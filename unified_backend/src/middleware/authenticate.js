/**
 * Unified Authentication Middleware
 * Merged from Admin-erp and education_erp authentication patterns
 * Supports JWT from Authorization header and cookies
 */

const { verifyToken } = require('../utils/jwt');
const { ApiError } = require('../utils/response');
const { errorResponse } = require('../utils/response');
const { logger } = require('../utils/logger');

/**
 * Main authentication middleware
 * Verifies JWT token from Authorization header or cookie
 * Supports both Admin-erp and education_erp token formats
 */
const authenticate = (req, res, next) => {
  try {
    let token = null;

    // Check Authorization header first (Bearer token)
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const [scheme, tokenValue] = authHeader.split(' ');
      if (scheme === 'Bearer' && tokenValue) {
        token = tokenValue;
      }
    }

    // Fallback to cookie if no header token
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    // No token found
    if (!token) {
      return next(new ApiError(401, 'Authentication token missing'));
    }

    // Verify and decode token
    const decoded = verifyToken(token);
    req.user = decoded;
    
    next();
  } catch (error) {
    if (error.message === 'Token has expired') {
      return next(new ApiError(401, 'Token expired. Please login again.'));
    }
    if (error.message === 'Invalid token') {
      return next(new ApiError(401, 'Invalid token'));
    }
    
    logger.error('Authentication error:', error);
    return next(new ApiError(401, 'Authentication failed'));
  }
};

/**
 * Require HOD role
 * Checks if user has HOD privileges
 */
const requireHOD = (req, res, next) => {
  if (!req.user) {
    return next(new ApiError(401, 'Authentication required'));
  }

  const isHOD = 
    req.user.isHOD === true || 
    (Array.isArray(req.user.roles) && req.user.roles.includes('HOD'));

  if (!isHOD) {
    return next(new ApiError(403, 'Access denied. HOD privileges required.'));
  }

  next();
};

/**
 * Require specific role(s)
 * Pass role slugs as arguments: requireRole('SPORTS', 'CULTURAL')
 * 
 * @param  {...string} roleSlugs - Role slugs to check
 * @returns {Function} Express middleware
 */
const requireRole = (...roleSlugs) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Authentication required'));
    }

    const userRoles = req.user.roles || [];
    const hasRole = roleSlugs.some((slug) => userRoles.includes(slug));

    if (!hasRole) {
      return next(new ApiError(
        403, 
        `Access denied. Required role(s): ${roleSlugs.join(', ')}`
      ));
    }

    next();
  };
};

/**
 * Require admin role
 * Checks if user is an admin
 */
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return next(new ApiError(401, 'Authentication required'));
  }

  if (req.user.role !== 'admin' && !req.user.isAdmin) {
    return next(new ApiError(403, 'Access denied. Admin privileges required.'));
  }

  next();
};

/**
 * Require same department
 * Ensures the requesting user belongs to the same department as the target resource
 * Target department should be set by route handler: req.targetDepartmentCode
 */
const requireSameDepartment = (req, res, next) => {
  if (!req.user) {
    return next(new ApiError(401, 'Authentication required'));
  }

  // Skip check if no target department specified
  if (!req.targetDepartmentCode) {
    return next();
  }

  if (req.user.departmentCode !== req.targetDepartmentCode) {
    return next(new ApiError(403, 'Access denied. Cross-department operation not allowed.'));
  }

  next();
};

/**
 * Optional authentication
 * Adds user to req if token is valid, but doesn't fail if no token
 * Useful for endpoints that have different behavior for authenticated users
 */
const optionalAuth = (req, res, next) => {
  try {
    let token = null;

    // Check Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const [scheme, tokenValue] = authHeader.split(' ');
      if (scheme === 'Bearer' && tokenValue) {
        token = tokenValue;
      }
    }

    // Fallback to cookie
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    // If token exists, verify it
    if (token) {
      const decoded = verifyToken(token);
      req.user = decoded;
    }

    next();
  } catch (error) {
    // Ignore errors for optional auth
    next();
  }
};

module.exports = {
  authenticate,
  requireHOD,
  requireRole,
  requireAdmin,
  requireSameDepartment,
  optionalAuth,
};
