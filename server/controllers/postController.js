const Post = require('../models/Post');
const User = require('../models/User');
const Category = require('../models/Category');
const { AppError } = require('../middleware/error');
const { uploadToCloudinary } = require('../utils/cloudinary');

// Helper function to filter allowed fields
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// @desc    Get all posts
// @route   GET /api/v1/posts
// @access  Public
exports.getAllPosts = async (req, res, next) => {
  try {
    // BUILD QUERY
    // 1) Filtering
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 2) Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    
    let query = Post.find(JSON.parse(queryStr)).populate({
      path: 'author',
      select: 'username avatar',
    });

    // 3) Search
    if (req.query.search) {
      query = query.find({
        $or: [
          { title: { $regex: req.query.search, $options: 'i' } },
          { excerpt: { $regex: req.query.search, $options: 'i' } },
          { content: { $regex: req.query.search, $options: 'i' } },
          { tags: { $in: [new RegExp(req.query.search, 'i')] } },
        ],
      });
    }

    // 4) Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // 5) Field limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    // 6) Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit;

    // Check if the requested page exists
    const numPosts = await Post.countDocuments();
    if (skip >= numPosts) {
      return next(new AppError('This page does not exist', 404));
    }

    query = query.skip(skip).limit(limit);

    // EXECUTE QUERY
    const posts = await query;

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: posts.length,
      data: {
        posts,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single post by slug
// @route   GET /api/v1/posts/:slug
// @access  Public
exports.getPost = async (req, res, next) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug })
      .populate({
        path: 'author',
        select: 'username avatar bio',
      })
      .populate({
        path: 'categories',
        select: 'name slug',
      });

    if (!post) {
      return next(new AppError('No post found with that slug', 404));
    }

    // Increment view count
    post.meta.views += 1;
    await post.save({ validateBeforeSave: false });

    res.status(200).json({
      status: 'success',
      data: {
        post,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new post
// @route   POST /api/v1/posts
// @access  Private (Admin/Author)
exports.createPost = async (req, res, next) => {
  try {
    // 1) Check if the user has permission to create posts
    if (req.user.role !== 'admin' && req.user.role !== 'author') {
      return next(
        new AppError('You do not have permission to create posts', 403)
      );
    }

    // 2) Filter allowed fields
    const filteredBody = filterObj(
      req.body,
      'title',
      'excerpt',
      'content',
      'categories',
      'tags',
      'status',
      'seo',
      'featuredImage'
    );

    // 3) Set the author
    filteredBody.author = req.user.id;

    // 4) Handle featured image upload if present
    if (req.file) {
      const result = await uploadToCloudinary(req.file.path, 'blog-images');
      filteredBody.featuredImage = {
        url: result.secure_url,
        publicId: result.public_id,
        altText: req.body.altText || 'Blog post image',
      };
    }

    // 5) Create post
    const newPost = await Post.create(filteredBody);

    // 6) Populate the author and categories for the response
    await newPost.populate('author', 'username avatar');
    await newPost.populate('categories', 'name slug');

    res.status(201).json({
      status: 'success',
      data: {
        post: newPost,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a post
// @route   PATCH /api/v1/posts/:id
// @access  Private (Admin/Author - Owner of the post)
exports.updatePost = async (req, res, next) => {
  try {
    // 1) Get the post
    let post = await Post.findById(req.params.id);
    
    if (!post) {
      return next(new AppError('No post found with that ID', 404));
    }

    // 2) Check if the user is the owner of the post or an admin
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new AppError('You do not have permission to update this post', 403)
      );
    }

    // 3) Filter allowed fields
    const filteredBody = filterObj(
      req.body,
      'title',
      'excerpt',
      'content',
      'categories',
      'tags',
      'status',
      'seo',
      'featuredImage'
    );

    // 4) Handle featured image update if present
    if (req.file) {
      // Delete old image if exists
      if (post.featuredImage && post.featuredImage.publicId) {
        await deleteFromCloudinary(post.featuredImage.publicId);
      }
      
      // Upload new image
      const result = await uploadToCloudinary(req.file.path, 'blog-images');
      filteredBody.featuredImage = {
        url: result.secure_url,
        publicId: result.public_id,
        altText: req.body.altText || post.featuredImage?.altText || 'Blog post image',
      };
    }

    // 5) Update the post
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      filteredBody,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate('author', 'username avatar')
      .populate('categories', 'name slug');

    res.status(200).json({
      status: 'success',
      data: {
        post: updatedPost,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a post
// @route   DELETE /api/v1/posts/:id
// @access  Private (Admin/Author - Owner of the post)
exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return next(new AppError('No post found with that ID', 404));
    }

    // Check if the user is the owner of the post or an admin
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new AppError('You do not have permission to delete this post', 403)
      );
    }

    // Delete featured image from cloud storage if it exists
    if (post.featuredImage && post.featuredImage.publicId) {
      await deleteFromCloudinary(post.featuredImage.publicId);
    }

    await Post.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get posts by category
// @route   GET /api/v1/posts/category/:slug
// @access  Public
exports.getPostsByCategory = async (req, res, next) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    
    if (!category) {
      return next(new AppError('No category found with that slug', 404));
    }

    const posts = await Post.find({ categories: category._id, status: 'published' })
      .populate('author', 'username avatar')
      .populate('categories', 'name slug')
      .sort('-createdAt');

    res.status(200).json({
      status: 'success',
      results: posts.length,
      data: {
        category: category.name,
        posts,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get posts by tag
// @route   GET /api/v1/posts/tag/:tag
// @access  Public
exports.getPostsByTag = async (req, res, next) => {
  try {
    const tag = req.params.tag.toLowerCase();
    
    const posts = await Post.find({ 
      tags: { $in: [tag] },
      status: 'published' 
    })
      .populate('author', 'username avatar')
      .populate('categories', 'name slug')
      .sort('-createdAt');

    res.status(200).json({
      status: 'success',
      results: posts.length,
      data: {
        tag,
        posts,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get posts by author
// @route   GET /api/v1/posts/author/:username
// @access  Public
exports.getPostsByAuthor = async (req, res, next) => {
  try {
    const author = await User.findOne({ username: req.params.username });
    
    if (!author) {
      return next(new AppError('No author found with that username', 404));
    }

    const posts = await Post.find({ 
      author: author._id,
      status: 'published' 
    })
      .populate('author', 'username avatar')
      .populate('categories', 'name slug')
      .sort('-createdAt');

    res.status(200).json({
      status: 'success',
      results: posts.length,
      data: {
        author: {
          username: author.username,
          avatar: author.avatar,
          bio: author.bio,
        },
        posts,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle like on a post
// @route   POST /api/v1/posts/:id/like
// @access  Private
exports.toggleLikePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return next(new AppError('No post found with that ID', 404));
    }

    // Check if the post has already been liked by this user
    const isLiked = post.likes.includes(req.user.id);
    
    if (isLiked) {
      // Unlike the post
      post.likes = post.likes.filter(
        (userId) => userId.toString() !== req.user.id
      );
      post.meta.likes = Math.max(0, post.meta.likes - 1);
    } else {
      // Like the post
      post.likes.push(req.user.id);
      post.meta.likes += 1;
    }

    await post.save();

    res.status(200).json({
      status: 'success',
      data: {
        likes: post.meta.likes,
        isLiked: !isLiked,
      },
    });
  } catch (error) {
    next(error);
  }
};
