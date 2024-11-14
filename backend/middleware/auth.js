const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};

// Check if user is superadmin
exports.superadminOnly = async (req, res, next) => {
  if (!req.user.isSuperAdmin()) {
    return res.status(403).json({
      success: false,
      message: 'Only superadmin can perform this action'
    });
  }
  next();
};

// Check if user can manage admins
exports.canManageAdmins = async (req, res, next) => {
  if (!req.user.canManageAdmins()) {
    return res.status(403).json({
      success: false,
      message: 'Only superadmin can manage admin privileges'
    });
  }
  next();
};

// Check resource ownership
exports.checkOwnership = (Model) => async (req, res, next) => {
  try {
    const resource = await Model.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    // Allow access if user is superadmin or resource owner
    if (req.user.isSuperAdmin() || resource.author.toString() === req.user.id) {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this resource'
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};
