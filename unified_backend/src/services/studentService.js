const studentRepository = require('../repositories/studentRepository');
const { ApiError } = require('../utils/apiResponse');

async function listStudents(filters) {
  const page = filters.page || 1;
  const pageSize = filters.pageSize || 20;
  const { rows, total } = await studentRepository.findAll({ ...filters, page, pageSize });
  return {
    students: rows,
    meta: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  };
}

async function getStudent(id) {
  const student = await studentRepository.findById(id);
  if (!student) throw new ApiError(404, 'Student not found');
  return student;
}

async function createStudent(payload) {
  return studentRepository.create(payload);
}

async function updateStudent(id, payload) {
  const existing = await studentRepository.findById(id);
  if (!existing) throw new ApiError(404, 'Student not found');
  return studentRepository.update(id, payload);
}

async function deleteStudent(id) {
  const existing = await studentRepository.findById(id);
  if (!existing) throw new ApiError(404, 'Student not found');
  await studentRepository.remove(id);
}

module.exports = {
  listStudents, getStudent, createStudent, updateStudent, deleteStudent,
};
