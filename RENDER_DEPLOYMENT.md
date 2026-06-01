# 🚀 Render Deployment Guide (100% Free)

## Why Render?
- ✅ 100% Free (no credits, no limits)
- ✅ No resource provision limits
- ✅ Easy GitHub integration
- ✅ Automatic deployments

## Step 1: Prepare for Deployment

### Check if your code is on GitHub:
```bash
cd "/Users/santhoshpitchai/Desktop/Intern-Flow Ai/internflow-ai"
git remote -v
```

If you see a GitHub URL, you're ready! If not, push to GitHub first.

## Step 2: Deploy to Render

1. **Go to [render.com](https://render.com)**
2. **Sign up with GitHub**
3. **Click "New +" → "Web Service"**
4. **Connect your GitHub repository**
5. **Configure the service:**

### Render Configuration:
```
Name: internflow-ai-backend
Root Directory: backend
Environment: Node
Region: Oregon (US West)
Branch: main (or master)

Build Command: npm install && npm run build
Start Command: npm start

Instance Type: Free
```

## Step 3: Environment Variables

After creating the service, go to "Environment" tab and add these variables:

### Copy these exact values:
```
NODE_ENV=production
PORT=4000
API_PREFIX=/api/v1

DATABASE_URL=postgresql://postgres.yttmzraxtjpdqvuijtib:Santhosh13%4020@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=20&pool_timeout=30&connect_timeout=30

DIRECT_URL=postgresql://postgres.yttmzraxtjpdqvuijtib:Santhosh13%4020@aws-1-ap-south-1.pooler.supabase.com:5432/postgres?connect_timeout=30&pool_timeout=30

JWT_ACCESS_SECRET=a9b8c60c50eb33c55e2f8f68474f6fce3bb2045f746c4263b7a66a5474099079
JWT_REFRESH_SECRET=ca7b418b44bdef9033bc9fab4ce4ea1d78ba1a9921d673e243c62fe915d63f4f
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

CLOUDINARY_CLOUD_NAME=dqlkztrro
CLOUDINARY_API_KEY=526967743393551
CLOUDINARY_API_SECRET=vdI-9JiGPDx5WmJRIw5UjYO8CMg

UPLOAD_DIR=uploads
MAX_FILE_SIZE_MB=5

SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=internflowainextgenai@gmail.com
SMTP_PASS=cicnoyhizatddhyn
FROM_EMAIL=internflowainextgenai@gmail.com

CORS_ORIGIN=https://your-frontend-url.vercel.app
```

## Step 4: Deploy and Test

1. **Click "Create Web Service"**
2. **Wait for deployment** (5-10 minutes)
3. **Get your URL**: `https://your-app-name.onrender.com`
4. **Test health endpoint**: `https://your-app-name.onrender.com/api/v1/health`

## Step 5: Run Database Migration

Once deployed, go to Render dashboard → Shell tab and run:
```bash
npx prisma migrate deploy
```

## Step 6: Deploy Frontend to Vercel

```bash
cd "/Users/santhoshpitchai/Desktop/Intern-Flow Ai/internflow-ai"
vercel login
vercel
```

Set environment variable:
```bash
vercel env add VITE_API_URL
# Enter: https://your-render-url.onrender.com/api/v1
```

Deploy to production:
```bash
vercel --prod
```

## Step 7: Update CORS

Update the CORS_ORIGIN in Render with your Vercel URL.

---

## ✅ Benefits of Render:
- No resource limits
- No credit system
- Automatic SSL
- GitHub integration
- Free forever

**Ready to deploy on Render?** 🚀