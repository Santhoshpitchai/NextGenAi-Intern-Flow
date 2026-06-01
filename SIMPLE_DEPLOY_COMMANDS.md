# 🚀 Simple Deployment Commands

Copy and paste these commands one by one in your terminal:

## 1. Deploy Backend to Railway

```bash
# Navigate to backend directory
cd "/Users/santhoshpitchai/Desktop/Intern-Flow Ai/internflow-ai/backend"

# Initialize Railway project (you're already logged in)
railway init

# Deploy backend
railway up
```

**After deployment, Railway will give you a URL like:** `https://your-app-name.railway.app`

## 2. Set Environment Variables in Railway

Go to your Railway dashboard and set these environment variables:

```bash
NODE_ENV=production
PORT=4000
API_PREFIX=/api/v1

# Your Supabase URLs (replace with actual values)
DATABASE_URL=your-supabase-pooler-url
DIRECT_URL=your-supabase-direct-url

# Generate strong secrets (32+ characters each)
JWT_ACCESS_SECRET=your-super-long-random-access-secret
JWT_REFRESH_SECRET=your-super-long-random-refresh-secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Cloudinary (get from cloudinary.com)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# File upload
UPLOAD_DIR=uploads
MAX_FILE_SIZE_MB=5

# CORS (update with your frontend URL later)
CORS_ORIGIN=https://your-frontend-url.vercel.app
```

## 3. Run Database Migration

```bash
# In backend directory
railway run npx prisma migrate deploy
```

## 4. Deploy Frontend to Vercel

```bash
# Navigate to frontend directory
cd "/Users/santhoshpitchai/Desktop/Intern-Flow Ai/internflow-ai"

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# - Link to existing project? N
# - Project name: internflow-ai
# - Directory: ./
# - Override settings? Y
# - Build command: npm run build
# - Output directory: dist/client
# - Development command: npm run dev

# Deploy to production
vercel --prod
```

## 5. Set Frontend Environment Variable

```bash
# Set API URL (replace with your Railway URL)
vercel env add VITE_API_URL
# Enter: https://your-railway-url.railway.app/api/v1
```

## 6. Update CORS in Railway

Update the CORS_ORIGIN in Railway dashboard with your Vercel URL.

## 7. Test Your Deployment

- Backend health: `https://your-railway-url.railway.app/api/v1/health`
- Frontend: `https://your-vercel-url.vercel.app`

---

## Need Cloudinary Account?

1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up (free)
3. Get credentials from dashboard
4. Add to Railway environment variables

That's it! Your app will be fully deployed! 🎉