const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../config/logger');

// Protect routes
exports.protect = async (req, res, next) => {
  try {
    let token;

    logger.info('Checking authorization header:', {
      hasAuthHeader: !!req.headers.authorization,
      authHeader: req.headers.authorization
    });

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      logger.warn('No token provided');
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    logger.info('Token decoded:', { userId: decoded.id });

    const user = await User.findById(decoded.id);
    logger.info('User found:', { 
      userId: user._id,
      role: user.role,
      path: req.path
    });

    req.user = user;
    next();
  } catch (err) {
    logger.error('Auth middleware error:', {
      error: err.message,
      stack: err.stack
    });
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};

// Role-based permissions
const rolePermissions = {
  superadmin: ['manageUsers', 'manageRoles', 'manageContent', 'viewStats', 'moderateContent'],
  admin: ['manageContent', 'viewStats', 'moderateContent'],
  moderator: ['moderateContent'],
  user: []
};

// Check if user has required permission
const hasPermission = (userRole, requiredPermission) => {
  const permissions = rolePermissions[userRole] || [];
  return permissions.includes(requiredPermission);
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    // Flatten the roles array in case it's nested
    const allowedRoles = roles.flat();

    logger.info('Checking role authorization:', {
      userRole: req.user.role,
      allowedRoles,
      path: req.path
    });

    if (!allowedRoles.includes(req.user.role)) {
      logger.warn('Role authorization failed:', {
        userRole: req.user.role,
        allowedRoles,
        path: req.path
      });
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }

    logger.info('Role authorization successful:', {
      userRole: req.user.role,
      path: req.path
    });
    next();
  };
};

// Check specific permissions
exports.requirePermission = (permission) => {
  return (req, res, next) => {
    logger.info('Checking permission:', {
      userRole: req.user.role,
      requiredPermission: permission,
      path: req.path
    });

    if (!hasPermission(req.user.role, permission)) {
      logger.warn('Permission denied:', {
        userRole: req.user.role,
        requiredPermission: permission,
        path: req.path
      });
      return res.status(403).json({
        success: false,
        message: `User does not have the required permission: ${permission}`
      });
    }

    logger.info('Permission granted:', {
      userRole: req.user.role,
      permission: permission,
      path: req.path
    });
    next();
  };
};

// Check if user is superadmin
exports.superadminOnly = async (req, res, next) => {
  logger.info('Checking superadmin access:', {
    userId: req.user.id,
    role: req.user.role,
    path: req.path
  });

  if (req.user.role !== 'superadmin') {
    logger.warn('Superadmin access denied:', {
      userId: req.user.id,
      role: req.user.role,
      path: req.path
    });
    return res.status(403).json({
      success: false,
      message: 'Only superadmin can perform this action'
    });
  }

  logger.info('Superadmin access granted:', {
    userId: req.user.id,
    path: req.path
  });
  next();
};

// Check if user can manage admins (superadmin only)
exports.canManageAdmins = async (req, res, next) => {
  logger.info('Checking admin management permission:', {
    userId: req.user.id,
    role: req.user.role,
    path: req.path
  });

  if (!hasPermission(req.user.role, 'manageRoles')) {
    logger.warn('Admin management permission denied:', {
      userId: req.user.id,
      role: req.user.role,
      path: req.path
    });
    return res.status(403).json({
      success: false,
      message: 'Only superadmin can manage admin privileges'
    });
  }

  logger.info('Admin management permission granted:', {
    userId: req.user.id,
    path: req.path
  });
  next();
};

// Check resource ownership
exports.checkOwnership = (Model) => async (req, res, next) => {
  try {
    const resource = await Model.findById(req.params.id);

    if (!resource) {
      logger.warn('Resource not found:', {
        resourceId: req.params.id,
        userId: req.user.id,
        path: req.path
      });
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    // Allow access if user has manageContent permission or is resource owner
    if (hasPermission(req.user.role, 'manageContent') || resource.author.toString() === req.user.id) {
      logger.info('Resource access granted:', {
        resourceId: req.params.id,
        userId: req.user.id,
        hasManageContent: hasPermission(req.user.role, 'manageContent'),
        isOwner: resource.author.toString() === req.user.id,
        path: req.path
      });
      next();
    } else {
      logger.warn('Resource access denied:', {
        resourceId: req.params.id,
        userId: req.user.id,
        path: req.path
      });
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this resource'
      });
    }
  } catch (err) {
    logger.error('Resource ownership check error:', {
      error: err.message,
      stack: err.stack,
      userId: req.user.id,
      path: req.path
    });
    return res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};
