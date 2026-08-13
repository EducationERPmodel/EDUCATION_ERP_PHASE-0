const express = require('express');
const SlAuthController = require('../controllers/slAuth.controller');
const { validate } = require('../middleware/validate');
const { slLoginRules } = require('../validators/authValidator');

const router = express.Router();

// POST /api/hod/auth/login
router.post('/login', validate(slLoginRules), SlAuthController.login);

module.exports = router;
