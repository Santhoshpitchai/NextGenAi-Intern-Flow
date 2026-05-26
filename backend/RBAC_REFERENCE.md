# RBAC (Role-Based Access Control) Reference

## User Roles

### 1. INTERN
- Can view and manage their own profile
- Can upload resume and profile photo
- Can view their own assignments and tasks
- Can update task progress
- **Cannot** access other interns' data
- **Cannot** manage company settings
- **Cannot** create assignments or tasks

### 2. COMPANY_ADMIN
- Can manage their company information
- Can view all interns in their company
- Can create and manage internship assignments
- Can create and assign tasks
- Can view all user profiles
- **Cannot** delete users (SUPER_ADMIN only)

### 3. SUPER_ADMIN
- Full system access
- Can delete users
- Can manage all companies
- Can access all features

## Permission Matrix

| Feature | INTERN | COMPANY_ADMIN | SUPER_ADMIN |
|---------|--------|---------------|-------------|
| View own profile | ✅ | ✅ | ✅ |
| Update own profile | ✅ | ✅ | ✅ |
| Upload resume | ✅ | ❌ | ❌ |
| Upload profile photo | ✅ | ❌ | ❌ |
| View own assignments | ✅ | ✅ | ✅ |
| View own tasks | ✅ | ✅ | ✅ |
| Update task progress | ✅ | ❌ | ✅ |
| View all interns | ❌ | ✅ | ✅ |
| Create assignments | ❌ | ✅ | ✅ |
| Manage tasks | ❌ | ✅ | ✅ |
| Manage company | ❌ | ✅ | ✅ |
| Delete users | ❌ | ❌ | ✅ |

## API Endpoints by Role

### Public Endpoints (No Authentication Required)
```
POST /api/v1/auth/register/admin
POST /api/v1/auth/register/intern
POST /api/v1/auth/login
POST /api/v1/auth/refresh
```

### Authenticated Endpoints (All Roles)
```
GET  /api/v1/auth/me
POST /api/v1/auth/logout
```

### Intern-Only Endpoints
```
GET    /api/v1/users/profile
PATCH  /api/v1/users/profile
POST   /api/v1/uploads/resume
POST   /api/v1/uploads/profile-photo
```

### Admin-Only Endpoints (COMPANY_ADMIN, SUPER_ADMIN)
```
GET    /api/v1/users
GET    /api/v1/users/:userId
POST   /api/v1/assignments
GET    /api/v1/assignments
PATCH  /api/v1/assignments/:id
DELETE /api/v1/assignments/:id
POST   /api/v1/tasks
GET    /api/v1/tasks
PATCH  /api/v1/tasks/:id
DELETE /api/v1/tasks/:id
```

## Using RBAC in Code

### In Routes

```typescript
import { requirePermission } from "../middleware/rbac.middleware.js";

// Single permission
router.get("/profile", 
  authenticate,
  requirePermission("VIEW_OWN_PROFILE"),
  controller.getProfile
);

// Multiple permissions (user needs ANY of them)
router.get("/data",
  authenticate,
  requireAnyPermission("VIEW_OWN_PROFILE", "VIEW_ALL_INTERNS"),
  controller.getData
);

// Resource ownership check
router.get("/intern/:internId",
  authenticate,
  requireResourceOwnership((req) => req.params.internId),
  controller.getIntern
);
```

### In Services

```typescript
import { hasPermission, isAdmin, isIntern } from "../middleware/rbac.middleware.js";

export async function getData(userId: string, userRole: UserRole) {
  // Check permission
  if (!hasPermission(userRole, "VIEW_ALL_INTERNS")) {
    throw ApiError.forbidden("Access denied");
  }
  
  // Role-based logic
  if (isAdmin(userRole)) {
    // Return all data
    return getAllData();
  } else if (isIntern(userRole)) {
    // Return only user's data
    return getUserData(userId);
  }
}
```

## Available Permissions

### Admin Permissions
- `MANAGE_COMPANY`
- `MANAGE_ASSIGNMENTS`
- `MANAGE_TASKS`
- `VIEW_ALL_INTERNS`
- `CREATE_INTERN_ASSIGNMENT`
- `DELETE_USERS` (SUPER_ADMIN only)

### Intern Permissions
- `VIEW_OWN_PROFILE`
- `UPDATE_OWN_PROFILE`
- `UPLOAD_RESUME`
- `UPLOAD_PROFILE_PHOTO`
- `VIEW_OWN_ASSIGNMENTS`
- `VIEW_OWN_TASKS`
- `UPDATE_TASK_PROGRESS`
- `VIEW_OWN_NOTIFICATIONS`

