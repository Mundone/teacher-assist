const StudentService = require('../services/studentService');

exports.getStudents = async (req, res, next) => {
  try {
    const students = await StudentService.getAllStudents(req.query);
    res.json(students);
  } catch (error) {
    next(error);
  }
};

