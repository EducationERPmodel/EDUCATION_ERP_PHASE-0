const { query } = require('../config/db');

/**
 * Find user by username.
 * Aliases unified schema columns to the shape expected by authService.
 */
async function findByUsername(username) {
  const result = await query(
    `SELECT
       u.user_id AS id,
       u.username,
       u.password_hash AS "passwordHash",
       u.username AS "fullName",
       u.role_id AS role,
       (u.status = 'active') AS "isActive"
     FROM users u
     WHERE u.username = $1`,
    [username],
  );
  return result.rows[0] || null;
}

/**
 * Find user by user_id.
 */
async function findById(id) {
  const result = await query(
    `SELECT
       u.user_id AS id,
       u.username,
       u.username AS "fullName",
       u.role_id AS role,
       (u.status = 'active') AS "isActive"
     FROM users u
     WHERE u.user_id = $1`,
    [id],
  );
  return result.rows[0] || null;
}

module.exports = { findByUsername, findById };
