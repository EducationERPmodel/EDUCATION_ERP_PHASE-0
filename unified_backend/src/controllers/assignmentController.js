/**
 * Assignments Controller
 * Updated to match unified_schema.sql:
 *   assignments(assignment_id, class_id, title, description,
 *               due_date, marks, attachment_url, status, created_at, updated_at)
 *
 * class_id links to classes → section/semester/subject/faculty
 * No standalone subject or semester columns — all derived via class_id
 */

const pool = require('../config/db').pool;

// GET /assignments?class_id=X&status=Open
const getAssignments = async (req, res) => {
  const { class_id, status } = req.query;
  try {
    const conditions = [];
    const params = [];
    let idx = 1;

    if (class_id) { conditions.push(`a.class_id = $${idx++}`); params.push(class_id); }
    if (status)   { conditions.push(`a.status   = $${idx++}`); params.push(status); }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const result = await pool.query(
      `SELECT a.*,
              sub.subject_name, sub.subject_code,
              sec.section_name,
              sem.semester_number
       FROM assignments a
       JOIN classes c ON c.class_id = a.class_id
       JOIN subjects sub ON sub.subject_id = c.subject_id
       JOIN sections sec ON sec.section_id = c.section_id
       JOIN semesters sem ON sem.semester_id = c.semester_id
       ${where}
       ORDER BY a.created_at DESC`,
      params,
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /assignments
const addAssignment = async (req, res) => {
  const { class_id, title, description, due_date, marks, attachment_url, status } = req.body;
  if (!class_id || !title) {
    return res.status(400).json({ message: 'class_id and title are required.' });
  }
  try {
    const result = await pool.query(
      `INSERT INTO assignments (class_id, title, description, due_date, marks, attachment_url, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [class_id, title, description || null, due_date || null, marks || 0, attachment_url || null, status || 'Open'],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /assignments/:id
const updateAssignment = async (req, res) => {
  const { id } = req.params;
  const { title, description, due_date, marks, attachment_url, status } = req.body;
  try {
    const result = await pool.query(
      `UPDATE assignments
       SET title = $1, description = $2, due_date = $3,
           marks = $4, attachment_url = $5, status = $6
       WHERE assignment_id = $7
       RETURNING *`,
      [title, description || null, due_date || null, marks ?? 0, attachment_url || null, status || 'Open', id],
    );
    if (!result.rows.length) return res.status(404).json({ message: 'Assignment not found.' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /assignments/:id
const deleteAssignment = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM assignments WHERE assignment_id = $1 RETURNING assignment_id',
      [id],
    );
    if (!result.rows.length) return res.status(404).json({ message: 'Assignment not found.' });
    res.json({ message: 'Assignment deleted.', id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAssignments, addAssignment, updateAssignment, deleteAssignment };
