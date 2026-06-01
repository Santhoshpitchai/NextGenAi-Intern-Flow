# 🚂 Complete Railway Environment Configuration

## Copy these EXACT values into Railway Dashboard:

### 1. Server Configuration
```
NODE_ENV=production
PORT=4000
API_PREFIX=/api/v1
```

### 2. Database Configuration (Your Supabase URLs)
```
DATABASE_URL=postgresql://postgres.yttmzraxtjpdqvuijtib:Santhosh13%4020@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=20&pool_timeout=30&connect_timeout=30
DIRECT_URL=postgresql://postgres.yttmzraxtjpdqvuijtib:Santhosh13%4020@aws-1-ap-south-1.pooler.supabase.com:5432/postgres?connect_timeout=30&pool_timeout=30
```

### 3. JWT Configuration (Generated secure secrets)
```
JWT_ACCESS_SECRET=a9b8c60c50eb33c55e2f8f68474f6fce3bb2045f746c4263b7a66a5474099079
JWT_REFRESH_SECRET=ca7b418b44bdef9033bc9fab4ce4ea1d78ba1a9921d673e243c62fe915d63f4f
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

### 4. Cloudinary Configuration (Your credentials)
```
CLOUDINARY_CLOUD_NAME=dqlkztrro
CLOUDINARY_API_KEY=526967743393551
CLOUDINARY_API_SECRET=vdI-9JiGPDx5WmJRIw5UjYO8CMg
```

### 5. File Upload Configuration
```
UPLOAD_DIR=uploads
MAX_FILE_SIZE_MB=5
```

### 6. Email Configuration (Your SMTP settings)
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=internflowainextgenai@gmail.com
SMTP_PASS=cicnoyhizatddhyn
FROM_EMAIL=internflowainextgenai@gmail.com
```

### 7. CORS Configuration (Update after frontend deployment)
```
CORS_ORIGIN=https://your-frontend-url.vercel.app
```

---

## 🚀 Deployment Steps:

### Step 1: Deploy Backend to Railway
```bash
cd "/Users/santhoshpitchai/Desktop/Intern-Flow Ai/internflow-ai/backend"
railway init
railway up
```

### Step 2: Set Environment Variables
1. Go to Railway dashboard
2. Click on your deployed service
3. Go to "Variables" tab
4. Copy and paste each variable above (one by one)
5. Click "Deploy" after adding all variables

### Step 3: Run Database Migration
```bash
railway run npx prisma migrate deploy
```

### Step 4: Test Backend
Visit: `https://your-railway-url.railway.app/api/v1/health`

---

## ✅ Ready to Deploy!

All your credentials are configured:
- ✅ Cloudinary: Ready for file uploads
- ✅ Supabase: Database configured
- ✅ JWT: Secure secrets generated
- ✅ SMTP: Email notifications ready

**Next: Run the deployment commands above!** 🎉