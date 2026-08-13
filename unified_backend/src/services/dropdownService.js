const dropdownRepository = require('../repositories/dropdownRepository');
const { ApiError } = require('../utils/apiResponse');

const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({ id: n, name: `Semester ${n}` }));
const GENDERS = [
  { id: 'Male', name: 'Male' },
  { id: 'Female', name: 'Female' },
];

async function getDropdown(type) {
  if (type === 'semester') return SEMESTERS;
  if (type === 'gender') return GENDERS;

  const rows = await dropdownRepository.findActive(type);
  if (!rows) throw new ApiError(404, `Unknown dropdown type: ${type}`);
  return rows;
}

async function getSectionsBySemester(semesterId) {
  const sections = await dropdownRepository.findSectionsBySemester(semesterId);
  return sections;
}

async function getDepartmentsByProgram(programId) {
  const departments = await dropdownRepository.findDepartmentsByProgram(programId);
  return departments;
}

module.exports = { getDropdown, getSectionsBySemester, getDepartmentsByProgram };
