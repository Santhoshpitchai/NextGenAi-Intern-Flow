# Authentication Persistence Fix

## Problem
Users were experiencing:
1. Automatic logout on page refresh
2. Need to restart servers frequently
3. Session not persisting across browser refreshes

## Root Causes

### 1. Missing Token Refresh on Bootstrap
The auth context wasn't properly validating tokens when the app loaded. It would check for tokens but not attempt to refresh them if the access token was expired.

### 2. Missing Refresh API Method
The frontend `authApi` was missing the `refresh()` method, so the auth context couldn't call it during bootstrap.

### 3. Incomplete Bootstrap Logic
The bootstrap process wasn't handling the token refresh flow properly:
- It would check if tokens exist
- But wouldn't try to refresh if access token was expired
- Wouldn't fetch user data after successful refresh

## Solutions Applied

### 1. Enhanced Auth Context Bootstrap (`src/contexts/auth-context.tsx`)

**Before:**
- Simple token check
- No refresh attempt on mount
- Would fail silently if token expired

**After:**
```typescript
// Bootstrap on mount - validate tokens
useEffect(() => {
  const bootstrap = async () => {
    if (!hasToken) {
      setBootstrapped(true);
      setInitializing(false);
      return;
    }

    // Try to get user with current token
    try {
      const userData = await authApi.getMe();
      queryClient.setQueryData(authKeys.me, userData);
      setBootstrapped(true);
    } catch (error) {
      // If access token failed, try refresh token
      const refreshToken = tokenStorage.getRefreshToken();
      if (refreshToken) {
        try {
          const response = await authApi.refresh(refreshToken);
          tokenStorage.setTokens(response.tokens.accessToken, response.tokens.refreshToken);
          // After refreshing tokens, get user data again
          const userData = await authApi.getMe();
          queryClient.setQueryData(authKeys.me, userData);
          setBootstrapped(true);
        } catch {
          // Refresh failed, clear everything
          tokenStorage.clear();
          queryClient.setQueryData(authKeys.me, null);
          setBootstrapped(true);
        }
      } else {
        // No refresh token, clear everything
        tokenStorage.clear();
        queryClient.setQueryData(authKeys.me, null);
        setBootstrapped(true);
      }
    } finally {
      setInitializing(false);
    }
  };

  bootstrap();
}, []); // Only run once on mount
```

**Benefits:**
- Validates tokens on every page load
- Automatically refreshes expired access tokens
- Fetches user data after successful refresh
- Clears invalid tokens gracefully
- Only runs once on mount (not on every render)

### 2. Added Refresh API Method (`src/services/auth-api.ts`)

**Added:**
```typescript
async refresh(refreshToken: string): Promise<{ tokens: { accessToken: string; refreshToken: string } }> {
  const res = await apiClient.post<ApiSuccess<{ accessToken: string; refreshToken: string }>>("/auth/refresh", {
    refreshToken,
  });
  return { tokens: unwrap(res) };
}
```

**Benefits:**
- Provides a way to refresh tokens from the auth context
- Returns new access and refresh tokens
- Properly typed response

### 3. Improved API Client Interceptor (`src/lib/api/client.ts`)

**Added:**
```typescript
!original.url?.includes("/auth/refresh") // Don't retry refresh endpoint
```

**Benefits:**
- Prevents infinite loops when refresh endpoint itself fails
- Avoids recursive refresh attempts
- Better error handling

### 4. Added Initializing State

**Added:**
```typescript
const [initializing, setInitializing] = useState(true);

// In value:
isLoading: initializing || (hasToken && isQueryLoading),
```

**Benefits:**
- Shows loading state during bootstrap
- Prevents flash of login screen
- Better UX during token validation

## How It Works Now

### On Page Load:
1. **Check for tokens** in localStorage
2. **If tokens exist:**
   - Try to fetch user with access token
   - **If successful:** User is logged in ✅
   - **If fails (401):**
     - Try to refresh using refresh token
     - **If refresh succeeds:**
       - Store new tokens
       - Fetch user data with new access token
       - User stays logged in ✅
     - **If refresh fails:**
       - Clear all tokens
       - User is logged out ❌
