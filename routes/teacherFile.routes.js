const express = require('express');
const teacherFileController = require('../controllers/teacherFileController');
const router = express.Router();

router.get('/get_teacher_files', teacherFileController.getTeacherFiles);
// other routes like POST, PUT, DELETE

module.exports = router;
