const StudentEnrollment = require('../models/studentEnrollment');

const getAllStudentEnrollments = async () => {
  return await StudentEnrollment.findAll();
};

module.exports = {
  getAllStudentEnrollments,
};
