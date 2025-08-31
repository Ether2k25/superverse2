const User = require('../models/User');
const { AppError } = require('../middleware/error');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinary');

// @desc    Get all users (Admin only)
// @route   GET /api/v1/users
// @access  Private (Admin)
exports.getAllUsers = async (req, res, next) => {
  try {
    // Build query
    const { role, search, page = 1, limit = 20 } = req.query;
    
    const query = {};
    
    // Filter by role
    if (role) {
      query.role = role;
    }
    
    // Search by username or email
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    
    // Execute query with pagination
    const users = await User.find(query)
      .select('-password -__v')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    const total = await User.countDocuments(query);

    res.status(200).json({
      status: 'success',
      results: users.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: {
        users,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user profile
// @route   GET /api/v1/users/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password -__v');
    
    if (!user) {
      return next(new AppError('User not found', 404));
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user by ID
// @route   GET /api/v1/users/:id
// @access  Private (Admin)
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password -__v');
    
    if (!user) {
      return next(new AppError('No user found with that ID', 404));
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PATCH /api/v1/users/update-me
// @access  Private
exports.updateMe = async (req, res, next) => {
  try {
    // 1) Create error if user POSTs password data
    if (req.body.password) {
      return next(
        new AppError(
          'This route is not for password updates. Please use /update-password',
          400
        )
      );
    }

    // 2) Filtered out unwanted fields that are not allowed to be updated
    const filteredBody = {};
    const allowedFields = ['username', 'email', 'bio', 'avatar'];
    
    Object.keys(req.body).forEach((key) => {
      if (allowedFields.includes(key)) {
        filteredBody[key] = req.body[key];
      }
    });

    // 3) Handle avatar upload if present
    if (req.file) {
      // Delete old avatar if exists
      if (req.user.avatar && req.user.avatar.publicId) {
        await deleteFromCloudinary(req.user.avatar.publicId);
      }
      
      // Upload new avatar
      const result = await uploadToCloudinary(req.file.path, 'user-avatars');
      filteredBody.avatar = {
        url: result.secure_url,
        publicId: result.public_id,
      };
    }

    // 4) Update user document
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      filteredBody,
      {
        new: true,
        runValidators: true,
      }
    ).select('-password -__v');

    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user (Admin only)
// @route   PATCH /api/v1/users/:id
// @access  Private (Admin)
exports.updateUser = async (req, res, next) => {
  try {
    // 1) Filter out unwanted fields that are not allowed to be updated
    const filteredBody = {};
    const allowedFields = ['username', 'email', 'role', 'bio', 'isActive'];
    
    Object.keys(req.body).forEach((key) => {
      if (allowedFields.includes(key)) {
        filteredBody[key] = req.body[key];
      }
    });

    // 2) Update user document
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      filteredBody,
      {
        new: true,
        runValidators: true,
      }
    ).select('-password -__v');

    if (!updatedUser) {
      return next(new AppError('No user found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user (Admin only)
// @route   DELETE /api/v1/users/:id
// @access  Private (Admin)
exports.deleteUser = async (req, res, next) => {
  try {
    // Prevent deleting your own account
    if (req.user.id === req.params.id) {
      return next(
        new AppError('You cannot delete your own account from this route', 400)
      );
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return next(new AppError('No user found with that ID', 404));
    }

    // Delete user's avatar if exists
    if (user.avatar && user.avatar.publicId) {
      await deleteFromCloudinary(user.avatar.publicId);
    }

    // TODO: Handle related data (posts, comments, etc.)
    // This would typically involve setting up pre-remove middleware in the User model
    // or handling it here with transactions

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Deactivate user account (User or Admin)
// @route   DELETE /api/v1/users/me/deactivate
// @access  Private
exports.deactivateAccount = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { isActive: false });

    // In a real app, you might want to:
    // 1. Send a confirmation email
    // 2. Invalidate any active sessions/tokens
    // 3. Schedule account deletion after a certain period

    res.status(200).json({
      status: 'success',
      message: 'Your account has been deactivated',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user statistics (Admin only)
// @route   GET /api/v1/users/stats
// @access  Private (Admin)
exports.getUserStats = async (req, res, next) => {
  try {
    const stats = await User.aggregate([
      {
        $facet: {
          totalUsers: [
            { $count: 'count' },
          ],
          activeUsers: [
            { $match: { isActive: true } },
            { $count: 'count' },
          ],
          usersByRole: [
            {
              $group: {
                _id: '$role',
                count: { $sum: 1 },
              },
            },
            {
              $project: {
                _id: 0,
                role: '$_id',
                count: 1,
              },
            },
            { $sort: { count: -1 } },
          ],
          recentUsers: [
            { $sort: { createdAt: -1 } },
            { $limit: 5 },
            {
              $project: {
                username: 1,
                email: 1,
                role: 1,
                createdAt: 1,
              },
            },
          ],
          userGrowth: [
            {
              $group: {
                _id: {
                  year: { $year: '$createdAt' },
                  month: { $month: '$createdAt' },
                },
                count: { $sum: 1 },
              },
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } },
            {
              $project: {
                _id: 0,
                period: {
                  $dateToString: {
                    format: '%Y-%m',
                    date: {
                      $dateFromParts: {
                        year: '$_id.year',
                        month: '$_id.month',
                        day: 1,
                      },
                    },
                  },
                },
                count: 1,
              },
            },
          ],
        },
      },
    ]);

    // Format the response
    const formattedStats = {
      totalUsers: stats[0].totalUsers[0]?.count || 0,
      activeUsers: stats[0].activeUsers[0]?.count || 0,
      usersByRole: stats[0].usersByRole || [],
      recentUsers: stats[0].recentUsers || [],
      userGrowth: stats[0].userGrowth || [],
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
