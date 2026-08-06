-- ============================================================
-- Student ERP — PostgreSQL Schema
-- Database: student_erp
-- Faculty: Mr. Lokesh M | SVCE Bengaluru | Semester 4 Bhaskara
-- ============================================================

-- ── Students ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS students (
  id          SERIAL       PRIMARY KEY,
  usn         VARCHAR(50)  NOT NULL UNIQUE,
  name        VARCHAR(255) NOT NULL,
  email       VARCHAR(255),
  phone       VARCHAR(20),
  semester    INTEGER,
  section     VARCHAR(10),
  status      VARCHAR(20)  DEFAULT 'Active',
  counsellor  VARCHAR(255),
  created_at  TIMESTAMP    DEFAULT NOW()
);

-- ── Attendance ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS attendance (
  id               SERIAL       PRIMARY KEY,
  student_id       INTEGER      NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  subject          VARCHAR(255) NOT NULL,
  attendance_date  DATE         NOT NULL,
  status           VARCHAR(10)  DEFAULT 'Present' CHECK (status IN ('Present', 'Absent')),
  created_at       TIMESTAMP    DEFAULT NOW(),
  CONSTRAINT attendance_unique_session UNIQUE (student_id, subject, attendance_date)
);

-- ── Assignments ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS assignments (
  id          SERIAL       PRIMARY KEY,
  title       VARCHAR(255) NOT NULL,
  subject     VARCHAR(255) NOT NULL,
  semester    VARCHAR(10),
  due_date    DATE,
  marks       INTEGER      DEFAULT 0,
  status      VARCHAR(20)  DEFAULT 'Open' CHECK (status IN ('Open', 'Closed')),
  created_at  TIMESTAMP    DEFAULT NOW()
);

-- ── IA Marks ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ia_marks (
  id          SERIAL       PRIMARY KEY,
  usn         VARCHAR(50)  NOT NULL,
  name        VARCHAR(255) NOT NULL,
  subject     VARCHAR(255) DEFAULT 'General',
  ia1         INTEGER      DEFAULT 0 CHECK (ia1 BETWEEN 0 AND 20),
  ia2         INTEGER      DEFAULT 0 CHECK (ia2 BETWEEN 0 AND 20),
  ia3         INTEGER      DEFAULT 0 CHECK (ia3 BETWEEN 0 AND 20),
  created_at  TIMESTAMP    DEFAULT NOW()
);

-- ── Achievements ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS achievements (
  id            SERIAL       PRIMARY KEY,
  student_id    INTEGER      NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  usn           VARCHAR(50),
  category      VARCHAR(50)  NOT NULL DEFAULT 'Certification'
                CHECK (category IN ('Certification','Hackathon','Event','Competition','Publication','Award','Other')),
  title         VARCHAR(255) NOT NULL,
  issuer        VARCHAR(255),
  date_achieved DATE,
  description   TEXT,
  created_at    TIMESTAMP    DEFAULT NOW()
);

-- ── Indexes ───────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_attendance_student    ON attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date       ON attendance(attendance_date);
CREATE INDEX IF NOT EXISTS idx_attendance_subject    ON attendance(subject);
CREATE INDEX IF NOT EXISTS idx_ia_marks_usn          ON ia_marks(usn);
CREATE INDEX IF NOT EXISTS idx_achievements_student  ON achievements(student_id);
CREATE INDEX IF NOT EXISTS idx_students_usn          ON students(usn);
