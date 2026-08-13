/**
 * Unified Auth Routes
 * Merged from Admin-erp and education_erp
 */

const express = require('express');
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/authenticate');
const { validate } = require('../middleware/validate');
const { loginRules, facultyLoginRules } = require('../validators/authValidator');

const router = express.Router();

// POST /api/auth/admin/login
router.post('/admin/login', validate(loginRules), authController.adminLogin);

// POST /api/auth/faculty/login
router.post('/faculty/login', validate(facultyLoginRules), authController.facultyLogin);

// POST /api/auth/login  — universal (auto-detects by departmentCode presence)
router.post('/login', validate(loginRules), authController.login);

// POST /api/auth/logout
router.post('/logout', authenticate, authController.logout);

// GET /api/auth/me
router.get('/me', authenticate, authController.getMe);

module.exports = router;
