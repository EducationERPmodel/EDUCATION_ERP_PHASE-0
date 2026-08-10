-- ============================================================
-- SVCE ERP — UNIFIED SEED DATA
-- Run AFTER unified_schema.sql on the svce_erp database.
-- ============================================================

-- ============================================================
-- 1. ROLES
-- ============================================================
INSERT INTO roles (role_name, description) VALUES
    ('super_admin',           'Full system access — college registrar'),
    ('admin',                 'Admin ERP access — student registry management'),
    ('hod',                   'Head of Department — HOD portal full access'),
    ('faculty',               'Faculty member — Faculty ERP access'),
    ('timetable_coordinator', 'Manages department timetable'),
    ('exam_coordinator',      'Manages examinations and marks'),
    ('cultural_coordinator',  'Manages cultural events and activities'),
    ('placement_coordinator', 'Manages placement activities')
ON CONFLICT (role_name) DO NOTHING;

-- ============================================================
-- 2. DEPARTMENTS
-- (matches Repo 1 seed_lookups.sql + Repo 2 departmentCode values)
-- ============================================================
INSERT INTO departments (department_name, department_code) VALUES
    ('Computer Science and Engineering',               'CSE'),
    ('Computer Science and Engineering - AI',           'CSE-AI'),
    ('Computer Science and Engineering - Data Science',  'CSE-DS'),
    ('Computer Science and Engineering - Cyber Security','CSE-CY'),
    ('Information Science and Engineering',             'ISE'),
    ('Electronics and Communication Engineering',       'ECE'),
    ('Civil Engineering',                               'CIVIL'),
    ('Mechanical Engineering',                          'MECHANICAL')
ON CONFLICT (department_code) DO NOTHING;

-- ============================================================
-- 3. PROGRAMS
-- BE is offered by every engineering department. MCA / MBA /
-- M.Tech are postgrad programs; seeded under CSE as a placeholder
-- — reassign department_id before using these in production if
-- they should sit under a dedicated postgrad department.
-- ============================================================
INSERT INTO programs (program_name, program_code, department_id)
SELECT 'Bachelor of Engineering', 'BE', department_id
FROM   departments WHERE department_code = 'CSE'
ON CONFLICT (program_code) DO NOTHING;

INSERT INTO programs (program_name, program_code, department_id)
SELECT 'Master of Computer Applications', 'MCA', department_id
FROM   departments WHERE department_code = 'CSE'
ON CONFLICT (program_code) DO NOTHING;

INSERT INTO programs (program_name, program_code, department_id)
SELECT 'Master of Business Administration', 'MBA', department_id
FROM   departments WHERE department_code = 'CSE'
ON CONFLICT (program_code) DO NOTHING;

INSERT INTO programs (program_name, program_code, department_id)
SELECT 'Master of Technology', 'MTECH', department_id
FROM   departments WHERE department_code = 'CSE'
ON CONFLICT (program_code) DO NOTHING;

-- ============================================================
-- 4. SEMESTERS (1 through 8)
-- ============================================================
INSERT INTO semesters (semester_number) VALUES
    (1),(2),(3),(4),(5),(6),(7),(8)
ON CONFLICT (semester_number) DO NOTHING;

-- ============================================================
-- 5. SECTIONS — A, B, C, D for every semester in CSE
-- ============================================================
DO $$
DECLARE
    v_section_name  VARCHAR(10);
    v_semester_row  RECORD;
    v_dept_id       BIGINT;
BEGIN
    SELECT department_id INTO v_dept_id
    FROM   departments
    WHERE  department_code = 'CSE';

    FOREACH v_section_name IN ARRAY ARRAY['A','B','C','D'] LOOP
        FOR v_semester_row IN SELECT semester_id FROM semesters LOOP
            INSERT INTO sections (section_name, semester_id, department_id)
            VALUES (v_section_name, v_semester_row.semester_id, v_dept_id)
            ON CONFLICT (section_name, semester_id, department_id) DO NOTHING;
        END LOOP;
    END LOOP;
END;
$$;

-- ============================================================
-- 6. ACADEMIC SETTINGS — current semester for HOD Portal
-- (table structure lives in unified_schema.sql Section 8;
--  this is the only place the row is actually seeded)
-- ============================================================
INSERT INTO academic_settings (academic_year, current_semester_type)
VALUES ('2025-26', 'ODD')
ON CONFLICT (academic_year) DO NOTHING;

-- ============================================================
-- 7. ADMIN USER
-- username: admin
-- password: Admin@123  (bcrypt 10 rounds — same hash as Repo 1)
-- ============================================================
INSERT INTO users (username, email, password_hash, status)
VALUES (
    'admin',
    'admin@svce.edu',
    '$2b$10$sTEWPHN82n8UpjoMfg4XfOy6GMOdNOBOmfdb1SoNpuKz4/E58kemO',
    'active'
)
ON CONFLICT (username) DO NOTHING;

UPDATE users
SET    role_id = (SELECT role_id FROM roles WHERE role_name = 'admin')
WHERE  username = 'admin'
  AND  role_id IS NULL;

-- ============================================================
-- 8. DEFAULT SETTINGS ROW FOR ADMIN USER
-- ============================================================
INSERT INTO settings (user_id, theme, language, notification_enabled)
SELECT user_id, 'light', 'en', TRUE
FROM   users
WHERE  username = 'admin'
ON CONFLICT (user_id) DO NOTHING;

-- ============================================================
-- NOTE: subjects, faculty, and classes are intentionally NOT
-- seeded here. subjects.program_id, classes.subject_id, and
-- classes.faculty_id are all NOT NULL in the corrected schema,
-- so realistic seed data for those tables needs actual
-- subject/faculty rosters — add a unified_academic_seed.sql
-- once that data is available, run after this file.
-- ============================================================