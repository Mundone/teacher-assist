const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Teacher } = require('../models'); // adjust the path as needed

const registerTeacher = async ({ code, name, password, roleID }) => {
  const existingTeacher = await Teacher.findOne({ where: { code } });
  if (existingTeacher) {
    throw new Error('Хэрэглэгчийн код давтагдаж байна.');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newTeacher = await Teacher.create({
    code: code,
    name: name,
    password: hashedPassword,
    role_id: roleID,
  });

  return newTeacher;
};

const authenticateTeacher = async (code, password) => {
  const teacher = await Teacher.findOne({ where: { code } });
  if (!teacher) {
    throw new Error('Хэрэглэгч олдсонгүй.');
  }

  const isMatch = await bcrypt.compare(password, teacher.password);
  if (!isMatch) {
    throw new Error('Нууц үг буруу байна.');
  }

  const token = jwt.sign(
    { id: teacher.id, code: teacher.code },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  return { teacher, token };
};

// Service
const refreshToken = async (teacherId) => {
  const teacher = await Teacher.findByPk(teacherId);
  if (!teacher) {
    const error = new Error('Teacher not found.');
    error.statusCode = 404;
    throw error;
  }

  const newToken = jwt.sign(
    { id: teacher.id, code: teacher.code },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  return { teacher, token: newToken };
};



module.exports = {
  registerTeacher,
  authenticateTeacher,
  refreshToken,
};
