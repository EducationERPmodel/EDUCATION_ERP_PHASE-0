const express  = require('express');
const router   = express.Router();
const multer   = require('multer');
const { extractText } = require('../controllers/aiCheckerController');

// Store file in memory (buffer) — no disk I/O needed
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
  fileFilter: (req, file, cb) => {
    const allowed = ['text/plain', 'application/pdf'];
    const name = file.originalname.toLowerCase();
    if (
      allowed.includes(file.mimetype) ||
      name.endsWith('.txt') ||
      name.endsWith('.pdf')
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only .txt and .pdf files are allowed.'));
    }
  },
});

// POST /aichecker/extract  — single file, field name "file"
router.post('/extract', upload.single('file'), extractText);

module.exports = router;
