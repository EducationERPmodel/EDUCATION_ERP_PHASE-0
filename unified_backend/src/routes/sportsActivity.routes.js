const express = require('express');
const { getList, getById, create, update, remove } = require('../controllers/sportsActivity.controller');
const { authenticate, requireHOD } = require('../middleware/authenticate');
const { validate } = require('../middleware/validate');
const { createSportsRules, updateSportsRules } = require('../validators/activityValidator');

const router = express.Router();
router.use(authenticate);

router.get('/',     getList);
router.get('/:id',  getById);
router.post('/',    requireHOD, validate(createSportsRules), create);
router.put('/:id',  requireHOD, validate(updateSportsRules), update);
router.delete('/:id', requireHOD, remove);

module.exports = router;
