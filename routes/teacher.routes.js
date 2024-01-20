const express = require('express');
const teacherController = require('../controllers/teacherController');
const router = express.Router();

router.get('/get_teachers', teacherController.getTeachers);
// other routes like POST, PUT, DELETE

module.exports = router;
