const authService = require('../services/authService');
const { validatePassword } = require('../utils/validation'); // Import the validatePassword function

const register = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).send({ message: "Body хэрэгтэй." });
    }

    const { code, name, password } = req.body;

    // Check if password is provided
    if (!password) {
      return res.status(400).send({ message: "Нууц үг оруулна уу." });
    }

    const roleID = 1; // Consider handling roles more dynamically if needed

    const passwordError = validatePassword(password);
    if (passwordError) {
      return res.status(400).send({ message: passwordError });
    }

    const newTeacher = await authService.registerTeacher({ code, name, password, roleID });
    const { password: _, ...teacherInfo } = newTeacher.toJSON();
    res.status(201).send(teacherInfo);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};


const login = async (req, res) => {
  try {
    const { code, password } = req.body;
    const { teacher, token } = await authService.authenticateTeacher(code, password);
    res.status(200).json({
      message: 'Login successful',
      accessToken: token,
      teacher,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller
const getAuthInfo = async (req, res) => {
  try {
    const teacherId = req.user.id; // Assuming req.user is set by Passport
    const { teacher, token } = await authService.refreshToken(teacherId);
    res.json({ teacher, token });
  } catch (error) {
    // Enhanced error handling
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal server error';
    res.status(statusCode).json({ message });
  }
};


module.exports = {
  register,
  login,
  getAuthInfo,
};
