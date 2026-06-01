# 🚀 How to Run InternFlow AI Project

## Project Overview
**InternFlow AI** is a full-stack internship management platform with:
- **Frontend**: TanStack Start (React) + Vite + TailwindCSS
- **Backend**: Node.js + Express + Prisma ORM
- **Database**: Supabase (PostgreSQL)

---

## ✅ Prerequisites Check

You already have:
- ✅ Node.js v25.2.1
- ✅ npm v11.6.2
- ✅ Dependencies installed

---

## 🎯 Quick Start (2 Steps)

### Step 1: Start Backend Server

Open **Terminal 1** and run:

```bash
cd "/Users/santhoshpitchai/Desktop/Intern-Flow Ai/internflow-ai/backend"
npm run dev
```

**Expected Output:**
```
✅ Database connected
✅ InternFlow API running on http://localhost:4000
```

**Backend will run on:** http://localhost:4000

---

### Step 2: Start Frontend Server

Open **Terminal 2** and run:

```bash
cd "/Users/santhoshpitchai/Desktop/Intern-Flow Ai/internflow-ai"
npm run dev
```

**Expected Output:**
```
VITE v7.x.x  ready in xxx ms

➜  Local:   http://localhost:5174/
➜  Network: use --host to expose
```

**Frontend will run on:** http://localhost:5174

---

## 🌐 Access the Application

1. Open your browser
2. Go to: **http://localhost:5174**
3. You should see the InternFlow login page

---

## 🔐 Test Accounts

### Option 1: Create New Accounts

#### Register as Admin:
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

#### Register as Intern:
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

### Option 2: Use Existing Accounts
Check if you already have accounts in the database.

---

## 📋 Available Scripts

### Frontend Commands:
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

### Backend Commands:
```bash
cd backend
npm run dev              # Start development server
npm run build            # Build TypeScript
npm run start            # Start production server
npm run prisma:push      # Push schema to database
npm run prisma:studio    # Open Prisma Studio (Database GUI)
npm run prisma:generate  # Generate Prisma Client
```

---

## 🔧 Environment Variables

### Frontend `.env` (Already configured):
```env
VITE_API_URL=http://localhost:4000/api/v1
```

### Backend `.env` (Check if configured):
Located at: `backend/.env`

Should contain:
```env
DATABASE_URL=your_supabase_connection_string
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
PORT=4000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173,http://localhost:5174,http://localhost:3000
```

---

## 🎨 Features Available

### For Admins:
- ✅ Dashboard with analytics
- ✅ Manage interns
- ✅ Create assignments
- ✅ Create and assign tasks
- ✅ View performance metrics
- ✅ User management

### For Interns:
- ✅ Personal dashboard
- ✅ View assigned tasks
- ✅ Update task progress
- ✅ View assignments
- ✅ Performance tracking
- ✅ Calendar view
- ✅ Submit requests
- ✅ Chat interface

---

## 🐛 Troubleshooting

### Problem: Backend won't start

**Solution 1:** Regenerate Prisma Client
```bash
cd backend
npx prisma generate
npm run dev
```

**Solution 2:** Check Database Connection
```bash
cd backend
node test-supabase-connection.js
```

---

### Problem: Frontend shows "Network Error"

**Check:**
1. Backend is running on http://localhost:4000
2. CORS is configured in `backend/.env`:
   ```env
   CORS_ORIGIN=http://localhost:5173,http://localhost:5174,http://localhost:3000
   ```

---

### Problem: Database connection fails

**Possible causes:**
1. Supabase database is paused
   - Go to https://supabase.com/dashboard
   - Resume your database
   - Wait 30-60 seconds
   - Restart backend

2. Invalid DATABASE_URL
   - Check `backend/.env`
   - Verify connection string is correct

---

### Problem: Port already in use

**Frontend (5174):**
```bash
# Find and kill process
lsof -ti:5174 | xargs kill -9
# Then restart
npm run dev
```

**Backend (4000):**
```bash
# Find and kill process
lsof -ti:4000 | xargs kill -9
# Then restart
cd backend && npm run dev
```

---

### Problem: "Module not found" errors

**Reinstall dependencies:**

Frontend:
```bash
rm -rf node_modules package-lock.json
npm install
```

Backend:
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
npx prisma generate
```

---

## 📊 Database Management

### Open Prisma Studio (Database GUI):
```bash
cd backend
npm run prisma:studio
```

This opens a web interface at http://localhost:5555 where you can:
- View all tables
- Add/edit/delete records
- Inspect relationships

---

## 🧪 Testing the Application

### 1. Test Backend Health:
```bash
curl http://localhost:4000/api/v1/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-06-01T..."
}
```

### 2. Test Login:
```bash
curl -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "Admin123!"
  }'
```

### 3. Test Frontend:
1. Open http://localhost:5174
2. Login with test credentials
3. Navigate through different pages
4. Check browser console for errors (F12)

---

## 📁 Project Structure

```
internflow-ai/
├── backend/                 # Backend API
│   ├── src/
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/     # Auth, validation, etc.
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── index.ts        # Entry point
│   ├── prisma/
│   │   └── schema.prisma   # Database schema
│   └── package.json
│
├── src/                     # Frontend source
│   ├── routes/             # Page routes
│   ├── components/         # React components
│   ├── lib/                # Utilities
│   └── styles/             # CSS/Tailwind
│
├── public/                  # Static assets
├── .env                     # Frontend environment
└── package.json             # Frontend dependencies
```

---

## 🔗 Important URLs

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:5174 | Main application |
| Backend API | http://localhost:4000 | REST API |
| API Health | http://localhost:4000/api/v1/health | Health check |
| Prisma Studio | http://localhost:5555 | Database GUI |

---

## 📚 Additional Documentation

- `QUICK_START.md` - Quick start guide with API examples
- `START_APP.md` - Simple startup instructions
- `ALL_FEATURES_COMPLETE.md` - Complete feature list
- `VISUAL_TEST_GUIDE.md` - Detailed testing guide
- `backend/README.md` - Backend-specific documentation

---

## 🎉 Success Checklist

After starting both servers, verify:

- [ ] Backend running on http://localhost:4000
- [ ] Frontend running on http://localhost:5174
- [ ] Can access login page
- [ ] Can login with test account
- [ ] Dashboard loads without errors
- [ ] Can navigate between pages
- [ ] No errors in browser console (F12)
- [ ] No errors in backend terminal

If all checked ✅ - **You're ready to develop!**

---

## 💡 Development Tips

1. **Keep both terminals open** - You need both servers running
2. **Check browser console** - Press F12 to see errors
3. **Use Prisma Studio** - Easy way to manage database
4. **Hot reload enabled** - Changes auto-refresh
5. **API documentation** - Check `QUICK_START.md` for all endpoints

---

## 🆘 Need Help?

1. Check the error message in terminal
2. Look at browser console (F12)
3. Review the troubleshooting section above
4. Check existing documentation files
5. Verify environment variables are set correctly

---

**Happy Coding! 🚀**
