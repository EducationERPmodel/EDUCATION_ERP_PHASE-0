/**
 * Industry Project Service
 * Unified schema: activities activity_type='IndustryProject'
 * title = projectName, description = {status, students: [{student_id, studentName, usn, semester, section}]}
 */

const industryProjectRepo = require('../repositories/industryProject.repository');

const parseQuery = (q) => ({
  page:      Math.max(1, parseInt(q.page)  || 1),
  limit:     Math.min(100, parseInt(q.limit) || 10),
  search:    q.search?.trim() || null,
  sortBy:    q.sortBy    || 'created_at',
  sortOrder: q.sortOrder || 'desc',
});

const getList = async (departmentCode, queryParams) => {
  const params = parseQuery(queryParams);
  const { items, total } = await industryProjectRepo.findAll(departmentCode, params);
  return {
    items,
    pagination: {
      total,
      page:       params.page,
      limit:      params.limit,
      totalPages: Math.ceil(total / params.limit),
      hasNext:    params.page * params.limit < total,
      hasPrev:    params.page > 1,
    },
  };
};

const getById = async (id, departmentCode) => {
  const record = await industryProjectRepo.findById(id);
  if (!record) throw { statusCode: 404, message: 'Industry project not found.' };
  if (departmentCode && record.department_code !== departmentCode)
    throw { statusCode: 403, message: 'Access denied.' };
  return record;
};

const create = async (data, departmentCode) => {
  if (!data.student_id)  throw { statusCode: 400, message: 'student_id is required.' };
  if (!data.projectName) throw { statusCode: 400, message: 'projectName is required.' };

  // Students array — at minimum include the primary student (library_id is the PK)
  const students = Array.isArray(data.students) ? data.students : [];
  if (!students.some(s => s.library_id === data.student_id)) {
    students.unshift({ library_id: data.student_id });
  }

  return industryProjectRepo.create({
    studentId:   data.student_id,
    facultyId:   data.faculty_id || null,
    title:       data.projectName.trim(),
    description: JSON.stringify({
      projectStatus: data.status || 'ONGOING',
      students,
    }),
    academicYear: data.academicYear || null,
    status:       data.status === 'COMPLETED' ? 'Completed' : 'Completed',
  });
};

const update = async (id, data, departmentCode) => {
  const existing = await industryProjectRepo.findById(id);
  if (!existing) throw { statusCode: 404, message: 'Industry project not found.' };
  if (departmentCode && existing.department_code !== departmentCode)
    throw { statusCode: 403, message: 'Access denied.' };

  const updateData = {};
  if (data.projectName)  updateData.title       = data.projectName.trim();
  if (data.academicYear) updateData.academicYear = data.academicYear;

  let desc = {};
  try { desc = JSON.parse(existing.description || '{}'); } catch {}
  if (data.status !== undefined) desc.projectStatus = data.status;
  updateData.description = JSON.stringify(desc);

  return industryProjectRepo.update(id, updateData);
};

const remove = async (id, departmentCode) => {
  const existing = await industryProjectRepo.findById(id);
  if (!existing) throw { statusCode: 404, message: 'Industry project not found.' };
  if (departmentCode && existing.department_code !== departmentCode)
    throw { statusCode: 403, message: 'Access denied.' };
  await industryProjectRepo.remove(id);
  return { message: 'Industry project deleted successfully.' };
};

const addStudent = async (id, studentData, departmentCode) => {
  const existing = await industryProjectRepo.findById(id);
  if (!existing) throw { statusCode: 404, message: 'Industry project not found.' };
  if (departmentCode && existing.department_code !== departmentCode)
    throw { statusCode: 403, message: 'Access denied.' };

  let desc = {};
  try { desc = JSON.parse(existing.description || '{}'); } catch {}
  const students = desc.students || [];

  if (students.some(s => s.library_id === studentData.student_id)) {
    throw { statusCode: 409, message: 'Student already in this project.' };
  }

  students.push({
    library_id:  studentData.student_id,
    studentName: studentData.studentName || null,
    usn:         studentData.usn         || null,
    semester:    studentData.semester    || null,
    section:     studentData.section     || null,
  });
  desc.students = students;

  return industryProjectRepo.update(id, { description: JSON.stringify(desc) });
};

const removeStudent = async (id, studentId, departmentCode) => {
  const existing = await industryProjectRepo.findById(id);
  if (!existing) throw { statusCode: 404, message: 'Industry project not found.' };
  if (departmentCode && existing.department_code !== departmentCode)
    throw { statusCode: 403, message: 'Access denied.' };

  let desc = {};
  try { desc = JSON.parse(existing.description || '{}'); } catch {}
  const before = (desc.students || []).length;
  desc.students = (desc.students || []).filter(s => s.library_id !== studentId);
  if (desc.students.length === before) throw { statusCode: 404, message: 'Student not found in project.' };

  return industryProjectRepo.update(id, { description: JSON.stringify(desc) });
};

module.exports = { getList, getById, create, update, remove, addStudent, removeStudent };
