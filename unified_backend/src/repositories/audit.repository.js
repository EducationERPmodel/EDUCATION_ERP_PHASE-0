const { query } = require('../config/db');

/**
 * Insert an audit log entry into audit_logs table.
 */
const create = async ({ userId, action, module, recordId, oldValue, newValue }) => {
  const result = await query(
    `INSERT INTO audit_logs (user_id, action, module, record_id, old_value, new_value)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING audit_id`,
    [
      userId   || null,
      action   || null,
      module   || null,
      recordId || null,
      oldValue != null ? JSON.stringify(oldValue) : null,
      newValue != null ? JSON.stringify(newValue) : null,
    ],
  );
  return result.rows[0];
};

const log = async ({ performedBy, action, facultyId, details }) => {
  return create({
    userId: performedBy || null,
    action,
    module: 'faculty',
    recordId: facultyId || null,
    oldValue: null,
    newValue: details || null,
  });
};

module.exports = { create, log };
