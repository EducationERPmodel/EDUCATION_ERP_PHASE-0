/**
 * Unified Controllers Index
 * Central export point for all controllers in the unified ERP system
 */

// ═════════════════════════════════════════════════════════════════════════════
// UNIFIED CONTROLLERS (Recommended for new development)
// ═════════════════════════════════════════════════════════════════════════════

const authController = require('./authController');
const dashboardController = require('./dashboardController');
const studentController = require('./studentController');

// ═════════════════════════════════════════════════════════════════════════════
// ACADEMIC MANAGEMENT
// ═════════════════════════════════════════════════════════════════════════════

const assignmentController = require('./assignmentController');
const attendanceController = require('./attendanceController');
const iaMarksController = require('./iaMarksController');

// ═════════════════════════════════════════════════════════════════════════════
// STUDENT ACTIVITIES & ACHIEVEMENTS
// ═════════════════════════════════════════════════════════════════════════════

const achievementsController = require('./achievementsController');
const aiCheckerController = require('./aiCheckerController');

// ═════════════════════════════════════════════════════════════════════════════
// EXTRACURRICULAR ACTIVITIES
// ═════════════════════════════════════════════════════════════════════════════

const culturalActivityController = require('./culturalActivity.controller');
const sportsActivityController = require('./sportsActivity.controller');
const technicalEventController = require('./technicalEvent.controller');
const hackathonController = require('./hackathon.controller');
const industryProjectController = require('./industryProject.controller');
const otherCurricularController = require('./otherCurricular.controller');

// ═════════════════════════════════════════════════════════════════════════════
// ADMINISTRATIVE
// ═════════════════════════════════════════════════════════════════════════════

const dropdownController = require('./dropdownController');
const exportController = require('./exportController');
const transferController = require('./transferController');

// ═════════════════════════════════════════════════════════════════════════════
// FACULTY & USER MANAGEMENT
// ═════════════════════════════════════════════════════════════════════════════

const facultyController = require('./faculty.controller');
const roleController = require('./role.controller');
const slAuthController = require('./slAuth.controller');

// ═════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═════════════════════════════════════════════════════════════════════════════

module.exports = {
  // Unified controllers (recommended)
  auth: authController,
  dashboard: dashboardController,
  student: studentController,
  
  // Academic management
  assignment: assignmentController,
  attendance: attendanceController,
  iaMarks: iaMarksController,
  
  // Student activities
  achievements: achievementsController,
  aiChecker: aiCheckerController,
  
  // Extracurricular activities
  culturalActivity: culturalActivityController,
  sportsActivity: sportsActivityController,
  technicalEvent: technicalEventController,
  hackathon: hackathonController,
  industryProject: industryProjectController,
  otherCurricular: otherCurricularController,
  
  // Administrative
  dropdown: dropdownController,
  export: exportController,
  transfer: transferController,
  
  // Faculty & user management
  faculty: facultyController,
  role: roleController,
  slAuth: slAuthController,
};
