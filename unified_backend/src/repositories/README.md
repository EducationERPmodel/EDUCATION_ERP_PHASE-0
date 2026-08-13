# Unified Repositories

Data access layer unified from Admin-erp (PostgreSQL via pg) and education_erp (Prisma ORM).

## 📁 Structure

```
unified_backend/src/repositories/
├── index.js                        # Central export
│
├── ── Core (pg) ────────────────────
├── userRepository.js               # Admin users
├── studentRepository.js            # ⚡ MERGED (pg + Prisma methods)
├── dropdownRepository.js           # Dropdown data
├── transferRepository.js           # Student transfers
│
├── ── Faculty & Auth (Prisma) ─────
├── faculty.repository.js           # Faculty CRUD
├── role.repository.js              # Role management
├── audit.repository.js             # Audit logs
├── slFacultyRepository.js          # Student-list faculty auth
│
├── ── Academic Structure (Prisma) ─
├── academicSettingsRepository.js   # Current semester settings
├── semesterRepository.js           # Semester data
├── sectionRepository.js            # Section data
├── timetableRepository.js          # Timetable
│
└── ── Extracurricular (Prisma) ────
    ├── culturalActivity.repository.js
    ├── sportsActivity.repository.js
    ├── technicalEvent.repository.js
    ├── hackathon.repository.js
    ├── industryProject.repository.js
    └── otherCurricular.repository.js

Total: 18 repositories + 1 prisma client
```

## 🔑 Key Points

### Dual Database Access Patterns

**Admin-erp repositories** (pg):
- Use raw SQL via `query()` from `../config/db`
- Direct PostgreSQL queries
- Used by: user, dropdown, transfer

**education_erp repositories** (Prisma):
- Use Prisma Client ORM
- Type-safe queries
- Used by: faculty, activities, academic structure

**Merged: studentRepository** - Has both patterns!

## 🎯 Usage Examples

### Admin-erp Pattern (pg)
```javascript
const { query } = require('../config/db');

// userRepository.js
async function findByUsername(username) {
  const result = await query(
    'SELECT * FROM users WHERE username = $1',
    [username]
  );
  return result.rows[0] || null;
}
```

### education_erp Pattern (Prisma)
```javascript
const prisma = require('../prisma/client');

// faculty.repository.js
async function findByUsername(username) {
  return prisma.facultyList.findUnique({
    where: { username }
  });
}
```

### Merged Pattern
```javascript
// studentRepository.js has BOTH:

// Admin-erp method (pg)
async function findAll(filters) {
  const result = await query(`SELECT ... FROM students ...`);
  return { rows: result.rows, total: ... };
}

// education_erp method (pg with joins for HOD dashboard)
async function getStudentsBySectionId(sectionId) {
  const result = await query(`
    SELECT s.*, att.percentage, perf.percentage
    FROM students s
    LEFT JOIN attendance_summary att ...
  `);
  return result.rows.map(formatForPrismaShape);
}
```

## 📊 Statistics

| Metric | Value |
|--------|-------|
| **Total Repositories** | 18 |
| **Systems Merged** | 2 (Admin-erp + education_erp) |
| **Merged Repos** | 1 (studentRepository) |
| **Prisma-based** | 14 |
| **pg-based** | 4 |

## ✅ What's Done

1. ✅ **All repos copied** - 18 repositories from 2 systems
2. ✅ **Student repo merged** - Both pg and Prisma methods
3. ✅ **User repo enhanced** - Added `findById` method
4. ✅ **Prisma client copied** - `../prisma/client.js`
5. ✅ **No duplicates** - Clean structure
6. ✅ **All services satisfied** - Every needed repo exists

## 🔧 Dependencies

Repositories depend on:
- **`../config/db`** - PostgreSQL connection (pg-based repos)
- **`../prisma/client`** - Prisma client (Prisma-based repos)

## ⚠️ Prisma Setup Required

For Prisma repos to work, you'll need:

```bash
# Install Prisma
npm install @prisma/client

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push
```

The Prisma schema should be at: `unified_backend/prisma/schema.prisma`

---

**Status**: ✅ **COMPLETE**  
**Next**: Routes Layer  
**Date**: August 6, 2026
