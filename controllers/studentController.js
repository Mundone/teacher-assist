// controllers/studentController.js
const StudentService = require('../services/studentService');

exports.getStudents = async (req, res, next) => {
  try {
    const students = await StudentService.getAllStudents(req.query);
    res.json(students);
  } catch (error) {
    next(error);
  }
};

exports.getStudentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const student = await StudentService.getStudentById(id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json(student);
  } catch (error) {
    next(error);
  }
};

exports.createStudent = async (req, res, next) => {
  try {
    const newStudent = await StudentService.createStudent(req.body);
    res.status(201).json(newStudent);
  } catch (error) {
    next(error);
  }
};

exports.updateStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    await StudentService.updateStudent(id, req.body);
    res.json({ message: "Student updated successfully" });
  } catch (error) {
    next(error);
  }
};

exports.deleteStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    await StudentService.deleteStudent(id);
    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    next(error);
  }
};
