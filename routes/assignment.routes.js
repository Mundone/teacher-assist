const express = require('express');
const assignmentController = require('../controllers/assignmentController');
const router = express.Router();

router.get('/get_assignments', assignmentController.getAssignment);
// other routes like POST, PUT, DELETE

module.exports = router;
