/**
 * Unified Student Validators
 * From Admin-erp — covers all student CRUD and list operations
 *
 * NOTE (Task 1): library_id is now the PRIMARY KEY for students.
 * - libraryId is REQUIRED on create (it is the PK, not auto-generated).
 * - Route :id params are library_id strings, not integers.
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
    .isIn(['Male', 'Female', 'Other']).withMessage('Gender must be Male, Female, or Other'),
  // libraryId is now the PK — required on create
  body('libraryId')
    .trim().notEmpty().withMessage('Library ID is required')
    .isLength({ min: 1, max: 50 }).withMessage('Library ID must be 1–50 characters'),
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
  // :id is a library_id string — validate as non-empty string, not integer
  param('id')
    .trim().notEmpty().withMessage('Student library ID is required')
    .isLength({ min: 1, max: 50 }).withMessage('Invalid student library ID'),
  ...createStudentRules
    .filter(rule => {
      // libraryId can remain optional on update (can't change PK via update)
      const str = rule.toString();
      return !str.includes("'libraryId'") && !str.includes('"libraryId"');
    })
    .map(rule => rule.optional({ checkFalsy: false })),
];

// :id is a library_id string — validate as non-empty, max 50 chars
const idParamRule = [
  param('id')
    .trim().notEmpty().withMessage('Student library ID is required')
    .isLength({ min: 1, max: 50 }).withMessage('Invalid student library ID'),
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
