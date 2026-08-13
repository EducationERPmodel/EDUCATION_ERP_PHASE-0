const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/apiResponse');
const exportService = require('../services/exportService');

const buildFilters = (query) => ({
  programId: query.programId ? parseInt(query.programId, 10) : undefined,
  departmentId: query.departmentId ? parseInt(query.departmentId, 10) : undefined,
  sectionId: query.sectionId ? parseInt(query.sectionId, 10) : undefined,
  semester: query.semester ? parseInt(query.semester, 10) : undefined,
  academicYear: query.academicYear || undefined,
});

const preview = asyncHandler(async (req, res) => {
  const result = await exportService.previewStudents(buildFilters(req.query));
  success(res, result);
});

const exportData = asyncHandler(async (req, res) => {
  const filters = buildFilters(req.body);
  const format = (req.body.format || 'excel').toLowerCase();

  if (format === 'pdf') {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="students.pdf"');
    await exportService.buildPdfStream(filters, res);
    return;
  }

  const buffer = await exportService.buildExcelBuffer(filters);
  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  );
  res.setHeader('Content-Disposition', 'attachment; filename="students.xlsx"');
  res.send(buffer);
});

module.exports = { preview, exportData };
