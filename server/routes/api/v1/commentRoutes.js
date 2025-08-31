const express = require('express');
const router = express.Router();
const commentController = require('../../../controllers/commentController');
const { authenticate, authorize } = require('../../../middleware/auth');

// Public routes - get comments for a post
router.get('/posts/:postId/comments', commentController.getCommentsForPost);

// Protected routes (require authentication)
router.use(authenticate);

// Comment on a post
router.post('/posts/:postId/comments', commentController.createComment);

// Update and delete own comments
router
  .route('/comments/:id')
  .patch(commentController.updateComment)
  .delete(commentController.deleteComment);

// Admin routes for comment management
router.use(authorize('admin'));

// Get all comments (admin only)
router.get('/comments', commentController.getAllComments);

// Toggle comment approval (admin only)
router.patch('/comments/:id/approve', commentController.toggleCommentApproval);

// Mark comment as spam (admin only)
router.patch('/comments/:id/spam', commentController.markCommentAsSpam);

// Get comment statistics (admin only)
router.get('/comments/stats', commentController.getCommentStats);

module.exports = router;
