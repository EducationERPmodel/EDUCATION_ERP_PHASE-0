const express = require('express');
const router  = express.Router();
const {
  getStudents,
  getStudentProfile,
  addStudent,
  updateStudent,
  deleteStudent,
} = require('../controllers/studentController');

router.get('/',           getStudents);
router.get('/:id/profile', getStudentProfile);
router.post('/',          addStudent);
router.put('/:id',        updateStudent);
router.delete('/:id',     deleteStudent);

module.exports = router;
