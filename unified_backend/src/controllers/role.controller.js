const facultyService = require('../services/faculty.service');
const { successResponse, errorResponse } = require('../utils/response');

const getAllRoles = async (req, res, next) => {
  try {
    // Return available coordinator roles
    const roles = [
      { id: '1', name: 'Timetable Coordinator', slug: 'TIMETABLE_COORDINATOR', isActive: true },
      { id: '2', name: 'Exam Coordinator', slug: 'EXAM_COORDINATOR', isActive: true },
      { id: '3', name: 'Cultural Coordinator', slug: 'CULTURAL_COORDINATOR', isActive: true },
      { id: '4', name: 'Placement Coordinator', slug: 'PLACEMENT_COORDINATOR', isActive: true },
    ];
    return successResponse(res, roles);
  } catch (err) {
    next(err);
  }
};

const getFacultyRoles = async (req, res, next) => {
  try {
    const roles = await facultyService.getFacultyRoles?.(req.params.id, req.user.departmentCode);
    return successResponse(res, roles || []);
  } catch (err) {
    if (err.statusCode) return errorResponse(res, err.message, err.statusCode);
    next(err);
  }
};

const syncRoles = async (req, res, next) => {
  try {
    const { add, remove } = req.body;
    const result = await facultyService.syncRoles(
      req.params.id,
      { add, remove },
      req.user.id,
      req.user.departmentCode
    );
    return successResponse(res, result, 'Roles synced successfully');
  } catch (err) {
    if (err.statusCode) return errorResponse(res, err.message, err.statusCode);
    next(err);
  }
};

module.exports = { getAllRoles, getFacultyRoles, syncRoles };
