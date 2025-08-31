const express = require('express');
const router = express.Router();
const newsletterController = require('../../../controllers/newsletterController');
const { authenticate, authorize } = require('../../../middleware/auth');

// Public routes
router.post('/subscribe', newsletterController.subscribe);
router.get('/unsubscribe/:token', newsletterController.unsubscribe);

// Protected routes (require authentication and admin role)
router.use(authenticate, authorize('admin'));

// Admin routes
router.get('/subscribers', newsletterController.getAllSubscribers);
router.get('/stats', newsletterController.getSubscriberStats);
router.delete('/subscribers/:id', newsletterController.deleteSubscriber);

module.exports = router;
