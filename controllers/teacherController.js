// controllers/teacherController.js
const TeacherService = require('../services/teacherService');

exports.getTeachers = async (req, res, next) => {
  try {
    const teachers = await TeacherService.getAllTeachers();
    res.json(teachers);
  } catch (error) {
    next(error);
  }
};

exports.getTeacher = async (req, res, next) => {
  try {
    const { id } = req.params;
    const teacher = await TeacherService.getTeacherById(id);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    res.json(teacher);
  } catch (error) {
    next(error);
  }
};

exports.createTeacher = async (req, res, next) => {
  try {
    const newTeacher = await TeacherService.createTeacher(req.body);
    res.status(201).json(newTeacher);
  } catch (error) {
    next(error);
  }
};

exports.updateTeacher = async (req, res, next) => {
  try {
    const { id } = req.params;
    await TeacherService.updateTeacher(id, req.body);
    res.json({ message: "Teacher updated successfully" });
  } catch (error) {
    next(error);
  }
};

exports.deleteTeacher = async (req, res, next) => {
  try {
    const { id } = req.params;
    await TeacherService.deleteTeacher(id);
    res.json({ message: "Teacher deleted successfully" });
  } catch (error) {
    next(error);
  }
};
