# 🧪 Quick Test Guide - Intern Features

## Prerequisites

✅ Backend running on http://localhost:4000
✅ Frontend running on http://localhost:5174
✅ Database connected to Supabase

---

## Step 1: Create Test Accounts (5 minutes)

### Create Admin Account

1. Go to http://localhost:5174/signup
2. Select "Company Admin"
3. Fill in:
   - Company Name: Test Corp
   - Admin Name: Test Admin
   - Email: admin@test.com
   - Password: Test123!@#
   - Phone: +1234567890
4. Click "Create Account"
5. **Save the admin credentials!**

### Create Intern Account

1. Go to http://localhost:5174/signup
2. Select "Intern"
3. Fill in all required fields:
   - Full Name: Test Intern
   - Email: intern@test.com
   - Password: Test123!@#
   - Phone: +1234567890
   - College: MIT
   - Degree: B.Tech
   - Branch: Computer Science
   - Skills: JavaScript, React, Node.js
   - Internship Role: Full Stack Developer
   - Start Date: 2024-06-01
   - End Date: 2024-08-31
   - Upload Resume (PDF)
   - Upload Profile Photo (JPG/PNG)
4. Click "Create Account"
5. **Save the intern credentials!**

---

## Step 2: Get Intern ID (2 minutes)

### Method 1: Via API

```bash
# Login as intern
curl -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "intern@test.com",
    "password": "Test123!@#"
  }'

# Look for "intern" object in response
# Copy the "id" field from intern object (NOT user.id)
```

### Method 2: Via Frontend

1. Login as intern at http://localhost:5174/login
2. Open browser console (F12)
3. Run: `localStorage.getItem("user")`
4. Look for `intern.id` in the JSON
5. Copy that ID

**Example:**
```json
{
  "id": "user-uuid-here",
  "intern": {
    "id": "THIS-IS-THE-INTERN-ID-YOU-NEED",
    "fullName": "Test Intern"
  }
}
```

---

## Step 3: Create Assignment (3 minutes)

### Via API (Recommended)

```bash
# 1. Login as admin
ADMIN_TOKEN=$(curl -s -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "Test123!@#"
  }' | jq -r '.data.tokens.accessToken')

# 2. Create assignment (replace INTERN_ID)
curl -X POST http://localhost:4000/api/v1/assignments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "internId": "PASTE-INTERN-ID-HERE",
    "title": "Frontend Development Project",
    "department": "Engineering",
    "startDate": "2024-06-01",
    "endDate": "2024-08-31",
    "notes": "Build user dashboard and profile pages"
  }'
```

### Expected Response

```json
{
  "success": true,
  "message": "Assignment created successfully",
  "data": {
    "id": "assignment-uuid",
    "title": "Frontend Development Project",
    "status": "PENDING",
    ...
  }
}
```

---

## Step 4: Verify in Intern Dashboard (1 minute)

1. **Login as intern** at http://localhost:5174/login
   - Email: intern@test.com
   - Password: Test123!@#

2. **Check Dashboard** (http://localhost:5174/intern)
   - Should see "1" in Assignments card
   - Should see assignment in "My Tasks" section (if it has tasks)

3. **Check My Tasks** (http://localhost:5174/intern/tasks)
   - Should see the assignment listed
   - Should show "0 active tasks" (no tasks created yet)

4. **Check Updates** (http://localhost:5174/intern/updates)
   - Should see the assignment card
   - Should show assignment details

---

## Step 5: Create More Test Data (Optional)

### Create Another Assignment

```bash
curl -X POST http://localhost:4000/api/v1/assignments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "internId": "INTERN_ID",
    "title": "Backend API Development",
    "department": "Engineering",
    "startDate": "2024-07-01",
    "endDate": "2024-09-30",
    "notes": "Build REST APIs for the application"
  }'
```

### Verify Multiple Assignments

1. Refresh intern dashboard
2. Should now see "2" in Assignments card
3. Both assignments should appear in Updates page

---

## ✅ Success Checklist

- [ ] Admin account created
- [ ] Intern account created
- [ ] Got intern ID
- [ ] Created assignment via API
- [ ] Assignment shows in intern dashboard
- [ ] Assignment shows in My Tasks page
- [ ] Assignment shows in Updates page
- [ ] Stats are correct (assignment count)
- [ ] No errors in browser console
- [ ] No errors in backend logs

---

## 🐛 Common Issues

### Issue: "Invalid intern ID"
**Solution:** Make sure you're using `intern.id` not `user.id`

### Issue: "403 Forbidden"
**Solution:** Make sure you're using admin token, not intern token

### Issue: "Assignment not showing"
**Solution:** 
1. Refresh the page
2. Check browser console for errors
3. Verify API call succeeded
4. Check you're logged in as the correct intern

### Issue: "Network Error"
**Solution:**
1. Check backend is running: `curl http://localhost:4000/api/v1/health`
2. Check frontend .env has correct API URL
3. Check CORS is configured

---

## 📊 What You Should See

### Intern Dashboard
```
Welcome, Test 👋
You have 0 active tasks and 1 assignments.

┌─────────────────┐  ┌─────────────────┐
│ Active Tasks: 0 │  │ Completed: 0    │
└─────────────────┘  └─────────────────┘
┌─────────────────┐  ┌─────────────────┐
│ Assignments: 1  │  │ Badges: 0       │
└─────────────────┘  └─────────────────┘

My Tasks
┌────────────────────────────────────────┐
│ No active tasks yet                    │
│ Tasks will appear here when assigned   │
└────────────────────────────────────────┘
```

### My Tasks Page
```
My Tasks
0 active tasks, 0 completed

┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ Active: 0       │  │ Completed: 0    │  │ Assignments: 1  │
└─────────────────┘  └─────────────────┘  └─────────────────┘

┌────────────────────────────────────────┐
│ No tasks yet                           │
│ Tasks will appear when admin assigns   │
└────────────────────────────────────────┘
```

### Updates Page
```
Daily Updates
Track your progress and share updates

Your Assignments
┌────────────────────────────────────────┐
│ PENDING  Engineering                   │
│ Frontend Development Project           │
│ Test Corp                              │
│ 📅 6/1/2024 - 8/31/2024 • 0 tasks    │
│ Build user dashboard and profile pages │
│                        [View Details]  │
└────────────────────────────────────────┘
```

---

## 🎯 Next Steps After Testing

1. **Create more assignments** to test multiple items
2. **Test with different data** (dates, departments, notes)
3. **Test error cases** (invalid data, missing fields)
4. **Add tasks** (need Tasks API - coming next)
5. **Test notifications** (need Notifications UI)

---

## 📞 Need Help?

If something doesn't work:

1. **Check backend logs** in terminal
2. **Check browser console** (F12)
3. **Check Network tab** for failed requests
4. **Verify database** has the data
5. **Check authentication** tokens are valid

---

## 🎉 You're Done!

If you can see the assignment in the intern dashboard, **everything is working!**

The frontend is now successfully connected to the backend, and data flows dynamically between admin and intern.

**Next:** Add more features like Tasks, Progress tracking, and Notifications!
