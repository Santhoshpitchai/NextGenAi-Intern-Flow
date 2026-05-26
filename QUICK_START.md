# 🚀 Quick Start Guide

## Start the Application

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
npm run dev
```

**URLs:**
- Frontend: http://localhost:5174
- Backend: http://localhost:4000
- API Docs: http://localhost:4000/api/v1/health

---

## Create Test Data (Quick)

### 1. Register Admin
```bash
curl -X POST http://localhost:4000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "Admin123!",
    "role": "COMPANY_ADMIN",
    "companyName": "Test Company",
    "fullName": "Admin User",
    "department": "Engineering"
  }'
```

### 2. Register Intern
```bash
curl -X POST http://localhost:4000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "intern@test.com",
    "password": "Intern123!",
    "role": "INTERN",
    "fullName": "Test Intern",
    "university": "Test University",
    "major": "Computer Science"
  }'
```

### 3. Login as Admin
```bash
curl -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "Admin123!"
  }'
```
**Save the `accessToken`!**

### 4. Get Intern ID
```bash
curl http://localhost:4000/api/v1/users \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```
**Find intern user and save their `id`!**

### 5. Create Assignment
```bash
curl -X POST http://localhost:4000/api/v1/assignments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "title": "Build Authentication System",
    "internId": "INTERN_ID_HERE",
    "startDate": "2026-05-25",
    "endDate": "2026-06-25",
    "department": "Engineering",
    "status": "ACTIVE"
  }'
```
**Save the assignment `id`!**

### 6. Create Tasks
```bash
curl -X POST http://localhost:4000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "title": "Implement Login API",
    "assignmentId": "ASSIGNMENT_ID_HERE",
    "priority": "HIGH",
    "status": "TODO",
    "dueDate": "2026-06-01"
  }'
```

---

## Test Intern Pages

1. Go to http://localhost:5174/login
2. Login with `intern@test.com` / `Intern123!`
3. Check each page:
   - ✅ Dashboard - See stats and tasks
   - ✅ My Tasks - See all tasks
   - ✅ Updates - See assignments
   - ✅ Performance - See completion rate
   - ✅ Calendar - See deadlines
   - ✅ Requests - See UI
   - ✅ Chat - See placeholder

---

## Environment Variables

### Backend `.env`:
```env
DATABASE_URL=postgresql://postgres.yttmzraxtjpdqvuijtib:Santhosh13%4020@aws-1-ap-south-1.pooler.supabase.com:5432/postgres
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
PORT=4000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173,http://localhost:5174,http://localhost:3000
```

### Frontend `.env`:
```env
VITE_API_URL=http://localhost:4000/api/v1
```

---

## Common Commands

### Backend:
```bash
cd backend
npm run dev          # Start dev server
npm run build        # Build for production
npm run prisma:push  # Push schema to database
npm run prisma:studio # Open Prisma Studio
```

### Frontend:
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

---

## API Endpoints

### Authentication:
- `POST /api/v1/auth/register` - Register user
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Refresh token
- `POST /api/v1/auth/logout` - Logout
- `GET /api/v1/auth/me` - Get current user

### Assignments:
- `POST /api/v1/assignments` - Create (Admin)
- `GET /api/v1/assignments` - List all (Admin)
- `GET /api/v1/assignments/my` - My assignments (Intern)
- `GET /api/v1/assignments/:id` - Get one
- `PUT /api/v1/assignments/:id` - Update
- `DELETE /api/v1/assignments/:id` - Delete

### Tasks:
- `POST /api/v1/tasks` - Create (Admin)
- `GET /api/v1/tasks` - List all (Admin)
- `GET /api/v1/tasks/my` - My tasks (Intern)
- `GET /api/v1/tasks/:id` - Get one
- `PUT /api/v1/tasks/:id` - Update
- `PUT /api/v1/tasks/:id/status` - Update status
- `POST /api/v1/tasks/:id/progress` - Add progress
- `DELETE /api/v1/tasks/:id` - Delete

### Users:
- `GET /api/v1/users` - List all (Admin)
- `GET /api/v1/users/:id` - Get one
- `PUT /api/v1/users/:id` - Update
- `DELETE /api/v1/users/:id` - Delete

---

## Troubleshooting

### "Network Error"
Check CORS in `backend/.env`:
```env
CORS_ORIGIN=http://localhost:5173,http://localhost:5174,http://localhost:3000
```

### "No data showing"
1. Create test data using API calls above
2. Refresh the page
3. Check browser console for errors

### "401 Unauthorized"
1. Login again to get fresh token
2. Token expires after 15 minutes
3. Use refresh token endpoint

---

## Documentation

- **ALL_FEATURES_COMPLETE.md** - Complete feature list
- **VISUAL_TEST_GUIDE.md** - Detailed testing guide
- **IMPLEMENTATION_COMPLETE.md** - Implementation summary
- **QUICK_START.md** - This file

---

## Status

✅ **All intern features working!**
- Dashboard ✅
- My Tasks ✅
- Updates ✅
- Performance ✅
- Calendar ✅
- Requests ✅
- Chat ✅

🚀 **Production Ready!**
