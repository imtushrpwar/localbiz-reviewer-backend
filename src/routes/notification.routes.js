const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const {
  getNotifications,
  getUnreadCount,
  markAsRead,
  getNotificationById
} = require("../controllers/notification.controller");

router.get("/", auth, getNotifications);

router.get("/unread-count", auth, getUnreadCount);

router.patch("/:id/read", auth, markAsRead);

router.get("/:id", auth, getNotificationById);

module.exports = router;
