# 📋 Deployment Checklist

Use this checklist to ensure a successful deployment of your InternFlow AI application.

## Pre-Deployment Setup

### 1. Account Creation
- [ ] Create [Vercel](https://vercel.com) account
- [ ] Create [Railway](https://railway.app) account  
- [ ] Create [Cloudinary](https://cloudinary.com) account
- [ ] Verify [Supabase](https://supabase.com) database is accessible

### 2. Environment Variables Collection
- [ ] Supabase DATABASE_URL (pooler connection)
- [ ] Supabase DIRECT_URL (direct connection)
- [ ] Cloudinary Cloud Name
- [ ] Cloudinary API Key
- [ ] Cloudinary API Secret
- [ ] Generate JWT Access Secret (32+ characters)
- [ ] Generate JWT Refresh Secret (32+ characters)

### 3. CLI Tools Installation
```bash
npm install -g vercel
npm install -g @railway/cli
```
- [ ] Vercel CLI installed: `vercel --version`
- [ ] Railway CLI installed: `railway --version`

## Backend Deployment (Railway)

### 4. Railway Setup
- [ ] Login to Railway: `railway login`
- [ ] Navigate to backend directory: `cd backend`
- [ ] Initialize project: `railway init`
- [ ] Deploy: `railway up`

### 5. Environment Variables in Railway
Set these in Railway dashboard or via CLI:

- [ ] `NODE_ENV=production`
- [ ] `PORT=4000`
- [ ] `API_PREFIX=/api/v1`
- [ ] `DATABASE_URL=your-supabase-pooler-url`
- [ ] `DIRECT_URL=your-supabase-direct-url`
- [ ] `JWT_ACCESS_SECRET=your-access-secret`
- [ ] `JWT_REFRESH_SECRET=your-refresh-secret`
- [ ] `JWT_ACCESS_EXPIRES_IN=15m`
- [ ] `JWT_REFRESH_EXPIRES_IN=7d`
- [ ] `CLOUDINARY_CLOUD_NAME=your-cloud-name`
- [ ] `CLOUDINARY_API_KEY=your-api-key`
- [ ] `CLOUDINARY_API_SECRET=your-api-secret`
- [ ] `UPLOAD_DIR=uploads`
- [ ] `MAX_FILE_SIZE_MB=5`
- [ ] `CORS_ORIGIN=https://your-frontend-url.vercel.app` (update after frontend deployment)

### 6. Database Migration
- [ ] Run migrations: `railway run npx prisma migrate deploy`
- [ ] Verify database connection: Visit `/api/v1/health` endpoint

## Frontend Deployment (Vercel)

### 7. Vercel Setup
- [ ] Login to Vercel: `vercel login`
- [ ] From root directory: `vercel`
- [ ] Configure project settings:
  - Build command: `npm run build`
  - Output directory: `dist/client`
  - Development command: `npm run dev`

### 8. Environment Variables in Vercel
- [ ] Set `VITE_API_URL=https://your-railway-url.railway.app/api/v1`

### 9. Production Deployment
- [ ] Deploy: `vercel --prod`
- [ ] Get Vercel URL from output

## Post-Deployment Configuration

### 10. Update CORS
- [ ] Update `CORS_ORIGIN` in Railway with your Vercel URL
- [ ] Redeploy backend if needed

### 11. Testing Checklist
- [ ] Frontend loads without errors
- [ ] Backend health check works: `https://your-backend.railway.app/api/v1/health`
- [ ] User registration works
- [ ] User login works
- [ ] File upload works (resume, profile photo)
- [ ] File download works
- [ ] Navigation is responsive and clickable
- [ ] API calls complete successfully
- [ ] No console errors in browser

### 12. Performance Verification
- [ ] Page load times are acceptable
- [ ] Images load properly
- [ ] File uploads complete within reasonable time
- [ ] Database queries are fast
- [ ] No memory leaks or freezing

## Troubleshooting

### Common Issues:
1. **Frontend freezing/non-clickable**
   - Check CORS configuration
   - Verify API URL is correct
   - Check browser console for errors

2. **File upload/download issues**
   - Verify Cloudinary credentials
   - Check file size limits
   - Test with different file types

3. **Authentication problems**
   - Verify JWT secrets match
   - Check token expiration settings
   - Test login/logout flow

4. **Database connection issues**
   - Verify Supabase URLs
   - Check connection limits
   - Test with Prisma Studio

## Monitoring Setup

### 13. Set Up Monitoring
- [ ] Enable Railway metrics and logs
- [ ] Set up Vercel analytics
- [ ] Monitor Supabase performance
- [ ] Set up Cloudinary usage alerts

### 14. Backup Strategy
- [ ] Database backup schedule (Supabase handles this)
- [ ] Environment variables backup
- [ ] Code repository backup (GitHub)

## Success Criteria

✅ **Deployment is successful when:**
- All checklist items are completed
- Application loads and functions correctly
- No errors in production logs
- File upload/download works seamlessly
- Users can register, login, and use all features
- Performance is acceptable for end users

---

**Estimated Deployment Time:** 30-60 minutes
**Prerequisites:** Basic knowledge of CLI tools and environment variables