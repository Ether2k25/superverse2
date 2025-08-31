const Category = require('../models/Category');
const Post = require('../models/Post');
const { AppError } = require('../middleware/error');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinary');

// @desc    Get all categories
// @route   GET /api/v1/categories
// @access  Public
exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort('name');
    
    res.status(200).json({
      status: 'success',
      results: categories.length,
      data: {
        categories,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single category by slug
// @route   GET /api/v1/categories/:slug
// @access  Public
exports.getCategory = async (req, res, next) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    
    if (!category) {
      return next(new AppError('No category found with that slug', 404));
    }

    // Get published posts count for this category
    const postCount = await Post.countDocuments({
      categories: category._id,
      status: 'published',
    });

    res.status(200).json({
      status: 'success',
      data: {
        category: {
          ...category.toObject(),
          postCount,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new category
// @route   POST /api/v1/categories
// @access  Private (Admin)
exports.createCategory = async (req, res, next) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return next(
        new AppError('You do not have permission to create categories', 403)
      );
    }

    const { name, description, seo } = req.body;

    // Check if category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return next(new AppError('Category with this name already exists', 400));
    }

    // Handle featured image upload if present
    let featuredImage = {};
    if (req.file) {
      const result = await uploadToCloudinary(req.file.path, 'category-images');
      featuredImage = {
        url: result.secure_url,
        publicId: result.public_id,
        altText: req.body.altText || name,
      };
    }

    const newCategory = await Category.create({
      name,
      description,
      featuredImage: Object.keys(featuredImage).length > 0 ? featuredImage : undefined,
      seo,
    });

    res.status(201).json({
      status: 'success',
      data: {
        category: newCategory,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a category
// @route   PATCH /api/v1/categories/:id
// @access  Private (Admin)
exports.updateCategory = async (req, res, next) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return next(
        new AppError('You do not have permission to update categories', 403)
      );
    }

    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return next(new AppError('No category found with that ID', 404));
    }

    const { name, description, isActive, seo } = req.body;
    
    // Check if the new name is already taken by another category
    if (name && name !== category.name) {
      const existingCategory = await Category.findOne({ name });
      if (existingCategory) {
        return next(new AppError('Category with this name already exists', 400));
      }
    }

    // Handle featured image update if present
    if (req.file) {
      // Delete old image if exists
      if (category.featuredImage && category.featuredImage.publicId) {
        await deleteFromCloudinary(category.featuredImage.publicId);
      }
      
      // Upload new image
      const result = await uploadToCloudinary(req.file.path, 'category-images');
      category.featuredImage = {
        url: result.secure_url,
        publicId: result.public_id,
        altText: req.body.altText || category.name,
      };
    }

    // Update fields
    if (name) category.name = name;
    if (description !== undefined) category.description = description;
    if (isActive !== undefined) category.isActive = isActive;
    if (seo) category.seo = { ...category.seo, ...seo };

    await category.save();

    res.status(200).json({
      status: 'success',
      data: {
        category,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a category
// @route   DELETE /api/v1/categories/:id
// @access  Private (Admin)
exports.deleteCategory = async (req, res, next) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return next(
        new AppError('You do not have permission to delete categories', 403)
      );
    }

    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return next(new AppError('No category found with that ID', 404));
    }

    // Check if there are any posts in this category
    const postCount = await Post.countDocuments({ categories: category._id });
    
    if (postCount > 0) {
      return next(
        new AppError(
          'Cannot delete category with associated posts. Please remove all posts from this category first.',
          400
        )
      );
    }

    // Delete featured image if exists
    if (category.featuredImage && category.featuredImage.publicId) {
      await deleteFromCloudinary(category.featuredImage.publicId);
    }

    await Category.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get category statistics
// @route   GET /api/v1/categories/stats
// @access  Private (Admin)
exports.getCategoryStats = async (req, res, next) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return next(
        new AppError('You do not have permission to view category statistics', 403)
      );
    }

    const stats = await Category.aggregate([
      {
        $lookup: {
          from: 'posts',
          localField: '_id',
          foreignField: 'categories',
          as: 'posts',
        },
      },
      {
        $project: {
          name: 1,
          slug: 1,
          postCount: { $size: '$posts' },
          isActive: 1,
          createdAt: 1,
        },
      },
      { $sort: { postCount: -1 } },
    ]);

    res.status(200).json({
      status: 'success',
      results: stats.length,
      data: {
        stats,
      },
    });
  } catch (error) {
    next(error);
  }
};
