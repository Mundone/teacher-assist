const assignmentService = require('../services/assignmentService');

exports.getAssignments = async (req, res, next) => {
  try {
    const assignments = await assignmentService.getAllAssignments();
    res.json(assignments);
  } catch (error) {
    next(error);
  }
};
