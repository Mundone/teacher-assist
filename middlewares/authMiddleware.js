const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer Token
  if (!token) {
    return res.status(401).json({ message: "No token provided." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token." });
    }
    req.user = decodedToken;
    next();
  });
};

const methodCheckMiddleware = (req, res, next) => {
  if (["POST", "PUT", "DELETE"].includes(req.method)) {
    return authenticateToken(req, res, next);
  }
  next();
};

module.exports = methodCheckMiddleware;
