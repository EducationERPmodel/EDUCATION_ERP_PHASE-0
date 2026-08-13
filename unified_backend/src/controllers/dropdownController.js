const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/apiResponse');
const dropdownService = require('../services/dropdownService');

const getByType = asyncHandler(async (req, res) => {
  const options = await dropdownService.getDropdown(req.params.type);
  success(res, options);
});

const getSectionsBySemester = asyncHandler(async (req, res) => {
  const sections = await dropdownService.getSectionsBySemester(req.params.semesterId);
  success(res, sections);
});

const getDepartmentsByProgram = asyncHandler(async (req, res) => {
  const departments = await dropdownService.getDepartmentsByProgram(req.params.programId);
  success(res, departments);
});

module.exports = { getByType, getSectionsBySemester, getDepartmentsByProgram };
