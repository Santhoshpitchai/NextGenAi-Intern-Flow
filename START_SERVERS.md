# 🚀 How to Start Frontend and Backend Together

## Current Status

✅ **Backend:** Running on http://localhost:4000
✅ **Frontend:** Running on http://localhost:5174
✅ **Database:** Connected to Supabase
✅ **CORS:** Configured for ports 5173, 5174, 3000

---

## 📁 Project Structure

Your project has this structure:
```
internflow-ai/
├── backend/          # Backend API (Node.js + Express + Prisma)
├── src/              # Frontend source (React + Vite)
├── .env              # Frontend environment variables
└── package.json      # Frontend package.json
```

**Note:** There is NO separate "frontend" folder. The frontend is in the root directory!

---

## 🎯 How to Start Both Servers

### Option 1: Two Separate Terminals (Recommended)

**Terminal 1 - Backend:**
```bash
cd /Users/santhoshpitchai/Desktop/Intern-Flow\ Ai/internflow-ai/backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd /Users/santhoshpitchai/Desktop/Intern-Flow\ Ai/internflow-ai
npm run dev
```

### Option 2: Using One Terminal with Background Process

```bash
# Start backend in background
cd backend && npm run dev &

# Start frontend in foreground
cd .. && npm run dev
```

### Option 3: Using tmux (Advanced)

```bash
# Create new tmux session
tmux new -s internflow

# Split window horizontally
Ctrl+B then "

# In top pane - start backend
cd backend && npm run dev

# Switch to bottom pane
Ctrl+B then down arrow

# In bottom pane - start frontend
npm run dev
```

---

## ✅ Verify Everything is Running

### Check Backend
```bash
curl http://localhost:4000/api/v1/auth/me
```
**Expected:** 401 Unauthorized (this is good - means API is working)

### Check Frontend
Open browser: http://localhost:5174

### Check Connection
Open browser console (F12) and run:
```javascript
fetch('http://localhost:4000/api/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'test', password: 'test' })
})
.then(r => r.json())
.then(d => console.log('✅ Connected:', d))
.catch(e => console.error('❌ Error:', e));
```

---

## 🔧 Restart Backend (to apply CORS changes)

The backend needs to be restarted to pick up the new CORS configuration for port 5174.

**In your backend terminal:**
1. Press `Ctrl+C` to stop the server
2. Run `npm run dev` again

Or run this command:
```bash
# Kill backend process and restart
pkill -f "tsx watch src/server.ts"
cd backend && npm run dev
```

---

## 📝 Current Configuration

### Backend (.env in backend folder)
```env
PORT=4000
DATABASE_URL=postgresql://postgres.yttmzraxtjpdqvuijtib:Santhosh13%4020@aws-1-ap-south-1.pooler.supabase.com:5432/postgres
CORS_ORIGIN=http://localhost:5173,http://localhost:5174,http://localhost:3000
```

### Frontend (.env in root folder)
```env
VITE_API_URL=http://localhost:4000/api/v1
```

---

## 🐛 Troubleshooting

### Issue: "Port 5173 is in use"
**Solution:** Frontend automatically uses 5174 (already handled)

### Issue: "Port 4000 is in use"
**Solution:** Kill the process and restart
```bash
lsof -ti:4000 | xargs kill -9
cd backend && npm run dev
```

### Issue: "Network Error" in frontend
**Solutions:**
1. Make sure backend is running
2. Restart backend to apply CORS changes
3. Clear browser cache (Ctrl+Shift+R)
4. Check browser console for specific error

### Issue: "CORS Error"
**Solution:** Restart backend (it needs to reload the .env file)
```bash
# In backend terminal
Ctrl+C
npm run dev
```

---

## 🎯 Quick Start Commands

### Start Everything Fresh

```bash
# Terminal 1 - Backend
cd ~/Desktop/Intern-Flow\ Ai/internflow-ai/backend
npm run dev

# Terminal 2 - Frontend (in new terminal)
cd ~/Desktop/Intern-Flow\ Ai/internflow-ai
npm run dev
```

### Stop Everything

```bash
# Stop backend
pkill -f "tsx watch src/server.ts"

# Stop frontend
pkill -f "vite dev"
```

---

## 📊 Expected Output

### Backend Terminal Should Show:
```
Database connected
InternFlow API running on http://localhost:4000
API base: http://localhost:4000/api/v1
Environment: development
```

### Frontend Terminal Should Show:
```
VITE v7.3.3  ready in 1173 ms
➜  Local:   http://localhost:5174/
➜  Network: use --host to expose
```

---

## ✅ Final Checklist

- [ ] Backend running on port 4000
- [ ] Frontend running on port 5174 (or 5173)
- [ ] Backend shows "Database connected"
- [ ] Can access http://localhost:5174 in browser
- [ ] No CORS errors in browser console
- [ ] Can see login/register page

---

## 🚨 Important Notes

1. **No "frontend" folder** - The frontend code is in the root `src/` directory
2. **Backend must be restarted** after changing .env file
3. **Frontend auto-reloads** when you change code
4. **Backend auto-reloads** when you change code (using tsx watch)
5. **Port 5174 is now configured** in backend CORS

---

## 🎉 You're All Set!

Both servers are running:
- **Backend API:** http://localhost:4000/api/v1
- **Frontend App:** http://localhost:5174

**Next Step:** Restart your backend server to apply the CORS changes for port 5174!

```bash
# In your backend terminal, press Ctrl+C then run:
npm run dev
```

Then refresh your browser and the network error should be gone! 🚀
