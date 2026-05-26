# Authentication Redirect Loop Fix

## Problem
Users were experiencing `ERR_TOO_MANY_REDIRECTS` error when:
- Refreshing the page
- After session inactivity
- When tokens expired

This was caused by an infinite redirect loop in the authentication bootstrap logic.

## Root Causes

### 1. **Reactive Token State**
The auth context was using `hasToken = !!tokenStorage.getAccessToken()` which would re-evaluate on every render, causing the useQuery to re-enable/disable repeatedly.

### 2. **Missing Mount Guard**
The bootstrap effect didn't have proper cleanup to prevent multiple simultaneous runs if the component re-rendered during bootstrap.

### 3. **Race Conditions**
Token changes during bootstrap could trigger the useQuery to re-run before bootstrap completed, causing cascading failures.

### 4. **Missing Logout Endpoint in Interceptor**
The API interceptor was attempting to refresh tokens even for logout requests, which could cause loops.

## Solution

### 1. **Stable Token State**
Replaced reactive `hasToken` with a stable `hasValidToken` state variable that only changes when explicitly set:
```typescript
const [hasValidToken, setHasValidToken] = useState(false);
```

### 2. **Mount Guard**
Added `isMounted` flag to prevent state updates after component unmounts:
```typescript
useEffect(() => {
  let isMounted = true;
  
  const bootstrap = async () => {
    // ... bootstrap logic
    if (isMounted) {
      setHasValidToken(true);
      setBootstrapped(true);
    }
  };
  
  bootstrap();
  
  return () => {
    isMounted = false;
  };
}, []);
```

### 3. **Simplified Bootstrap Flow**
Improved the bootstrap logic to handle all cases cleanly:
1. No tokens → finish bootstrap immediately
2. Valid access token → set user data and finish
3. Invalid access token + valid refresh token → refresh and get user data
4. All tokens invalid → clear everything and finish

### 4. **Disabled Query Retry**
Changed useQuery retry from `1` to `false` to prevent automatic retries that could cause loops:
```typescript
const { data: user } = useQuery({
  queryKey: authKeys.me,
  queryFn: () => authApi.getMe(),
  enabled: hasValidToken && bootstrapped,
  retry: false, // Prevent automatic retries
});
```

### 5. **Enhanced API Interceptor**
Added `/auth/logout` to the list of endpoints that should not trigger token refresh:
```typescript
if (
  error.response?.status === 401 &&
  !original.url?.includes("/auth/login") &&
  !original.url?.includes("/auth/register") &&
  !original.url?.includes("/auth/refresh") &&
  !original.url?.includes("/auth/logout") // Added this
) {
  // ... refresh logic
}
```

## Files Modified

1. **`src/contexts/auth-context.tsx`**
   - Added `hasValidToken` state
   - Added mount guard to bootstrap effect
   - Simplified bootstrap flow
   - Updated login/logout to manage `hasValidToken`
   - Disabled query retry

2. **`src/lib/api/client.ts`**
   - Added `/auth/logout` to interceptor exclusions
   - Added better comments for clarity

## Testing

To verify the fix works:

1. **Page Refresh Test**
   ```bash
   # Login to the app
   # Refresh the page (Cmd+R or F5)
   # Should stay logged in without redirect loop
   ```

2. **Token Expiration Test**
   ```bash
   # Login to the app
   # Wait 15+ minutes (access token expires)
   # Make any API request
   # Should auto-refresh token without logout
   ```

3. **Invalid Token Test**
   ```bash
   # Login to the app
   # Open DevTools → Application → Local Storage
   # Manually corrupt the access token
   # Refresh the page
   # Should attempt refresh, then logout gracefully if refresh fails
   ```

4. **Session Expired Test**
   ```bash
   # Login to the app
   # Wait 7+ days (refresh token expires)
   # Refresh the page
   # Should logout and redirect to login page
   ```

## Expected Behavior

- ✅ Page refresh maintains login state
- ✅ Expired access tokens auto-refresh silently
- ✅ Expired refresh tokens trigger clean logout
- ✅ No redirect loops
- ✅ No unnecessary API calls
- ✅ Proper error handling

## Token Expiration Settings

- **Access Token**: 15 minutes
- **Refresh Token**: 7 days

These are configured in `backend/src/config/env.ts`:
```typescript
JWT_ACCESS_EXPIRES_IN: '15m'
JWT_REFRESH_EXPIRES_IN: '7d'
```
