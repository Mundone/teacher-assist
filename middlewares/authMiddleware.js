const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;
  if (!token) {
    return res.status(401).json({ message: "Токен ирүүлээгүй байна." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
    if (err) {
      const message =
        err.name === "TokenExpiredError"
          ? "Токений хугацаа дууссан байна."
          : "Зөвшөөрөлгүй хандалт.";
      return res.status(403).json({ message });
    }
    req.user = decodedToken;
    next();
  });
};

const methodCheckMiddleware = (req, res, next) => {
  // Define a list of routes that should bypass token authentication
  const bypassRoutes = [
    { method: "POST", path: "/login" },
    { method: "POST", path: "/login_student" },
    { method: "POST", path: "/register" },
    // { method: "GET", path: "/get_auth_info" },
    { method: "GET", path: "/get_current_week" },
    { method: "POST", path: "/register_attendance" },
    { method: "GET", path: "/get_schedules" },
    { method: "POST", path: "/send_otp_student" },
  ];

  // Define the GET routes that require authentication
  // const authRequiredRoutes = [
  //   { method: "GET", path: "/get_lesson_assessments" },
  //   { method: "GET", path: "/get_subject_schedules" },
  //   // Add more GET routes here as needed
  // ];

  // Check if the current route is in the bypass list
  const isBypassed = bypassRoutes.some(
    (route) => req.method === route.method && req.path === route.path
  );

  // Check if the current route requires authentication
  // const requiresAuth = authRequiredRoutes.some(
  //   (route) => req.method === route.method && req.path === route.path
  // );

  // If the route requires authentication or is not in the bypass list and is a POST, PUT, or DELETE request, authenticate token
  if (
    // requiresAuth ||
    (!isBypassed && 
      ["POST", "PUT", "DELETE", "GET"].includes(req.method)
      )
  ) {
    return authenticateToken(req, res, next);
  }

  // Proceed to the next middleware if the route is bypassed or not a POST, PUT, DELETE request
  next();
};

const accessControl = (allowedRoles) => {
  return (req, res, next) => {
    const userRoleId = req.user && req.user.role_id;
    if (!allowedRoles.includes(userRoleId)) {
      return res.status(403).json({ message: "Зөвшөөрөлгүй хандалт." });
    }
    next();
  };
};

module.exports = {
  accessControl,
  methodCheckMiddleware,
};
