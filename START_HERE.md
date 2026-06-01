# 🎯 START HERE - InternFlow AI

## ⚡ Super Quick Start (3 Commands)

### Method 1: Using Scripts (Easiest)

**Terminal 1 - Backend:**
```bash
./start-backend.sh
```

**Terminal 2 - Frontend:**
```bash
./start-frontend.sh
```

### Method 2: Manual Commands

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

---

## 🌐 Open the App

Once both servers are running, open your browser:

👉 **http://localhost:5174**

---

## ✅ What's Already Done

- ✅ Node.js v25.2.1 installed
- ✅ npm v11.6.2 installed
- ✅ All dependencies installed
- ✅ Environment variables configured
- ✅ Database connected (Supabase)
- ✅ Prisma Client generated

**You're ready to run!**

---

## 🔐 Create Test Accounts

### Option 1: Via UI
1. Go to http://localhost:5174
2. Click "Register" or "Sign Up"
3. Fill in the form

### Option 2: Via API (Quick)

**Create Admin:**
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

**Create Intern:**
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

Then login at http://localhost:5174 with:
- Email: `admin@test.com` or `intern@test.com`
- Password: `Admin123!` or `Intern123!`

---

## 📊 View Database (Optional)

Open Prisma Studio to see your data:

```bash
cd backend
npm run prisma:studio
```

Opens at: http://localhost:5555

---

## 🐛 Quick Troubleshooting

### Backend won't start?
```bash
cd backend
npx prisma generate
npm run dev
```

### Frontend shows errors?
```bash
rm -rf node_modules/.vite
npm run dev
```

### Port already in use?
```bash
# Kill backend (port 4000)
lsof -ti:4000 | xargs kill -9

# Kill frontend (port 5174)
lsof -ti:5174 | xargs kill -9
```

---

## 📚 More Documentation

- **HOW_TO_RUN.md** - Detailed setup guide (recommended)
- **QUICK_START.md** - API examples and testing
- **ALL_FEATURES_COMPLETE.md** - Feature list
- **VISUAL_TEST_GUIDE.md** - Testing guide

---

## 🎉 Success Indicators

You'll know it's working when you see:

**Backend Terminal:**
```
✅ Database connected
✅ InternFlow API running on http://localhost:4000
```

**Frontend Terminal:**
```
➜  Local:   http://localhost:5174/
```

**Browser:**
- Login page loads
- No errors in console (F12)
- Can login and navigate

---

## 💡 Pro Tips

1. **Keep both terminals open** - You need both servers
2. **Use Prisma Studio** - Easy database management
3. **Check browser console** - Press F12 for errors
4. **Hot reload works** - Changes auto-refresh

---

## 🆘 Still Need Help?

Read the detailed guide:
```bash
open HOW_TO_RUN.md
```

Or check the troubleshooting section in **HOW_TO_RUN.md**

---

**Ready? Let's go! 🚀**

Run the commands above and you'll be up in 30 seconds!
