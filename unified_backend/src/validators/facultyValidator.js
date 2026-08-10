/**
 * Faculty Validators
 * Extracted from education_erp faculty.routes.js inline validation
 */

const { body } = require('express-validator');

const createFacultyRules = [
  body('employeeId').trim().notEmpty().withMessage('Employee ID is required'),
  body('name')
    .trim().notEmpty().withMessage('Name is required')
    .isLength({ max: 100 }),
  body('email').trim().isEmail().withMessage('Valid email is required'),
  body('designation').trim().notEmpty().withMessage('Designation is required'),
  body('qualification').trim().notEmpty().withMessage('Qualification is required'),
  body('username')
    .trim().notEmpty().withMessage('Username is required')
    .isLength({ min: 3, max: 50 }).withMessage('Username must be 3-50 characters')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers, underscore'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('joiningDate').isISO8601().withMessage('Valid joining date is required'),
  body('experience')
    .optional().isInt({ min: 0, max: 60 }).withMessage('Experience must be 0-60 years'),
];

const updateFacultyRules = [
  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('experience').optional().isInt({ min: 0, max: 60 }),
  body('joiningDate').optional().isISO8601(),
  body('status').optional().isIn(['ACTIVE', 'INACTIVE', 'ON_LEAVE']),
];

module.exports = { createFacultyRules, updateFacultyRules };
