const express = require('express');
const lectureScheduleController = require('../controllers/lectureScheduleController');
const router = express.Router();

router.get('/get_lecture_schedules', lectureScheduleController.getLectureSchedules);
// other routes like POST, PUT, DELETE

module.exports = router;
