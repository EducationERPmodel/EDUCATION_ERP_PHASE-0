/**
 * Unified Dashboard Routes
 * Merged from faculty_student and education_erp
 */

const express = require('express');
const { getDashboardStats, getWeeklyAttendance, getHODDashboard } = require('../controllers/dashboardController');
const { authenticate, requireHOD } = require('../middleware/authenticate');

const router = express.Router();

router.use(authenticate);

// GET /api/dashboard/stats          — faculty_student pattern
router.get('/stats', getDashboardStats);

// GET /api/dashboard/weekly-attendance — faculty_student pattern
router.get('/weekly-attendance', getWeeklyAttendance);

// GET /api/dashboard/hod            — education_erp pattern (HOD only)
router.get('/hod', requireHOD, getHODDashboard);

module.exports = router;
