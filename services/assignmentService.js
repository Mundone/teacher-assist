// services/assignmentService.js
const Assignment = require('../models/assignment');

const getAllAssignments = async () => {
  return await Assignment.findAll();
};

const getAssignmentById = async (id) => {
  return await Assignment.findByPk(id);
};

const createAssignment = async (data) => {
  return await Assignment.create(data);
};

const updateAssignment = async (id, data) => {
  return await Assignment.update(data, { where: { id } });
};

const deleteAssignment = async (id) => {
  return await Assignment.destroy({ where: { id } });
};

module.exports = {
  getAllAssignments,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  deleteAssignment,
};
