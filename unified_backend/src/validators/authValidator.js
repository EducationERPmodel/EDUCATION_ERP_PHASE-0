/**
 * Unified Auth Validators
 * Merged from Admin-erp (admin login) and education_erp (faculty login)
 */

const { body } = require('express-validator');

// ── Admin login (Admin-erp) ───────────────────────────────────────────────────
const loginRules = [
  body('username').trim().notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

// ── Faculty/HOD login (education_erp) ────────────────────────────────────────
// departmentCode is optional — HOD portal sends it, Faculty portal omits it.
const facultyLoginRules = [
  body('departmentCode')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 20 }).withMessage('Invalid department code'),
  body('username')
    .trim().notEmpty().withMessage('Username is required')
    .isLength({ min: 3, max: 50 }).withMessage('Username must be 3-50 characters'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6, max: 100 }).withMessage('Password must be 6-100 characters'),
];

// ── HOD student-list login (slAuth) ──────────────────────────────────────────
const slLoginRules = [
  body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

module.exports = { loginRules, facultyLoginRules, slLoginRules };
