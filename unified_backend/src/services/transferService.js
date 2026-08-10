const { getClient } = require('../config/db');
const studentRepository = require('../repositories/studentRepository');
const transferRepository = require('../repositories/transferRepository');
const { ApiError } = require('../utils/apiResponse');

async function transferStudent(payload) {
  const student = await studentRepository.findById(payload.studentId);
  if (!student) throw new ApiError(404, 'Student not found');

  // Application-level validation: ensure at least one field is different
  const isSameProgram = student.programId === payload.newProgramId;
  const isSameDepartment = student.departmentId === payload.newDepartmentId;
  const isSameSemester = student.semesterId === (payload.newSemesterId || 
    (payload.newSemester ? await getSemesterIdFromNumber(payload.newSemester) : null));
  const isSameSection = student.sectionId === payload.newSectionId;

  if (isSameProgram && isSameDepartment && isSameSemester && isSameSection) {
    throw new ApiError(400, 'Transfer cannot be completed: no changes detected. The target academic placement is identical to the current placement.');
  }

  const client = await getClient();
  try {
    await client.query('BEGIN');

    const transferId = await transferRepository.createTransfer(client, {
      studentId:          payload.studentId,
      oldProgramId:       student.programId,
      oldDepartmentId:    student.departmentId,
      oldSemesterId:      student.semesterId,   // unified schema uses semester_id FK
      oldSectionId:       student.sectionId,
      newProgramId:       payload.newProgramId,
      newDepartmentId:    payload.newDepartmentId,
      newSemesterId:      payload.newSemesterId,  // pass semester_id directly
      newSemesterNumber:  payload.newSemester,    // or resolve from number
      newSectionId:       payload.newSectionId,
      reason:             payload.remarks,
      documentUrl:        payload.supportingDocumentUrl,
    });

    // Update student — resolve new semester_id from semester number if needed
    let newSemesterId = payload.newSemesterId;
    if (!newSemesterId && payload.newSemester) {
      const semRes = await client.query(
        'SELECT semester_id FROM semesters WHERE semester_number = $1',
        [payload.newSemester],
      );
      if (!semRes.rows.length) throw new ApiError(400, `Invalid semester: ${payload.newSemester}`);
      newSemesterId = semRes.rows[0].semester_id;
    }

    await client.query(
      `UPDATE students
       SET program_id    = $1,
           department_id = $2,
           semester_id   = $3,
           section_id    = $4,
           updated_at    = NOW()
       WHERE student_id  = $5`,
      [payload.newProgramId, payload.newDepartmentId, newSemesterId, payload.newSectionId, payload.studentId],
    );

    await client.query('COMMIT');

    const updatedStudent = await studentRepository.findById(payload.studentId);
    return { transferId, student: updatedStudent };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function getSemesterIdFromNumber(semesterNumber) {
  const result = await require('../config/db').query(
    'SELECT semester_id FROM semesters WHERE semester_number = $1',
    [semesterNumber]
  );
  return result.rows[0]?.semester_id;
}

async function getTransferHistory(studentId) {
  const student = await studentRepository.findById(studentId);
  if (!student) throw new ApiError(404, 'Student not found');
  return transferRepository.findByStudentId(studentId);
}

module.exports = { transferStudent, getTransferHistory };
