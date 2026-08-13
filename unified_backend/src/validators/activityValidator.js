/**
 * Activity Validators
 * Extracted from education_erp activity routes inline validation
 * Covers: cultural, sports, technical, hackathon, industry projects, other curricular
 */

const { body, param } = require('express-validator');

// ── Shared reusable rules ─────────────────────────────────────────────────────

const studentInfoRules = [
  body('studentName')
    .trim().notEmpty().withMessage('Student name is required')
    .isLength({ max: 150 }),
  body('usn')
    .trim().notEmpty().withMessage('USN / Roll number is required')
    .isLength({ max: 30 }),
  body('semester').isInt({ min: 1, max: 8 }).withMessage('Semester must be between 1 and 8'),
  body('section')
    .trim().notEmpty().withMessage('Section is required')
    .isLength({ max: 10 }),
];

const departmentRule = body('department')
  .trim().notEmpty().withMessage('Department is required')
  .isLength({ max: 100 });

const academicYearRule = body('academicYear')
  .trim().notEmpty().withMessage('Academic year is required')
  .matches(/^\d{4}-\d{2,4}$/).withMessage('Academic year format: 2024-25 or 2024-2025');

const academicYearOptional = body('academicYear')
  .optional()
  .matches(/^\d{4}-\d{2,4}$/).withMessage('Academic year format: 2024-25');

// ── Cultural Activity ─────────────────────────────────────────────────────────

const createCulturalRules = [
  ...studentInfoRules,
  departmentRule,
  body('culturalActivityName')
    .trim().notEmpty().withMessage('Cultural activity name is required')
    .isLength({ max: 150 }),
  body('eventName')
    .trim().notEmpty().withMessage('Event name is required')
    .isLength({ max: 200 }),
  body('positionPrize').optional({ checkFalsy: true }).isLength({ max: 100 }),
  academicYearRule,
];

const updateCulturalRules = [
  body('studentName').optional().trim().notEmpty().isLength({ max: 150 }),
  body('usn').optional().trim().notEmpty().isLength({ max: 30 }),
  body('department').optional().trim().notEmpty().isLength({ max: 100 }),
  body('section').optional().trim().notEmpty().isLength({ max: 10 }),
  body('semester').optional().isInt({ min: 1, max: 8 }),
  body('culturalActivityName').optional().trim().notEmpty().isLength({ max: 150 }),
  body('eventName').optional().trim().notEmpty().isLength({ max: 200 }),
  body('positionPrize').optional({ checkFalsy: true }).isLength({ max: 100 }),
  academicYearOptional,
];

// ── Sports Activity ───────────────────────────────────────────────────────────

const createSportsRules = [
  ...studentInfoRules,
  departmentRule,
  body('sportName')
    .trim().notEmpty().withMessage('Sport name is required')
    .isLength({ max: 150 }),
  body('competitionLevel')
    .trim().notEmpty().withMessage('Competition level is required')
    .isLength({ max: 100 }),
  body('positionMedal').optional({ checkFalsy: true }).isLength({ max: 100 }),
  academicYearRule,
];

const updateSportsRules = [
  body('studentName').optional().trim().notEmpty().isLength({ max: 150 }),
  body('usn').optional().trim().notEmpty().isLength({ max: 30 }),
  body('department').optional().trim().notEmpty().isLength({ max: 100 }),
  body('section').optional().trim().notEmpty().isLength({ max: 10 }),
  body('semester').optional().isInt({ min: 1, max: 8 }),
  body('sportName').optional().trim().notEmpty().isLength({ max: 150 }),
  body('competitionLevel').optional().trim().notEmpty().isLength({ max: 100 }),
  body('positionMedal').optional({ checkFalsy: true }).isLength({ max: 100 }),
  academicYearOptional,
];

// ── Technical Event ───────────────────────────────────────────────────────────

const VALID_EVENT_TYPES = [
  'Hackathon', 'Project', 'Paper Presentation',
  'Coding Contest', 'Workshop', 'Seminar', 'Internship', 'Other',
];
const VALID_STATUSES = ['ONGOING', 'COMPLETED'];

const createTechnicalRules = [
  ...studentInfoRules,
  departmentRule,
  body('eventType')
    .trim().notEmpty().withMessage('Event type is required')
    .isIn(VALID_EVENT_TYPES).withMessage(`Event type must be one of: ${VALID_EVENT_TYPES.join(', ')}`),
  body('projectName')
    .trim().notEmpty().withMessage('Project / event name is required')
    .isLength({ max: 200 }),
  body('projectDomain')
    .trim().notEmpty().withMessage('Project domain is required')
    .isLength({ max: 150 }),
  body('facultyMentor').optional({ checkFalsy: true }).isLength({ max: 150 }),
  body('projectStatus').optional().isIn(VALID_STATUSES),
  academicYearRule,
];

