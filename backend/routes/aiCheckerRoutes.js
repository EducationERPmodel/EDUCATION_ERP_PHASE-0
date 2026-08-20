const express  = require('express');
const router   = express.Router();
const multer   = require('multer');
const { extractText } = require('../controllers/aiCheckerController');

// multer v2 — fileFilter uses cb(accept: boolean) not cb(null, boolean)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    const allowed = ['text/plain', 'application/pdf'];
    const name    = file.originalname.toLowerCase();
    const ok      = allowed.includes(file.mimetype) ||
                    name.endsWith('.txt') ||
                    name.endsWith('.pdf');
    if (ok) {
      cb(null, true);
    } else {
      cb(new Error('Only .txt and .pdf files are allowed.'));
    }
  },
});

// POST /aichecker/extract  — field name must be "file"
router.post('/extract', upload.single('file'), extractText);

module.exports = router;
