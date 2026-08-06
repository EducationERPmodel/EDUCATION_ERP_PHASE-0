# Student ERP — Faculty Portal

A complete **React Native + Expo** faculty management system for SVCE Bengaluru.

**Faculty:** Mr. Lokesh M | **Class:** Semester 4 Bhaskara | **Department:** CSE

---

## Features

| Module | Description |
|--------|-------------|
| 📊 Dashboard | Live stats, weekly attendance graph, class overview |
| 👨‍🎓 Students | CRUD with counsellor assignment, individual profiles |
| ✅ Attendance | Date-wise marking (any date), per-subject, bulk save |
| 📝 Assignments | Create and manage with due dates |
| 📈 IA Marks | IA1/IA2/IA3 per student with grade calculation |
| 🏆 Achievements | Certifications, hackathons, events per student |
| 🤖 AI Checker | Plagiarism detection for .txt and .pdf files |
| 📅 Timetable | SVCE Semester 4 Bhaskara schedule |

---

## Quick Start

### 1. Database
```bash
psql -U postgres -d student_erp -f database/schema.sql
```

### 2. Backend
```bash
cd backend && npm install && node server.js
```

### 3. Mobile App
```bash
# Update your LAN IP in src/services/api.js first
npm install
node node_modules/@expo/cli/build/bin/cli start --clear --host lan
```

**Login:** `lokesh@erp.com` / `12345`

---

## Tech Stack

- **Frontend:** React Native · Expo SDK 54 · Expo Router v6
- **Backend:** Node.js · Express · PostgreSQL
- **Charts:** react-native-svg (Fabric-compatible)
- **AI Checker:** pdf-parse + string-similarity

## Documentation

| Doc | Description |
|-----|-------------|
| [Setup Guide](docs/SetupGuide.md) | Full installation instructions |
| [API Reference](docs/API.md) | All backend endpoints |
| [Database Design](docs/DatabaseDesign.md) | Schema and ERD |
| [Project Structure](docs/ProjectStructure.md) | Architecture decisions |
