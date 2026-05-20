-- InternFlow AI — Enterprise baseline migration
-- Requires PostgreSQL 14+

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('INTERN', 'COMPANY_ADMIN', 'SUPER_ADMIN');
CREATE TYPE "AssignmentStatus" AS ENUM ('DRAFT', 'PENDING', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED');
CREATE TYPE "TaskStatus" AS ENUM ('TODO', 'IN_PROGRESS', 'IN_REVIEW', 'BLOCKED', 'DONE', 'CANCELLED');
CREATE TYPE "TaskPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');
CREATE TYPE "NotificationType" AS ENUM ('SYSTEM', 'TASK_ASSIGNED', 'TASK_DUE', 'PROGRESS_UPDATE', 'ASSIGNMENT_UPDATE', 'MENTION', 'REMINDER');
CREATE TYPE "FileKind" AS ENUM ('RESUME', 'PROFILE_PHOTO', 'COMPANY_LOGO', 'TASK_ATTACHMENT', 'OTHER');
CREATE TYPE "SessionStatus" AS ENUM ('ACTIVE', 'REVOKED', 'EXPIRED');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" VARCHAR(320) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(32),
    "role" "UserRole" NOT NULL,
    "email_verified_at" TIMESTAMPTZ(6),
    "last_login_at" TIMESTAMPTZ(6),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),
    "created_by_id" UUID,
    "updated_by_id" UUID,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "refresh_tokens" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "token_hash" VARCHAR(128) NOT NULL,
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "revoked_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "sessions" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "refresh_token_id" UUID,
    "status" "SessionStatus" NOT NULL DEFAULT 'ACTIVE',
    "ip_address" VARCHAR(45),
    "user_agent" VARCHAR(512),
    "device_label" VARCHAR(120),
    "last_active_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "revoked_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "files" (
    "id" UUID NOT NULL,
    "owner_id" UUID NOT NULL,
    "kind" "FileKind" NOT NULL,
    "storage_key" VARCHAR(500) NOT NULL,
    "public_url" VARCHAR(500) NOT NULL,
    "mime_type" VARCHAR(120) NOT NULL,
    "size_bytes" INTEGER NOT NULL,
    "original_name" VARCHAR(255) NOT NULL,
    "checksum" VARCHAR(64),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "companies" (
    "id" UUID NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "slug" VARCHAR(220) NOT NULL,
    "description" TEXT,
    "website" VARCHAR(500),
    "industry" VARCHAR(120),
    "size_band" VARCHAR(50),
    "logo_file_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),
    "created_by_id" UUID,
    "updated_by_id" UUID,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "company_admins" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "company_id" UUID NOT NULL,
    "full_name" VARCHAR(160) NOT NULL,
    "department" VARCHAR(120) NOT NULL,
    "job_title" VARCHAR(120),
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),
    "created_by_id" UUID,
    "updated_by_id" UUID,

    CONSTRAINT "company_admins_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "interns" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "full_name" VARCHAR(160) NOT NULL,
    "college" VARCHAR(200) NOT NULL,
    "degree" VARCHAR(120) NOT NULL,
    "specialization" VARCHAR(160) NOT NULL,
    "github_url" VARCHAR(500),
    "linkedin_url" VARCHAR(500),
    "resume_file_id" UUID,
    "profile_photo_id" UUID,
    "duration_start" DATE NOT NULL,
    "duration_end" DATE NOT NULL,
    "bio" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),
    "created_by_id" UUID,
    "updated_by_id" UUID,

    CONSTRAINT "interns_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "skills" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(120) NOT NULL,
    "category" VARCHAR(80),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "intern_skills" (
    "id" UUID NOT NULL,
    "intern_id" UUID NOT NULL,
    "skill_id" UUID NOT NULL,
    "proficiency" SMALLINT,
    "years_experience" DECIMAL(3,1),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "intern_skills_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "internship_assignments" (
    "id" UUID NOT NULL,
    "intern_id" UUID NOT NULL,
    "company_id" UUID NOT NULL,
    "title" VARCHAR(160) NOT NULL,
    "department" VARCHAR(120),
    "status" "AssignmentStatus" NOT NULL DEFAULT 'PENDING',
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "manager_id" UUID,
    "notes" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),
    "created_by_id" UUID,
    "updated_by_id" UUID,

    CONSTRAINT "internship_assignments_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "tasks" (
    "id" UUID NOT NULL,
    "assignment_id" UUID NOT NULL,
    "assignee_id" UUID NOT NULL,
    "created_by_id" UUID NOT NULL,
    "title" VARCHAR(240) NOT NULL,
    "description" TEXT,
    "status" "TaskStatus" NOT NULL DEFAULT 'TODO',
    "priority" "TaskPriority" NOT NULL DEFAULT 'MEDIUM',
    "due_date" TIMESTAMPTZ(6),
    "completed_at" TIMESTAMPTZ(6),
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "progress_entries" (
    "id" UUID NOT NULL,
    "task_id" UUID,
    "intern_id" UUID NOT NULL,
    "author_id" UUID NOT NULL,
    "percent_complete" SMALLINT NOT NULL,
    "summary" VARCHAR(500) NOT NULL,
    "details" TEXT,
    "blockers" TEXT,
    "recorded_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "progress_entries_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "notifications" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" VARCHAR(240) NOT NULL,
    "body" TEXT NOT NULL,
    "action_url" VARCHAR(500),
    "metadata" JSONB,
    "read_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE INDEX "users_email_idx" ON "users"("email");
CREATE INDEX "users_role_idx" ON "users"("role");
CREATE INDEX "users_deleted_at_idx" ON "users"("deleted_at");
CREATE INDEX "users_is_active_role_idx" ON "users"("is_active", "role");

CREATE UNIQUE INDEX "refresh_tokens_token_hash_key" ON "refresh_tokens"("token_hash");
CREATE INDEX "refresh_tokens_user_id_idx" ON "refresh_tokens"("user_id");
CREATE INDEX "refresh_tokens_expires_at_idx" ON "refresh_tokens"("expires_at");
CREATE INDEX "refresh_tokens_revoked_at_idx" ON "refresh_tokens"("revoked_at");

CREATE INDEX "sessions_user_id_status_idx" ON "sessions"("user_id", "status");
CREATE INDEX "sessions_expires_at_idx" ON "sessions"("expires_at");
CREATE INDEX "sessions_refresh_token_id_idx" ON "sessions"("refresh_token_id");

CREATE INDEX "files_owner_id_kind_idx" ON "files"("owner_id", "kind");
CREATE INDEX "files_storage_key_idx" ON "files"("storage_key");
CREATE INDEX "files_deleted_at_idx" ON "files"("deleted_at");

CREATE UNIQUE INDEX "companies_slug_key" ON "companies"("slug");
CREATE UNIQUE INDEX "companies_logo_file_id_key" ON "companies"("logo_file_id");
CREATE INDEX "companies_name_idx" ON "companies"("name");
CREATE INDEX "companies_deleted_at_idx" ON "companies"("deleted_at");

CREATE UNIQUE INDEX "company_admins_user_id_key" ON "company_admins"("user_id");
CREATE UNIQUE INDEX "company_admins_company_id_user_id_key" ON "company_admins"("company_id", "user_id");
CREATE INDEX "company_admins_company_id_deleted_at_idx" ON "company_admins"("company_id", "deleted_at");
CREATE INDEX "company_admins_department_idx" ON "company_admins"("department");

CREATE UNIQUE INDEX "interns_user_id_key" ON "interns"("user_id");
CREATE UNIQUE INDEX "interns_resume_file_id_key" ON "interns"("resume_file_id");
CREATE UNIQUE INDEX "interns_profile_photo_id_key" ON "interns"("profile_photo_id");
CREATE INDEX "interns_college_idx" ON "interns"("college");
CREATE INDEX "interns_degree_idx" ON "interns"("degree");
CREATE INDEX "interns_duration_start_duration_end_idx" ON "interns"("duration_start", "duration_end");
CREATE INDEX "interns_deleted_at_idx" ON "interns"("deleted_at");

CREATE UNIQUE INDEX "skills_name_key" ON "skills"("name");
CREATE UNIQUE INDEX "skills_slug_key" ON "skills"("slug");
CREATE INDEX "skills_category_idx" ON "skills"("category");
CREATE INDEX "skills_deleted_at_idx" ON "skills"("deleted_at");

CREATE UNIQUE INDEX "intern_skills_intern_id_skill_id_key" ON "intern_skills"("intern_id", "skill_id");
CREATE INDEX "intern_skills_skill_id_idx" ON "intern_skills"("skill_id");

CREATE INDEX "internship_assignments_company_id_status_idx" ON "internship_assignments"("company_id", "status");
CREATE INDEX "internship_assignments_intern_id_status_idx" ON "internship_assignments"("intern_id", "status");
CREATE INDEX "internship_assignments_start_date_end_date_idx" ON "internship_assignments"("start_date", "end_date");
CREATE INDEX "internship_assignments_deleted_at_idx" ON "internship_assignments"("deleted_at");

CREATE INDEX "tasks_assignment_id_status_idx" ON "tasks"("assignment_id", "status");
CREATE INDEX "tasks_assignee_id_status_idx" ON "tasks"("assignee_id", "status");
CREATE INDEX "tasks_due_date_idx" ON "tasks"("due_date");
CREATE INDEX "tasks_deleted_at_idx" ON "tasks"("deleted_at");

CREATE INDEX "progress_entries_intern_id_recorded_at_idx" ON "progress_entries"("intern_id", "recorded_at");
CREATE INDEX "progress_entries_task_id_idx" ON "progress_entries"("task_id");
CREATE INDEX "progress_entries_deleted_at_idx" ON "progress_entries"("deleted_at");

CREATE INDEX "notifications_user_id_read_at_idx" ON "notifications"("user_id", "read_at");
CREATE INDEX "notifications_user_id_created_at_idx" ON "notifications"("user_id", "created_at");
CREATE INDEX "notifications_type_idx" ON "notifications"("type");
CREATE INDEX "notifications_deleted_at_idx" ON "notifications"("deleted_at");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "users" ADD CONSTRAINT "users_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_refresh_token_id_fkey" FOREIGN KEY ("refresh_token_id") REFERENCES "refresh_tokens"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "files" ADD CONSTRAINT "files_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "companies" ADD CONSTRAINT "companies_logo_file_id_fkey" FOREIGN KEY ("logo_file_id") REFERENCES "files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "company_admins" ADD CONSTRAINT "company_admins_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "company_admins" ADD CONSTRAINT "company_admins_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "interns" ADD CONSTRAINT "interns_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "interns" ADD CONSTRAINT "interns_resume_file_id_fkey" FOREIGN KEY ("resume_file_id") REFERENCES "files"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "interns" ADD CONSTRAINT "interns_profile_photo_id_fkey" FOREIGN KEY ("profile_photo_id") REFERENCES "files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "intern_skills" ADD CONSTRAINT "intern_skills_intern_id_fkey" FOREIGN KEY ("intern_id") REFERENCES "interns"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "intern_skills" ADD CONSTRAINT "intern_skills_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "internship_assignments" ADD CONSTRAINT "internship_assignments_intern_id_fkey" FOREIGN KEY ("intern_id") REFERENCES "interns"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "internship_assignments" ADD CONSTRAINT "internship_assignments_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "internship_assignments" ADD CONSTRAINT "internship_assignments_manager_id_fkey" FOREIGN KEY ("manager_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "tasks" ADD CONSTRAINT "tasks_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "internship_assignments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_assignee_id_fkey" FOREIGN KEY ("assignee_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "progress_entries" ADD CONSTRAINT "progress_entries_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "progress_entries" ADD CONSTRAINT "progress_entries_intern_id_fkey" FOREIGN KEY ("intern_id") REFERENCES "interns"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "progress_entries" ADD CONSTRAINT "progress_entries_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
