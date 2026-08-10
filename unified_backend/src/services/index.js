/**
 * Unified Services Index
 * Central export point for all services
 */

// ── Core ─────────────────────────────────────────────────────────────────────
const authService        = require('./authService');
const studentService     = require('./studentService');
const studentListService = require('./studentList.service');
const dropdownService    = require('./dropdownService');
const transferService    = require('./transferService');
const exportService      = require('./exportService');
const dashboardService   = require('./dashboard.service');

// ── Faculty & Roles ───────────────────────────────────────────────────────────
const facultyService     = require('./faculty.service');
const roleService        = require('./role.service');
const slAuthService      = require('./slAuth.service');

// ── Extracurricular Activities ────────────────────────────────────────────────
const culturalActivityService  = require('./culturalActivity.service');
const sportsActivityService    = require('./sportsActivity.service');
const technicalEventService    = require('./technicalEvent.service');
const hackathonService         = require('./hackathon.service');
const industryProjectService   = require('./industryProject.service');
const otherCurricularService   = require('./otherCurricular.service');

module.exports = {
  // Core
  authService,
  studentService,
  studentListService,
  dropdownService,
  transferService,
  exportService,
  dashboardService,

  // Faculty & Roles
  facultyService,
  roleService,
  slAuthService,

  // Extracurricular
  culturalActivityService,
  sportsActivityService,
  technicalEventService,
  hackathonService,
  industryProjectService,
  otherCurricularService,
};
