# Unified Routes

API routing layer unified from three ERP systems.

## 📁 Structure

```
unified_backend/src/routes/
├── index.js                        # Central router
│
├── ── Core ─────────────────────────
├── auth.routes.js                  # ⚡ UNIFIED (admin + faculty login)
├── student.routes.js               # ⚡ UNIFIED (all 3 systems)
├── dropdown.routes.js              # Dropdown data
├── transfer.routes.js              # Student transfers
├── export.routes.js                # Excel/PDF export
│
├── ── Dashboard ────────────────────
├── dashboard.routes.js             # ⚡ UNIFIED (stats + HOD dashboard)
│
├── ── Academic ─────────────────────
├── achievementsRoutes.js           # Student achievements
├── assignmentRoutes.js             # Assignments
├── attendanceRoutes.js             # Attendance
├── iaMarksRoutes.js                # IA marks
├── aiCheckerRoutes.js              # AI plagiarism checker
│
├── ── Faculty & Management ─────────
├── faculty.routes.js               # Faculty CRUD
├── role.routes.js                  # Role management
├── studentList.routes.js           # HOD section dashboard
├── slAuth.routes.js                # HOD alt auth
│
└── ── Extracurricular ──────────────
    ├── culturalActivity.routes.js
    ├── sportsActivity.routes.js
    ├── technicalEvent.routes.js
    ├── hackathon.routes.js
    ├── industryProject.routes.js
    └── otherCurricular.routes.js

Total: 22 route files
```

## 🎯 API Endpoints

### Core

```
POST   /api/auth/login              Universal login
POST   /api/auth/admin/login        Admin login
POST   /api/auth/faculty/login      Faculty login
POST   /api/auth/logout             Logout
GET    /api/auth/me                 Get current user

GET    /api/students                Simple list
GET    /api/students/list           Paginated list with filters
GET    /api/students/:id            Get by ID
GET    /api/students/:id/profile    Comprehensive profile
POST   /api/students                Create student
PUT    /api/students/:id            Update student
DELETE /api/students/:id            Delete student

GET    /api/students/semesters                         Get semesters
GET    /api/students/semesters/:sem/sections           Get sections
GET    /api/students/semesters/:sem/sections/:section  Section dashboard

GET    /api/dropdown/:type          Get dropdown data
POST   /api/transfer                Transfer student
GET    /api/transfer/:id/history    Transfer history
GET    /api/export/preview          Preview export
POST   /api/export                  Export data (Excel/PDF)
```

### Dashboard

```
GET    /api/dashboard/stats              General stats
GET    /api/dashboard/weekly-attendance  Weekly attendance chart
GET    /api/dashboard/hod                HOD dashboard (auth + HOD role)
```

### Academic

```
GET    /api/achievements            Get achievements
POST   /api/achievements            Add achievement
PUT    /api/achievements/:id        Update achievement
DELETE /api/achievements/:id        Delete achievement

GET    /api/assignments             Get assignments
POST   /api/assignments             Add assignment
PUT    /api/assignments/:id         Update assignment
DELETE /api/assignments/:id         Delete assignment

GET    /api/attendance              Get attendance
POST   /api/attendance              Save attendance (single)
POST   /api/attendance/bulk         Save attendance (bulk)

GET    /api/ia-marks                Get IA marks
POST   /api/ia-marks                Add IA marks
PUT    /api/ia-marks/:id            Update IA marks
DELETE /api/ia-marks/:id            Delete IA marks

POST   /api/ai-checker/extract      Extract text for AI check
```

### Faculty & Management

```
GET    /api/faculty                 List faculty
GET    /api/faculty/:id             Get faculty by ID
POST   /api/faculty                 Create faculty (HOD only)
PUT    /api/faculty/:id             Update faculty (HOD only)
DELETE /api/faculty/:id             Delete faculty (HOD only)

GET    /api/roles                   Get all roles
GET    /api/roles/faculty/:id/roles Get faculty roles
PATCH  /api/roles/faculty/:id/roles/sync Sync roles (HOD only)

GET    /api/hod/student-list/semesters           Get semesters
GET    /api/hod/student-list/:sem/sections       Get sections
GET    /api/hod/student-list/:sem/:section       Section dashboard

POST   /api/hod/auth/login          HOD alt login
```

### Extracurricular Activities

```
GET    /api/activities/cultural             List cultural activities
POST   /api/activities/cultural             Create (HOD only)
GET    /api/activities/cultural/:id         Get by ID
PUT    /api/activities/cultural/:id         Update (HOD only)
DELETE /api/activities/cultural/:id         Delete (HOD only)

# Same pattern for:
# /api/activities/sports
# /api/activities/technical
# /api/activities/hackathons
# /api/activities/industry-projects
# /api/activities/other-curricular
```

## 📊 Statistics

| Metric | Value |
|--------|-------|
| **Total Route Files** | 22 |
| **Systems Unified** | 3 |
| **Merged Routes** | 3 (auth, student, dashboard) |
| **Total Endpoints** | ~80+ |

## ✅ What's Done

1. ✅ **All routes copied** - 22 route files from 3 systems
2. ✅ **3 routes unified** - auth, student, dashboard
3. ✅ **Imports fixed** - All point to unified middleware/controllers
4. ✅ **Central router** - index.js mounts all routes
5. ✅ **No duplicates** - Old files removed

## 🔧 Usage

### In app.js

```javascript
const routes = require('./routes');

app.use('/api', routes);
```

### Accessing Endpoints

```javascript
// Auth
POST /api/auth/login { username, password }
POST /api/auth/faculty/login { departmentCode, username, password }

// Students
GET  /api/students/list?page=1&pageSize=20&semester=5
GET  /api/students/123/profile
POST /api/students { name, usn, semester, ... }

// Dashboard
GET /api/dashboard/stats
GET /api/dashboard/hod
```

---

**Status**: ✅ **COMPLETE**  
**Next**: app.js + server.js  
**Date**: August 6, 2026
