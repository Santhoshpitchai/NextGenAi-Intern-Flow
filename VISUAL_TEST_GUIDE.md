# 🎯 Visual Test Guide - Verify All Features

## Quick 5-Minute Test

### Step 1: Start Servers ✅

```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend  
npm run dev
```

**Expected Output:**
- Backend: `InternFlow API running on http://localhost:4000`
- Frontend: `Local: http://localhost:5174/`

---

### Step 2: Register Accounts ✅

#### Option A: Using UI (Recommended)
1. Go to http://localhost:5174/signup
2. Register as **Admin**:
   - Email: `admin@test.com`
   - Password: `Admin123!`
   - Role: Company Admin
   - Company Name: `Test Company`
   - Full Name: `Admin User`

3. Logout and register as **Intern**:
   - Email: `intern@test.com`
   - Password: `Intern123!`
   - Role: Intern
   - Full Name: `Test Intern`
   - University: `Test University`

#### Option B: Using API
```bash
# Register Admin
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

# Register Intern
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

---

### Step 3: Create Test Data (Admin) ✅

#### Get Admin Token:
```bash
curl -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "Admin123!"
  }'
```

**Save the `accessToken` from response!**

#### Get Intern ID:
```bash
curl http://localhost:4000/api/v1/users \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

**Find the intern user and save their `id`!**

#### Create Assignment:
```bash
curl -X POST http://localhost:4000/api/v1/assignments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "title": "Build Authentication System",
    "internId": "INTERN_USER_ID_HERE",
    "startDate": "2026-05-25",
    "endDate": "2026-06-25",
    "department": "Engineering",
    "status": "ACTIVE",
    "notes": "Implement JWT authentication with refresh tokens"
  }'
```

**Save the assignment `id` from response!**

#### Create Tasks:
```bash
# Task 1 - High Priority
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

# Task 2 - Medium Priority
curl -X POST http://localhost:4000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "title": "Write API Documentation",
    "assignmentId": "ASSIGNMENT_ID_HERE",
    "priority": "MEDIUM",
    "status": "TODO",
    "dueDate": "2026-06-10"
  }'

# Task 3 - Completed
curl -X POST http://localhost:4000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "title": "Setup Development Environment",
    "assignmentId": "ASSIGNMENT_ID_HERE",
    "priority": "HIGH",
    "status": "DONE",
    "dueDate": "2026-05-20",
    "completedAt": "2026-05-20T10:00:00Z"
  }'
```

---

### Step 4: Test Intern Pages ✅

#### Login as Intern:
1. Go to http://localhost:5174/login
2. Email: `intern@test.com`
3. Password: `Intern123!`

#### Test Each Page:

##### 1. Dashboard (`/intern`)
**What to Check:**
- [ ] Shows "Welcome, Test" with intern's first name
- [ ] Active Tasks count shows `2`
- [ ] Completed count shows `1`
- [ ] Assignments count shows `1`
- [ ] Task list shows 2 active tasks with priority badges
- [ ] Each task has "View" and "Update" buttons
- [ ] Productivity chart displays

**Expected:**
```
Welcome, Test 👋
You have 2 active tasks and 1 assignments.

Stats:
- Active Tasks: 2
- Completed: 1
- Assignments: 1
- Badges Earned: 0

My Tasks:
1. Implement Login API (HIGH priority, Due: Jun 1)
2. Write API Documentation (MEDIUM priority, Due: Jun 10)
```

##### 2. My Tasks (`/intern/tasks`)
**What to Check:**
- [ ] Shows "2 active tasks, 1 completed"
- [ ] Stats cards show correct numbers
- [ ] All 3 tasks listed (2 active + 1 completed)
- [ ] Status badges (TODO, DONE)
- [ ] Priority badges (HIGH, MEDIUM)
- [ ] Due dates displayed
- [ ] Assignment name shown
- [ ] Company name shown
- [ ] "Update Progress" and "Mark Done" buttons on active tasks

**Expected:**
```
My Tasks
2 active tasks, 1 completed

Active Tasks: 2
Completed: 1
Assignments: 1

Tasks:
1. Implement Login API
   - Status: TODO | Priority: HIGH
   - Build Authentication System • Test Company
   - Due: Jun 1, 2026

2. Write API Documentation
   - Status: TODO | Priority: MEDIUM
   - Build Authentication System • Test Company
   - Due: Jun 10, 2026

3. Setup Development Environment
   - Status: DONE | Priority: HIGH
   - Build Authentication System • Test Company
   - Completed: May 20, 2026
```

