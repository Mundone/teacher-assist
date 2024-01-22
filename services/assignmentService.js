const Assignment = require('../models/assignment');

const getAllAssignments = async () => {
  return await Assignment.findAll();
};

module.exports = {
  getAllAssignments,
};
