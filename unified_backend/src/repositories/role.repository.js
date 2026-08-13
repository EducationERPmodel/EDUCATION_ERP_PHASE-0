const { query } = require('../config/db');

/**
 * Get all roles
 */
const findAll = async () => {
  const result = await query(
    `SELECT role_id AS id, role_name AS name, description FROM roles ORDER BY role_name ASC`,
  );
  return result.rows;
};

/**
 * Get role by id
 */
const findById = async (roleId) => {
  const result = await query(
    `SELECT role_id AS id, role_name AS name, description FROM roles WHERE role_id = $1`,
    [roleId],
  );
  return result.rows[0] || null;
};

/**
 * Assign a role to a faculty member for a department.
 * Returns { isNew, record }.
 */
const assignToFaculty = async (facultyId, roleId, departmentId) => {
  // Check for existing assignment
  const existing = await query(
    `SELECT coordinator_id FROM coordinator_assignments
     WHERE faculty_id = $1 AND role_id = $2 AND department_id = $3`,
    [facultyId, roleId, departmentId],
  );
  if (existing.rows.length > 0) {
    return { isNew: false, record: existing.rows[0] };
  }

  const result = await query(
    `INSERT INTO coordinator_assignments (faculty_id, role_id, department_id, assigned_date)
     VALUES ($1, $2, $3, CURRENT_DATE)
     RETURNING *`,
    [facultyId, roleId, departmentId],
  );
  return { isNew: true, record: result.rows[0] };
};

/**
 * Remove a role from a faculty member for a department.
 */
const removeFromFaculty = async (facultyId, roleId, departmentId) => {
  const result = await query(
    `DELETE FROM coordinator_assignments
     WHERE faculty_id = $1 AND role_id = $2 AND department_id = $3`,
    [facultyId, roleId, departmentId],
  );
  return result.rowCount > 0;
};

/**
 * Get all roles assigned to a faculty member.
 */
const getFacultyRoles = async (facultyId) => {
  const result = await query(
    `SELECT ca.coordinator_id, ca.faculty_id, ca.role_id, ca.department_id,
            ca.assigned_date, ca.remarks,
            r.role_name AS name, r.description,
            d.department_code, d.department_name
     FROM coordinator_assignments ca
     JOIN roles r ON r.role_id = ca.role_id
     JOIN departments d ON d.department_id = ca.department_id
     WHERE ca.faculty_id = $1
     ORDER BY ca.assigned_date ASC`,
    [facultyId],
  );
  return result.rows;
};

/**
 * Sync faculty roles — add new ones, remove specified ones, for a department.
 */
const syncFacultyRoles = async (facultyId, addRoleIds = [], removeRoleIds = [], departmentId) => {
  const results = { added: [], removed: [] };

  for (const roleId of addRoleIds) {
    const { isNew, record } = await assignToFaculty(facultyId, roleId, departmentId);
    if (isNew) results.added.push(record);
  }

  for (const roleId of removeRoleIds) {
    const removed = await removeFromFaculty(facultyId, roleId, departmentId);
    if (removed) results.removed.push(roleId);
  }

  return results;
};

module.exports = {
  findAll,
  findById,
  assignToFaculty,
  removeFromFaculty,
  getFacultyRoles,
  syncFacultyRoles,
};
