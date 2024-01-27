// services/studentService.js
const Student = require('../models/student');

const getAllStudents = async () => {
  return await Student.findAll();
};

const getStudentById = async (id) => {
  return await Student.findByPk(id);
};

const createStudent = async (data) => {
  return await Student.create(data);
};

const updateStudent = async (id, data) => {
  const student = await Student.findByPk(id);
  if (student) {
    return await student.update(data);
  }
  return null;
};

const deleteStudent = async (id) => {
  const student = await Student.findByPk(id);
  if (student) {
    await student.destroy();
    return true;
  }
  return false;
};

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};
