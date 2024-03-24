const express = require("express");
const attendanceController = require("../controllers/attendanceController");
const router = express.Router();
// const paginationMiddleware = require("../middlewares/paginationMiddleware");
const { accessControl } = require("../middlewares/authMiddleware");

router.get(
  "/get_attendance/:id",
  accessControl([1, 2, 3]),
  attendanceController.getAttendanceController
);

router.post(
  "/create_attendance",
  accessControl([1, 2, 3]),
  attendanceController.createAttendanceController
);

router.delete(
  "/delete_attendance/:id",
  accessControl([1, 2, 3]),
  attendanceController.deleteAttendanceController
);

module.exports = router;
