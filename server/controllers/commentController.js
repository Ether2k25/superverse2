const Comment = require('../models/Comment');
const Post = require('../models/Post');
const User = require('../models/User');
const { AppError } = require('../middleware/error');

// @desc    Get all comments for a post
// @route   GET /api/v1/posts/:postId/comments
// @access  Public
exports.getCommentsForPost = async (req, res, next) => {
  try {
    // Check if post exists
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return next(new AppError('No post found with that ID', 404));
    }

    // Get top-level comments (no parent comment)
    const comments = await Comment.find({
      post: req.params.postId,
      parentComment: null,
      isApproved: true,
      isSpam: false,
    })
      .populate('author', 'username avatar')
      .sort('-createdAt');

    // Get all comment IDs to check for replies
    const commentIds = comments.map(comment => comment._id);

    // Get all replies for these comments
    const replies = await Comment.find({
      parentComment: { $in: commentIds },
      isApproved: true,
      isSpam: false,
    })
      .populate('author', 'username avatar')
      .sort('createdAt');

    // Create a map of parent comment ID to its replies
    const repliesMap = new Map();
    replies.forEach(reply => {
      if (!repliesMap.has(reply.parentComment.toString())) {
        repliesMap.set(reply.parentComment.toString(), []);
      }
      repliesMap.get(reply.parentComment.toString()).push(reply);
    });

    // Add replies to their parent comments
    const commentsWithReplies = comments.map(comment => ({
      ...comment.toObject(),
      replies: repliesMap.get(comment._id.toString()) || [],
    }));

    res.status(200).json({
      status: 'success',
      results: comments.length,
      data: {
        comments: commentsWithReplies,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new comment
// @route   POST /api/v1/posts/:postId/comments
// @access  Private
exports.createComment = async (req, res, next) => {
  try {
    const { content, parentCommentId } = req.body;
    const { postId } = req.params;

    // Check if post exists and is published
    const post = await Post.findOne({ _id: postId, status: 'published' });
    if (!post) {
      return next(new AppError('No published post found with that ID', 404));
    }

    // If this is a reply, check if parent comment exists
    if (parentCommentId) {
      const parentComment = await Comment.findOne({
        _id: parentCommentId,
        post: postId,
      });
      if (!parentComment) {
        return next(new AppError('Parent comment not found', 404));
      }
    }

    // Create the comment
    const newComment = await Comment.create({
      content,
      author: req.user.id,
      post: postId,
      parentComment: parentCommentId || null,
      isApproved: req.user.role === 'admin', // Auto-approve for admins
      userAgent: req.get('user-agent'),
      ipAddress: req.ip,
    });

    // Populate author info for response
    await newComment.populate('author', 'username avatar');

    // If this is a reply, also populate parent comment info
    if (parentCommentId) {
      await newComment.populate('parentComment', 'author content');
    }

    res.status(201).json({
      status: 'success',
      data: {
        comment: newComment,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a comment
// @route   PATCH /api/v1/comments/:id
// @access  Private (Comment owner or Admin)
exports.updateComment = async (req, res, next) => {
  try {
    const { content } = req.body;
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return next(new AppError('No comment found with that ID', 404));
    }

    // Check if user is the author or an admin
    if (
      comment.author.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return next(
        new AppError('You do not have permission to update this comment', 403)
      );
    }

    // Only allow updating content for non-admin users
    if (req.user.role !== 'admin') {
      comment.content = content;
      comment.isEdited = true;
      await comment.save();
    } else {
      // Admin can update any field
      const updatedComment = await Comment.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );
      return res.status(200).json({
        status: 'success',
        data: {
          comment: updatedComment,
        },
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        comment,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a comment
// @route   DELETE /api/v1/comments/:id
// @access  Private (Comment owner, Post author, or Admin)
exports.deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id).populate(
      'post',
      'author'
    );

    if (!comment) {
      return next(new AppError('No comment found with that ID', 404));
    }

    // Check if user is the comment author, post author, or an admin
    const isCommentAuthor = comment.author.toString() === req.user.id;
    const isPostAuthor = comment.post.author.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isCommentAuthor && !isPostAuthor && !isAdmin) {
      return next(
        new AppError('You do not have permission to delete this comment', 403)
      );
    }

    // If this is a top-level comment, delete all its replies
    if (!comment.parentComment) {
      await Comment.deleteMany({ parentComment: comment._id });
    }

    await Comment.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all comments (Admin only)
// @route   GET /api/v1/comments
// @access  Private (Admin)
exports.getAllComments = async (req, res, next) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return next(
        new AppError('You do not have permission to view all comments', 403)
      );
    }

    // Build query
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    // Filter by status if provided
    if (req.query.status) {
      if (req.query.status === 'pending') {
        queryObj.isApproved = false;
        queryObj.isSpam = false;
      } else if (req.query.status === 'approved') {
        queryObj.isApproved = true;
        queryObj.isSpam = false;
      } else if (req.query.status === 'spam') {
        queryObj.isSpam = true;
      }
    }

    let query = Comment.find(queryObj)
      .populate('author', 'username avatar')
      .populate('post', 'title slug')
      .populate('parentComment', 'content');

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 20;
    const skip = (page - 1) * limit;

    const total = await Comment.countDocuments(queryObj);
    const comments = await query.skip(skip).limit(limit);

    res.status(200).json({
      status: 'success',
      results: comments.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: {
        comments,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle comment approval status (Admin only)
// @route   PATCH /api/v1/comments/:id/approve
// @access  Private (Admin)
exports.toggleCommentApproval = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return next(new AppError('No comment found with that ID', 404));
    }

    // Toggle approval status
    comment.isApproved = !comment.isApproved;
    
    // If marking as approved, ensure it's not marked as spam
    if (comment.isApproved) {
      comment.isSpam = false;
    }
    
    await comment.save();

    res.status(200).json({
      status: 'success',
      data: {
        comment,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark comment as spam (Admin only)
// @route   PATCH /api/v1/comments/:id/spam
// @access  Private (Admin)
exports.markCommentAsSpam = async (req, res, next) => {
  try {
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      {
        isSpam: true,
        isApproved: false,
      },
      { new: true, runValidators: true }
    );

    if (!comment) {
      return next(new AppError('No comment found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        comment,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get comment statistics (Admin only)
// @route   GET /api/v1/comments/stats
// @access  Private (Admin)
exports.getCommentStats = async (req, res, next) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return next(
        new AppError('You do not have permission to view comment statistics', 403)
      );
    }

    const stats = await Comment.aggregate([
      {
        $facet: {
          totalComments: [
            { $count: 'count' },
          ],
          approvedComments: [
            { $match: { isApproved: true, isSpam: false } },
            { $count: 'count' },
          ],
          pendingComments: [
            { $match: { isApproved: false, isSpam: false } },
            { $count: 'count' },
          ],
          spamComments: [
            { $match: { isSpam: true } },
            { $count: 'count' },
          ],
          recentComments: [
            { $sort: { createdAt: -1 } },
            { $limit: 5 },
            {
              $lookup: {
                from: 'users',
                localField: 'author',
                foreignField: '_id',
                as: 'author',
              },
            },
            { $unwind: '$author' },
            {
              $project: {
                content: 1,
                'author.username': 1,
                'author.avatar': 1,
                createdAt: 1,
              },
            },
          ],
        },
      },
    ]);

    // Format the response
    const formattedStats = {
      total: stats[0].totalComments[0]?.count || 0,
      approved: stats[0].approvedComments[0]?.count || 0,
      pending: stats[0].pendingComments[0]?.count || 0,
      spam: stats[0].spamComments[0]?.count || 0,
      recent: stats[0].recentComments || [],
    };

    res.status(200).json({
      status: 'success',
      data: {
        stats: formattedStats,
      },
    });
  } catch (error) {
    next(error);
  }
};
