// controllers/assignmentController.js
const assignmentService = require('../services/assignmentService');

exports.getAssignments = async (req, res, next) => {
  try {
    const assignments = await assignmentService.getAllAssignments();
    res.json(assignments);
  } catch (error) {
    next(error);
  }
};

exports.getAssignment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const assignment = await assignmentService.getAssignmentById(id);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }
    res.json(assignment);
  } catch (error) {
    next(error);
  }
};

exports.createAssignment = async (req, res, next) => {
  try {
    const newAssignment = await assignmentService.createAssignment(req.body);
    res.status(201).json(newAssignment);
  } catch (error) {
    next(error);
  }
};

exports.updateAssignment = async (req, res, next) => {
  try {
    const { id } = req.params;
    await assignmentService.updateAssignment(id, req.body);
    res.json({ message: "Assignment updated successfully" });
  } catch (error) {
    next(error);
  }
};

exports.deleteAssignment = async (req, res, next) => {
  try {
    const { id } = req.params;
    await assignmentService.deleteAssignment(id);
    res.json({ message: "Assignment deleted successfully" });
  } catch (error) {
    next(error);
  }
};
