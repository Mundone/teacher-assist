const TeacherFile = require('../models/teacherFile');

const getAllTeacherFiles = async () => {
  return await TeacherFile.findAll();
};

module.exports = {
  getAllTeacherFiles,
};
