const express = require('express');
const studentEnrollmentController = require('../controllers/studentEnrollmentController');
const router = express.Router();

router.get('/get_student_enrollments', studentEnrollmentController.getStudentEnrollments);
// other routes like POST, PUT, DELETE

module.exports = router;
