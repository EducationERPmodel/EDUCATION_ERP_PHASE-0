# Project Structure

```
student-erp-mobile/
├── frontend/               ← Expo / React Native app
│   ├── app/                ← Expo Router screens (file-based routing)
│   │   ├── (app)/          ← Authenticated screens
│   │   │   ├── dashboard.jsx
│   │   │   ├── students/
│   │   │   │   ├── index.jsx
│   │   │   │   └── [id].jsx    ← Student profile
│   │   │   ├── attendance.jsx
│   │   │   ├── assignments.jsx
│   │   │   ├── iamarks.jsx
│   │   │   ├── profile.jsx
│   │   │   ├── aichecker.jsx
│   │   │   ├── timetable.jsx
│   │   │   └── _layout.jsx
│   │   ├── index.jsx           ← Landing / Home
│   │   ├── login.jsx           ← Login screen
│   │   └── _layout.jsx         ← Root layout
│   ├── src/
│   │   ├── components/         ← UI components by feature
│   │   │   ├── aichecker/
│   │   │   ├── assignments/
│   │   │   ├── common/         ← Shared (Navbar, Sidebar, PageHeader, TopNavbar)
│   │   │   ├── dashboard/
│   │   │   ├── home/
│   │   │   └── iamarks/
│   │   ├── services/api.js     ← Axios instance (update LAN IP here)
│   │   ├── data/               ← Offline fallback data
│   │   ├── theme/colors.js     ← Design system colours
│   │   └── utils/pdfUtils.js   ← File extraction utility
│   ├── assets/                 ← App icon, splash screen, images
│   ├── app.json                ← Expo configuration (SDK 54)
│   ├── babel.config.js
│   └── package.json
│
├── backend/                ← Node.js + Express REST API
│   ├── config/db.js        ← PostgreSQL pool connection
│   ├── controllers/        ← Business logic (7 modules)
│   │   ├── studentController.js
│   │   ├── attendanceController.js
│   │   ├── assignmentController.js
│   │   ├── iaMarksController.js
│   │   ├── dashboardController.js
│   │   ├── aiCheckerController.js
│   │   └── achievementsController.js
│   ├── routes/             ← Express route definitions (7 modules)
│   ├── scripts/            ← DB maintenance scripts (single source of truth)
│   │   ├── migrate.js      ← Run: node backend/scripts/migrate.js
│   │   ├── seed.js         ← Run: node backend/scripts/seed.js
│   │   └── check_schema.js ← Run: node backend/scripts/check_schema.js
│   ├── middleware/         ← (reserved for future auth middleware)
│   ├── models/             ← (reserved for future ORM models)
│   ├── utils/              ← (reserved for future utilities)
│   ├── .env                ← DB credentials and PORT (git-ignored)
│   ├── package.json
│   └── server.js           ← Entry point (PORT 5001)
│
├── database/
│   └── schema.sql          ← Full DB schema (CREATE TABLE statements)
│
├── docs/
│   ├── API.md
│   ├── DatabaseDesign.md
│   ├── ProjectStructure.md
│   └── SetupGuide.md
│
├── .gitignore
├── LICENSE
├── README.md
└── student-erp-mobile.code-workspace
```

## Key Architecture Decisions

### Scripts live in `backend/scripts/` — single source of truth
All database scripts (migrate, seed, check_schema) live in `backend/scripts/`.
They use `require('pg')` from `backend/node_modules` and load `.env` from `backend/.env`.
Run them from the project root: `node backend/scripts/migrate.js`
Or from `frontend/`: `npm run db:migrate` / `npm run db:seed` / `npm run db:check`

### `database/` contains only `schema.sql`
The schema file is the ground truth for table definitions.
It is used for fresh installs: `psql -U postgres -d student_erp -f database/schema.sql`

### Backend PORT
The backend runs on **port 5001** (set in `backend/.env` and defaulted in `server.js`).
The frontend API client at `frontend/src/services/api.js` must point to this port.

### `app/` lives inside `frontend/`
Expo Router v6 requires `app/` at the **project root relative to `package.json`**.
Since `frontend/package.json` is the Expo project root, `frontend/app/` is correct.
Run all Expo commands from inside `frontend/`.
