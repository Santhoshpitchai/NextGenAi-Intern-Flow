# 🛡️ CORS Configuration Reference

## Current Configuration (Working)
```javascript
// backend/src/app.ts
cors({
  origin: true, // Allows ALL origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
})
```

## Future Production Configuration (More Secure)
When ready for production, replace with:

```javascript
cors({
  origin: [
    'https://nextgenai-intern-flow.pages.dev',
    'https://your-custom-domain.com',
    'http://localhost:5173', // For local development
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
})
```

## Environment Variable Approach (Most Flexible)
```javascript
cors({
  origin: process.env.CORS_ORIGIN?.split(',') || true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
})
```

Then set `CORS_ORIGIN` environment variable:
```
CORS_ORIGIN=https://nextgenai-intern-flow.pages.dev,https://your-domain.com
```

## If CORS Issues Return
1. Check if your domain changed
2. Verify the backend deployment succeeded
3. Check browser console for specific error messages
4. Test with `origin: true` temporarily to confirm it's CORS

## Common CORS Error Messages
- `ERR_BLOCKED_BY_RESPONSE.NotSameOrigin` = Origin not allowed
- `CORS policy: No 'Access-Control-Allow-Origin'` = CORS not configured
- `timeout of 30000ms exceeded` = Usually network/server issue, not CORS

## Deployment Checklist
- ✅ Backend code includes CORS configuration
- ✅ Environment variables set (if using)
- ✅ Frontend points to correct backend URL
- ✅ Both frontend and backend deployed
- ✅ Test with browser developer tools

---
**Last Updated**: June 6, 2026
**Status**: CORS fully resolved with `origin: true`