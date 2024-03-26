// subjectRoutes.js
const express = require("express");
const scheduleController = require("../controllers/scheduleController");
const router = express.Router();


router.get(
  "/get_schedules",
  scheduleController.getScheduleController
);


module.exports = router;
