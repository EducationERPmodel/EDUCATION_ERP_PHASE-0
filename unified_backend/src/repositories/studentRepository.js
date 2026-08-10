/**
 * Unified Student Repository
 * Pure pg — no Prisma.
 *
 * Admin-erp pattern  → full CRUD (findAll, findById, create, update, remove, setStatus)
 * education_erp pattern → getStudentsBySectionId (used by studentList.service)
 */

const { query } = require('../config/db');

// ─── Base SELECT ──────────────────────────────────────────────────────────────

const SELECT_BASE = `
  SELECT
    s.student_id   AS "id",
    s.name,
    s.phone,
    s.email,
    s.gender,
    s.library_id   AS "libraryId",
    s.usn,
    s.academic_year AS "academicYear",
    s.status,
    s.semester_id  AS "semesterId",
    sem.semester_number AS "semester",
    s.program_id   AS "programId",    p.program_name    AS "programName",
    s.department_id AS "departmentId", d.department_name AS "departmentName",
    s.section_id   AS "sectionId",    sec.section_name  AS "sectionName",
    s.created_at   AS "createdAt",
    s.updated_at   AS "updatedAt"
  FROM students s
  JOIN programs    p   ON p.program_id    = s.program_id
  JOIN departments d   ON d.department_id = s.department_id
  JOIN semesters   sem ON sem.semester_id = s.semester_id
  JOIN sections    sec ON sec.section_id  = s.section_id
`;

const SORT_COLUMN_MAP = {
  name:          's.name',
  usn:           's.usn',
  academic_year: 's.academic_year',
  semester:      'sem.semester_number',
  created_at:    's.created_at',
};

// ─── Admin-erp methods ────────────────────────────────────────────────────────

async function findAll({
  page = 1, pageSize = 20,
  sortBy = 'created_at', sortOrder = 'desc',
  search, programId, departmentId, sectionId, semester, academicYear,
} = {}) {
  const conditions = [];
  const params = [];
  let idx = 1;

  if (search) {
    // same param index used three times — pg handles this fine
    conditions.push(`(s.name ILIKE $${idx} OR s.usn ILIKE $${idx} OR s.library_id ILIKE $${idx})`);
    params.push(`%${search}%`);
    idx++;
  }
  if (programId)    { conditions.push(`s.program_id = $${idx}`);        params.push(programId);    idx++; }
  if (departmentId) { conditions.push(`s.department_id = $${idx}`);     params.push(departmentId); idx++; }
  if (sectionId)    { conditions.push(`s.section_id = $${idx}`);        params.push(sectionId);    idx++; }
  if (semester)     { conditions.push(`sem.semester_number = $${idx}`); params.push(semester);     idx++; }
  if (academicYear) { conditions.push(`s.academic_year = $${idx}`);     params.push(academicYear); idx++; }

  const where     = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const sortCol   = SORT_COLUMN_MAP[sortBy] || 's.created_at';
  const direction = sortOrder === 'asc' ? 'ASC' : 'DESC';
  const offset    = (page - 1) * pageSize;

  const [dataResult, countResult] = await Promise.all([
    query(
      `${SELECT_BASE} ${where} ORDER BY ${sortCol} ${direction} LIMIT $${idx} OFFSET $${idx + 1}`,
      [...params, pageSize, offset],
    ),
    query(
      `SELECT COUNT(*)::int AS total
       FROM students s
       JOIN semesters sem ON sem.semester_id = s.semester_id
       ${where}`,
      params,
    ),
  ]);

  return { rows: dataResult.rows, total: countResult.rows[0].total };
}

async function findById(id) {
  const result = await query(`${SELECT_BASE} WHERE s.student_id = $1`, [id]);
  return result.rows[0] || null;
}

