const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models"); // adjust the path as needed

const registerUser = async ({ code, name, password, roleID }) => {
  const existingUser = await User.findOne({ where: { code } });
  if (existingUser) {
    throw new Error("Хэрэглэгчийн код давтагдаж байна.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({
    code: code,
    name: name,
    password: hashedPassword,
    role_id: roleID,
  });

  return newUser;
};

const authenticateUser = async (code, password) => {
  const inputUser = await User.findOne({ where: { code } });
  if (!inputUser) {
    throw new Error("Хэрэглэгч олдсонгүй.");
  }

  const isMatch = await bcrypt.compare(password, inputUser.password);
  if (!isMatch) {
    throw new Error("Нууц үг буруу байна.");
  }

  const token = jwt.sign(
    { id: inputUser.id, code: inputUser.code },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );
  
  var user = {
    id: inputUser.id,
    name: inputUser.name,
    email: inputUser.email,
    code: inputUser.code,
    role_id: inputUser.role_id,
  };
  
  return { user, token };
};

// Service
const refreshToken = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) {
    const error = new Error("User not found.");
    error.statusCode = 404;
    throw error;
  }

  const newToken = jwt.sign(
    { id: user.id, code: user.code },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return { user, token: newToken };
};

module.exports = {
  registerUser,
  authenticateUser,
  refreshToken,
};
