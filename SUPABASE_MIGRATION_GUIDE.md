# Supabase Migration & RBAC Implementation Guide

## Overview
This guide covers:
1. Migrating your database to Supabase
2. Implementing Role-Based Access Control (RBAC)
3. Fixing resume and profile photo upload issues

## 1. Supabase Database Migration

### Step 1: Verify Supabase Connection

Your Supabase connection string format:
```
postgresql://postgres:[PASSWORD]@db.yttmzraxtjpdqvuijtib.supabase.co:5432/postgres
```

**Important Notes:**
- Special characters in password must be URL-encoded
- `@` becomes `%40`
- Your password `Santhosh13@20` becomes `Santhosh13%4020`

### Step 2: Update Environment Variables

The `.env` file has been updated with:
```env
DATABASE_URL="postgresql://postgres:Santhosh13%4020@db.yttmzraxtjpdqvuijtib.supabase.co:5432/postgres?schema=public"
```

### Step 3: Ensure Supabase Project is Active

1. Go to https://supabase.com/dashboard
2. Navigate to your project
3. Check if the database is paused (free tier projects pause after inactivity)
4. If paused, click "Resume" to activate it

### Step 4: Run Migration

Once your Supabase project is active, run:

```bash
cd backend
npm run prisma:push
```

This will:
- Create all tables in your Supabase database
- Set up indexes and relationships
- Apply the complete schema

### Step 5: Verify Migration

Check your Supabase dashboard:
1. Go to Table Editor
2. You should see all tables:
   - users
   - interns
   - company_admins
   - companies
   - internship_assignments
   - tasks
   - progress_entries
   - skills
   - intern_skills
   - files
   - refresh_tokens
   - sessions
   - notifications

## 2. RBAC Implementation

### What's Been Implemented

A comprehensive RBAC system has been added with feature-level permissions:

#### Admin Features (COMPANY_ADMIN, SUPER_ADMIN)
- ✅ Manage company information
- ✅ Create and manage internship assignments
- ✅ Create and assign tasks to interns
- ✅ View all interns in their company
- ✅ View all user profiles
- ✅ Manage company settings

#### Intern Features (INTERN)
- ✅ View and update own profile
- ✅ Upload resume
- ✅ Upload profile photo
- ✅ View own assignments
- ✅ View own tasks
- ✅ Update task progress
- ✅ View own notifications

### RBAC Middleware

New middleware file: `src/middleware/rbac.middleware.ts`

**Key Functions:**
- `requirePermission(permission)` - Check if user has specific permission
- `requireResourceOwnership(getter)` - Ensure interns can only access their own data
- `requireAnyPermission(...permissions)` - Check if user has any of the listed permissions
- `hasPermission(role, permission)` - Helper for service layer checks

### Updated Routes

#### User Routes (`/api/v1/users`)
```typescript
GET    /profile          - Get own profile (INTERN only)
PATCH  /profile          - Update own profile (INTERN/ADMIN)
GET    /                 - Get all users (ADMIN only)
GET    /:userId          - Get user by ID (ADMIN only)
```

#### Upload Routes (`/api/v1/uploads`)
```typescript
POST   /resume           - Upload resume (INTERN only)
POST   /profile-photo    - Upload profile photo (INTERN only)
```

#### Auth Routes (`/api/v1/auth`)
```typescript
POST   /register/admin   - Register company admin (PUBLIC)
POST   /register/intern  - Register intern (PUBLIC)
POST   /login            - Login (PUBLIC)
GET    /me               - Get current user (AUTHENTICATED)
```

## 3. Resume & Profile Photo Upload Fix

### Issue Identified
The file creation was happening outside the transaction, causing potential inconsistencies.

### Solution Implemented

Updated `src/services/auth.service.ts`:
- File records are now created **inside** the transaction
- Ensures atomicity: if intern creation fails, files aren't orphaned
- If file creation fails, user creation is rolled back

### How It Works

```typescript
await prisma.$transaction(async (tx) => {
  // 1. Create user
  const user = await tx.user.create({...});
  
  // 2. Create file records (inside transaction)
  const resumeFile = await tx.file.create({...});
  const photoFile = await tx.file.create({...});
  
  // 3. Create intern profile with file references
  const intern = await tx.intern.create({
    resumeFileId: resumeFile.id,
    profilePhotoId: photoFile.id,
    ...
  });
  
  // 4. Create skills
  // All or nothing - transaction ensures consistency
});
```

## 4. Testing the Implementation

### Test Admin Registration

```bash
curl -X POST http://localhost:4000/api/v1/auth/register/admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@company.com",
    "password": "SecurePass123!",
    "phone": "+1234567890",
    "companyName": "Tech Corp",
    "adminName": "John Admin"
  }'
```

### Test Intern Registration

```bash
curl -X POST http://localhost:4000/api/v1/auth/register/intern \
  -F "email=intern@example.com" \
  -F "password=SecurePass123!" \
  -F "phone=+1234567890" \
  -F "fullName=Jane Intern" \
  -F "college=MIT" \
  -F "degree=B.Tech" \
  -F "branch=Computer Science" \
  -F "skills=JavaScript,React,Node.js" \
  -F "internshipRole=Full Stack Developer" \
  -F "startDate=2024-06-01" \
  -F "endDate=2024-08-31" \
  -F "resume=@/path/to/resume.pdf" \
  -F "profilePhoto=@/path/to/photo.jpg"
```

