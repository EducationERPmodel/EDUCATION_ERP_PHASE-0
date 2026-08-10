const express = require('express');
const exportController = require('../controllers/exportController');

const router = express.Router();

router.get('/preview', exportController.preview);
router.post('/', exportController.exportData);

module.exports = router;
