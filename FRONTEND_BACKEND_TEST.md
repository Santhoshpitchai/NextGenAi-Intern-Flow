# Frontend-Backend Connection Test

## ✅ Status Check

### Backend Server
- **Status:** 🟢 Running
- **URL:** http://localhost:4000
- **API Base:** http://localhost:4000/api/v1
- **CORS:** ✅ Configured for http://localhost:5173

### Frontend Server
- **Status:** 🟢 Running
- **URL:** http://localhost:5173
- **API Config:** http://localhost:4000/api/v1

### Connection Test Results
- ✅ Backend is responding
- ✅ CORS headers are correct
- ✅ API endpoints are accessible

---

## 🔍 Troubleshooting Network Errors

If you're seeing network errors in the frontend, try these steps:

### 1. Check Browser Console

Open your browser's Developer Tools (F12) and check:

**Console Tab:**
- Look for any error messages
- Check if API calls are being made
- Verify the request URL

**Network Tab:**
- Filter by "XHR" or "Fetch"
- Look for failed requests (red)
- Click on a failed request to see details
- Check the "Headers" tab for request/response info

### 2. Common Issues & Solutions

#### Issue: "Network Error" or "ERR_CONNECTION_REFUSED"

**Cause:** Backend server is not running

**Solution:**
```bash
cd backend
npm run dev
```

#### Issue: "CORS Error"

**Cause:** CORS not configured properly

**Solution:** Already configured! Backend `.env` has:
```env
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

#### Issue: "404 Not Found"

**Cause:** Wrong API endpoint or route not defined

**Solution:** Check the endpoint exists in backend routes

#### Issue: "401 Unauthorized"

**Cause:** Missing or invalid authentication token

**Solution:** This is normal for protected endpoints. Login first!

#### Issue: "500 Internal Server Error"

**Cause:** Backend error (database, code issue)

**Solution:** Check backend terminal for error logs

---

## 🧪 Manual API Tests

### Test 1: Health Check (No Auth Required)

```bash
curl http://localhost:4000/api/v1/auth/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test"}'
```

**Expected:** 401 Unauthorized (normal - user doesn't exist)

### Test 2: Register Admin

```bash
curl -X POST http://localhost:4000/api/v1/auth/register/admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "Test123!@#",
    "phone": "+1234567890",
    "companyName": "Test Company",
    "adminName": "Test Admin"
  }'
```

**Expected:** 201 Created with user data and tokens

### Test 3: Login

```bash
curl -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "Test123!@#"
  }'
```

**Expected:** 200 OK with tokens

---

## 🌐 Test from Browser Console

Open your frontend (http://localhost:5173) and paste this in the browser console:

### Test API Connection

```javascript
// Test 1: Check if API is reachable
fetch('http://localhost:4000/api/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'test@test.com', password: 'test' })
})
.then(r => r.json())
.then(d => console.log('API Response:', d))
.catch(e => console.error('API Error:', e));

// Test 2: Check environment variable
console.log('API URL from env:', import.meta.env.VITE_API_URL);

// Test 3: Test with axios (if available)
// This uses your app's configured axios instance
import { apiClient } from './src/lib/api/client';
apiClient.post('/auth/login', { email: 'test@test.com', password: 'test' })
  .then(r => console.log('Axios Response:', r))
  .catch(e => console.error('Axios Error:', e));
```

---

## 📋 Checklist

Before reporting a network error, verify:

- [ ] Backend server is running (`npm run dev` in backend folder)
- [ ] Frontend server is running (should already be running)
- [ ] Backend shows "Database connected" message
- [ ] Backend shows "InternFlow API running on http://localhost:4000"
- [ ] No errors in backend terminal
- [ ] Browser console shows no CORS errors
- [ ] `.env` file exists in root with `VITE_API_URL=http://localhost:4000/api/v1`

---

## 🔧 Quick Fixes

### Restart Backend
```bash
# Stop backend (Ctrl+C in backend terminal)
cd backend
npm run dev
```

### Restart Frontend
```bash
# Stop frontend (Ctrl+C in frontend terminal)
npm run dev
```

### Clear Browser Cache
1. Open DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

### Check Environment Variables
```bash
# In root directory
cat .env

# Should show:
# VITE_API_URL=http://localhost:4000/api/v1
```

---

## 📸 What to Check in Browser DevTools

### Network Tab
1. Open DevTools (F12)
2. Go to "Network" tab
3. Try to login or register
4. Look for requests to `localhost:4000`
5. Click on a failed request
6. Check:
   - **Status:** Should be 200, 201, 400, 401, etc. (not "failed")
   - **Headers → Request URL:** Should be `http://localhost:4000/api/v1/...`
   - **Headers → Request Headers:** Should include `Content-Type: application/json`
   - **Response:** Check the error message

### Console Tab
Look for errors like:
- ❌ `net::ERR_CONNECTION_REFUSED` → Backend not running
- ❌ `CORS policy` → CORS issue (shouldn't happen, already configured)
- ❌ `Network Error` → Backend not reachable
- ✅ `401 Unauthorized` → Normal for wrong credentials
- ✅ `400 Bad Request` → Normal for validation errors

---

## 🎯 Expected Behavior

### Registration Flow
1. User fills form
2. Frontend sends POST to `/api/v1/auth/register/admin` or `/intern`
3. Backend validates data
4. Backend creates user in database
5. Backend returns user data + tokens
6. Frontend stores tokens
7. Frontend redirects to dashboard

### Login Flow
1. User enters email/password
2. Frontend sends POST to `/api/v1/auth/login`
3. Backend validates credentials
4. Backend returns user data + tokens
5. Frontend stores tokens
6. Frontend redirects to dashboard

---

## 🚨 If Still Having Issues

### Collect This Information:

1. **Backend Terminal Output:**
   ```
   [Copy the last 20 lines from backend terminal]
   ```

2. **Browser Console Errors:**
   ```
   [Copy any red errors from browser console]
   ```

3. **Network Tab Details:**
   - Request URL: 
   - Status Code:
   - Response:

4. **What You're Trying to Do:**
   - [ ] Register as Admin
   - [ ] Register as Intern
   - [ ] Login
   - [ ] Other: ___________

### Quick Diagnostic Script

Run this in your terminal:

```bash
# Check if backend is running
curl -s http://localhost:4000/api/v1/auth/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"test","password":"test"}' \
  | jq '.' || echo "Backend not responding"

# Check environment
echo "Frontend .env:"
cat .env

echo "\nBackend .env (DATABASE_URL only):"
grep DATABASE_URL backend/.env
```

---

## ✅ Everything Should Be Working

Based on the tests:
- ✅ Backend is running on port 4000
- ✅ Frontend is running on port 5173
- ✅ CORS is configured correctly
- ✅ API endpoints are responding
- ✅ Database is connected

**If you're still seeing network errors, please:**
1. Open browser DevTools (F12)
2. Go to Network tab
3. Try the action that's failing
4. Take a screenshot of the failed request
5. Share the error message from Console tab

The connection is working - the issue might be:
- Specific endpoint error
- Validation error
- Authentication error
- Form data format issue

These are different from "network errors" and have specific solutions!