### Test RBAC

1. **Login as Admin:**
```bash
curl -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@company.com",
    "password": "SecurePass123!"
  }'
```

2. **Try to access admin-only endpoint (should succeed):**
```bash
curl -X GET http://localhost:4000/api/v1/users \
  -H "Authorization: Bearer YOUR_ADMIN_ACCESS_TOKEN"
```

3. **Login as Intern:**
```bash
curl -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "intern@example.com",
    "password": "SecurePass123!"
  }'
```

4. **Try to access admin endpoint (should fail with 403):**
```bash
curl -X GET http://localhost:4000/api/v1/users \
  -H "Authorization: Bearer YOUR_INTERN_ACCESS_TOKEN"
```

5. **Access intern-allowed endpoint (should succeed):**
```bash
curl -X GET http://localhost:4000/api/v1/users/profile \
  -H "Authorization: Bearer YOUR_INTERN_ACCESS_TOKEN"
```

## 5. Supabase-Specific Configuration

### Enable Row Level Security (Optional but Recommended)

For additional security, you can enable RLS in Supabase:

1. Go to Supabase Dashboard → Authentication → Policies
2. Enable RLS on sensitive tables
3. Create policies based on user roles

Example policy for `interns` table:
```sql
-- Interns can only view their own data
CREATE POLICY "Interns can view own data"
ON interns FOR SELECT
USING (auth.uid() = user_id);

-- Admins can view all intern data
CREATE POLICY "Admins can view all interns"
ON interns FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role IN ('COMPANY_ADMIN', 'SUPER_ADMIN')
  )
);
```

### Connection Pooling

For production, consider using Supabase's connection pooler:

```env
# Transaction mode (for Prisma)
DATABASE_URL="postgresql://postgres:PASSWORD@db.PROJECT.supabase.co:6543/postgres?pgbouncer=true&connection_limit=1"

# Direct connection (for migrations)
DIRECT_URL="postgresql://postgres:PASSWORD@db.PROJECT.supabase.co:5432/postgres"
```

Update `schema.prisma`:
```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

## 6. Environment Variables Checklist

Ensure all required environment variables are set:

```env
# Server
NODE_ENV=production
PORT=4000
API_PREFIX=/api/v1

# Database
DATABASE_URL="postgresql://postgres:PASSWORD@db.PROJECT.supabase.co:5432/postgres?schema=public"

# JWT (Generate secure secrets)
JWT_ACCESS_SECRET=your-secure-access-secret-here
JWT_REFRESH_SECRET=your-secure-refresh-secret-here
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=https://your-frontend-domain.com

# File uploads
UPLOAD_DIR=uploads
MAX_FILE_SIZE_MB=5
```

## 7. Troubleshooting

### Database Connection Issues

**Problem:** Can't connect to Supabase
**Solutions:**
1. Check if project is paused (free tier)
2. Verify password is URL-encoded
3. Check firewall/network settings
4. Ensure you're using the correct connection string from Supabase dashboard

### File Upload Issues

**Problem:** Files not uploading during registration
**Solutions:**
1. Check `uploads/` directory exists and has write permissions
2. Verify `MAX_FILE_SIZE_MB` in `.env`
3. Check file MIME types are allowed
4. Ensure multipart/form-data is being sent

### RBAC Issues

**Problem:** Getting 403 Forbidden errors
**Solutions:**
1. Verify JWT token is valid
2. Check user role in token payload
3. Ensure permission is defined in `PERMISSIONS` object
4. Check middleware order in routes

## 8. Next Steps

1. **Activate Supabase Project** - Resume your project if paused
2. **Run Migration** - Execute `npm run prisma:push`
3. **Test Registration** - Try creating admin and intern accounts
4. **Test RBAC** - Verify role-based access works correctly
5. **Configure Storage** - Consider using Supabase Storage for files instead of local filesystem
6. **Set up Monitoring** - Use Supabase dashboard to monitor database performance

## 9. Production Deployment Checklist

- [ ] Database migrated to Supabase
- [ ] Environment variables configured
- [ ] JWT secrets are strong and unique
- [ ] CORS origins properly configured
- [ ] File upload limits set appropriately
- [ ] RBAC tested for all roles
- [ ] Error handling tested
- [ ] Logging configured
- [ ] Rate limiting implemented
- [ ] HTTPS enabled
- [ ] Database backups configured in Supabase

## Support

If you encounter issues:
1. Check Supabase project status
2. Review application logs
3. Verify environment variables
4. Test database connection directly
5. Check Prisma schema matches database

---

**Summary of Changes Made:**
1. ✅ Updated DATABASE_URL to use Supabase
2. ✅ Fixed file upload transaction consistency
3. ✅ Implemented comprehensive RBAC system
4. ✅ Added feature-level permissions
5. ✅ Updated routes with permission checks
6. ✅ Added user management endpoints
7. ✅ Created migration guide
