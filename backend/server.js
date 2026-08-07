require('dotenv').config();

const express = require('express');
const cors = require('cors');
const pool = require('./config/db');

const studentRoutes       = require('./routes/studentRoutes');
const attendanceRoutes    = require('./routes/attendanceRoutes');
const assignmentRoutes    = require('./routes/assignmentRoutes');
const iaMarksRoutes       = require('./routes/iaMarksRoutes');
const dashboardRoutes     = require('./routes/dashboardRoutes');
const aiCheckerRoutes     = require('./routes/aiCheckerRoutes');
const achievementsRoutes  = require('./routes/achievementsRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// ── Routes ──────────────────────────────────────────
app.use('/students',      studentRoutes);
app.use('/attendance',    attendanceRoutes);
app.use('/assignments',   assignmentRoutes);
app.use('/iamarks',       iaMarksRoutes);
app.use('/dashboard',     dashboardRoutes);
app.use('/aichecker',     aiCheckerRoutes);
app.use('/achievements',  achievementsRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('🎉 Student ERP Backend is Running...');
});

// DB test
app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ success: true, time: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log('Routes: /students /attendance /assignments /iamarks /dashboard /aichecker /achievements');
});
