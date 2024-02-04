const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
  if (!token) {
    return res.status(401).json({ message: "No token provided." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
    if (err) {
      const message = err.name === "TokenExpiredError" ? "Token expired." : "Invalid token.";
      return res.status(403).json({ message });
    }
    req.user = decodedToken;
    next();
  });
};

const methodCheckMiddleware = (req, res, next) => {
  // Define a list of routes that should bypass token authentication
  const bypassRoutes = [
    { method: 'POST', path: '/login' },
    { method: 'POST', path: '/register' },
    { method: 'GET', path: '/get_auth_info' }
  ];

  // Check if the current route is in the bypass list
  const isBypassed = bypassRoutes.some(route => 
    req.method === route.method && req.path === route.path);

  // If the route is not in the bypass list and is a POST, PUT, or DELETE request, authenticate token
  if (!isBypassed && ["POST", "PUT", "DELETE"].includes(req.method)) {
    return authenticateToken(req, res, next);
  }

  // Proceed to the next middleware if the route is bypassed or not a POST, PUT, DELETE request
  next();
};

module.exports = methodCheckMiddleware;
