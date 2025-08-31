const express = require('express');
const router = express.Router();
const userController = require('../../../controllers/userController');
const { authenticate, authorize } = require('../../../middleware/auth');
const { upload } = require('../../../utils/multer');

// Protected routes (require authentication)
router.use(authenticate);

// User profile routes
router.get('/me', userController.getMe);
router.patch('/update-me', upload.single('avatar'), userController.updateMe);
router.delete('/me/deactivate', userController.deactivateAccount);

// Admin routes
router.use(authorize('admin'));

// User management routes (admin only)
router.get('/', userController.getAllUsers);
router.get('/stats', userController.getUserStats);

// Single user routes (admin only)
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
