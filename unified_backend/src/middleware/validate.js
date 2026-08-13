/**
 * Unified Validation Middleware
 * Merged from Admin-erp and education_erp validation patterns
 * Uses express-validator for request validation
 */

const { validationResult } = require('express-validator');
const { ApiError } = require('../utils/response');

/**
 * Admin-erp pattern: Takes validation chains as argument
 * Runs validations and throws ApiError if validation fails
 * 
 * Usage:
 * router.post('/users', 
 *   validate([
 *     body('email').isEmail(),
 *     body('name').notEmpty()
 *   ]),
 *   createUser
 * );
 * 
 * @param {Array} validations - Array of express-validator validation chains
 * @returns {Function} Express middleware
 */
const validate = (validations) => {
  return async (req, res, next) => {
    // Run all validations
    await Promise.all(validations.map((validation) => validation.run(req)));

    // Check for errors
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    // Format errors
    const details = errors.array().map((e) => ({
      field: e.path || e.param,
      message: e.msg,
      value: e.value,
    }));

    // Throw validation error
    next(new ApiError(400, 'Validation failed', details));
  };
};

/**
 * education_erp pattern: Simple validation check
 * Just checks validation results without taking validations as argument
 * Validations should be defined inline in route
 * 
 * Usage:
 * router.post('/users',
 *   body('email').isEmail(),
 *   body('name').notEmpty(),
 *   checkValidation,
 *   createUser
 * );
 * 
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next function
 */
const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  
  if (errors.isEmpty()) {
    return next();
  }

  // Format errors
  const details = errors.array().map((e) => ({
    field: e.path || e.param,
    message: e.msg,
    value: e.value,
  }));

  // Throw validation error
  next(new ApiError(422, 'Validation failed', details));
};

/**
 * Sanitize request body
 * Removes unwanted fields from request body
 * 
 * @param {Array} allowedFields - Array of allowed field names
 * @returns {Function} Express middleware
 */
const sanitize = (allowedFields) => {
  return (req, res, next) => {
    const sanitized = {};
    
    for (const field of allowedFields) {
      if (req.body.hasOwnProperty(field)) {
        sanitized[field] = req.body[field];
      }
    }
    
    req.body = sanitized;
    next();
  };
};

/**
 * Validate pagination parameters
 * Ensures page and limit are valid numbers
 */
const validatePagination = (req, res, next) => {
  const page = parseInt(req.query.page, 10);
  const limit = parseInt(req.query.limit || req.query.pageSize, 10);

  if (req.query.page && (isNaN(page) || page < 1)) {
    return next(new ApiError(400, 'Invalid page number'));
  }

  if ((req.query.limit || req.query.pageSize) && (isNaN(limit) || limit < 1 || limit > 100)) {
    return next(new ApiError(400, 'Invalid limit (must be between 1 and 100)'));
  }

  // Set defaults
  req.pagination = {
    page: page || 1,
    limit: limit || 20,
    offset: ((page || 1) - 1) * (limit || 20),
  };

  next();
};

/**
 * Validate ID parameter
 * Ensures req.params.id is a valid number
 */
const validateId = (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  
  if (isNaN(id) || id < 1) {
    return next(new ApiError(400, 'Invalid ID parameter'));
  }
  
  req.params.id = id;
  next();
};

module.exports = {
  validate,           // Admin-erp pattern (with validation chains)
  checkValidation,    // education_erp pattern (inline validations)
  sanitize,           // Sanitize request body
  validatePagination, // Validate pagination params
  validateId,         // Validate ID param
};