##### 3. Updates (`/intern/updates`)
**What to Check:**
- [ ] Shows "Daily Updates" header
- [ ] "Submit Update" button visible
- [ ] Assignment card displayed
- [ ] Assignment title: "Build Authentication System"
- [ ] Company name: "Test Company"
- [ ] Department badge: "Engineering"
- [ ] Date range shown
- [ ] Task count: "3 tasks"
- [ ] "View Details" button

**Expected:**
```
Daily Updates
Track your progress and share updates with your team

Your Assignments:
- Build Authentication System
  Test Company
  Engineering
  May 25, 2026 - Jun 25, 2026
  3 tasks
```

##### 4. Performance (`/intern/performance`)
**What to Check:**
- [ ] Total Tasks: `3`
- [ ] Completed: `1`
- [ ] Completion Rate: `33%`
- [ ] Assignment listed with task counts
- [ ] Shows "1 completed" out of 3 tasks

**Expected:**
```
Performance
Track your progress and achievements

Total Tasks: 3
Completed: 1
Completion Rate: 33%

Your Assignments:
- Build Authentication System
  Test Company
  3 tasks • 1 completed
```

##### 5. Calendar (`/intern/calendar`)
**What to Check:**
- [ ] Shows "Upcoming Deadlines"
- [ ] 2 tasks listed (only incomplete with future dates)
- [ ] Tasks sorted by due date (nearest first)
- [ ] Each task shows title, assignment, priority, due date
- [ ] Completed task NOT shown

**Expected:**
```
Calendar
View your upcoming deadlines and events

Upcoming Deadlines:
1. Implement Login API
   Build Authentication System
   HIGH | Due: Jun 1, 2026

2. Write API Documentation
   Build Authentication System
   MEDIUM | Due: Jun 10, 2026
```

##### 6. Requests (`/intern/requests`)
**What to Check:**
- [ ] Shows "Requests" header
- [ ] "New Request" button visible
- [ ] Empty state message displayed
- [ ] "Create Request" button in center

**Expected:**
```
Requests
Submit requests and track their status

No requests yet
Submit a request for time off, resources, or help
[Create Request button]
```

##### 7. Chat (`/intern/chat`)
**What to Check:**
- [ ] Shows "Team Chat" header
- [ ] "Chat Coming Soon" message
- [ ] Message icon displayed

**Expected:**
```
Team Chat
Communicate with your team

Chat Coming Soon
Real-time chat functionality will be available soon
```

---

### Step 5: Test Dynamic Updates ✅

#### Update Task Status (as Intern):
```bash
# Get Intern Token
curl -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "intern@test.com",
    "password": "Intern123!"
  }'

# Update Task Status
curl -X PUT http://localhost:4000/api/v1/tasks/TASK_ID/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer INTERN_TOKEN" \
  -d '{
    "status": "IN_PROGRESS"
  }'
```

**Then refresh the intern pages and verify:**
- [ ] Dashboard shows updated status
- [ ] My Tasks shows "IN_PROGRESS" badge
- [ ] Performance stats update if task completed

---

## ✅ Success Checklist

### Backend:
- [ ] Backend server running on port 4000
- [ ] Database connected to Supabase
- [ ] Can register admin and intern
- [ ] Can login and get JWT token
- [ ] Can create assignments
- [ ] Can create tasks
- [ ] Notifications created automatically

### Frontend:
- [ ] Frontend running on port 5174
- [ ] Can access all intern pages
- [ ] Dashboard shows real data
- [ ] My Tasks shows all tasks
- [ ] Updates shows assignments
- [ ] Performance shows stats
- [ ] Calendar shows deadlines
- [ ] Requests page loads
- [ ] Chat page loads

### Data Flow:
- [ ] Admin creates assignment → Intern sees it
- [ ] Admin creates task → Intern sees it
- [ ] Intern updates task → Stored in database
- [ ] All data persists after refresh
- [ ] No console errors

---

## 🐛 Troubleshooting

### Issue: "Network Error"
**Solution:** Check CORS settings in `backend/.env`:
```
CORS_ORIGIN=http://localhost:5173,http://localhost:5174,http://localhost:3000
```

### Issue: "No tasks showing"
**Solution:** 
1. Verify assignment was created with correct `internId`
2. Check tasks have correct `assignmentId`
3. Login as the correct intern user

### Issue: "401 Unauthorized"
**Solution:**
1. Get fresh token by logging in again
2. Check token is included in Authorization header
3. Verify token hasn't expired (15 minutes)

### Issue: "Empty pages"
**Solution:**
1. Create test data using the API calls above
2. Refresh the page
3. Check browser console for errors

---

## 🎉 All Tests Passing?

If all checkboxes are checked, **congratulations!** 

All intern features are:
- ✅ Dynamic
- ✅ Clickable
- ✅ Connected to database
- ✅ Showing real data
- ✅ Fully functional

**The intern module is production-ready!** 🚀
