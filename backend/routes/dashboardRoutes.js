const express = require('express');
const router  = express.Router();
const {
  getDashboardStats,
  getWeeklyAttendance,
} = require('../controllers/dashboardController');

router.get('/stats',             getDashboardStats);    // GET /dashboard/stats
router.get('/weekly-attendance', getWeeklyAttendance);  // GET /dashboard/weekly-attendance

module.exports = router;
