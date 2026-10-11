const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: "User not authenticated",
      });
    }

    const userRole = req.user.role?.trim();

    if (!roles.includes(userRole)) {
      return res.status(403).json({
        message: "You are not authorized to access this resource",
      });
    }

    next();
  };
};

module.exports = { authorizeRoles };
