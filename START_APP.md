# 🚀 Quick Start Guide

## Start the Application (2 Commands)

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

Wait for:
```
✅ Database connected
✅ InternFlow API running on http://localhost:4000
```

### Terminal 2 - Frontend
```bash
npm run dev
```

Wait for:
```
✅ Local: http://localhost:5174/
```

### Open Browser
Go to: **http://localhost:5174**

---

## Test Credentials

### Admin Account
- Email: `admin@company.com`
- Password: (your admin password)

### Intern Account
- Email: `intern@example.com`
- Password: (your intern password)

---

## What Should Work Now

✅ Login without redirect loops
✅ Page refresh maintains session
✅ All API calls work
✅ No database connection errors
✅ Token auto-refresh after 15 minutes
✅ Smooth navigation

---

## If Something Goes Wrong

### Backend won't start?
```bash
cd backend
npx prisma generate
npm run dev
```

### Frontend shows errors?
```bash
# Clear cache and restart
rm -rf node_modules/.vite
npm run dev
```

### Database connection fails?
Check if Supabase database is paused:
1. Go to https://supabase.com/dashboard
2. Select your project
3. Click "Resume Database" if paused
4. Wait 30-60 seconds
5. Restart backend

### Still having issues?
Read the detailed guides:
- [ALL_ISSUES_FIXED.md](./ALL_ISSUES_FIXED.md) - Complete fix summary
- [AUTH_REDIRECT_LOOP_FIX.md](./AUTH_REDIRECT_LOOP_FIX.md) - Auth issues
- [CONNECTION_FIXED.md](./CONNECTION_FIXED.md) - Database issues

---

## Quick Test Checklist

After starting both servers:

1. [ ] Login works
2. [ ] Dashboard loads
3. [ ] Refresh page (Cmd+R) - stays logged in
4. [ ] Navigate to different pages
5. [ ] All data loads correctly
6. [ ] No errors in browser console
7. [ ] No errors in backend terminal

If all checked ✅ - You're good to go!

---

**Need Help?** Check the detailed documentation in the root folder.
