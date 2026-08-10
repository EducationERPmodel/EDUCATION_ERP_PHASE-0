/**
 * Transfer Validator
 * From Admin-erp
 */

const { body } = require('express-validator');

const transferStudentRules = [
  body('studentId')
    .notEmpty().withMessage('Student is required')
    .isInt({ min: 1 }).withMessage('Student must be a valid id'),
  body('newProgramId')
    .notEmpty().withMessage('New program is required')
    .isInt({ min: 1 }).withMessage('New program must be a valid id'),
  body('newDepartmentId')
    .notEmpty().withMessage('New department is required')
    .isInt({ min: 1 }).withMessage('New department must be a valid id'),
  body('newSemester')
    .notEmpty().withMessage('New semester is required')
    .isInt({ min: 1, max: 8 }).withMessage('New semester must be between 1 and 8'),
  body('newSectionId')
    .notEmpty().withMessage('New section is required')
    .isInt({ min: 1 }).withMessage('New section must be a valid id'),
  body('remarks')
    .optional({ checkFalsy: true }).trim()
    .isLength({ max: 500 }).withMessage('Remarks must be 500 characters or fewer'),
];

module.exports = { transferStudentRules };
