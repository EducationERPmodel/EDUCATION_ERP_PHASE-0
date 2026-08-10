/**
 * JWT Token Utilities
 * From education_erp
 * 
 * Handles JWT token generation, verification, and decoding
 * Supports role-based access control (RBAC) for faculty
 */

const jwt = require('jsonwebtoken');
const config = require('../config');

const JWT_SECRET = config.jwt.secret;
const JWT_EXPIRES_IN = config.jwt.expiresIn;

/**
 * Generate JWT token for authenticated user
 * Supports both faculty (with roles) and admin users
 * 
 * @param {Object} user - User object (faculty or admin)
 * @param {string} user.id - User ID
 * @param {string} user.username - Username
 * @param {string} user.departmentCode - Department code (for faculty)
 * @param {string} user.coordinatorRoles - Comma-separated coordinator roles
 * @param {string} user.designation - User designation (HOD, etc.)
 * @param {string} user.role - User role (for admin: 'admin')
 * @returns {string} JWT token
 */
const generateToken = (user) => {
  // Handle admin users (simple case)
  if (user.role === 'admin' || user.isAdmin) {
    const payload = {
      id: user.id,
      username: user.username,
      role: 'admin',
      isAdmin: true,
    };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }

  // Handle faculty users (complex case with roles)
  const coordinatorRoles = user.coordinatorRoles
    ? user.coordinatorRoles.split(',').map(r => r.trim())
    : [];

  // Build roles array: always include FACULTY, add coordinator roles, and HOD if applicable
  const roles = ['FACULTY', ...coordinatorRoles];
  if (user.designation && user.designation.includes('HOD')) {
    roles.push('HOD');
  }

  const payload = {
    id: user.employeeId || user.id,
    username: user.username,
    departmentCode: user.departmentCode,
    roles,
    isHOD: user.designation ? user.designation.includes('HOD') : false,
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

/**
 * Verify JWT token and return decoded payload
 * Throws an error if token is invalid or expired
 * 
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload
 * @throws {Error} If token is invalid or expired
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token has expired');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    }
    throw error;
  }
};

/**
 * Decode token without verification (for expired token reading)
 * Useful for debugging or reading expired tokens
 * 
 * @param {string} token - JWT token to decode
 * @returns {Object|null} Decoded token payload or null if invalid
 */
const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
};

/**
 * Generate refresh token with longer expiry
 * 
 * @param {Object} user - User object
 * @returns {string} Refresh token
 */
const generateRefreshToken = (user) => {
  const payload = {
    id: user.id || user.employeeId,
    username: user.username,
    type: 'refresh',
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

module.exports = { 
  generateToken, 
  verifyToken, 
  decodeToken,
  generateRefreshToken,
};
