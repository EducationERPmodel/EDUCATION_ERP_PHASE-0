/**
 * Unified Response Utilities
 * Merged from Admin-erp/apiResponse.js and education_erp/response.js
 * Provides consistent API response formatting across all systems
 */

// ═════════════════════════════════════════════════════════════════════════════
// ERROR CLASS
// ═════════════════════════════════════════════════════════════════════════════

class ApiError extends Error {
  constructor(statusCode, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.name = 'ApiError';
  }
}

// ═════════════════════════════════════════════════════════════════════════════
// SUCCESS RESPONSES
// ═════════════════════════════════════════════════════════════════════════════

/**
 * Admin-erp pattern: Simple success response
 * @param {Object} res - Express response object
 * @param {*} data - Response data
 * @param {Object} meta - Optional metadata (pagination, etc.)
 * @param {number} statusCode - HTTP status code (default: 200)
 */
const success = (res, data, meta = null, statusCode = 200) => {
  const body = { success: true, data };
  if (meta) body.meta = meta;
  return res.status(statusCode).json(body);
};

/**
 * education_erp pattern: Success response with message and timestamp
 * @param {Object} res - Express response object
 * @param {*} data - Response data
 * @param {string} message - Success message
 * @param {number} statusCode - HTTP status code (default: 200)
 */
const successResponse = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Paginated success response
 * @param {Object} res - Express response object
 * @param {*} data - Response data array
 * @param {Object} pagination - Pagination metadata (page, limit, total, etc.)
 * @param {string} message - Success message
 */
const paginatedResponse = (res, data, pagination, message = 'Success') => {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination,
    timestamp: new Date().toISOString(),
  });
};

// ═════════════════════════════════════════════════════════════════════════════
// ERROR RESPONSES
// ═════════════════════════════════════════════════════════════════════════════

/**
 * Error response with message and optional validation errors
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code (default: 500)
 * @param {Array|Object} errors - Optional validation errors
 */
const errorResponse = (res, message = 'Internal Server Error', statusCode = 500, errors = null) => {
  const response = {
    success: false,
    message,
    timestamp: new Date().toISOString(),
  };
  if (errors) response.errors = errors;
  return res.status(statusCode).json(response);
};

// ═════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═════════════════════════════════════════════════════════════════════════════

module.exports = {
  // Error class
  ApiError,
  
  // Success responses
  success,              // Admin-erp pattern (simple)
  successResponse,      // education_erp pattern (with message)
  paginatedResponse,    // Paginated data
  
  // Error responses
  errorResponse,        // Error with message
};
