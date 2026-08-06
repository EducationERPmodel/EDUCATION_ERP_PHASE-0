# Setup Guide

## Prerequisites
- Node.js v20+
- PostgreSQL 14+
- Expo Go app on Android/iOS

---

## 1. Database Setup

```sql
-- In pgAdmin or psql:
CREATE DATABASE student_erp;
ALTER USER postgres PASSWORD 'student@erp';
```

Then run the schema:
```bash
psql -U postgres -d student_erp -f database/schema.sql
```

Or use the migration script:
```bash
cd backend
npm install
node scripts/migrate.js   # creates all tables
node scripts/seed.js      # inserts 10 sample students
```

---

## 2. Backend

```bash
cd backend
npm install
node server.js
# Runs at http://localhost:5001
```

---

## 3. Mobile App (Expo Go)

```bash
# Step 1: Find your PC's LAN IP
ipconfig   # look for Wi-Fi IPv4 Address

# Step 2: Update IP in src/services/api.js
# Change: baseURL: 'http://YOUR_PC_IP:5001'

# Step 3: Install and start
npm install
node node_modules/@expo/cli/build/bin/cli start --clear --host lan
```

Scan QR code with Expo Go. Phone must be on same Wi-Fi as PC.

**Login:** `lokesh@erp.com` / `12345`

---

## Project Structure

```
student-erp-mobile/
├── app/                    ← Expo Router screens (MUST stay at root)
│   ├── (app)/              ← Authenticated screens
│   ├── index.jsx           ← Home/Landing
│   ├── login.jsx           ← Login screen
│   └── _layout.jsx         ← Root layout
├── src/                    ← React Native source
│   ├── components/         ← UI components
│   ├── services/api.js     ← Axios instance (update IP here)
│   ├── data/               ← Offline fallback data
│   ├── theme/colors.js     ← Design system colours
│   └── utils/              ← Utilities
├── assets/                 ← Icons and splash images
├── backend/                ← Node.js + Express API
│   ├── controllers/        ← Business logic
│   ├── routes/             ← API routes
│   ├── config/db.js        ← PostgreSQL connection
│   └── server.js           ← Entry point
├── database/
│   ├── schema.sql          ← Full DB schema
│   ├── migrations/         ← Migration scripts
│   └── seed/               ← Sample data
├── docs/                   ← Documentation
├── app.json                ← Expo config (SDK 54)
└── package.json
```
