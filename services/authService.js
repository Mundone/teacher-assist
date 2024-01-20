const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Teacher } = require('../models'); // adjust the path as needed

const registerTeacher = async ({ email, password, name }) => {
  const existingTeacher = await Teacher.findOne({ where: { email } });
  if (existingTeacher) {
    throw new Error('Email already in use.');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newTeacher = await Teacher.create({
    email,
    password: hashedPassword,
    name,
  });

  return newTeacher;
};

const authenticateTeacher = async (email, password) => {
  const teacher = await Teacher.findOne({ where: { email } });
  if (!teacher) {
    throw new Error('Teacher not found.');
  }

  const isMatch = await bcrypt.compare(password, teacher.password);
  if (!isMatch) {
    throw new Error('Invalid credentials.');
  }

  const token = jwt.sign(
    { id: teacher.id, email: teacher.email },
    process.env.JWT_KEY,
    { expiresIn: '1h' }
  );

  return { teacher, token };
};

const refreshToken = async (teacherId) => {
  const teacher = await Teacher.findByPk(teacherId);
  if (!teacher) {
    throw new Error('Teacher not found.');
  }

  const newToken = jwt.sign(
    { id: teacher.id, email: teacher.email },
    process.env.JWT_KEY,
    { expiresIn: '1h' }
  );

  return { teacher, token: newToken };
};

module.exports = {
  registerTeacher,
  authenticateTeacher,
  refreshToken,
};
