const TeacherRoleService = require('../services/teacherRoleService');

exports.getTeacherRoles = async (req, res, next) => {
  try {
    const teacherRoles = await TeacherRoleService.getAllTeacherRoles();
    res.json(teacherRoles);
  } catch (error) {
    next(error);
  }
};
