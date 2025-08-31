const express = require('express');
const router = express.Router();
const postController = require('../../../controllers/postController');
const { authenticate } = require('../../../middleware/auth');
const { upload } = require('../../../utils/multer');

// Public routes
router.get('/', postController.getAllPosts);
router.get('/:slug', postController.getPost);
router.get('/category/:slug', postController.getPostsByCategory);
router.get('/tag/:tag', postController.getPostsByTag);
router.get('/author/:username', postController.getPostsByAuthor);

// Protected routes (require authentication)
router.use(authenticate);

// Like/Unlike a post
router.post('/:id/like', postController.toggleLikePost);

// Routes that require author or admin role
router.use((req, res, next) => {
  if (req.user.role !== 'admin' && req.user.role !== 'author') {
    return res.status(403).json({
      status: 'error',
      message: 'You do not have permission to perform this action',
    });
  }
  next();
});

// Create a new post
router.post('/', upload.single('featuredImage'), postController.createPost);

// Update and delete post (only for post owner or admin)
router
  .route('/:id')
  .patch(upload.single('featuredImage'), postController.updatePost)
  .delete(postController.deletePost);

module.exports = router;
