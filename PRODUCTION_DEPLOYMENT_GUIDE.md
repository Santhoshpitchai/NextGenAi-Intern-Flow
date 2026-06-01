# 🚀 InternFlow AI - Complete Production Deployment Guide

This guide will help you deploy your InternFlow AI application to production with zero local dependencies and fix the frontend freezing issues.

## 📋 Prerequisites

1. **Accounts needed:**
   - [Vercel](https://vercel.com) (Frontend hosting)
   - [Railway](https://railway.app) (Backend hosting)
   - [Supabase](https://supabase.com) (Database - already configured)
   - [Cloudinary](https://cloudinary.com) (File storage)

2. **Tools to install:**
   ```bash
   npm install -g vercel
   npm install -g @railway/cli
   ```

---

## 🗄️ Step 1: Setup Cloudinary (File Storage)

### 1.1 Create Cloudinary Account
1. Go to [Cloudinary](https://cloudinary.com) and sign up
2. Go to Dashboard → Settings → Security
3. Copy these values:
   - Cloud Name
   - API Key  
   - API Secret

### 1.2 Configure Environment Variables
You'll need these for the backend deployment.

---

## 🚂 Step 2: Deploy Backend to Railway

### 2.1 Setup Railway
1. Go to [Railway](https://railway.app) and sign up with GitHub
2. Install Railway CLI:
   ```bash
   npm install -g @railway/cli
   ```
3. Login to Railway:
   ```bash
   railway login
   ```

### 2.2 Deploy Backend
1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Initialize Railway project:
   ```bash
   railway init
   ```

3. Set environment variables in Railway dashboard:
   ```bash
   # Database (use your existing Supabase URLs)
   DATABASE_URL=postgresql://postgres.USER:PASSWORD@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=20&pool_timeout=30&connect_timeout=30
   DIRECT_URL=postgresql://postgres.USER:PASSWORD@aws-1-ap-south-1.pooler.supabase.com:5432/postgres?connect_timeout=30&pool_timeout=30
   
   # JWT Secrets (generate strong secrets)
   JWT_ACCESS_SECRET=your-super-long-random-access-secret-here
   JWT_REFRESH_SECRET=your-super-long-random-refresh-secret-here
   JWT_ACCESS_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=7d
   
   # Server Config
   NODE_ENV=production
   PORT=4000
   API_PREFIX=/api/v1
   
   # CORS (will be updated with frontend URL)
   CORS_ORIGIN=https://your-frontend-url.vercel.app
   
   # Cloudinary (from Step 1)
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   
   # File Upload
   UPLOAD_DIR=uploads
   MAX_FILE_SIZE_MB=5
   ```

4. Deploy to Railway:
   ```bash
   railway up
   ```

5. Get your Railway backend URL (something like: `https://your-app.railway.app`)

### 2.3 Run Database Migrations
```bash
railway run npx prisma migrate deploy
```

---

## 🌐 Step 3: Deploy Frontend to Vercel

### 3.1 Setup Vercel
1. Go to [Vercel](https://vercel.com) and sign up with GitHub
2. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

### 3.2 Configure Frontend Environment
1. Create production environment file:
   ```bash
   # In the root directory (not backend)
   cp .env.example .env.production
   ```

2. Update `.env.production`:
   ```bash
   VITE_API_URL=https://your-backend-url.railway.app/api/v1
   ```

### 3.3 Deploy to Vercel
1. From the root directory:
   ```bash
   vercel
   ```

2. Follow the prompts:
   - Link to existing project? **N**
   - Project name: **internflow-ai**
   - Directory: **./** (current directory)
   - Override settings? **Y**
   - Build command: **npm run build**
   - Output directory: **dist/client**
   - Development command: **npm run dev**

3. Set environment variables in Vercel:
   ```bash
   vercel env add VITE_API_URL
   # Enter: https://your-backend-url.railway.app/api/v1
   ```

4. Deploy to production:
   ```bash
   vercel --prod
   ```

### 3.4 Update Backend CORS
Update the CORS_ORIGIN in Railway with your Vercel URL:
```bash
CORS_ORIGIN=https://your-frontend-url.vercel.app
```

---

## 🔧 Step 4: Fix Frontend Issues

### 4.1 Common Issues & Solutions

**Issue: Frozen Screen/Non-clickable Elements**
- **Cause**: Incorrect API URL or CORS issues
- **Solution**: Ensure VITE_API_URL points to your Railway backend and CORS is properly configured

**Issue: File Upload/Download Not Working**
- **Cause**: Local file storage doesn't work in production
- **Solution**: Cloudinary integration (already implemented)

**Issue: Authentication Issues**
- **Cause**: JWT secrets not set or different between environments
- **Solution**: Use the same JWT secrets in both development and production

### 4.2 Verify Deployment
1. **Backend Health Check**: Visit `https://your-backend-url.railway.app/api/v1/health`
2. **Frontend**: Visit your Vercel URL
3. **Database**: Check Supabase dashboard for connections

---

## 📱 Step 5: Testing Production Setup

### 5.1 Test Checklist
- [ ] Frontend loads without errors
- [ ] User registration works
- [ ] User login works
- [ ] File upload works (resume, profile photo)
- [ ] File download works
- [ ] All pages are clickable and responsive
- [ ] API calls work correctly

### 5.2 Monitoring
- **Railway**: Monitor backend logs and performance
- **Vercel**: Monitor frontend deployments and analytics
- **Supabase**: Monitor database performance and connections
- **Cloudinary**: Monitor file storage usage

---

## 🚨 Troubleshooting

### Common Issues:

1. **"Network Error" in Frontend**
   ```bash
   # Check CORS configuration in Railway
   CORS_ORIGIN=https://your-exact-vercel-url.vercel.app
   ```

2. **Database Connection Issues**
   ```bash
   # Verify Supabase URLs are correct
   # Check if IP is whitelisted in Supabase
   ```

3. **File Upload Fails**
   ```bash
   # Verify Cloudinary credentials
   # Check file size limits
   ```

4. **Build Failures**
   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

---

## 🎯 Production URLs

After successful deployment, you'll have:

- **Frontend**: `https://your-app.vercel.app`
- **Backend API**: `https://your-app.railway.app/api/v1`
- **Database**: Supabase (existing)
- **File Storage**: Cloudinary

---

## 🔄 Future Deployments

### Frontend Updates:
```bash
git push origin main  # Auto-deploys via Vercel GitHub integration
# OR
vercel --prod
```

### Backend Updates:
```bash
cd backend
railway up
```

### Database Schema Changes:
```bash
cd backend
railway run npx prisma migrate deploy
```

---

## 📞 Support

If you encounter issues:
1. Check Railway logs: `railway logs`
2. Check Vercel deployment logs in dashboard
3. Verify all environment variables are set correctly
4. Test API endpoints individually

Your application will now be fully deployed with no local dependencies! 🎉