/**
 * Unified Error Handler Middleware
 * Merged from Admin-erp and education_erp error handling patterns
 * Handles API errors, database errors, and validation errors
 */

const { ApiError } = require('../utils/response');
const { logger } = require('../utils/logger');
const config = require('../config');

/**
 * 404 Not Found Handler
 * Place this after all routes
 */
const notFound = (req, res, next) => {
  const error = new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`);
  next(error);
};

/**
 * Global Error Handler
 * Handles all errors thrown in the application
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let details = null;

  // Handle ApiError
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    details = err.details;
  } else if (err.statusCode || err.status) {
    // Handle errors with statusCode property
    statusCode = err.statusCode || err.status;
    message = err.message || message;
  }

  // PostgreSQL Errors (pg library)
  if (err.code === '23505') {
    // Unique violation
    statusCode = 409;
    message = 'A record with the same unique value already exists';
    
    // Extract field name from error if available
    if (err.detail) {
      const match = err.detail.match(/Key \(([^)]+)\)/);
      if (match) {
        details = { field: match[1] };
      }
    }
  }

  if (err.code === '23503') {
    // Foreign key violation
    statusCode = 400;
    message = 'Invalid reference: related record does not exist';
  }

  if (err.code === '23502') {
    // Not null violation
    statusCode = 400;
    message = 'Required field is missing';
    
    if (err.column) {
      details = { field: err.column };
    }
  }

  if (err.code === '22P02') {
    // Invalid text representation
    statusCode = 400;
    message = 'Invalid data format';
  }

  // Multer errors (file upload)
  if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 413;
    message = 'File size too large';
  }

  if (err.code === 'LIMIT_FILE_COUNT') {
    statusCode = 400;
    message = 'Too many files uploaded';
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    statusCode = 400;
    message = 'Unexpected file field';
  }

  // JWT Errors
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token has expired';
  }

  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  // Validation Errors (express-validator)
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    details = err.errors;
  }

  // Log server errors (5xx) - ALWAYS log with full details
  if (statusCode >= 500) {
    logger.error(`${statusCode} - ${message}`, {
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
      user: req.user?.username || req.user?.email || 'anonymous',
      stack: err.stack,
      error: err.message,
      fullError: err,
    });
    
    // Also console log in development for immediate visibility
    if (config.env === 'development') {
      console.error('❌ 500 ERROR DETAILS:');
      console.error('URL:', req.originalUrl);
      console.error('Method:', req.method);
      console.error('Error:', err.message);
      console.error('Stack:', err.stack);
      console.error('Full Error:', err);
    }
  } else if (statusCode >= 400 && config.env === 'development') {
    // Log client errors in development
    logger.warn(`${statusCode} - ${message}`, {
      url: req.originalUrl,
      method: req.method,
      error: err.message,
    });
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    message,
    ...(details && { details }),
    ...(config.env === 'development' && statusCode >= 500 && { stack: err.stack }),
    timestamp: new Date().toISOString(),
  });
};

/**
 * Async Error Wrapper (alternative to asyncHandler utility)
 * Wraps async route handlers to catch errors
 * 
 * @param {Function} fn - Async route handler
 * @returns {Function} Express middleware
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = {
  notFound,
  errorHandler,
  catchAsync,
};
