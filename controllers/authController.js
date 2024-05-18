const authService = require("../services/authService");
const { validatePassword } = require("../utils/validation"); // Import the validatePassword function
const jwt = require("jsonwebtoken");
const responses = require("../utils/responseUtil");

const registerController = async (req, res) => {
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
      // return res.status(400).send({ message: passwordError });
      responses.badRequest(res, error);
    }

    const newUser = await authService.registerUserService({
      code,
      name,
      password,
      roleID,
    });
    const { password: _, ...userInfo } = newUser.toJSON();
    res.status(201).send(userInfo);
  } catch (error) {
    if (error.statusCode == 403) {
      responses.forbidden(res, error);
    } else {
      responses.internalServerError(res, error);
    }
  }
};

const loginController = async (req, res) => {
  try {
    const { code, password } = req.body;
    const { user, token, UserMenus } =
      await authService.authenticateUserService({ code, password });
    res.status(200).json({
      message: "Амжилттай нэвтэрлээ.",
      accessToken: token,
      user,
      UserMenus,
    });
  } catch (error) {
    if (error.statusCode == 403) {
      responses.forbidden(res, error);
    } else {
      responses.internalServerError(res, error);
    }
  }
};

// Controller
const getAuthInfoController = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    // return res.status(401).json({ message: "Токен ирүүлээгүй байна." });
    responses.unauthorized(res);
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      // return res.status(403).json({ message: "Токений хугацаа дууссан байна." });
      responses.forbidden(res, err);
    }
    try {
      // Use the decoded ID to fetch the user and refresh the token
      const { user, UserMenus } = await authService.refreshTokenService(
        decoded.id
      );
      res.json({ user, UserMenus });
    } catch (error) {
      responses.internalServerError(res, error);
    }
  });
};

const loginStudentController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.authenticateStudentService(
      email,
      password
    );
    res.status(200).json({
      message: "Амжилттай нэвтэрлээ.",
      accessToken: token,
      user,
      // UserMenus,
    });
  } catch (error) {
    if (error.statusCode == 403) {
      responses.forbidden(res, error);
    } else {
      responses.internalServerError(res, error);
    }
  }
};

// Controller
const getAuthInfoStudentController = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    // return res.status(401).json({ message: "Токен ирүүлээгүй байна." });
    responses.unauthorized(res);
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      // return res.status(403).json({ message: "Токений хугацаа дууссан байна." });
      responses.forbidden(res, err);
    }
    try {
      // Use the decoded ID to fetch the user and refresh the token
      const { user } = await authService.refreshTokenStudentService(decoded.id);
      res.json({ user });
    } catch (error) {
      responses.internalServerError(res, error);
    }
  });
};

const sendOTPStudentController = async (req, res) => {
  try {
    const { email, student_code } = req.body;
    await authService.sendEmailStudentService(email, student_code);

    res.status(200).json({
      message: "Амжилттай код явууллаа.",
    });
  } catch (error) {
    if (error.statusCode == 403) {
      responses.forbidden(res, error);
    } else {
      responses.internalServerError(res, error);
    }
  }
};

const storePlayerIdController = async (req, res, next) => {
  try {
    const object = await authService.storePlayerIdService(req.body);
    responses.created(res, object);
  } catch (error) {
    if (error.statusCode == 403) {
      responses.forbidden(res, error);
    } else {
      responses.internalServerError(res, error);
    }
  }
};

module.exports = {
  registerController,
  loginController,
  getAuthInfoController,
  sendOTPStudentController,
  loginStudentController,
  getAuthInfoStudentController,
  storePlayerIdController,
};
