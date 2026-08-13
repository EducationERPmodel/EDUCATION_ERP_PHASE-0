/**
 * Achievements Controller
 * Updated to match unified_schema.sql:
 *   achievements(achievement_id, student_id, faculty_id, title, level, type,
 *                position, certificate_url, achievement_date, created_at, updated_at)
 */

const pool = require('../config/db').pool;

// GET /achievements?student_id=X
// student_id here is the library_id value
const getAchievements = async (req, res) => {
  const { student_id } = req.query;
  try {
    const result = student_id
      ? await pool.query(
          `SELECT * FROM achievements
           WHERE student_id = $1
           ORDER BY achievement_date DESC, created_at DESC`,
          [student_id],
        )
      : await pool.query(
          `SELECT a.*, s.name AS student_name
           FROM achievements a
           JOIN students s ON s.library_id = a.student_id
           ORDER BY a.created_at DESC`,
        );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /achievements
const addAchievement = async (req, res) => {
  const { student_id, title, type, level, position, certificate_url, achievement_date } = req.body;

  if (!student_id || !title || !type) {
    return res.status(400).json({ message: 'student_id, title, and type are required.' });
  }

  const VALID_TYPES = ['Hackathon','Sports','Cultural','Industry','Certification','Publication','Award','Other'];
  if (!VALID_TYPES.includes(type)) {
    return res.status(400).json({ message: `type must be one of: ${VALID_TYPES.join(', ')}` });
  }

  const VALID_LEVELS = ['College','University','State','National','International'];
  if (level && !VALID_LEVELS.includes(level)) {
    return res.status(400).json({ message: `level must be one of: ${VALID_LEVELS.join(', ')}` });
  }

  try {
    const result = await pool.query(
      `INSERT INTO achievements
         (student_id, title, type, level, position, certificate_url, achievement_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [student_id, title, type, level || null, position || null, certificate_url || null, achievement_date || null],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /achievements/:id
const updateAchievement = async (req, res) => {
  const { id } = req.params;
  const { title, type, level, position, certificate_url, achievement_date } = req.body;
  try {
    const result = await pool.query(
      `UPDATE achievements
       SET title = $1, type = $2, level = $3, position = $4,
           certificate_url = $5, achievement_date = $6
       WHERE achievement_id = $7
       RETURNING *`,
      [title, type, level || null, position || null, certificate_url || null, achievement_date || null, id],
    );
    if (!result.rows.length) return res.status(404).json({ message: 'Achievement not found.' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /achievements/:id
const deleteAchievement = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM achievements WHERE achievement_id = $1 RETURNING achievement_id',
      [id],
    );
    if (!result.rows.length) return res.status(404).json({ message: 'Achievement not found.' });
    res.json({ message: 'Achievement deleted.', id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAchievements, addAchievement, updateAchievement, deleteAchievement };
