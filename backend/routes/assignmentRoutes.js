const express = require('express');
const router = express.Router();
const {
  getAssignments, addAssignment, updateAssignment, deleteAssignment,
} = require('../controllers/assignmentController');

router.get('/', getAssignments);
router.post('/', addAssignment);
router.put('/:id', updateAssignment);
router.delete('/:id', deleteAssignment);

module.exports = router;
