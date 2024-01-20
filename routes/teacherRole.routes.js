const express = require('express');
const teacherRoleController = require('../controllers/teacherRoleController');
const router = express.Router();

router.get('/get_teacher_roles', teacherRoleController.getTeacherRoles);
// other routes like POST, PUT, DELETE

module.exports = router;
