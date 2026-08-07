# Student ERP — Faculty Portal

A complete **React Native + Expo** faculty management system for SVCE Bengaluru.

**Faculty:** Mr. Lokesh M | **Class:** Semester 4 Bhaskara | **Department:** CSE

---

## Project Structure

```
student-erp-mobile/
├── frontend/          # React Native + Expo app (Expo Router v6)
│   ├── app/           # File-based routing (screens)
│   ├── src/           # Components, services, utils, theme, data
│   ├── assets/        # Icons, splash screen
│   ├── app.json       # Expo configuration
│   └── package.json
├── backend/           # Node.js + Express REST API (port 5001)
│   ├── controllers/   # 7 route handlers
│   ├── routes/        # 7 Express routers
│   ├── scripts/       # migrate.js · seed.js · check_schema.js
│   ├── config/db.js   # PostgreSQL connection
│   └── server.js
├── database/
│   └── schema.sql     # Full DB schema
├── docs/              # Setup guide, API reference, DB design
└── student-erp-mobile.code-workspace
```

---

## Features

| Module | Description |
|--------|-------------|
| 📊 Dashboard | Live stats, weekly attendance graph |
| 👨‍🎓 Students | CRUD with counsellor assignment and full profiles |
| ✅ Attendance | Per-subject, per-date, bulk save with UPSERT |
| 📝 Assignments | Create and manage with due dates |
| 📈 IA Marks | IA1/IA2/IA3 with grade calculation |
| 🏆 Achievements | Certifications, hackathons, awards per student |
| 🤖 AI Checker | Plagiarism detection for .txt and .pdf |
| 📅 Timetable | SVCE Semester 4 Bhaskara schedule |

---

## Quick Start

### 1. Database
```bash
psql -U postgres -d student_erp -f database/schema.sql
node backend/scripts/seed.js
```

### 2. Backend
```bash
cd backend && npm install && node server.js
# http://localhost:5001
```

### 3. Frontend
```bash
# Update LAN IP in frontend/src/services/api.js first
cd frontend && npm install
node node_modules/@expo/cli/build/bin/cli start --clear --host lan
```

**Login:** `lokesh@erp.com` / `12345`

---

## Tech Stack

- **Frontend:** React Native · Expo SDK 54 · Expo Router v6
- **Backend:** Node.js · Express · PostgreSQL
- **AI Checker:** pdf-parse + string-similarity

## Documentation

| Doc | Description |
|-----|-------------|
| [Setup Guide](docs/SetupGuide.md) | Full installation instructions |
| [API Reference](docs/API.md) | All backend endpoints |
| [Database Design](docs/DatabaseDesign.md) | Schema and ERD |
| [Project Structure](docs/ProjectStructure.md) | Architecture decisions |
