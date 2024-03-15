const express = require("express");
const settingsController = require("../controllers/settingsController");
const router = express.Router();
const paginationMiddleware = require("../middlewares/paginationMiddleware");
const { accessControl } = require("../middlewares/authMiddleware");

router.get(
  "/get_current_week",
  // accessControl([1, 2, 3]),
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

module.exports = router;
