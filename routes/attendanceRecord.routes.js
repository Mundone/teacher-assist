const express = require('express');
const attendanceRecordController = require('../controllers/attendanceRecordController');
const router = express.Router();

router.get('/get_attendance_records', attendanceRecordController.getAttendanceRecords);
// other routes like POST, PUT, DELETE

module.exports = router;
