# Unified Services

Business logic layer unified from three ERP systems.

## 📁 Structure

```
unified_backend/src/services/
├── index.js                      # Central export
│
├── ── Core Services ─────────────
├── authService.js                # ⚡ UNIFIED (admin + faculty HOD login)
├── studentService.js             # Student CRUD with pagination
├── studentList.service.js        # Semester/section dashboard
├── dropdownService.js            # Dropdown data
├── transferService.js            # Student transfers
├── exportService.js              # Excel/PDF export
├── dashboard.service.js          # HOD dashboard
│
├── ── Faculty & Roles ───────────
├── faculty.service.js            # Faculty management
├── role.service.js               # Role management
├── slAuth.service.js             # Student-list auth
│
└── ── Extracurricular ───────────
    ├── culturalActivity.service.js
    ├── sportsActivity.service.js
    ├── technicalEvent.service.js
    ├── hackathon.service.js
    ├── industryProject.service.js
    └── otherCurricular.service.js

Total: 17 services
```

## 🎯 Key Services

### 1. **authService.js** ⚡
Unified authentication for both admin and faculty/HOD users.

```javascript
const { login, adminLogin, facultyLogin, getMe } = require('./services/authService');

// Universal login (auto-detects user type)
await login({ username, password });  // Admin
await login({ departmentCode, username, password });  // Faculty

// Explicit logins
await adminLogin({ username, password });
await facultyLogin({ departmentCode, username, password });

// Get current user
await getMe(userId);
```

### 2. **studentService.js**
Student CRUD with pagination and filtering.

```javascript
const { listStudents, getStudent, createStudent, updateStudent, deleteStudent } = require('./services/studentService');

// List with filters
const { students, meta } = await listStudents({
  page: 1,
  pageSize: 20,
  search: 'John',
  semester: 5,
  departmentId: 3
});

// CRUD operations
const student = await getStudent(123);
await createStudent({ usn, name, email, ... });
await updateStudent(123, { name: 'Updated Name' });
await deleteStudent(123);
```

### 3. **exportService.js**
Export student data to Excel or PDF.

```javascript
const { previewStudents, buildExcelBuffer, buildPdfStream } = require('./services/exportService');

// Preview before export
const { total, sample } = await previewStudents(filters);

// Export to Excel
const buffer = await buildExcelBuffer(filters);

// Export to PDF (stream)
await buildPdfStream(filters, res);
```

### 4. **transferService.js**
Student transfer with transaction support.

```javascript
const { transferStudent, getTransferHistory } = require('./services/transferService');

// Transfer student
const { transferId, student } = await transferStudent({
  studentId: 123,
  newProgramId: 2,
  newDepartmentId: 3,
  newSemester: 5,
  newSectionId: 4,
  remarks: 'Transfer approved'
});

// Get history
const history = await getTransferHistory(123);
```

### 5. **dashboard.service.js**
HOD dashboard with department statistics.

```javascript
const { getHODDashboard } = require('./services/dashboard.service');

const data = await getHODDashboard('CS');
// Returns: { department, stats, roleDistribution, recentActivity }
```

## 📊 Service Dependencies

Services depend on:
- **Repositories** - Data access layer (TODO: needs unification)
- **Utils** - Response formatters, JWT, logging
- **Config** - Database connection, environment variables

## ✅ What's Been Done

1. ✅ **All services copied** - 17 service files from 2 systems
2. ✅ **Auth services merged** - `authService.js` now handles both admin and faculty
3. ✅ **Prisma import removed** - `dashboard.service.js` now uses repository
4. ✅ **No duplicates** - Clean structure
5. ✅ **Central export** - `index.js` for easy imports

## ⚠️ What's Next

**Repositories layer** - Services currently import repositories that don't exist in unified folder yet:

Required repositories:
- `userRepository`
- `studentRepository`
- `dropdownRepository`
- `transferRepository`
- `facultyRepository` / `faculty.repository`
- `roleRepository` / `role.repository`
- `slFacultyRepository`
- `academicSettingsRepository`
- `semesterRepository`
- `sectionRepository`
- `timetableRepository`
- `auditRepository`
- Activity repositories (cultural, sports, technical, hackathon, etc.)

## 🔧 Import Patterns

### Individual Service
```javascript
const authService = require('./services/authService');
const studentService = require('./services/studentService');
```

### From Index
```javascript
const { 
  authService, 
  studentService,
  exportService 
} = require('./services');
```

## 📈 Statistics

| Metric | Value |
|--------|-------|
| **Total Services** | 17 |
| **Systems Unified** | 2 (Admin-erp, education_erp) |
| **Services Merged** | 1 (auth) |
| **Prisma Dependencies Removed** | 1 |
| **Lines of Code** | ~2,500 |

---

**Status**: ✅ **COMPLETE**  
**Next**: Repositories Layer  
**Date**: August 6, 2026
