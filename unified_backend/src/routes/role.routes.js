const express = require('express');
const { getAllRoles, getFacultyRoles, syncRoles } = require('../controllers/role.controller');
const { authenticate, requireHOD } = require('../middleware/authenticate');

const router = express.Router();
router.use(authenticate);

router.get('/', getAllRoles);
router.get('/faculty/:id/roles', getFacultyRoles);
router.patch('/faculty/:id/roles/sync', requireHOD, syncRoles);

module.exports = router;
