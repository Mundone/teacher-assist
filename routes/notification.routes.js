// subjectRoutes.js
const express = require("express");
const notificationController = require("../controllers/notificationController");
const { accessControl } = require("../middlewares/authMiddleware");
const paginationMiddleware = require("../middlewares/paginationMiddleware");
const router = express.Router();

router.post(
  "/get_notifications",
  paginationMiddleware,
  accessControl([1, 2]),
  notificationController.getNotificationsController
);
router.post(
  "/create_notification",
  accessControl([1, 2]),
  notificationController.createNotificationController
);

module.exports = router;
