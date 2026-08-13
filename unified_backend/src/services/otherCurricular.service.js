/**
 * Other Curricular Activity Service
 * Unified schema: activities activity_type='OtherCurricular'
 * title = eventName, description = {organizingCollege, achievement, year, section, semester}
 */

const otherCurricularRepo = require('../repositories/otherCurricular.repository');

const parseQuery = (q) => ({
  page:      Math.max(1, parseInt(q.page)  || 1),
  limit:     Math.min(100, parseInt(q.limit) || 10),
  search:    q.search?.trim() || null,
  sortBy:    q.sortBy    || 'created_at',
  sortOrder: q.sortOrder || 'desc',
});

const getList = async (departmentCode, queryParams) => {
  const params = parseQuery(queryParams);
  const { items, total } = await otherCurricularRepo.findAll(departmentCode, params);
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
  const record = await otherCurricularRepo.findById(id);
  if (!record) throw { statusCode: 404, message: 'Activity not found.' };
  if (departmentCode && record.department_code !== departmentCode)
    throw { statusCode: 403, message: 'Access denied.' };
  return record;
};

const create = async (data, departmentCode) => {
  if (!data.student_id) throw { statusCode: 400, message: 'student_id is required.' };
  if (!data.eventName)  throw { statusCode: 400, message: 'eventName is required.' };

  return otherCurricularRepo.create({
    studentId:   data.student_id,
    facultyId:   data.faculty_id || null,
    title:       data.eventName.trim(),
    description: JSON.stringify({
      organizingCollege: data.organizingCollege || null,
      achievement:       data.achievement       || null,
      year:              data.year              || null,
      section:           data.section           || null,
      semester:          data.semester          || null,
    }),
    academicYear: data.academicYear || (data.year ? String(data.year) : null),
    status:       'Completed',
  });
};

const update = async (id, data, departmentCode) => {
  const existing = await otherCurricularRepo.findById(id);
  if (!existing) throw { statusCode: 404, message: 'Activity not found.' };
  if (departmentCode && existing.department_code !== departmentCode)
    throw { statusCode: 403, message: 'Access denied.' };

  const updateData = {};
  if (data.eventName)    updateData.title       = data.eventName.trim();
  if (data.academicYear) updateData.academicYear = data.academicYear;

  let desc = {};
  try { desc = JSON.parse(existing.description || '{}'); } catch {}
  if (data.organizingCollege !== undefined) desc.organizingCollege = data.organizingCollege;
  if (data.achievement       !== undefined) desc.achievement       = data.achievement;
  if (data.year              !== undefined) desc.year              = parseInt(data.year);
  if (data.section           !== undefined) desc.section           = data.section;
  if (data.semester          !== undefined) desc.semester          = parseInt(data.semester);
  updateData.description = JSON.stringify(desc);

  return otherCurricularRepo.update(id, updateData);
};

const remove = async (id, departmentCode) => {
  const existing = await otherCurricularRepo.findById(id);
  if (!existing) throw { statusCode: 404, message: 'Activity not found.' };
  if (departmentCode && existing.department_code !== departmentCode)
    throw { statusCode: 403, message: 'Access denied.' };
  await otherCurricularRepo.remove(id);
  return { message: 'Activity deleted successfully.' };
};

module.exports = { getList, getById, create, update, remove };
