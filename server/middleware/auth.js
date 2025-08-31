const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT token
exports.authenticate = async (req, res, next) => {
  try {
    // Get token from header or cookie
    let token = req.header('Authorization') || req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Remove 'Bearer ' if present
    if (token.startsWith('Bearer ')) {
      token = token.split(' ')[1];
    }

    // Verify token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.user.id).select('-password');
      
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      if (!user.isActive) {
        return res.status(401).json({ message: 'User account is deactivated' });
      }

      req.user = user;
      next();
    } catch (err) {
      console.error('Token verification error:', err);
      return res.status(401).json({ message: 'Token is not valid' });
    }
  } catch (err) {
    console.error('Authentication error:', err);
    res.status(500).json({ message: 'Server error during authentication' });
  }
};

// Middleware to check if user has admin role
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};

// Middleware to check if user is the author of a resource
exports.isAuthor = async (req, res, next) => {
  try {
    const resource = await req.model.findById(req.params.id);
    
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Check if the user is the author or an admin
    if (resource.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        message: 'User not authorized to modify this resource'
      });
    }

    req.resource = resource;
    next();
  } catch (err) {
    console.error('Authorization error:', err);
    res.status(500).json({ message: 'Server error during authorization' });
  }
};

// Middleware to check if user is owner or admin
exports.isOwnerOrAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user is the owner or an admin
    if (user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        message: 'Not authorized to perform this action'
      });
    }

    req.targetUser = user;
    next();
  } catch (err) {
    console.error('Owner/Admin check error:', err);
    res.status(500).json({ message: 'Server error during authorization' });
  }
};
