// routes/studentRoutes.js
const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

router.get('/get_students', studentController.getStudents);
router.get('/get_student/:id', studentController.getStudentById);
router.post('/create_student', studentController.createStudent);
router.put('/update_student/:id', studentController.updateStudent);
router.delete('/delete_student/:id', studentController.deleteStudent);

module.exports = router;
