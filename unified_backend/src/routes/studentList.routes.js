const { Router } = require('express');
const { param } = require('express-validator');
const { authenticate, requireHOD } = require('../middleware/authenticate');
const { validate } = require('../middleware/validate');
const StudentListController = require('../controllers/studentController');

const router = Router();

// All routes require a valid JWT with HOD role
router.use(authenticate, requireHOD);

// GET /api/hod/student-list/semesters
router.get('/semesters', StudentListController.getSemesters);

// GET /api/hod/student-list/:semester/sections
router.get(
  '/:semester/sections',
  validate([param('semester').isInt({ min: 1, max: 8 }).withMessage('Semester must be 1-8').toInt()]),
  StudentListController.getSections,
);

// GET /api/hod/student-list/:semester/:section
router.get(
  '/:semester/:section',
  validate([
    param('semester').isInt({ min: 1, max: 8 }).withMessage('Semester must be 1-8').toInt(),
    param('section').isLength({ min: 1, max: 10 }).withMessage('Section must be 1-10 chars').trim(),
  ]),
  StudentListController.getSectionDashboard,
);

module.exports = router;
