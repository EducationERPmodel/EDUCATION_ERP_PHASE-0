const express = require('express');
const { getList, getById, create, update, remove } = require('../controllers/technicalEvent.controller');
const { authenticate, requireHOD } = require('../middleware/authenticate');
const { validate } = require('../middleware/validate');
const { createTechnicalRules, updateTechnicalRules } = require('../validators/activityValidator');

const router = express.Router();
router.use(authenticate);

router.get('/',     getList);
router.get('/:id',  getById);
router.post('/',    requireHOD, validate(createTechnicalRules), create);
router.put('/:id',  requireHOD, validate(updateTechnicalRules), update);
router.delete('/:id', requireHOD, remove);

module.exports = router;
