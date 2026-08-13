const roleRepo = require('../repositories/role.repository');
const facultyRepo = require('../repositories/faculty.repository');
const auditRepo = require('../repositories/audit.repository');

// Roles that cannot be assigned via coordinator assignment endpoint
const PROTECTED_ROLES = ['HOD', 'FACULTY'];

// Coordinator role slugs (assignable by HOD)
const COORDINATOR_SLUGS = [
  'TIMETABLE_COORDINATOR',
  'EXAM_COORDINATOR',
  'CULTURAL_COORDINATOR',
  'PLACEMENT_COORDINATOR',
];

/**
 * Get all available roles
 */
const getAllRoles = async () => {
  return roleRepo.findAll();
};

/**
 * Get roles for a specific faculty (dept-scoped)
 */
const getFacultyRoles = async (facultyId, departmentId) => {
  const faculty = await facultyRepo.findById(facultyId);
  if (!faculty) throw { statusCode: 404, message: 'Faculty not found.' };
  if (faculty.departmentId !== departmentId) throw { statusCode: 403, message: 'Access denied.' };

  return roleRepo.getFacultyRoles(facultyId);
};

/**
 * Assign a coordinator role to faculty (HOD only)
 * Extensible: any role not in PROTECTED_ROLES can be assigned
 */
const assignRole = async (facultyId, roleId, assignedBy, hodDepartmentId) => {
  // Verify faculty exists and belongs to HOD's department
  const faculty = await facultyRepo.findById(facultyId);
  if (!faculty) throw { statusCode: 404, message: 'Faculty not found.' };
  if (faculty.departmentId !== hodDepartmentId) {
    throw { statusCode: 403, message: 'Cannot assign roles to faculty outside your department.' };
  }

  // Verify role exists
  const role = await roleRepo.findById(roleId);
  if (!role) throw { statusCode: 404, message: 'Role not found.' };

  // Prevent assigning protected roles via this endpoint
  if (PROTECTED_ROLES.includes(role.name)) {
    throw { statusCode: 400, message: `Cannot assign '${role.name}' role via this endpoint.` };
  }

  const { isNew, record } = await roleRepo.assignToFaculty(facultyId, roleId, hodDepartmentId);
  if (!isNew) {
    throw { statusCode: 409, message: `Faculty already has the '${role.name}' role.` };
  }

  await auditRepo.log({
    performedBy: assignedBy,
    action:      'ASSIGN_ROLE',
    facultyId,
    details:     { roleName: role.name },
  });

  return record;
};

/**
 * Remove a coordinator role from faculty (HOD only)
 */
const removeRole = async (facultyId, roleId, removedBy, hodDepartmentId) => {
  const faculty = await facultyRepo.findById(facultyId);
  if (!faculty) throw { statusCode: 404, message: 'Faculty not found.' };
  if (faculty.departmentId !== hodDepartmentId) {
    throw { statusCode: 403, message: 'Cannot modify faculty outside your department.' };
  }

  const role = await roleRepo.findById(roleId);
  if (!role) throw { statusCode: 404, message: 'Role not found.' };

  if (PROTECTED_ROLES.includes(role.name)) {
    throw { statusCode: 400, message: `Cannot remove '${role.name}' role via this endpoint.` };
  }

  const removed = await roleRepo.removeFromFaculty(facultyId, roleId, hodDepartmentId);
  if (!removed) {
    throw { statusCode: 404, message: 'Faculty does not have this role.' };
  }

  await auditRepo.log({
    performedBy: removedBy,
    action:      'REMOVE_ROLE',
    facultyId,
    details:     { roleName: role.name },
  });

  return { message: `Role '${role.name}' removed successfully.` };
};

/**
 * Bulk sync coordinator roles for a faculty (used by context menu toggle)
 * Assigns roles in `add` array, removes roles in `remove` array - atomic
 */
const syncRoles = async (facultyId, { add = [], remove = [] }, performedBy, hodDepartmentId) => {
  const faculty = await facultyRepo.findById(facultyId);
  if (!faculty) throw { statusCode: 404, message: 'Faculty not found.' };
  if (faculty.departmentId !== hodDepartmentId) {
    throw { statusCode: 403, message: 'Cannot modify faculty outside your department.' };
  }

  const results = { added: [], removed: [], errors: [] };

  for (const roleId of add) {
    try {
      const role = await roleRepo.findById(roleId);
      if (!role || PROTECTED_ROLES.includes(role.name)) continue;
      const { isNew } = await roleRepo.assignToFaculty(facultyId, roleId, hodDepartmentId);
      if (isNew) {
        results.added.push(role.name);
        await auditRepo.log({
          performedBy, action: 'ASSIGN_ROLE', facultyId,
          details: { roleName: role.name },
        });
      }
    } catch (e) {
      results.errors.push({ roleId, error: e.message });
    }
  }

  for (const roleId of remove) {
    try {
      const role = await roleRepo.findById(roleId);
      if (!role || PROTECTED_ROLES.includes(role.name)) continue;
      await roleRepo.removeFromFaculty(facultyId, roleId, hodDepartmentId);
      results.removed.push(role.name);
      await auditRepo.log({
        performedBy, action: 'REMOVE_ROLE', facultyId,
        details: { roleName: role.name },
      });
    } catch (e) {
      results.errors.push({ roleId, error: e.message });
    }
  }

  // Return updated faculty
  const updated = await facultyRepo.findById(facultyId);
  return { faculty: updated, results };
};

module.exports = { getAllRoles, getFacultyRoles, assignRole, removeRole, syncRoles };
