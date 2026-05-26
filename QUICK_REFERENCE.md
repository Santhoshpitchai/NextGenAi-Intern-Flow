# 🚀 Quick Reference - InternFlow AI

## 📊 Current Status

| Component | Status | URL |
|-----------|--------|-----|
| Backend | 🟢 Running | http://localhost:4000 |
| Frontend | 🟢 Running | http://localhost:5174 |
| Database | 🟢 Connected | Supabase (ap-south-1) |
| Assignments API | ✅ Ready | /api/v1/assignments |
| Notifications | ✅ Ready | /api/v1/notifications |

---

## 🔑 Test Accounts

Create test accounts with these commands:

```bash
# Admin Account
curl -X POST http://localhost:4000/api/v1/auth/register/admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "Test123!@#",
    "phone": "+1234567890",
    "companyName": "Test Corp",
    "adminName": "Test Admin"
  }'

# Intern Account (requires files)
# Use Postman or frontend to register intern with resume/photo
```

---

## 📡 API Endpoints

### Authentication
```
POST /api/v1/auth/register/admin    - Register admin
POST /api/v1/auth/register/intern   - Register intern (multipart)
POST /api/v1/auth/login             - Login
POST /api/v1/auth/refresh           - Refresh token
POST /api/v1/auth/logout            - Logout
GET  /api/v1/auth/me                - Get current user
```

### Assignments (NEW!)
```
POST   /api/v1/assignments                    - Create (Admin)
GET    /api/v1/assignments                    - List all
GET    /api/v1/assignments/:id                - Get details
PATCH  /api/v1/assignments/:id                - Update (Admin)
DELETE /api/v1/assignments/:id                - Delete (Admin)
GET    /api/v1/assignments/my/assignments     - My assignments (Intern)
```

### Users
```
GET    /api/v1/users/profile       - Get own profile
PATCH  /api/v1/users/profile       - Update profile
GET    /api/v1/users               - Get all users (Admin)
GET    /api/v1/users/:userId       - Get user by ID (Admin)
```

### Uploads
```
POST /api/v1/uploads/resume         - Upload resume (Intern)
POST /api/v1/uploads/profile-photo  - Upload photo (Intern)
```

---

## 🧪 Quick Test

```bash
# 1. Check backend health
curl http://localhost:4000/api/v1/health

# 2. Login
TOKEN=$(curl -s -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"Test123!@#"}' \
  | jq -r '.data.tokens.accessToken')

# 3. Get current user
curl http://localhost:4000/api/v1/auth/me \
  -H "Authorization: Bearer $TOKEN"

# 4. Create assignment (need intern ID first)
curl -X POST http://localhost:4000/api/v1/assignments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "internId": "INTERN_ID_HERE",
    "title": "Test Assignment",
    "startDate": "2024-06-01",
    "endDate": "2024-08-31"
  }'
```

---

## 🎯 Next Steps

1. **Test Backend APIs** ✅ (Ready)
2. **Create Frontend API Clients** (30 min)
3. **Update Frontend Pages** (2 hours)
4. **Add Remaining Modules** (2 hours)
5. **Test End-to-End** (1 hour)

---

## 📁 Key Files

### Backend
- `backend/src/routes/index.ts` - Main routes
- `backend/src/middleware/rbac.middleware.ts` - Permissions
- `backend/src/services/assignment.service.ts` - Assignment logic
- `backend/.env` - Configuration

### Frontend
- `src/lib/api/client.ts` - API client
- `src/services/auth-api.ts` - Auth API
- `src/lib/env.ts` - Environment config
- `.env` - Frontend config

---

## 🔧 Common Commands

```bash
# Backend
cd backend
npm run dev              # Start server
npm run prisma:push      # Migrate database
npm run prisma:studio    # Open database GUI

# Frontend
npm run dev              # Start frontend
npm run build            # Build for production

# Database
node backend/test-supabase-connection.js  # Test connection
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Network Error | Check backend is running on port 4000 |
| 401 Unauthorized | Login again, token expired |
| 403 Forbidden | Wrong role for endpoint |
| CORS Error | Backend CORS configured for 5173, 5174 |
| Database Error | Check Supabase connection |

---

## 📚 Documentation

- **IMPLEMENTATION_SUMMARY.md** - Complete status
- **INTERN_FEATURES_IMPLEMENTATION.md** - Step-by-step guide
- **COMPLETE_API_IMPLEMENTATION.md** - Full API docs
- **RBAC_REFERENCE.md** - Permissions guide
- **START_SERVERS.md** - How to run

---

## 🎉 What's Working

✅ Backend server
✅ Database (Supabase)
✅ Authentication
✅ File uploads
✅ RBAC system
✅ Assignments API
✅ Notifications
✅ CORS configured

## 🔄 What's Next

🔄 Frontend integration
🔄 Tasks API
🔄 Progress API
🔄 Dashboard stats
🔄 Real-time updates

---

**You're ready to start connecting the frontend!** 🚀