### Shared Permissions
- `VIEW_PROFILE`
- `VIEW_NOTIFICATIONS`

## Adding New Permissions

1. **Define permission in `rbac.middleware.ts`:**
```typescript
export const PERMISSIONS = {
  // ... existing permissions
  NEW_FEATURE: [UserRole.COMPANY_ADMIN, UserRole.SUPER_ADMIN],
} as const;
```

2. **Use in routes:**
```typescript
router.post("/new-feature",
  authenticate,
  requirePermission("NEW_FEATURE"),
  controller.newFeature
);
```

3. **Update this documentation**

## Testing RBAC

### Test as Admin
```bash
# Login
TOKEN=$(curl -s -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@company.com","password":"password"}' \
  | jq -r '.data.tokens.accessToken')

# Access admin endpoint (should succeed)
curl -X GET http://localhost:4000/api/v1/users \
  -H "Authorization: Bearer $TOKEN"
```

### Test as Intern
```bash
# Login
TOKEN=$(curl -s -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"intern@example.com","password":"password"}' \
  | jq -r '.data.tokens.accessToken')

# Access admin endpoint (should fail with 403)
curl -X GET http://localhost:4000/api/v1/users \
  -H "Authorization: Bearer $TOKEN"

# Access intern endpoint (should succeed)
curl -X GET http://localhost:4000/api/v1/users/profile \
  -H "Authorization: Bearer $TOKEN"
```

## Security Best Practices

1. **Always authenticate first:**
   ```typescript
   router.use(authenticate); // Before any RBAC checks
   ```

2. **Check permissions at route level:**
   ```typescript
   router.get("/sensitive", authenticate, requirePermission("ADMIN_ONLY"), handler);
   ```

3. **Verify ownership for user-specific resources:**
   ```typescript
   router.get("/intern/:id", 
     authenticate,
     requireResourceOwnership((req) => req.params.id),
     handler
   );
   ```

4. **Double-check in service layer for critical operations:**
   ```typescript
   if (!hasPermission(user.role, "DELETE_USERS")) {
     throw ApiError.forbidden();
   }
   ```

5. **Use least privilege principle:**
   - Grant minimum permissions needed
   - Interns should only access their own data
   - Admins should only access their company's data

## Common Patterns

### Pattern 1: Self-Service Endpoints
Interns can only access their own data:
```typescript
router.get("/profile",
  authenticate,
  requirePermission("VIEW_OWN_PROFILE"),
  async (req, res) => {
    // req.user.id is automatically the authenticated user
    const profile = await getProfile(req.user.id);
    res.json(profile);
  }
);
```

### Pattern 2: Admin Override
Admins can access any data, interns only their own:
```typescript
router.get("/data/:userId",
  authenticate,
  async (req, res) => {
    const { userId } = req.params;
    
    // Admins can access any user's data
    if (isAdmin(req.user.role)) {
      return res.json(await getData(userId));
    }
    
    // Interns can only access their own
    if (req.user.id !== userId) {
      throw ApiError.forbidden();
    }
    
    res.json(await getData(userId));
  }
);
```

### Pattern 3: Feature Flags
Enable features based on role:
```typescript
const features = {
  canCreateAssignments: hasPermission(user.role, "MANAGE_ASSIGNMENTS"),
  canUploadResume: hasPermission(user.role, "UPLOAD_RESUME"),
  canViewAllInterns: hasPermission(user.role, "VIEW_ALL_INTERNS"),
};

res.json({ user, features });
```

## Troubleshooting

### Issue: Getting 403 Forbidden
**Check:**
1. Is user authenticated? (401 vs 403)
2. Does user's role have the required permission?
3. Is permission spelled correctly?
4. Is middleware in correct order?

### Issue: Intern can access admin features
**Check:**
1. Is `requirePermission` middleware applied?
2. Is permission defined correctly in `PERMISSIONS`?
3. Is user's role correct in JWT token?

### Issue: Admin can't access feature
**Check:**
1. Is admin role included in permission definition?
2. Is JWT token valid and not expired?
3. Is `authenticate` middleware before `requirePermission`?

---

**Quick Reference:**
- Interns: Own data only
- Admins: Company-wide access
- Super Admins: System-wide access
- Always authenticate before checking permissions
- Use `requirePermission` for feature access
- Use `requireResourceOwnership` for data access
