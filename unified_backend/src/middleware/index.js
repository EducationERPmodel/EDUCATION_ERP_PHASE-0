/**
 * Unified Middleware Index
 * Central export point for all middleware
 */

// Authentication middleware
const {
  authenticate,
  requireHOD,
  requireRole,
  requireAdmin,
  requireSameDepartment,
  optionalAuth,
} = require('./authenticate');

// Error handling middleware
const {
  notFound,
  errorHandler,
  catchAsync,
} = require('./errorHandler');

// Validation middleware
const {
  validate,
  checkValidation,
  sanitize,
  validatePagination,
  validateId,
} = require('./validate');

// Upload middleware
const {
  uploadPhoto,
  uploadDocument,
  uploadAny,
  deleteUploadedFile,
  getUploadUrl,
  uploadDirs,
} = require('./upload');

module.exports = {
  // Authentication
  authenticate,
  requireHOD,
  requireRole,
  requireAdmin,
  requireSameDepartment,
  optionalAuth,
  
  // Error handling
  notFound,
  errorHandler,
  catchAsync,
  
  // Validation
  validate,
  checkValidation,
  sanitize,
  validatePagination,
  validateId,
  
  // File upload
  uploadPhoto,
  uploadDocument,
  uploadAny,
  deleteUploadedFile,
  getUploadUrl,
  uploadDirs,
};
