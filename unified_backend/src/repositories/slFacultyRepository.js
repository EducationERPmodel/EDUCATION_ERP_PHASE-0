const { query } = require('../config/db');

/**
 * SlFacultyRepository — used by slAuth (student-list auth) which authenticates
 * faculty via email rather than username.
 */
const SlFacultyRepository = {
  /**
   * Find faculty by email address.
   */
  async findByEmail(email) {
    const result = await query(
      `SELECT
         f.faculty_id AS id,
         f.employee_id AS "employeeId",
         f.name,
         f.email,
         f.password_hash AS password,
         f.designation,
         f.status,
         d.department_code AS "departmentCode"
       FROM faculty f
       JOIN departments d ON d.department_id = f.department_id
       WHERE f.email = $1
       LIMIT 1`,
      [email],
    );
    return result.rows[0] || null;
  },

  /**
   * Find faculty by faculty_id (primary key).
   */
  async findById(id) {
    const result = await query(
      `SELECT
         f.faculty_id AS id,
         f.employee_id AS "employeeId",
         f.name,
         f.email,
         f.designation,
         f.status,
         d.department_code AS "departmentCode"
       FROM faculty f
       JOIN departments d ON d.department_id = f.department_id
       WHERE f.faculty_id = $1
       LIMIT 1`,
      [id],
    );
    return result.rows[0] || null;
  },
};

module.exports = SlFacultyRepository;