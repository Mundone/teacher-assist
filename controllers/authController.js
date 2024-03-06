const authService = require('../services/authService');
const { validatePassword } = require('../utils/validation'); // Import the validatePassword function
const jwt = require("jsonwebtoken");

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

    const roleID = 2; // Consider handling roles more dynamically if needed

    const passwordError = validatePassword(password);
    if (passwordError) {
      return res.status(400).send({ message: passwordError });
    }

    const newUser = await authService.registerUser({ code, name, password, roleID });
    const { password: _, ...userInfo } = newUser.toJSON();
    res.status(201).send(userInfo);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};


const login = async (req, res) => {
  try {
    const { code, password } = req.body;
    const { user, token } = await authService.authenticateUser(code, password);
    res.status(200).json({
      message: 'Login successful',
      accessToken: token,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller
const getAuthInfo = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Token is not valid" });
    }
    try {
      // Use the decoded ID to fetch the user and refresh the token
      const { user, token: newToken } = await authService.refreshToken(decoded.id);
      res.json({ user, token: newToken });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      const message = error.message || 'Internal server error';
      res.status(statusCode).json({ message });
    }
  });
};



module.exports = {
  register,
  login,
  getAuthInfo,
};
