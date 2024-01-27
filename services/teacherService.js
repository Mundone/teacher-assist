// services/teacherService.js
const Teacher = require('../models/teacher');

const getAllTeachers = async () => {
  return await Teacher.findAll();
};

const getTeacherById = async (id) => {
  return await Teacher.findByPk(id);
};

const createTeacher = async (data) => {
  return await Teacher.create(data);
};

const updateTeacher = async (id, data) => {
  const teacher = await Teacher.findByPk(id);
  if (teacher) {
    return await teacher.update(data);
  }
  return null;
};

const deleteTeacher = async (id) => {
  const teacher = await Teacher.findByPk(id);
  if (teacher) {
    await teacher.destroy();
    return true;
  }
  return false;
};

module.exports = {
  getAllTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
};
