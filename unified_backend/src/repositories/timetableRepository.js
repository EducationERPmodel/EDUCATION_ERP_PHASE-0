const { query } = require('../config/db');

const TimetableRepository = {
  /**
   * Get full timetable for a semester+section, joining through classes → subjects/faculty.
   * Returns rows shaped so studentList.service can access t.subject.subjectName and t.faculty.name.
   */
  async getTimetableBySemesterAndSection(semesterId, sectionId) {
    const result = await query(
      `SELECT
         tt.timetable_id,
         tt.day_of_week AS day,
         tt.period,
         tt.room_number AS "roomNumber",
         sub.subject_id AS "subjectId",
         sub.subject_name AS "subjectName",
         sub.subject_code AS "subjectCode",
         f.faculty_id AS "facultyId",
         f.name AS "facultyName"
       FROM timetable tt
       JOIN classes c ON c.class_id = tt.class_id
       JOIN subjects sub ON sub.subject_id = c.subject_id
       JOIN faculty f ON f.faculty_id = c.faculty_id
       WHERE c.semester_id = $1
         AND c.section_id = $2
       ORDER BY tt.day_of_week ASC, tt.period ASC`,
      [semesterId, sectionId],
    );

    // Shape the rows so callers can access row.subject.subjectName / row.faculty.name
    return result.rows.map(r => ({
      timetableId: r.timetable_id,
      day: r.day,
      period: r.period,
      roomNumber: r.roomNumber,
      subject: {
        id: r.subjectId,
        subjectName: r.subjectName,
        subjectCode: r.subjectCode,
      },
      faculty: {
        id: r.facultyId,
        name: r.facultyName,
      },
    }));
  },

  /**
   * Get distinct subject→faculty mappings for a semester+section (one entry per subject).
   */
  async getSubjectFacultyMappingBySemesterAndSection(semesterId, sectionId) {
    const result = await query(
      `SELECT DISTINCT ON (sub.subject_id)
         sub.subject_id AS "subjectId",
         sub.subject_name AS subject,
         sub.subject_code AS "subjectCode",
         f.faculty_id AS "facultyId",
         f.name AS faculty
       FROM timetable tt
       JOIN classes c ON c.class_id = tt.class_id
       JOIN subjects sub ON sub.subject_id = c.subject_id
       JOIN faculty f ON f.faculty_id = c.faculty_id
       WHERE c.semester_id = $1
         AND c.section_id = $2
       ORDER BY sub.subject_id ASC`,
      [semesterId, sectionId],
    );
    return result.rows;
  },
};

module.exports = TimetableRepository;
