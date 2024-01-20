const Teacher = require('../models/teacher');

const getAllTeachers = async () => {
  return await Teacher.findAll();
};

module.exports = {
  getAllTeachers,
};
