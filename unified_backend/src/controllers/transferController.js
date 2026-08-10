const asyncHandler = require('../utils/asyncHandler');
const { success, ApiError } = require('../utils/apiResponse');
const transferService = require('../services/transferService');

const transfer = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, 'Supporting document is required');
  const {
    studentId, newProgramId, newDepartmentId, newSemester, newSectionId, remarks,
  } = req.body;

  const supportingDocumentUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

  const result = await transferService.transferStudent({
    studentId: parseInt(studentId, 10),
    newProgramId: parseInt(newProgramId, 10),
    newDepartmentId: parseInt(newDepartmentId, 10),
    newSemester: parseInt(newSemester, 10),
    newSectionId: parseInt(newSectionId, 10),
    remarks,
    supportingDocumentUrl,
  });

  success(res, result, null, 201);
});

const history = asyncHandler(async (req, res) => {
  const rows = await transferService.getTransferHistory(parseInt(req.params.id, 10));
  success(res, rows);
});

module.exports = { transfer, history };
