const express = require("express");
const settingsController = require("../controllers/settingsController");
const router = express.Router();
// const { accessControl } = require("../middlewares/authMiddleware");

router.get(
  "/get_current_week",
  // accessControl([1, 2, 3]),
  settingsController.getCurrentWeekController
);


module.exports = router;
