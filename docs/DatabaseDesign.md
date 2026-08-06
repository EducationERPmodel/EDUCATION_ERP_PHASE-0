# Database Design

## Tables

| Table | Purpose |
|-------|---------|
| `students` | Student records with USN, contact, semester, counsellor |
| `attendance` | Per-student, per-subject, per-date attendance with UPSERT |
| `assignments` | Assignments with due dates and open/closed status |
| `ia_marks` | IA1/IA2/IA3 marks per student (0–20 each) |
| `achievements` | Student certifications, hackathons, awards, events |

## Key Constraints
- `attendance` has a UNIQUE constraint on `(student_id, subject, attendance_date)` — enables UPSERT
- `ia_marks` validates marks are between 0 and 20
- `achievements.category` is an ENUM-style CHECK constraint
- `achievements.student_id` and `attendance.student_id` have CASCADE DELETE

## ERD Summary
```
students (1) ──< attendance (many)
students (1) ──< achievements (many)
ia_marks references usn (denormalized for simplicity)
assignments is standalone (filtered by semester)
```
