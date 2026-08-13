# Unified Controllers

This folder contains all controllers from the three ERP systems unified into a single, cohesive structure.

## 📁 Structure Overview

```
unified_backend/src/controllers/
├── index.js                              # Central export point
├── README.md                             # This file
├── CONTROLLER_STRUCTURE.md               # Detailed structure documentation
├── MIGRATION_GUIDE.md                    # Migration guide from old systems
│
├── ✅ UNIFIED CONTROLLERS (Recommended)
├── authController.unified.js             # Unified authentication
├── dashboardController.unified.js        # Unified dashboard
├── studentController.unified.js          # Unified student management
│
├── 📚 ACADEMIC MANAGEMENT
├── assignmentController.js               # Assignment CRUD
├── attendanceController.js               # Attendance tracking
├── iaMarksController.js                  # Internal assessment marks
│
├── 🏆 STUDENT ACTIVITIES
├── achievementsController.js             # Student achievements
├── aiCheckerController.js                # AI plagiarism checker
│
├── 🎭 EXTRACURRICULAR ACTIVITIES
├── culturalActivity.controller.js        # Cultural activities
├── sportsActivity.controller.js          # Sports activities
├── technicalEvent.controller.js          # Technical events
├── hackathon.controller.js               # Hackathon participation
├── industryProject.controller.js         # Industry projects
├── otherCurricular.controller.js         # Other curricular activities
│
├── 📋 ADMINISTRATIVE
├── dropdownController.js                 # Dropdown data
├── exportController.js                   # Data export
├── transferController.js                 # Student transfers
│
├── 👥 FACULTY & USER MANAGEMENT
├── faculty.controller.js                 # Faculty management
├── role.controller.js                    # Role management
├── slAuth.controller.js                  # Student login
│
└── 📦 ORIGINAL FILES (Preserved for compatibility)
    ├── authController.js                 # Admin-erp auth
    ├── auth.controller.js                # education_erp auth
    ├── dashboardController.js            # faculty_student dashboard
    ├── dashboard.controller.js           # education_erp dashboard
    ├── studentController.js              # faculty_student students
    └── studentList.controller.js         # education_erp student lists
```

## 🚀 Quick Start

### Import All Controllers

```javascript
const controllers = require('./controllers');

// Use unified controllers (recommended)
app.use('/api/auth', controllers.auth);
app.use('/api/dashboard', controllers.dashboard);
app.use('/api/students', controllers.student);

// Use domain-specific controllers
app.use('/api/assignments', controllers.assignment);
app.use('/api/attendance', controllers.attendance);
app.use('/api/achievements', controllers.achievements);
```

### Import Specific Controller

```javascript
const authController = require('./controllers/authController.unified');
const studentController = require('./controllers/studentController.unified');

router.post('/login', authController.login);
router.get('/students', studentController.listStudents);
```

## 📊 Controller Statistics

| Category | Count | Source Systems |
|----------|-------|----------------|
| Unified | 3 | Admin-erp, faculty_student, education_erp |
| Academic | 3 | faculty_student |
| Student Activities | 2 | faculty_student |
| Extracurricular | 6 | education_erp |
| Administrative | 3 | Admin-erp |
| Faculty & User | 3 | education_erp |
| **Total** | **20** | **3 systems** |

## 🔄 Unified Controllers

### 1. **authController.unified.js**
- **Purpose**: Authentication for both admin and faculty users
- **Merged From**: Admin-erp/authController.js, education_erp/auth.controller.js
- **Key Functions**:
  - `login` - Universal login (auto-detects user type)
  - `adminLogin` - Explicit admin login
  - `facultyLogin` - Explicit faculty login
  - `logout` - Logout user
  - `getMe` - Get current user profile

### 2. **dashboardController.unified.js**
- **Purpose**: Comprehensive dashboard views for faculty and admin
- **Merged From**: faculty_student/dashboardController.js, education_erp/dashboard.controller.js
- **Key Functions**:
  - `getDashboardStats` - Overall stats (students, attendance, assignments)
  - `getWeeklyAttendance` - 7-day attendance chart
  - `getHODDashboard` - HOD comprehensive dashboard

