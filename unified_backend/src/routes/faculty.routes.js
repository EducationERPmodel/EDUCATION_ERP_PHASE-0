/**
 * Faculty Routes
 * From education_erp - updated to use unified middleware and validators
 */

const express = require('express');
const {
  getFacultyList, getFacultyById, createFaculty, updateFaculty, deleteFaculty,
  getMyProfile, getMyClasses,
} = require('../controllers/faculty.controller');
const { authenticate, requireHOD } = require('../middleware/authenticate');
const { validate } = require('../middleware/validate');
const { uploadPhoto } = require('../middleware/upload');
const { createFacultyRules, updateFacultyRules } = require('../validators/facultyValidator');

const router = express.Router();

router.use(authenticate);

// GET /api/faculty/me          — logged-in faculty's own profile
router.get('/me', getMyProfile);

// GET /api/faculty/me/classes  — classes assigned to logged-in faculty
router.get('/me/classes', getMyClasses);

// GET /api/faculty
router.get('/', getFacultyList);

// GET /api/faculty/:id
router.get('/:id', getFacultyById);

// POST /api/faculty (HOD only)
router.post('/', requireHOD, uploadPhoto.single('photo'), validate(createFacultyRules), createFaculty);

// PUT /api/faculty/:id (HOD only)
router.put('/:id', requireHOD, uploadPhoto.single('photo'), validate(updateFacultyRules), updateFaculty);

// DELETE /api/faculty/:id (HOD only)
router.delete('/:id', requireHOD, deleteFaculty);

module.exports = router;
