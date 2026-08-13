const express = require('express');
const ctrl = require('../controllers/hackathon.controller');
const { authenticate, requireHOD } = require('../middleware/authenticate');
const { validate } = require('../middleware/validate');
const { createHackathonRules, updateHackathonRules } = require('../validators/activityValidator');

const router = express.Router();
router.use(authenticate);

router.get('/',     ctrl.getList);
router.get('/:id',  ctrl.getById);
router.post('/',    requireHOD, validate(createHackathonRules), ctrl.create);
router.put('/:id',  requireHOD, validate(updateHackathonRules), ctrl.update);
router.delete('/:id', requireHOD, ctrl.remove);

module.exports = router;