const updateTechnicalRules = [
  body('studentName').optional().trim().notEmpty().isLength({ max: 150 }),
  body('usn').optional().trim().notEmpty().isLength({ max: 30 }),
  body('department').optional().trim().notEmpty().isLength({ max: 100 }),
  body('section').optional().trim().notEmpty().isLength({ max: 10 }),
  body('semester').optional().isInt({ min: 1, max: 8 }),
  body('eventType').optional().trim().notEmpty().isIn(VALID_EVENT_TYPES),
  body('projectName').optional().trim().notEmpty().isLength({ max: 200 }),
  body('projectDomain').optional().trim().notEmpty().isLength({ max: 150 }),
  body('facultyMentor').optional({ checkFalsy: true }).isLength({ max: 150 }),
  body('projectStatus').optional().isIn(VALID_STATUSES),
  academicYearOptional,
];

// ── Hackathon ─────────────────────────────────────────────────────────────────

const createHackathonRules = [
  ...studentInfoRules,
  body('hackathonName')
    .trim().notEmpty().withMessage('Hackathon name is required')
    .isLength({ max: 200 }),
  body('position')
    .trim().notEmpty().withMessage('Position is required')
    .isLength({ max: 100 }),
  body('year').isInt({ min: 2000, max: 2100 }).withMessage('Valid year required'),
];

const updateHackathonRules = [
  body('studentName').optional().trim().notEmpty().isLength({ max: 150 }),
  body('usn').optional().trim().notEmpty().isLength({ max: 30 }),
  body('semester').optional().isInt({ min: 1, max: 8 }),
  body('section').optional().trim().notEmpty().isLength({ max: 10 }),
  body('hackathonName').optional().trim().notEmpty().isLength({ max: 200 }),
  body('position').optional().trim().notEmpty().isLength({ max: 100 }),
  body('year').optional().isInt({ min: 2000, max: 2100 }),
];

// ── Industry Project ──────────────────────────────────────────────────────────

const createIndustryProjectRules = [
  body('projectName')
    .trim().notEmpty().withMessage('Project name is required')
    .isLength({ max: 200 }),
  body('status').optional().isIn(VALID_STATUSES).withMessage('Status must be ONGOING or COMPLETED'),
];

const industryStudentRules = [
  body('studentName')
    .trim().notEmpty().withMessage('Student name is required')
    .isLength({ max: 150 }),
  body('usn').trim().notEmpty().withMessage('USN is required').isLength({ max: 30 }),
  body('semester').isInt({ min: 1, max: 8 }).withMessage('Semester must be 1-8'),
  body('section').trim().notEmpty().withMessage('Section is required').isLength({ max: 10 }),
];

// ── Other Curricular ──────────────────────────────────────────────────────────

const createOtherCurricularRules = [
  ...studentInfoRules,
  body('eventName')
    .trim().notEmpty().withMessage('Event name is required')
    .isLength({ max: 200 }),
  body('organizingCollege')
    .trim().notEmpty().withMessage('Organizing college is required')
    .isLength({ max: 200 }),
  body('achievement').optional({ checkFalsy: true }).isLength({ max: 200 }),
  body('year').isInt({ min: 2000, max: 2100 }).withMessage('Valid year required'),
];

const updateOtherCurricularRules = [
  body('studentName').optional().trim().notEmpty().isLength({ max: 150 }),
  body('usn').optional().trim().notEmpty().isLength({ max: 30 }),
  body('semester').optional().isInt({ min: 1, max: 8 }),
  body('section').optional().trim().notEmpty().isLength({ max: 10 }),
  body('eventName').optional().trim().notEmpty().isLength({ max: 200 }),
  body('organizingCollege').optional().trim().notEmpty().isLength({ max: 200 }),
  body('achievement').optional({ checkFalsy: true }).isLength({ max: 200 }),
  body('year').optional().isInt({ min: 2000, max: 2100 }),
];

module.exports = {
  // Cultural
  createCulturalRules, updateCulturalRules,
  // Sports
  createSportsRules, updateSportsRules,
  // Technical
  createTechnicalRules, updateTechnicalRules,
  // Hackathon
  createHackathonRules, updateHackathonRules,
  // Industry Projects
  createIndustryProjectRules, industryStudentRules,
  // Other Curricular
  createOtherCurricularRules, updateOtherCurricularRules,
  // Shared
  VALID_EVENT_TYPES, VALID_STATUSES,
};
