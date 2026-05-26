# Quick Start - Testing Intern Portal Features

## 🚀 All Features Are Now Working!

The following features have been fully implemented and are ready to test:

1. ✅ **Daily Updates** - Submit and view daily progress updates
2. ✅ **Requests** - Create and track requests (time off, resources, help)
3. ✅ **Team Chat** - Send and receive messages with your team
4. ✅ **Calendar** - View upcoming task deadlines

---

## 📋 Prerequisites

Make sure you have:
- Backend server running on `http://localhost:3000`
- Frontend server running on `http://localhost:5174`
- Database connection configured (Supabase)
- At least one intern user account

---

## 🏃 Quick Start

### Step 1: Start the Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### Step 2: Login as Intern

1. Open browser to `http://localhost:5174`
2. Login with your intern credentials
3. You should see the intern dashboard

---

## 🧪 Testing Each Feature

### 1. Daily Updates

**Location:** Click "Daily Updates" in the sidebar

**Test Steps:**
1. Click the "Submit Update" button (top right)
2. Fill in the form:
   - **Summary** (required): "Completed user authentication module"
   - **Accomplishments**: "Implemented JWT tokens and refresh logic"
   - **Challenges**: "Had some issues with token expiration"
   - **Next Steps**: "Will work on password reset feature tomorrow"
3. Click "Submit Update"
4. ✅ You should see a success toast
5. ✅ Your update should appear in the "Progress Updates" section
6. ✅ Try submitting another update today - it should update the existing one

**What to Look For:**
- Green success toast notification
- Update appears immediately in the list
- Shows date, summary, and all details
- Can see your assignments in the top section

---

### 2. Requests

**Location:** Click "Requests" in the sidebar

**Test Steps:**
1. Click the "New Request" button (top right)
2. Fill in the form:
   - **Type**: Select "Time Off"
   - **Title**: "Vacation Request - June 1-5"
   - **Description**: "I would like to request time off for a family vacation"
3. Click "Submit Request"
4. ✅ You should see a success toast
5. ✅ Your request should appear with "PENDING" status
6. ✅ Shows yellow badge for pending status

**Test Different Request Types:**
- Time Off
- Resource (e.g., "Need access to staging server")
- Help (e.g., "Need help with React Query setup")
- Other

**What to Look For:**
- Request appears immediately
- Shows correct status badge (yellow for pending)
- Displays submission date
- Once admin responds, you'll see the response

---

### 3. Team Chat

**Location:** Click "Team Chat" in the sidebar

**Test Steps:**
1. Type a message in the input box at the bottom
2. Example: "Hi team! Just finished the authentication module 🎉"
3. Click the send button (or press Enter)
4. ✅ Message should appear immediately
5. ✅ Your message appears on the right side (blue background)
6. ✅ Shows your name and timestamp

**Test Real-time Updates:**
1. Open another browser window (or incognito mode)
2. Login as a different user (admin or another intern)
3. Send a message from that window
4. ✅ Within 5 seconds, the message should appear in your first window
5. ✅ Other users' messages appear on the left (gray background)

**What to Look For:**
- Messages appear instantly when you send
- Your messages on right (blue), others on left (gray)
- Profile pictures/initials show for each sender
- Timestamps for each message
- Auto-scroll to latest message
- Messages refresh every 5 seconds

---

### 4. Calendar

**Location:** Click "Calendar" in the sidebar

**Test Steps:**
1. View the "Upcoming Deadlines" section
2. ✅ Should see all your tasks with future due dates
3. ✅ Tasks are sorted by due date (earliest first)
4. ✅ Shows task priority badge
5. ✅ Shows assignment name
6. ✅ Completed tasks are filtered out

**What to Look For:**
- Only future deadlines shown
- Sorted chronologically
- Shows priority (LOW, MEDIUM, HIGH, URGENT)
- Shows which assignment the task belongs to
- Clean, organized view

---

## 🎯 Expected Behavior

### Success Indicators:
- ✅ No "coming soon" messages
- ✅ Forms submit successfully
- ✅ Data appears immediately after submission
- ✅ Toast notifications show success/error
- ✅ Loading spinners during API calls
- ✅ Data persists after page refresh

### Error Handling:
- ❌ If backend is down: "Failed to..." error toast
- ❌ If not authenticated: Redirected to login
- ❌ If missing required fields: Button disabled or validation error

---

## 🔍 Troubleshooting

### Issue: "Failed to submit..."
**Solution:** 
- Check backend is running on port 3000
- Check browser console for errors
- Verify database connection in backend/.env

### Issue: "No data showing"
**Solution:**
- Refresh the page
- Check Network tab in browser DevTools
- Verify API endpoints are responding (check backend logs)

### Issue: Chat messages not updating
**Solution:**
- Wait 5 seconds (auto-refresh interval)
- Refresh the page manually
- Check if other user is logged in correctly

### Issue: Calendar shows "No upcoming deadlines"
**Solution:**
- This is normal if you have no tasks assigned
- Ask admin to create an assignment and task for you
- Make sure task has a future due date

---

## 📊 API Endpoints Reference

### Daily Updates
- `POST /api/daily-updates` - Create update
- `GET /api/daily-updates/my` - Get your updates

### Requests
- `POST /api/requests` - Create request
- `GET /api/requests/my` - Get your requests

### Messages
- `POST /api/messages` - Send message
- `GET /api/messages` - Get messages

### Tasks (Calendar)
- `GET /api/tasks/my` - Get your tasks

---

## 🎨 UI Features

### Daily Updates Page:
- Blue gradient "Submit Update" button
- Card layout for each update
- Date and time stamps
- Expandable sections for accomplishments, challenges, next steps

### Requests Page:
- Status badges with colors:
  - 🟡 Yellow = Pending
  - 🟢 Green = Approved
  - 🔴 Red = Rejected
- Request type badges
- Admin response section (when available)

### Team Chat Page:
- Full-height chat interface
- Message bubbles (blue for you, gray for others)
- Avatar/initials for each sender
- Fixed input at bottom
- Auto-scroll to latest

### Calendar Page:
- Clean list of upcoming deadlines
- Priority badges
- Assignment context
- Due date display

---

## ✅ Verification Checklist

Before reporting any issues, verify:

- [ ] Backend server is running (check terminal)
- [ ] Frontend server is running (check terminal)
- [ ] Logged in as intern user
- [ ] Database connection is working
- [ ] Browser console shows no errors
- [ ] Network tab shows API calls succeeding (200 status)

---

## 🎉 Success!

If all features work as described above, congratulations! The intern portal is fully functional and ready for use.

**Next Steps:**
- Test with multiple users simultaneously
- Try different scenarios (edge cases)
- Customize the UI to match your branding
- Add more features as needed

---

## 📞 Need Help?

If you encounter issues:
1. Check the browser console for errors
2. Check the backend terminal for errors
3. Review the API responses in Network tab
4. Check the database has the new tables
5. Verify environment variables are set correctly

---

**Last Updated:** May 25, 2026
**Status:** All Features Working ✅
