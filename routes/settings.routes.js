const express = require("express");
const settingsController = require("../controllers/settingsController");
const router = express.Router();
const paginationMiddleware = require("../middlewares/paginationMiddleware");
const { accessControl } = require("../middlewares/authMiddleware");

router.get(
  "/get_current_week",
  // accessControl([1, 2]),
  settingsController.getCurrentWeekController
);

router.post(
  "/get_semesters",
  paginationMiddleware,
  accessControl([1]),
  settingsController.getSemestersController
);

router.get(
  "/get_semester/:id",
  accessControl([1]),
  settingsController.getSemesterController
);

router.post(
  "/create_semester",
  accessControl([1]),
  settingsController.createSemesterController
);

router.put(
  "/update_semester/:id",
  accessControl([1]),
  settingsController.updateSemesterController
);

router.delete(
  "/delete_semester/:id",
  accessControl([1]),
  settingsController.deleteSemesterController
);

router.put(
  "/change_qr_url",
  accessControl([1, 2]),
  settingsController.changeQRUrlController
);

router.get(
  "/reset_db",
  accessControl([1, 2]),
  settingsController.resetDatabaseController
);

router.get(
  "/dashboard/get_teacher_count",
  accessControl([1, 2]),
  settingsController.getAllTeacherCountController
);

router.get(
  "/dashboard/get_his_subject_count",
  accessControl([1, 2]),
  settingsController.getAllTeachersSubjectCountController
);

router.get(
  "/dashboard/get_his_student_count",
  accessControl([1, 2]),
  settingsController.getAllTeachersStudentCountController
);

router.get(
  "/dashboard/get_his_subjects_with_student_count",
  accessControl([1, 2]),
  settingsController.getAllTeachersSubjecsWithStudentCountController
);

router.get(
  "/dashboard/get_students_attendance/:subject_id",
  accessControl([1, 2]),
  settingsController.getStudentsAttendanceWithWeekForEachSubjectController
);

router.get(
  "/dashboard/get_dashboard",
  accessControl([1, 2]),
  settingsController.getDashboardController
);

router.post(
  "/ask_gpt",
  accessControl([1, 2]),
  settingsController.askGPTController
);


module.exports = router;
