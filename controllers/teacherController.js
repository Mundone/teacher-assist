const TeacherService = require('../services/teacherService');


exports.getTeachers = async (req, res, next) => {
  try {
    const teachers = await TeacherService.getAllTeachers();
    res.json(teachers);
  } catch (error) {
    next(error);
  }
};
