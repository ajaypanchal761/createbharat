const express = require('express');
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getNotificationStats
} = require('../controllers/notificationController');
const { protect } = require('../middleware/adminAuth');

const router = express.Router();

// All routes are protected and require admin authentication
router.get('/', protect, getNotifications);
router.get('/stats', protect, getNotificationStats);
router.put('/:id/read', protect, markAsRead);
router.put('/read-all', protect, markAllAsRead);
router.delete('/:id', protect, deleteNotification);

module.exports = router;

