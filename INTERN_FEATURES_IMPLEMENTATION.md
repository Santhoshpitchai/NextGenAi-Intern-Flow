# Intern Module Features - Implementation Guide

## 🎯 Goal
Make all intern features work dynamically so:
- **Admin actions** → **Intern sees updates**
- **Intern actions** → **Admin sees updates**

## ✅ What's Been Implemented

### 1. Assignments Module (COMPLETE)
**Backend:**
- ✅ Create assignment (Admin)
- ✅ View all assignments (Admin/Intern)
- ✅ Update assignment (Admin)
- ✅ Delete assignment (Admin)
- ✅ Get my assignments (Intern)
- ✅ Notifications when assigned

**API Endpoints:**
```
POST   /api/v1/assignments              - Create (Admin)
GET    /api/v1/assignments              - List all
GET    /api/v1/assignments/:id          - Get details
PATCH  /api/v1/assignments/:id          - Update (Admin)
DELETE /api/v1/assignments/:id          - Delete (Admin)
GET    /api/v1/assignments/my/assignments - My assignments (Intern)
```

### 2. Notifications Module (COMPLETE)
- ✅ Create notifications
- ✅ Get notifications
- ✅ Mark as read
- ✅ Unread count

## 🔄 What Needs Frontend Integration

The backend APIs are ready. Now we need to connect the frontend pages to these APIs.

### Current Frontend Pages (Need Data):
1. **My Dashboard** (`/intern`) - Needs stats API
2. **My Tasks** (`/intern/tasks`) - Needs tasks API  
3. **Daily Updates** (`/intern/updates`) - Needs progress API
4. **Performance** (`/intern/performance`) - Needs stats API
5. **Requests** (`/intern/requests`) - Needs requests API
6. **Team Chat** (`/intern/chat`) - Needs chat API
7. **Calendar** (`/intern/calendar`) - Needs events API

## 🚀 Quick Implementation Steps

### Step 1: Test Backend API (5 minutes)

**Test Assignment Creation (as Admin):**
```bash
# First, register an admin
curl -X POST http://localhost:4000/api/v1/auth/register/admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "Test123!@#",
    "phone": "+1234567890",
    "companyName": "Test Corp",
    "adminName": "Test Admin"
  }'

# Save the accessToken from response

# Register an intern
curl -X POST http://localhost:4000/api/v1/auth/register/intern \
  -F "email=intern@test.com" \
  -F "password=Test123!@#" \
  -F "phone=+1234567890" \
  -F "fullName=Test Intern" \
  -F "college=MIT" \
  -F "degree=B.Tech" \
  -F "branch=Computer Science" \
  -F "skills=JavaScript,React" \
  -F "internshipRole=Developer" \
  -F "startDate=2024-06-01" \
  -F "endDate=2024-08-31" \
  -F "resume=@/path/to/resume.pdf" \
  -F "profilePhoto=@/path/to/photo.jpg"

# Save the intern user ID from response

# Create assignment (use admin token)
curl -X POST http://localhost:4000/api/v1/assignments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "internId": "INTERN_ID_FROM_REGISTRATION",
    "title": "Frontend Development Project",
    "department": "Engineering",
    "startDate": "2024-06-01",
    "endDate": "2024-08-31",
    "notes": "Build the user dashboard"
  }'
```

### Step 2: Create Frontend API Client (10 minutes)

Create `/src/services/assignment-api.ts`:
```typescript
import { apiClient, unwrap } from "@/lib/api/client";
import type { ApiSuccess } from "@/types/auth";

export interface Assignment {
  id: string;
  title: string;
  department?: string;
  status: string;
  startDate: string;
  endDate: string;
  notes?: string;
  company: {
    name: string;
  };
  tasks: Array<{
    id: string;
    title: string;
    status: string;
    priority: string;
  }>;
}

export const assignmentApi = {
  async getMyAssignments(): Promise<Assignment[]> {
    const res = await apiClient.get<ApiSuccess<Assignment[]>>(
      "/assignments/my/assignments"
    );
    return unwrap(res);
  },

  async getAssignmentById(id: string): Promise<Assignment> {
    const res = await apiClient.get<ApiSuccess<Assignment>>(
      `/assignments/${id}`
    );
    return unwrap(res);
  },

  // Admin only
  async createAssignment(data: any): Promise<Assignment> {
    const res = await apiClient.post<ApiSuccess<Assignment>>(
      "/assignments",
      data
    );
    return unwrap(res);
  },
};
```

### Step 3: Update Frontend Components (20 minutes)

**Example: Update My Tasks Page**

Find the file: `/src/routes/intern/tasks.tsx` (or similar)