3. **If no tokens:** User is logged out ❌

### During API Calls:
1. **Every request** includes access token in Authorization header
2. **If 401 response:**
   - Automatically try to refresh token
   - Retry original request with new token
   - **If refresh fails:** Trigger logout

### Token Expiration:
- **Access Token:** 15 minutes (short-lived)
- **Refresh Token:** 7 days (long-lived)
- Access token refreshed automatically when expired
- User stays logged in as long as refresh token is valid

## Testing

### Test 1: Page Refresh
1. Login to the app
2. Refresh the page (F5 or Cmd+R)
3. ✅ Should stay logged in
4. ✅ Should see your dashboard immediately

### Test 2: Token Expiration
1. Login to the app
2. Wait 16 minutes (access token expires)
3. Make any API call (navigate to a page)
4. ✅ Should automatically refresh token
5. ✅ Should stay logged in

### Test 3: Long Session
1. Login to the app
2. Keep the tab open for several hours
3. Come back and interact with the app
4. ✅ Should automatically refresh token
5. ✅ Should stay logged in

### Test 4: Invalid Tokens
1. Login to the app
2. Open DevTools → Application → Local Storage
3. Manually corrupt the access token
4. Refresh the page
5. ✅ Should try to refresh
6. ✅ Should stay logged in (using refresh token)

### Test 5: Expired Refresh Token
1. Login to the app
2. Wait 8 days (refresh token expires)
3. Refresh the page
4. ✅ Should be logged out
5. ✅ Should see login screen

## Benefits

### For Users:
- ✅ No more unexpected logouts
- ✅ Sessions persist across page refreshes
- ✅ Can keep app open for days
- ✅ Seamless experience

### For Developers:
- ✅ No need to restart servers frequently
- ✅ Better debugging experience
- ✅ Proper token lifecycle management
- ✅ Clear error handling

## Token Storage

Tokens are stored in **localStorage**:
- `internflow_access_token` - Short-lived access token
- `internflow_refresh_token` - Long-lived refresh token

**Security Notes:**
- Tokens are HTTP-only on backend (secure)
- Frontend stores in localStorage (standard practice for SPAs)
- Tokens are validated on every request
- Refresh tokens can be revoked server-side

## Troubleshooting

### Still Getting Logged Out?

**Check 1: Backend is Running**
```bash
cd backend
npm run dev
```
Backend should be on `http://localhost:3000`

**Check 2: Database Connection**
Check `backend/.env` has valid `DATABASE_URL`

**Check 3: JWT Secrets**
Check `backend/.env` has:
- `JWT_ACCESS_SECRET` (at least 32 characters)
- `JWT_REFRESH_SECRET` (at least 32 characters)

**Check 4: Browser Console**
Open DevTools → Console
Look for errors related to auth or tokens

**Check 5: Network Tab**
Open DevTools → Network
Check if `/auth/refresh` is being called
Check if it returns 200 or error

**Check 6: Local Storage**
Open DevTools → Application → Local Storage
Check if tokens exist:
- `internflow_access_token`
- `internflow_refresh_token`

### Clear Everything and Start Fresh

If issues persist:
```bash
# 1. Clear browser data
# DevTools → Application → Clear Storage → Clear site data

# 2. Restart backend
cd backend
npm run dev

# 3. Restart frontend
npm run dev

# 4. Login again
```

## Summary

The authentication persistence issue has been fixed by:
1. ✅ Adding proper token refresh on app bootstrap
2. ✅ Implementing refresh API method
3. ✅ Improving error handling in API interceptor
4. ✅ Adding initializing state for better UX
5. ✅ Preventing infinite refresh loops

Users should now be able to:
- ✅ Refresh the page without losing session
- ✅ Keep the app open for extended periods
- ✅ Have tokens automatically refreshed
- ✅ Experience seamless authentication

---

**Last Updated:** May 25, 2026
**Status:** Fixed ✅
