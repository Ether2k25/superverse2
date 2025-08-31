const express = require('express');
const router = express.Router();
const categoryController = require('../../../controllers/categoryController');
const { authenticate, authorize } = require('../../../middleware/auth');
const { upload } = require('../../../utils/multer');

// Public routes
router.get('/', categoryController.getAllCategories);
router.get('/:slug', categoryController.getCategory);

// Protected routes (require authentication and admin role)
router.use(authenticate, authorize('admin'));

// Admin routes
router.post('/', upload.single('featuredImage'), categoryController.createCategory);
router.get('/stats', categoryController.getCategoryStats);

router
  .route('/:id')
  .patch(upload.single('featuredImage'), categoryController.updateCategory)
  .delete(categoryController.deleteCategory);

module.exports = router;