### 3. **studentController.unified.js**
- **Purpose**: Complete student management system
- **Merged From**: Admin-erp/studentController.js, faculty_student/studentController.js, education_erp/studentList.controller.js
- **Key Functions**:
  - `listStudents` - Paginated list with filters (Admin-erp pattern)
  - `getStudents` - Simple list (faculty_student pattern)
  - `getById` - Basic student info
  - `getStudentProfile` - Comprehensive profile with attendance, IA marks, assignments, achievements
  - `createStudent` / `addStudent` - Create new student (service layer / direct DB)
  - `updateStudent` / `updateStudentDirect` - Update student (service layer / direct DB)
  - `deleteStudent` / `deleteStudentDirect` - Delete student (service layer / direct DB)
  - `getSemesters` - Get available semesters
  - `getSections` - Get sections by semester
  - `getSectionDashboard` - Section-wise student dashboard

## 🎯 Usage Examples

### Authentication

```javascript
// Universal login
POST /api/auth/login
Body: { username, password }  // Admin
Body: { departmentCode, username, password }  // Faculty

// Explicit login
POST /api/auth/admin/login
Body: { username, password }

POST /api/auth/faculty/login
Body: { departmentCode, username, password }

// Get current user
GET /api/auth/me
Headers: { Authorization: Bearer <token> }
```

### Dashboard

```javascript
// Get dashboard stats
GET /api/dashboard/stats

// Get weekly attendance chart
GET /api/dashboard/weekly-attendance

// Get HOD dashboard
GET /api/dashboard/hod
Headers: { Authorization: Bearer <token> }
```

### Students

```javascript
// Paginated list with filters
GET /api/students/list?page=1&pageSize=20&semester=5&search=John

// Simple list
GET /api/students

// Student profile
GET /api/students/123/profile

// Create student
POST /api/students
Body: { usn, name, email, phone, semester, section, ... }

// Update student
PUT /api/students/123
Body: { usn, name, email, ... }

// Delete student
DELETE /api/students/123

// Section dashboard
GET /api/students/semesters/5/sections/A?page=1&limit=50
```

## 📖 Documentation

- **[CONTROLLER_STRUCTURE.md](./CONTROLLER_STRUCTURE.md)** - Detailed structure and organization
- **[MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)** - Complete migration guide from old systems

## ✅ Best Practices

1. **Use unified controllers** for new development
2. **Use service layer methods** (e.g., `createStudent`) over direct DB methods (e.g., `addStudent`)
3. **Import from index.js** for cleaner imports
4. **Preserve original files** during transition period
5. **Test thoroughly** when migrating routes

## 🔧 Maintenance

### Adding a New Controller

1. Create the controller file in the appropriate category folder
2. Add exports to `index.js`
3. Update `CONTROLLER_STRUCTURE.md`
4. Add usage examples to `MIGRATION_GUIDE.md`

### Updating a Unified Controller

1. Update the unified controller file (e.g., `authController.unified.js`)
2. Test backward compatibility with both patterns
3. Update documentation if API changes
4. Update `MIGRATION_GUIDE.md` with any breaking changes

## 🐛 Troubleshooting

### Common Issues

1. **Module not found errors**
   - Ensure all service, repository, and utility files are also unified
   - Check import paths are correct

2. **Response format mismatches**
   - Unified controllers support multiple response formats
   - Check which format your frontend expects

3. **Authentication failures**
   - Ensure middleware is properly configured
   - Check JWT secret and cookie settings

See [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) for detailed troubleshooting.

## 📞 Support

For questions or issues:
1. Check the documentation files in this folder
2. Review the original controller implementations
3. Consult the service and repository layers
4. Test with Postman or similar API client

## 🎉 Migration Status

| Component | Status | Notes |
|-----------|--------|-------|
| Authentication | ✅ Complete | Unified from 2 systems |
| Dashboard | ✅ Complete | Unified from 2 systems |
| Student Management | ✅ Complete | Unified from 3 systems |
| Academic Management | ✅ Ready | No merge needed |
| Activities | ✅ Ready | No merge needed |
| Administrative | ✅ Ready | No merge needed |
| Faculty Management | ✅ Ready | No merge needed |

---

**Last Updated**: August 6, 2026  
**Version**: 1.0.0  
**Maintained By**: ERP Integration Team
