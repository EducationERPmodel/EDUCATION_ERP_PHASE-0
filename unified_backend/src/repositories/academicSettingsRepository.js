const { query } = require('../config/db');

const AcademicSettingsRepository = {
  /**
   * Returns the most recent academic settings row.
   */
  async getCurrentSettings() {
    const result = await query(
      `SELECT academic_year AS "academicYear",
              current_semester_type AS "currentSemesterType"
       FROM academic_settings
       ORDER BY setting_id DESC
       LIMIT 1`,
    );
    return result.rows[0] || null;
  },
};

module.exports = AcademicSettingsRepository;
