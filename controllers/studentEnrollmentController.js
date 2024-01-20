const StudentEnrollmentService = require('../services/studentEnrollmentService');

exports.getStudentEnrollments = async (req, res, next) => {
  try {
    const studentEnrollments = await StudentEnrollmentService.getAllStudentEnrollments();
    res.json(studentEnrollments);
  } catch (error) {
    next(error);
  }
};
