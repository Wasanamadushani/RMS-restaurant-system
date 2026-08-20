const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({
      message: "Authentication required.",
    });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token.",
    });
  }
};

const requireRoles = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Authentication required.",
    });
  }

  // Admin has access to everything
  if (req.user.role === "admin") {
    return next();
  }

  // Check main role
  if (roles.includes(req.user.role)) {
    return next();
  }

  // Check staff sub-roles (for "kitchen", "delivery", "cashier" filters)
  if (req.user.role === "staff" && req.user.staffRole) {
    if (roles.includes(req.user.staffRole)) {
      return next();
    }
  }

  return res.status(403).json({
    message: "You do not have permission to access this route.",
  });
};

module.exports = {
  authenticateToken,
  requireRoles,
};