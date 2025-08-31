const NewsletterSubscriber = require('../models/NewsletterSubscriber');
const { AppError } = require('../middleware/error');
const crypto = require('crypto');

// @desc    Subscribe to newsletter
// @route   POST /api/v1/newsletter/subscribe
// @access  Public
exports.subscribe = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return next(new AppError('Please provide an email address', 400));
    }

    // Check if email is already subscribed
    let subscriber = await NewsletterSubscriber.findOne({ email });

    if (subscriber) {
      if (subscriber.isActive) {
        return next(new AppError('This email is already subscribed', 400));
      } else {
        // Reactivate unsubscribed user
        subscriber.isActive = true;
        subscriber.unsubscribedAt = undefined;
        subscriber.metadata = {
          ipAddress: req.ip,
          userAgent: req.get('user-agent'),
          referrer: req.get('referer'),
        };
        await subscriber.save();
        
        return res.status(200).json({
          status: 'success',
          message: 'Successfully resubscribed to our newsletter!',
        });
      }
    }

    // Create new subscriber
    subscriber = await NewsletterSubscriber.create({
      email,
      metadata: {
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
        referrer: req.get('referer'),
      },
    });

    // In a real app, you would send a welcome/confirmation email here
    // await sendWelcomeEmail(email, { /* email data */ });

    res.status(201).json({
      status: 'success',
      message: 'Successfully subscribed to our newsletter!',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Unsubscribe from newsletter
// @route   GET /api/v1/newsletter/unsubscribe/:token
// @access  Public
exports.unsubscribe = async (req, res, next) => {
  try {
    // In a real app, you would verify the token before unsubscribing
    // For now, we'll just use the email from the token
    const { token } = req.params;
    
    // In a real app, you would verify the token like this:
    // const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    // const subscriber = await NewsletterSubscriber.findOne({
    //   unsubscribeToken: hashedToken,
    //   unsubscribeTokenExpires: { $gt: Date.now() },
    // });
    
    // For this example, we'll find by email directly (not secure for production)
    const email = Buffer.from(token, 'base64').toString('ascii');
    const subscriber = await NewsletterSubscriber.findOne({ email });

    if (!subscriber) {
      return next(new AppError('Invalid or expired token', 400));
    }

    if (!subscriber.isActive) {
      return res.status(200).json({
        status: 'success',
        message: 'You are already unsubscribed from our newsletter.',
      });
    }

    // Update subscriber status
    subscriber.isActive = false;
    subscriber.unsubscribedAt = Date.now();
    await subscriber.save();

    res.status(200).json({
      status: 'success',
      message: 'You have been successfully unsubscribed from our newsletter.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all subscribers (Admin only)
// @route   GET /api/v1/newsletter/subscribers
// @access  Private (Admin)
exports.getAllSubscribers = async (req, res, next) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return next(
        new AppError('You do not have permission to view subscribers', 403)
      );
    }

    // Build query
    const { status, search, page = 1, limit = 20 } = req.query;
    
    const query = {};
    
    // Filter by status
    if (status === 'active') {
      query.isActive = true;
    } else if (status === 'inactive') {
      query.isActive = false;
    }
    
    // Search by email
    if (search) {
      query.email = { $regex: search, $options: 'i' };
    }
    
    // Execute query with pagination
    const subscribers = await NewsletterSubscriber.find(query)
      .sort('-subscribedAt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    const total = await NewsletterSubscriber.countDocuments(query);

    res.status(200).json({
      status: 'success',
      results: subscribers.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: {
        subscribers,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get subscriber statistics (Admin only)
// @route   GET /api/v1/newsletter/stats
// @access  Private (Admin)
exports.getSubscriberStats = async (req, res, next) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return next(
        new AppError('You do not have permission to view subscriber statistics', 403)
      );
    }

    // Get total subscribers
    const totalSubscribers = await NewsletterSubscriber.countDocuments();
    
    // Get active subscribers
    const activeSubscribers = await NewsletterSubscriber.countDocuments({ isActive: true });
    
    // Get subscribers by source
    const subscribersBySource = await NewsletterSubscriber.aggregate([
      {
        $group: {
          _id: '$source',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          source: '$_id',
          count: 1,
        },
      },
      { $sort: { count: -1 } },
    ]);
    
    // Get subscription growth over time (last 12 months)
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    
    const subscriptionGrowth = await NewsletterSubscriber.aggregate([
      {
        $match: {
          subscribedAt: { $gte: oneYearAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$subscribedAt' },
            month: { $month: '$subscribedAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
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
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        totalSubscribers,
        activeSubscribers,
        inactiveSubscribers: totalSubscribers - activeSubscribers,
        subscribersBySource,
        subscriptionGrowth,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a subscriber (Admin only)
// @route   DELETE /api/v1/newsletter/subscribers/:id
// @access  Private (Admin)
exports.deleteSubscriber = async (req, res, next) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return next(
        new AppError('You do not have permission to delete subscribers', 403)
      );
    }

    const subscriber = await NewsletterSubscriber.findByIdAndDelete(req.params.id);

    if (!subscriber) {
      return next(new AppError('No subscriber found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