async function create(data) {
  const semResult = await query(
    'SELECT semester_id FROM semesters WHERE semester_number = $1',
    [data.semester],
  );
  if (!semResult.rows.length) throw new Error(`Invalid semester number: ${data.semester}`);
  const semesterId = semResult.rows[0].semester_id;

  const result = await query(
    `INSERT INTO students
       (name, phone, email, gender, library_id, usn, academic_year,
        program_id, department_id, semester_id, section_id)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
     RETURNING student_id`,
    [
      data.name,
      data.phone       || null,
      data.email       || null,
      data.gender,
      data.libraryId   || null,
      data.usn         || null,
      data.academicYear,
      data.programId,
      data.departmentId,
      semesterId,
      data.sectionId,
    ],
  );
  return findById(result.rows[0].student_id);
}

async function update(id, data) {
  const fields = [];
  const params = [];
  let idx = 1;

  if (data.semester !== undefined) {
    const semResult = await query(
      'SELECT semester_id FROM semesters WHERE semester_number = $1',
      [data.semester],
    );
    if (!semResult.rows.length) throw new Error(`Invalid semester number: ${data.semester}`);
    data.semesterId = semResult.rows[0].semester_id;
  }

  const fieldMap = {
    name:         'name',
    phone:        'phone',
    email:        'email',
    gender:       'gender',
    libraryId:    'library_id',
    usn:          'usn',
    academicYear: 'academic_year',
    programId:    'program_id',
    departmentId: 'department_id',
    semesterId:   'semester_id',
    sectionId:    'section_id',
    status:       'status',
  };

  Object.entries(fieldMap).forEach(([key, col]) => {
    if (data[key] !== undefined) {
      fields.push(`${col} = $${idx}`);
      params.push(data[key]);
      idx++;
    }
  });

  if (!fields.length) return findById(id);

  fields.push('updated_at = NOW()');
  params.push(id);

  await query(
    `UPDATE students SET ${fields.join(', ')} WHERE student_id = $${idx}`,
    params,
  );
  return findById(id);
}

async function remove(id) {
  const result = await query('DELETE FROM students WHERE student_id = $1', [id]);
  return result.rowCount > 0;
}

async function setStatus(id, status) {
  await query(
    'UPDATE students SET status = $1, updated_at = NOW() WHERE student_id = $2',
    [status, id],
  );
}

// ─── education_erp method (used by studentList.service) ──────────────────────

async function getStudentsBySectionId(sectionId) {
  const result = await query(
    `SELECT
       s.student_id  AS id,
       s.usn,
       s.name,
       s.phone,
       s.email,
       att.attendance_percentage  AS "attendancePercentage",
       perf.performance_percentage AS "performancePercentage"
     FROM students s
     LEFT JOIN (
       SELECT student_id,
              ROUND(
                100.0 * SUM(CASE WHEN status = 'Present' THEN 1 ELSE 0 END)
                / NULLIF(COUNT(*), 0),
                2
              ) AS attendance_percentage
       FROM attendance
       GROUP BY student_id
     ) att  ON att.student_id  = s.student_id
     LEFT JOIN (
       SELECT student_id,
              ROUND(AVG((COALESCE(ia1,0) + COALESCE(ia2,0) + COALESCE(ia3,0)) / 3.0), 2) AS performance_percentage
       FROM ia_marks
       GROUP BY student_id
     ) perf ON perf.student_id = s.student_id
     WHERE s.section_id = $1
     ORDER BY s.usn ASC`,
    [sectionId],
  );

  return result.rows.map(r => ({
    id:    r.id,
    usn:   r.usn,
    name:  r.name,
    phone: r.phone,
    email: r.email,
    attendance:  r.attendancePercentage  != null
      ? { attendancePercentage:  parseFloat(r.attendancePercentage) }
      : null,
    performance: r.performancePercentage != null
      ? { performancePercentage: parseFloat(r.performancePercentage) }
      : null,
  }));
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
  setStatus,
  SELECT_BASE,
  getStudentsBySectionId,
};
