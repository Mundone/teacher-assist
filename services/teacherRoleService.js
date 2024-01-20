const TeacherRole = require('../models/teacherRole');

const getAllTeacherRoles = async () => {
  return await TeacherRole.findAll();
};

module.exports = {
  getAllTeacherRoles,
};