```typescript
import { useQuery } from "@tanstack/react-query";
import { assignmentApi } from "@/services/assignment-api";

export function InternTasksPage() {
  const { data: assignments, isLoading } = useQuery({
    queryKey: ["my-assignments"],
    queryFn: () => assignmentApi.getMyAssignments(),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>My Tasks</h1>
      {assignments?.map((assignment) => (
        <div key={assignment.id}>
          <h2>{assignment.title}</h2>
          <p>Company: {assignment.company.name}</p>
          <p>Status: {assignment.status}</p>
          
          <h3>Tasks:</h3>
          {assignment.tasks.map((task) => (
            <div key={task.id}>
              <p>{task.title} - {task.status}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
```

### Step 4: Add Real-Time Updates (Optional, 30 minutes)

For real-time notifications, you can:

**Option A: Polling (Simple)**
```typescript
// Refetch every 30 seconds
useQuery({
  queryKey: ["notifications"],
  queryFn: () => notificationApi.getNotifications(),
  refetchInterval: 30000,
});
```

**Option B: WebSockets (Advanced)**
- Set up Socket.io on backend
- Connect from frontend
- Emit events when data changes

## 📋 Complete Feature Checklist

### Assignments ✅
- [x] Backend API
- [x] Routes registered
- [x] RBAC applied
- [ ] Frontend API client
- [ ] Frontend components
- [ ] Real-time updates

### Tasks 🔄
- [ ] Backend API
- [ ] Routes
- [ ] Frontend client
- [ ] Frontend components

### Progress/Updates 🔄
- [ ] Backend API
- [ ] Routes
- [ ] Frontend client
- [ ] Frontend components

### Dashboard 🔄
- [ ] Backend stats API
- [ ] Frontend integration

### Notifications ✅
- [x] Backend API
- [ ] Frontend client
- [ ] Real-time polling
- [ ] Notification bell

### Requests 🔄
- [ ] Backend API
- [ ] Routes
- [ ] Frontend client
- [ ] Frontend components

## 🎯 Priority Order

1. **Assignments** (Already done backend, needs frontend)
2. **Tasks** (Most important for intern workflow)
3. **Dashboard Stats** (Shows overview)
4. **Notifications** (Real-time updates)
5. **Progress Updates** (Intern reports progress)
6. **Requests** (Intern requests help/resources)

## 🔧 Quick Fixes for Current Pages

### Fix "Module ready to wire up" Pages

Each page showing this message needs:

1. **Create API client** in `/src/services/`
2. **Use React Query** to fetch data
3. **Display data** in component
4. **Add loading/error states**

**Template:**
```typescript
// 1. Create API client
export const featureApi = {
  async getData() {
    const res = await apiClient.get("/endpoint");
    return unwrap(res);
  },
};

// 2. Use in component
function FeaturePage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["feature-data"],
    queryFn: () => featureApi.getData(),
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage />;

  return <div>{/* Display data */}</div>;
}
```

## 🚨 Common Issues & Solutions

### Issue: "Network Error"
**Solution:** Backend not running or wrong URL
```bash
# Check backend is running
curl http://localhost:4000/api/v1/health

# Check frontend .env
cat .env
# Should have: VITE_API_URL=http://localhost:4000/api/v1
```

### Issue: "401 Unauthorized"
**Solution:** Not logged in or token expired
```typescript
// Check if token exists
const token = localStorage.getItem("accessToken");
console.log("Token:", token);

// If no token, redirect to login
if (!token) {
  navigate("/login");
}
```

### Issue: "403 Forbidden"
**Solution:** Wrong role trying to access endpoint
- Interns can't access admin endpoints
- Admins can't access intern-only endpoints
- Check RBAC permissions in backend

### Issue: "Empty data"
**Solution:** No data in database yet
- Create test data using API
- Or use Prisma Studio to add data manually

## 📚 Next Steps

1. **Test backend APIs** with curl/Postman
2. **Create frontend API clients** for each module
3. **Update components** to use real data
4. **Add loading states** and error handling
5. **Test end-to-end flow:**
   - Admin creates assignment
   - Intern sees it in dashboard
   - Intern updates progress
   - Admin sees the update

## 🎉 Expected Result

After implementation:
- ✅ Admin creates assignment → Intern sees it immediately
- ✅ Admin assigns task → Intern gets notification
- ✅ Intern updates progress → Admin sees in dashboard
- ✅ All pages show real data (no more "Module ready to wire up")
- ✅ Real-time or near-real-time updates

## 📞 Need Help?

If you get stuck:
1. Check backend logs for errors
2. Check browser console for frontend errors
3. Verify API endpoints with curl
4. Check authentication tokens
5. Verify RBAC permissions

---

**Current Status:** Backend APIs ready for Assignments & Notifications
**Next:** Create frontend API clients and connect components
**Time Estimate:** 2-3 hours for complete integration
