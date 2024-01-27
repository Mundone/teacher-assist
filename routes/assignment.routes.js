// routes/assignmentRoutes.js
const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');

router.get('/get_assignments', assignmentController.getAssignments);
router.get('/get_assignment/:id', assignmentController.getAssignment);
router.post('/create_assignment', assignmentController.createAssignment);
router.put('/update_assignment/:id', assignmentController.updateAssignment);
router.delete('/delete_assignment/:id', assignmentController.deleteAssignment);

module.exports = router;
