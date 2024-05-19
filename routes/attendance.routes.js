const express = require("express");
const attendanceController = require("../controllers/attendanceController");
const router = express.Router();
const paginationMiddleware = require("../middlewares/paginationMiddleware");
const { accessControl } = require("../middlewares/authMiddleware");

router.get(
  "/get_attendance/:id",
  accessControl([1, 2]),
  attendanceController.getAttendanceController
);

router.post(
  "/create_attendance",
  accessControl([1, 2]),
  attendanceController.createAttendanceController
);

router.delete(
  "/delete_attendance/:id",
  accessControl([1, 2]),
  attendanceController.deleteAttendanceController
);

router.post(
  "/register_attendance",
  attendanceController.registerAttendanceController
);

router.post(
  "/register_attendance_in_mobile",
  attendanceController.registerAttendanceInMobileController
);

router.post(
  "/get_attendance_responses/:subject_schedule_id",
  accessControl([1, 2]),
  paginationMiddleware,
  attendanceController.getAllAttendanceResponsesController
);

router.post(
  "/get_students_with_attendance/:attendance_id",
  accessControl([1, 2]),
  paginationMiddleware,
  attendanceController.getStudentsWithAttendanceController
);

router.get(
  "/student/get_students_attendance/:id",
  attendanceController.getStudentsAttendanceController
);

// router.get(
//   "/get_students/:id",
//   accessControl([1, 2]),
//   attendanceController.getStudentsAttendanceListController
// );

module.exports = router;
