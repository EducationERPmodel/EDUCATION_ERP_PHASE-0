/**
 * Unified Student Validators
 * From Admin-erp — covers all student CRUD and list operations
 */

const { body, query, param } = require('express-validator');

const createStudentRules = [
  body('name')
    .trim().notEmpty().withMessage('Name is required')
    .isLength({ max: 150 }).withMessage('Name must be 150 characters or fewer'),
  body('phone')
    .optional({ checkFalsy: true }).trim()
    .matches(/^[0-9+\-\s]{7,20}$/).withMessage('Phone number is invalid'),
  body('gender')
    .notEmpty().withMessage('Gender is required')
    .isIn(['Male', 'Female']).withMessage('Gender must be Male or Female'),
  body('libraryId')
    .optional({ checkFalsy: true }).trim()
    .isLength({ max: 50 }).withMessage('Library ID must be 50 characters or fewer'),
  body('usn')
    .optional({ checkFalsy: true }).trim()
    .isLength({ max: 50 }).withMessage('USN must be 50 characters or fewer'),
  body('academicYear')
    .trim().notEmpty().withMessage('Academic year is required')
    .isLength({ max: 20 }).withMessage('Academic year must be 20 characters or fewer'),
  body('programId')
    .notEmpty().withMessage('Program is required')
    .isInt({ min: 1 }).withMessage('Program must be a valid id'),
  body('departmentId')
    .notEmpty().withMessage('Department is required')
    .isInt({ min: 1 }).withMessage('Department must be a valid id'),
  body('semester')
    .notEmpty().withMessage('Semester is required')
    .isInt({ min: 1, max: 8 }).withMessage('Semester must be between 1 and 8'),
  body('sectionId')
    .notEmpty().withMessage('Section is required')
    .isInt({ min: 1 }).withMessage('Section must be a valid id'),
];

const updateStudentRules = [
  param('id').isInt({ min: 1 }).withMessage('Invalid student id'),
  ...createStudentRules.map((rule) => rule.optional({ checkFalsy: false })),
];

const idParamRule = [
  param('id').isInt({ min: 1 }).withMessage('Invalid student id'),
];

const listStudentsRules = [
  query('page').optional().isInt({ min: 1 }).withMessage('page must be >= 1'),
  query('pageSize').optional().isInt({ min: 1, max: 100 }).withMessage('pageSize must be 1-100'),
  query('sortBy').optional().isIn([
    'name', 'usn', 'academic_year', 'semester', 'created_at',
  ]).withMessage('Invalid sortBy field'),
  query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('sortOrder must be asc or desc'),
  query('programId').optional().isInt({ min: 1 }),
  query('departmentId').optional().isInt({ min: 1 }),
  query('sectionId').optional().isInt({ min: 1 }),
  query('semester').optional().isInt({ min: 1, max: 8 }),
  query('academicYear').optional().trim(),
  query('search').optional().trim(),
];

module.exports = {
  createStudentRules,
  updateStudentRules,
  idParamRule,
  listStudentsRules,
};
