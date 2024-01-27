// routes/teacherRoutes.js
const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');

router.get('/get_teachers', teacherController.getTeachers);
router.get('/get_teacher/:id', teacherController.getTeacher);
router.post('/create_teacher', teacherController.createTeacher);
router.put('/update_teacher/:id', teacherController.updateTeacher);
router.delete('/delete_teacher/:id', teacherController.deleteTeacher);

module.exports = router;
