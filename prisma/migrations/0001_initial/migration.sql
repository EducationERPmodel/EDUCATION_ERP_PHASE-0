-- =============================================================================
-- SVCE Unified ERP — Initial Migration
-- Prisma migration file: 0001_initial
-- =============================================================================
-- This is the COMPLETE database schema for the SVCE Unified ERP system.
-- It is an exact transcription of database/unified_schema.sql into Prisma's
-- migration format so that `prisma migrate deploy` can reproduce the full
-- database on a fresh PostgreSQL instance.
--
-- Run order (fresh setup):
--   1. createdb <db_name>
--   2. Set DATABASE_URL in .env
--   3. cd unified_backend && npx prisma migrate deploy
--   4. psql -U postgres -d <db_name> -f ../database/unified_seed_empty.sql
--   5. npm start
-- =============================================================================

-- ─── Section 1: Auth & Authorization ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "roles" (
    "role_id"     BIGSERIAL    PRIMARY KEY,
    "role_name"   VARCHAR(100) NOT NULL UNIQUE,
    "description" TEXT,
    "created_at"  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    "updated_at"  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "users" (
    "user_id"       BIGSERIAL    PRIMARY KEY,
    "username"      VARCHAR(50)  NOT NULL UNIQUE,
    "email"         VARCHAR(150) NOT NULL UNIQUE,
    "password_hash" VARCHAR(255) NOT NULL,
    "role_id"       BIGINT       REFERENCES "roles"("role_id") ON DELETE SET NULL,
    "faculty_id"    BIGINT,
    "student_id"    VARCHAR(50),
    "status"        VARCHAR(20)  NOT NULL DEFAULT 'active'
                                 CHECK ("status" IN ('active','inactive','suspended')),
    "last_login"    TIMESTAMPTZ,
    "created_at"    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    "updated_at"    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "refresh_tokens" (
    "token_id"   BIGSERIAL    PRIMARY KEY,
    "user_id"    BIGINT       NOT NULL REFERENCES "users"("user_id") ON DELETE CASCADE,
    "token_hash" VARCHAR(255) NOT NULL UNIQUE,
    "expires_at" TIMESTAMPTZ  NOT NULL,
    "revoked"    BOOLEAN      NOT NULL DEFAULT FALSE,
    "created_at" TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ─── Section 2: Master Data ───────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "departments" (
    "department_id"   BIGSERIAL    PRIMARY KEY,
    "department_name" VARCHAR(100) NOT NULL UNIQUE,
    "department_code" VARCHAR(20)  NOT NULL UNIQUE,
    "hod_faculty_id"  BIGINT,
    "is_active"       BOOLEAN      NOT NULL DEFAULT TRUE,
    "created_at"      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    "updated_at"      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "programs" (
    "program_id"    BIGSERIAL    PRIMARY KEY,
    "program_name"  VARCHAR(100) NOT NULL UNIQUE,
    "program_code"  VARCHAR(20)  NOT NULL UNIQUE,
    "department_id" BIGINT       NOT NULL REFERENCES "departments"("department_id") ON DELETE RESTRICT,
    "is_active"     BOOLEAN      NOT NULL DEFAULT TRUE,
    "created_at"    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    "updated_at"    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "semesters" (
    "semester_id"     BIGSERIAL   PRIMARY KEY,
    "semester_number" INTEGER     NOT NULL CHECK ("semester_number" BETWEEN 1 AND 8),
    "created_at"      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at"      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE ("semester_number")
);

CREATE TABLE IF NOT EXISTS "sections" (
    "section_id"    BIGSERIAL    PRIMARY KEY,
    "section_name"  VARCHAR(10)  NOT NULL,
    "semester_id"   BIGINT       NOT NULL REFERENCES "semesters"("semester_id")   ON DELETE RESTRICT,
    "department_id" BIGINT       NOT NULL REFERENCES "departments"("department_id") ON DELETE RESTRICT,
    "created_at"    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    "updated_at"    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    UNIQUE ("section_name", "semester_id", "department_id")
);

CREATE TABLE IF NOT EXISTS "faculty" (
    "faculty_id"       BIGSERIAL    PRIMARY KEY,
    "employee_id"      VARCHAR(50)  NOT NULL UNIQUE,
    "name"             VARCHAR(150) NOT NULL,
    "email"            VARCHAR(150) NOT NULL UNIQUE,
    "phone"            VARCHAR(20),
    "designation"      VARCHAR(100) NOT NULL,
    "qualification"    VARCHAR(150),
    "specialization"   VARCHAR(150),
    "experience_years" INTEGER      NOT NULL DEFAULT 0,
    "department_id"    BIGINT       NOT NULL REFERENCES "departments"("department_id") ON DELETE RESTRICT,
    "photo_url"        VARCHAR(500),
    "username"         VARCHAR(50)  NOT NULL UNIQUE,
    "password_hash"    VARCHAR(255) NOT NULL,
    "coordinator_roles" VARCHAR(500),
    "is_hod"           BOOLEAN      NOT NULL DEFAULT FALSE,
    "status"           VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE'
                                   CHECK ("status" IN ('ACTIVE','INACTIVE','ON_LEAVE')),
    "created_at"       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    "updated_at"       TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Deferred FK: departments.hod_faculty_id → faculty
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'fk_departments_hod_faculty'
          AND conrelid = 'public.departments'::regclass
    ) THEN
        ALTER TABLE departments DROP CONSTRAINT fk_departments_hod_faculty;
    END IF;
END $$;

ALTER TABLE "departments"
    ADD CONSTRAINT fk_departments_hod_faculty
    FOREIGN KEY ("hod_faculty_id")
    REFERENCES "faculty"("faculty_id")
    ON DELETE SET NULL;

-- Deferred FK: users.faculty_id → faculty
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'fk_users_faculty'
          AND conrelid = 'public.users'::regclass
    ) THEN
        ALTER TABLE users DROP CONSTRAINT fk_users_faculty;
    END IF;
END $$;

ALTER TABLE "users"
    ADD CONSTRAINT fk_users_faculty
    FOREIGN KEY ("faculty_id")
    REFERENCES "faculty"("faculty_id")
    ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS "faculty_subjects" (
    "faculty_id"  BIGINT      NOT NULL REFERENCES "faculty"("faculty_id")  ON DELETE CASCADE,
    "subject_id"  BIGINT      NOT NULL,
    "assigned_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY ("faculty_id", "subject_id")
);

-- ─── Section 3: Student Master ────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "students" (
    "library_id"    VARCHAR(50)  NOT NULL,
    "usn"           VARCHAR(50)  UNIQUE,
    "name"          VARCHAR(150) NOT NULL,
    "email"         VARCHAR(150) UNIQUE,
    "phone"         VARCHAR(20),
    "gender"        VARCHAR(10)  NOT NULL
                                 CHECK ("gender" IN ('Male','Female','Other')),
    "program_id"    BIGINT       NOT NULL REFERENCES "programs"("program_id")       ON DELETE RESTRICT,
    "department_id" BIGINT       NOT NULL REFERENCES "departments"("department_id") ON DELETE RESTRICT,
    "semester_id"   BIGINT       NOT NULL REFERENCES "semesters"("semester_id")     ON DELETE RESTRICT,
    "section_id"    BIGINT       NOT NULL REFERENCES "sections"("section_id")       ON DELETE RESTRICT,
    "academic_year" VARCHAR(20)  NOT NULL,
    "status"        VARCHAR(20)  NOT NULL DEFAULT 'Enrolled'
                                 CHECK ("status" IN ('Enrolled','On Leave','Transferred','Inactive')),
    "created_at"    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    "updated_at"    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    PRIMARY KEY ("library_id")
);

-- Deferred FK: users.student_id → students (references library_id PK)
-- Note: users.student_id column stores the student's library_id value (VARCHAR)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'fk_users_student'
          AND conrelid = 'public.users'::regclass
    ) THEN
        ALTER TABLE users DROP CONSTRAINT fk_users_student;
    END IF;
END $$;

ALTER TABLE "users"
    ADD CONSTRAINT fk_users_student
    FOREIGN KEY ("student_id")
    REFERENCES "students"("library_id")
    ON DELETE SET NULL;

-- Trigger: validate section belongs to student's semester
CREATE OR REPLACE FUNCTION fn_validate_student_section()
RETURNS TRIGGER AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM sections s
        WHERE s.section_id = NEW.section_id
          AND s.semester_id = NEW.semester_id
    ) THEN
        RAISE EXCEPTION
            'section_id % does not belong to semester_id % for student %',
            NEW.section_id, NEW.semester_id, NEW.library_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_validate_student_section ON students;

CREATE TRIGGER trg_validate_student_section
    BEFORE INSERT OR UPDATE OF semester_id, section_id ON students
    FOR EACH ROW
    EXECUTE FUNCTION fn_validate_student_section();

-- ─── Section 4: Subjects, Classes, Timetable ─────────────────────────────────

CREATE TABLE IF NOT EXISTS "subjects" (
    "subject_id"    BIGSERIAL    PRIMARY KEY,
    "subject_code"  VARCHAR(20)  NOT NULL UNIQUE,
    "subject_name"  VARCHAR(100) NOT NULL,
    "credits"       INTEGER,
    "program_id"    BIGINT       NOT NULL REFERENCES "programs"("program_id")       ON DELETE RESTRICT,
    "semester_id"   BIGINT       NOT NULL REFERENCES "semesters"("semester_id")     ON DELETE RESTRICT,
    "department_id" BIGINT       NOT NULL REFERENCES "departments"("department_id") ON DELETE RESTRICT,
    "created_at"    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    "updated_at"    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Wire deferred FK on faculty_subjects → subjects
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'fk_faculty_subjects_subject'
          AND conrelid = 'public.faculty_subjects'::regclass
    ) THEN
        ALTER TABLE faculty_subjects DROP CONSTRAINT fk_faculty_subjects_subject;
    END IF;
END $$;

ALTER TABLE "faculty_subjects"
    ADD CONSTRAINT fk_faculty_subjects_subject
    FOREIGN KEY ("subject_id")
    REFERENCES "subjects"("subject_id")
    ON DELETE CASCADE;

CREATE TABLE IF NOT EXISTS "classes" (
    "class_id"         BIGSERIAL    PRIMARY KEY,
    "semester_id"      BIGINT       NOT NULL REFERENCES "semesters"("semester_id")  ON DELETE RESTRICT,
    "section_id"       BIGINT       NOT NULL REFERENCES "sections"("section_id")    ON DELETE RESTRICT,
    "subject_id"       BIGINT       NOT NULL REFERENCES "subjects"("subject_id")    ON DELETE RESTRICT,
    "faculty_id"       BIGINT       NOT NULL REFERENCES "faculty"("faculty_id")     ON DELETE RESTRICT,
    "academic_year"    VARCHAR(20)  NOT NULL,
    "class_teacher_id" BIGINT       REFERENCES "faculty"("faculty_id")              ON DELETE SET NULL,
    "created_at"       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    "updated_at"       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    UNIQUE ("semester_id", "section_id", "subject_id", "academic_year")
);

CREATE TABLE IF NOT EXISTS "timetable" (
    "timetable_id" BIGSERIAL   PRIMARY KEY,
    "class_id"     BIGINT      NOT NULL REFERENCES "classes"("class_id") ON DELETE RESTRICT,
    "day_of_week"  VARCHAR(10) NOT NULL
                   CHECK ("day_of_week" IN
                       ('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday')),
    "period"       INTEGER     NOT NULL CHECK ("period" BETWEEN 1 AND 8),
    "room_number"  VARCHAR(20),
    "created_at"   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at"   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE ("class_id", "day_of_week", "period")
);

-- Trigger: prevent faculty double-booking in timetable
CREATE OR REPLACE FUNCTION fn_prevent_faculty_double_booking()
RETURNS TRIGGER AS $$
DECLARE
    v_faculty_id   BIGINT;
    v_conflict_id  BIGINT;
BEGIN
    SELECT faculty_id INTO v_faculty_id
    FROM   classes
    WHERE  class_id = NEW.class_id;

    SELECT t.timetable_id INTO v_conflict_id
    FROM   timetable t
    JOIN   classes c ON c.class_id = t.class_id
    WHERE  c.faculty_id  = v_faculty_id
      AND  t.day_of_week = NEW.day_of_week
      AND  t.period       = NEW.period
      AND  t.timetable_id <> COALESCE(NEW.timetable_id, -1)
    LIMIT 1;

    IF v_conflict_id IS NOT NULL THEN
        RAISE EXCEPTION
            'faculty_id % is already scheduled for another class at % period % (timetable_id %)',
            v_faculty_id, NEW.day_of_week, NEW.period, v_conflict_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_prevent_faculty_double_booking ON timetable;

CREATE TRIGGER trg_prevent_faculty_double_booking
    BEFORE INSERT OR UPDATE OF class_id, day_of_week, period ON timetable
    FOR EACH ROW
    EXECUTE FUNCTION fn_prevent_faculty_double_booking();

-- ─── Section 5: Academic Operations ──────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "attendance" (
    "attendance_id"   BIGSERIAL   PRIMARY KEY,
    "student_id"      VARCHAR(50) NOT NULL REFERENCES "students"("library_id") ON DELETE CASCADE,
    "class_id"        BIGINT      NOT NULL REFERENCES "classes"("class_id")    ON DELETE RESTRICT,
    "attendance_date" DATE        NOT NULL,
    "status"          VARCHAR(10) NOT NULL CHECK ("status" IN ('Present','Absent')),
    "remarks"         VARCHAR(255),
    "created_at"      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE ("student_id", "class_id", "attendance_date")
);

CREATE TABLE IF NOT EXISTS "ia_marks" (
    "ia_id"      BIGSERIAL    PRIMARY KEY,
    "student_id" VARCHAR(50)  NOT NULL REFERENCES "students"("library_id") ON DELETE CASCADE,
    "class_id"   BIGINT       NOT NULL REFERENCES "classes"("class_id")    ON DELETE RESTRICT,
    "ia1"        INTEGER      CHECK ("ia1" BETWEEN 0 AND 20),
    "ia2"        INTEGER      CHECK ("ia2" BETWEEN 0 AND 20),
    "ia3"        INTEGER      CHECK ("ia3" BETWEEN 0 AND 20),
    "average"    NUMERIC(5,2) GENERATED ALWAYS AS (
                     ROUND(
                         (COALESCE("ia1", 0) + COALESCE("ia2", 0) + COALESCE("ia3", 0))
                         ::NUMERIC / 3,
                     2)
                 ) STORED,
    "created_at" TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    UNIQUE ("student_id", "class_id")
);

CREATE TABLE IF NOT EXISTS "assignments" (
    "assignment_id"  BIGSERIAL    PRIMARY KEY,
    "class_id"       BIGINT       NOT NULL REFERENCES "classes"("class_id") ON DELETE RESTRICT,
    "title"          VARCHAR(255) NOT NULL,
    "description"    TEXT,
    "due_date"       DATE,
    "marks"          INTEGER      DEFAULT 0,
    "attachment_url" VARCHAR(500),
    "status"         VARCHAR(20)  NOT NULL DEFAULT 'Open'
                                  CHECK ("status" IN ('Open','Closed','Graded')),
    "created_at"     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    "updated_at"     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "assignment_submissions" (
    "submission_id" BIGSERIAL    PRIMARY KEY,
    "assignment_id" BIGINT       NOT NULL REFERENCES "assignments"("assignment_id") ON DELETE CASCADE,
    "student_id"    VARCHAR(50)  NOT NULL REFERENCES "students"("library_id")       ON DELETE CASCADE,
    "submitted_at"  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    "file_url"      VARCHAR(500),
    "marks"         INTEGER,
    "remarks"       VARCHAR(500),
    UNIQUE ("assignment_id", "student_id")
);

-- ─── Section 6: Activities & Achievements ────────────────────────────────────

CREATE TABLE IF NOT EXISTS "activities" (
    "activity_id"   BIGSERIAL    PRIMARY KEY,
    "student_id"    VARCHAR(50)  NOT NULL REFERENCES "students"("library_id") ON DELETE CASCADE,
    "faculty_id"    BIGINT       REFERENCES "faculty"("faculty_id")            ON DELETE SET NULL,
    "activity_type" VARCHAR(50)  NOT NULL
                    CHECK ("activity_type" IN (
                        'Technical','Sports','Cultural',
                        'IndustryProject','Hackathon','OtherCurricular'
                    )),
    "title"         VARCHAR(255) NOT NULL,
    "description"   TEXT,
    "academic_year" VARCHAR(20),
    "status"        VARCHAR(20)  NOT NULL DEFAULT 'Completed',
    "created_at"    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    "updated_at"    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "achievements" (
    "achievement_id"   BIGSERIAL    PRIMARY KEY,
    "student_id"       VARCHAR(50)  NOT NULL REFERENCES "students"("library_id") ON DELETE CASCADE,
    "faculty_id"       BIGINT       REFERENCES "faculty"("faculty_id")            ON DELETE SET NULL,
    "title"            VARCHAR(255) NOT NULL,
    "level"            VARCHAR(50)
                       CHECK ("level" IN (
                           'College','University','State','National','International'
                       )),
    "type"             VARCHAR(50)  NOT NULL
                       CHECK ("type" IN (
                           'Hackathon','Sports','Cultural','Industry',
                           'Certification','Publication','Award','Other'
                       )),
    "position"         VARCHAR(100),
    "certificate_url"  VARCHAR(500),
    "achievement_date" DATE,
    "created_at"       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    "updated_at"       TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ─── Section 7: Admin Operations ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "student_transfers" (
    "transfer_id"       BIGSERIAL   PRIMARY KEY,
    "student_id"        VARCHAR(50) NOT NULL REFERENCES "students"("library_id")       ON DELETE CASCADE,
    "old_program_id"    BIGINT      REFERENCES "programs"("program_id")                ON DELETE SET NULL,
    "old_department_id" BIGINT      REFERENCES "departments"("department_id")          ON DELETE SET NULL,
    "old_semester_id"   BIGINT      REFERENCES "semesters"("semester_id")              ON DELETE SET NULL,
    "old_section_id"    BIGINT      REFERENCES "sections"("section_id")                ON DELETE SET NULL,
    "new_program_id"    BIGINT      NOT NULL REFERENCES "programs"("program_id")       ON DELETE RESTRICT,
    "new_department_id" BIGINT      NOT NULL REFERENCES "departments"("department_id") ON DELETE RESTRICT,
    "new_semester_id"   BIGINT      NOT NULL REFERENCES "semesters"("semester_id")     ON DELETE RESTRICT,
    "new_section_id"    BIGINT      NOT NULL REFERENCES "sections"("section_id")       ON DELETE RESTRICT,
    "reason"            VARCHAR(500),
    "document_url"      VARCHAR(500),
    "transfer_date"     DATE        NOT NULL DEFAULT CURRENT_DATE,
    "created_at"        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'chk_transfer_different_target'
          AND conrelid = 'public.student_transfers'::regclass
    ) THEN
        ALTER TABLE student_transfers DROP CONSTRAINT chk_transfer_different_target;
    END IF;
END $$;

ALTER TABLE "student_transfers"
    ADD CONSTRAINT chk_transfer_different_target
    CHECK (
        "new_program_id"    <> "old_program_id" OR
        "new_department_id" <> "old_department_id" OR
        "new_semester_id"   <> "old_semester_id" OR
        "new_section_id"    <> "old_section_id" OR
        "old_program_id"    IS NULL OR
        "old_department_id" IS NULL OR
        "old_semester_id"   IS NULL OR
        "old_section_id"    IS NULL
    );

CREATE TABLE IF NOT EXISTS "coordinator_assignments" (
    "coordinator_id" BIGSERIAL   PRIMARY KEY,
    "faculty_id"     BIGINT      NOT NULL REFERENCES "faculty"("faculty_id")     ON DELETE CASCADE,
    "role_id"        BIGINT      NOT NULL REFERENCES "roles"("role_id")          ON DELETE CASCADE,
    "department_id"  BIGINT      NOT NULL REFERENCES "departments"("department_id") ON DELETE CASCADE,
    "assigned_date"  DATE        NOT NULL DEFAULT CURRENT_DATE,
    "remarks"        VARCHAR(500),
    "created_at"     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at"     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE ("faculty_id", "role_id", "department_id")
);

-- ─── Section 8: Academic Settings ────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "academic_settings" (
    "setting_id"            BIGSERIAL    PRIMARY KEY,
    "academic_year"         VARCHAR(20)  NOT NULL UNIQUE,
    "current_semester_type" VARCHAR(10)  NOT NULL
                            CHECK ("current_semester_type" IN ('ODD','EVEN')),
    "created_at"            TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    "updated_at"            TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ─── Section 9: Communication & System ───────────────────────────────────────

CREATE TABLE IF NOT EXISTS "notifications" (
    "notification_id" BIGSERIAL    PRIMARY KEY,
    "user_id"         BIGINT       NOT NULL REFERENCES "users"("user_id") ON DELETE CASCADE,
    "title"           VARCHAR(255) NOT NULL,
    "message"         TEXT         NOT NULL,
    "read_status"     VARCHAR(10)  NOT NULL DEFAULT 'Unread'
                                   CHECK ("read_status" IN ('Unread','Read')),
    "created_at"      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "settings" (
    "setting_id"           BIGSERIAL   PRIMARY KEY,
    "user_id"              BIGINT      NOT NULL REFERENCES "users"("user_id") ON DELETE CASCADE,
    "theme"                VARCHAR(20) DEFAULT 'light',
    "language"             VARCHAR(20) DEFAULT 'en',
    "notification_enabled" BOOLEAN     NOT NULL DEFAULT TRUE,
    "created_at"           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at"           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE ("user_id")
);

-- ─── Section 10: Audit & Logs ─────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "audit_logs" (
    "audit_id"   BIGSERIAL    PRIMARY KEY,
    "user_id"    BIGINT       REFERENCES "users"("user_id") ON DELETE SET NULL,
    "action"     VARCHAR(100) NOT NULL,
    "module"     VARCHAR(50),
    "record_id"  VARCHAR(100),
    "old_value"  JSONB,
    "new_value"  JSONB,
    "created_at" TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ─── Section 11: Indexes ──────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user     ON "refresh_tokens" ("user_id");
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_expires  ON "refresh_tokens" ("expires_at");

CREATE INDEX IF NOT EXISTS idx_students_usn            ON "students" ("usn");
CREATE INDEX IF NOT EXISTS idx_students_name           ON "students" ("name");
CREATE INDEX IF NOT EXISTS idx_students_department     ON "students" ("department_id");
CREATE INDEX IF NOT EXISTS idx_students_program        ON "students" ("program_id");
CREATE INDEX IF NOT EXISTS idx_students_semester       ON "students" ("semester_id");
CREATE INDEX IF NOT EXISTS idx_students_section        ON "students" ("section_id");
CREATE INDEX IF NOT EXISTS idx_students_status         ON "students" ("status");

CREATE INDEX IF NOT EXISTS idx_faculty_department      ON "faculty" ("department_id");
CREATE INDEX IF NOT EXISTS idx_faculty_username        ON "faculty" ("username");
CREATE INDEX IF NOT EXISTS idx_faculty_status          ON "faculty" ("status");
CREATE INDEX IF NOT EXISTS idx_faculty_employee_id     ON "faculty" ("employee_id");

CREATE INDEX IF NOT EXISTS idx_subjects_program        ON "subjects" ("program_id");
CREATE INDEX IF NOT EXISTS idx_subjects_semester       ON "subjects" ("semester_id");
CREATE INDEX IF NOT EXISTS idx_subjects_department     ON "subjects" ("department_id");

CREATE INDEX IF NOT EXISTS idx_classes_semester        ON "classes" ("semester_id");
CREATE INDEX IF NOT EXISTS idx_classes_section         ON "classes" ("section_id");
CREATE INDEX IF NOT EXISTS idx_classes_subject         ON "classes" ("subject_id");
CREATE INDEX IF NOT EXISTS idx_classes_faculty         ON "classes" ("faculty_id");

CREATE INDEX IF NOT EXISTS idx_timetable_class         ON "timetable" ("class_id");

CREATE INDEX IF NOT EXISTS idx_attendance_student      ON "attendance" ("student_id");
CREATE INDEX IF NOT EXISTS idx_attendance_class        ON "attendance" ("class_id");
CREATE INDEX IF NOT EXISTS idx_attendance_date         ON "attendance" ("attendance_date");

CREATE INDEX IF NOT EXISTS idx_ia_marks_student        ON "ia_marks" ("student_id");
CREATE INDEX IF NOT EXISTS idx_ia_marks_class          ON "ia_marks" ("class_id");

CREATE INDEX IF NOT EXISTS idx_assignments_class       ON "assignments" ("class_id");
CREATE INDEX IF NOT EXISTS idx_assignments_status      ON "assignments" ("status");

CREATE INDEX IF NOT EXISTS idx_submissions_assignment  ON "assignment_submissions" ("assignment_id");
CREATE INDEX IF NOT EXISTS idx_submissions_student     ON "assignment_submissions" ("student_id");

CREATE INDEX IF NOT EXISTS idx_activities_student      ON "activities" ("student_id");
CREATE INDEX IF NOT EXISTS idx_activities_type         ON "activities" ("activity_type");
CREATE INDEX IF NOT EXISTS idx_activities_faculty      ON "activities" ("faculty_id");

CREATE INDEX IF NOT EXISTS idx_achievements_student    ON "achievements" ("student_id");
CREATE INDEX IF NOT EXISTS idx_achievements_type       ON "achievements" ("type");

CREATE INDEX IF NOT EXISTS idx_transfers_student       ON "student_transfers" ("student_id");
CREATE INDEX IF NOT EXISTS idx_transfers_date          ON "student_transfers" ("transfer_date");

CREATE INDEX IF NOT EXISTS idx_coordinator_faculty     ON "coordinator_assignments" ("faculty_id");
CREATE INDEX IF NOT EXISTS idx_coordinator_dept        ON "coordinator_assignments" ("department_id");

CREATE INDEX IF NOT EXISTS idx_faculty_subjects_subject ON "faculty_subjects" ("subject_id");

CREATE INDEX IF NOT EXISTS idx_notifications_user      ON "notifications" ("user_id");
CREATE INDEX IF NOT EXISTS idx_notifications_status    ON "notifications" ("read_status");

CREATE INDEX IF NOT EXISTS idx_audit_user              ON "audit_logs" ("user_id");
CREATE INDEX IF NOT EXISTS idx_audit_action            ON "audit_logs" ("action");
CREATE INDEX IF NOT EXISTS idx_audit_created           ON "audit_logs" ("created_at");
CREATE INDEX IF NOT EXISTS idx_audit_module            ON "audit_logs" ("module");

-- ─── Section 12: updated_at Auto-maintenance Trigger ─────────────────────────

CREATE OR REPLACE FUNCTION fn_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
    v_table TEXT;
BEGIN
    FOREACH v_table IN ARRAY ARRAY[
        'roles', 'users', 'departments', 'programs', 'semesters',
        'sections', 'faculty', 'students', 'subjects', 'classes',
        'timetable', 'ia_marks', 'assignments', 'activities',
        'achievements', 'coordinator_assignments',
        'academic_settings', 'settings'
    ] LOOP
        EXECUTE format(
            'DROP TRIGGER IF EXISTS trg_set_updated_at ON %I;
             CREATE TRIGGER trg_set_updated_at
                 BEFORE UPDATE ON %I
                 FOR EACH ROW
                 EXECUTE FUNCTION fn_set_updated_at();',
            v_table, v_table
        );
    END LOOP;
END;
$$;
