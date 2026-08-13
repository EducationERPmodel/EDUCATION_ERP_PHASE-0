const { query } = require('../config/db');

const SemesterRepository = {
  /**
   * Find a semester by its number (1–8).
   */
  async findBySemesterNumber(semesterNumber) {
    const result = await query(
      `SELECT semester_id AS id, semester_number AS "semesterNumber"
       FROM semesters
       WHERE semester_number = $1`,
      [semesterNumber],
    );
    return result.rows[0] || null;
  },

  /**
   * Get semesters filtered by type.
   * ODD  → 1, 3, 5, 7
   * EVEN → 2, 4, 6, 8
   */
  async getSemestersBySemesterType(semesterType) {
    const isOdd = semesterType.toUpperCase() === 'ODD';
    const nums = isOdd ? [1, 3, 5, 7] : [2, 4, 6, 8];

    const result = await query(
      `SELECT semester_id AS id, semester_number AS "semesterNumber"
       FROM semesters
       WHERE semester_number = ANY($1::int[])
       ORDER BY semester_number ASC`,
      [nums],
    );
    return result.rows;
  },
};

module.exports = SemesterRepository;
