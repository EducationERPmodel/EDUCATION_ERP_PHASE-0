# API Reference — Student ERP Backend

Base URL: `http://YOUR_IP:5001`

---

## Students

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/students` | List all students |
| GET | `/students/:id/profile` | Full student profile (attendance + IA + assignments + achievements) |
| POST | `/students` | Create student |
| PUT | `/students/:id` | Update student |
| DELETE | `/students/:id` | Delete student |

### POST /students body
```json
{ "usn": "1VE23CS001", "name": "...", "email": "...", "phone": "...", "semester": 4, "section": "B", "counsellor": "Mr. Lokesh M" }
```

---

## Attendance

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/attendance?subject=X&date=YYYY-MM-DD` | Get attendance for subject+date |
| GET | `/attendance` | Full attendance log |
| POST | `/attendance` | Single UPSERT |
| POST | `/attendance/bulk` | Bulk UPSERT `{ records: [...] }` |

---

## Assignments

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/assignments` | List all |
| POST | `/assignments` | Create |
| PUT | `/assignments/:id` | Update |
| DELETE | `/assignments/:id` | Delete |

---

## IA Marks

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/iamarks` | List all |
| POST | `/iamarks` | Add record |
| PUT | `/iamarks/:id` | Update |
| DELETE | `/iamarks/:id` | Delete |

---

## Achievements

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/achievements?student_id=X` | List achievements for student |
| POST | `/achievements` | Add achievement |
| PUT | `/achievements/:id` | Update |
| DELETE | `/achievements/:id` | Delete |

---

## Dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard/stats` | Total students, attendance %, assignments, IA average |
| GET | `/dashboard/weekly-attendance` | 7-day attendance data for chart |

---

## AI Checker

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/aichecker/extract` | Upload file (multipart), returns extracted text |

Supports: `.txt`, `.pdf`
