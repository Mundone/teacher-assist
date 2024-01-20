const express = require('express');
const studentController = require('../controllers/studentController');
const router = express.Router();

router.get('/get_students', studentController.getStudents);
// other routes like POST, PUT, DELETE

module.exports = router;
