/**
 * Unified Utils Index
 * Central export point for all utility functions
 */

// Response utilities (unified from Admin-erp and education_erp)
const {
  ApiError,
  success,
  successResponse,
  paginatedResponse,
  errorResponse,
} = require('./response');

// Async handler (from Admin-erp)
const asyncHandler = require('./asyncHandler');

// JWT utilities (from education_erp)
const {
  generateToken,
  verifyToken,
  decodeToken,
  generateRefreshToken,
} = require('./jwt');

// Logger utilities (from education_erp)
const {
  logger,
  logRequest,
  logError,
} = require('./logger');

module.exports = {
  // Response utilities
  ApiError,
  success,
  successResponse,
  paginatedResponse,
  errorResponse,
  
  // Async handler
  asyncHandler,
  
  // JWT utilities
  generateToken,
  verifyToken,
  decodeToken,
  generateRefreshToken,
  
  // Logger utilities
  logger,
  logRequest,
  logError,
};
