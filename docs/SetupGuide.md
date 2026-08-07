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

Apply schema (fresh install):
```bash
psql -U postgres -d student_erp -f database/schema.sql
```

Or run migration + seed (from project root):
```bash
node backend/scripts/migrate.js   # creates/updates all tables
node backend/scripts/seed.js      # inserts 10 sample students + data
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

## 3. Frontend / Mobile App (Expo Go)

```bash
# Step 1: Find your PC's LAN IP
ipconfig   # look for Wi-Fi IPv4 Address

# Step 2: Update IP in frontend/src/services/api.js
# Change: baseURL: 'http://YOUR_PC_IP:5001'

# Step 3: Install and start
cd frontend
npm install
node node_modules/@expo/cli/build/bin/cli start --clear --host lan
```

Scan QR code with Expo Go. Phone and PC must be on the same Wi-Fi.

**Login:** `lokesh@erp.com` / `12345`

---

## Available npm scripts (run from `frontend/`)

| Script | Command | Description |
|--------|---------|-------------|
| `npm start` | Expo LAN mode | Start Expo dev server |
| `npm run start:tunnel` | Expo tunnel | Start with tunnel (different network) |
| `npm run backend` | node ../backend/server.js | Start backend |
| `npm run db:migrate` | node ../backend/scripts/migrate.js | Run migrations |
| `npm run db:seed` | node ../backend/scripts/seed.js | Seed sample data |
| `npm run db:check` | node ../backend/scripts/check_schema.js | Check schema |
| `npm run db:schema` | psql ... | Apply full schema.sql |

---

## Project Structure

```
student-erp-mobile/
├── frontend/       ← Expo React Native app (run npm commands here)
├── backend/        ← Node.js Express API (port 5001)
│   └── scripts/    ← migrate.js, seed.js, check_schema.js
├── database/
│   └── schema.sql  ← Full DB schema (single source of truth)
└── docs/
```

---

## Environment Variables

`backend/.env`:
```
DB_USER=postgres
DB_PASSWORD=student@erp
DB_HOST=localhost
DB_PORT=5432
DB_NAME=student_erp
PORT=5001
```

`frontend/src/services/api.js` — update `baseURL` to your LAN IP:
```js
const api = axios.create({
  baseURL: 'http://192.168.1.X:5001',
  timeout: 15000,
});
```
