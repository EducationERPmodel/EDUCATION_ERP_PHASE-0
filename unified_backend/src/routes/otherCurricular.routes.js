const express = require('express');
const ctrl = require('../controllers/otherCurricular.controller');
const { authenticate, requireHOD } = require('../middleware/authenticate');
const { validate } = require('../middleware/validate');
const { createOtherCurricularRules, updateOtherCurricularRules } = require('../validators/activityValidator');

const router = express.Router();
router.use(authenticate);

router.get('/',     ctrl.getList);
router.get('/:id',  ctrl.getById);
router.post('/',    requireHOD, validate(createOtherCurricularRules), ctrl.create);
router.put('/:id',  requireHOD, validate(updateOtherCurricularRules), ctrl.update);
router.delete('/:id', requireHOD, ctrl.remove);

module.exports = router;
