const TeacherFileService = require('../services/teacherFileService');

exports.getTeacherFiles = async (req, res, next) => {
  try {
    const teacherFiles = await TeacherFileService.getAllTeacherFiles();
    res.json(teacherFiles);
  } catch (error) {
    next(error);
  }
};
