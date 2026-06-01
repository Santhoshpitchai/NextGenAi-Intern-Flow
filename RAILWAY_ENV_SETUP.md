# 🚂 Railway Environment Variables Setup

## Copy these exact values into your Railway dashboard:

### 1. Server Configuration
```
NODE_ENV=production
PORT=4000
API_PREFIX=/api/v1
```

### 2. Database URLs (Replace with your actual Supabase URLs)
```
DATABASE_URL=postgresql://postgres.USER:PASSWORD@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=20&pool_timeout=30&connect_timeout=30
DIRECT_URL=postgresql://postgres.USER:PASSWORD@aws-1-ap-south-1.pooler.supabase.com:5432/postgres?connect_timeout=30&pool_timeout=30
```

### 3. JWT Secrets (Generate strong secrets - 32+ characters each)
```
JWT_ACCESS_SECRET=your-super-long-random-access-secret-minimum-32-characters-here
JWT_REFRESH_SECRET=your-super-long-random-refresh-secret-minimum-32-characters-here
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

### 6. CORS (Update after frontend deployment)
```
CORS_ORIGIN=https://your-frontend-url.vercel.app
```

---

## 🔐 Generate JWT Secrets

Use these commands to generate secure JWT secrets:

```bash
# Generate Access Secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate Refresh Secret  
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Or use these pre-generated secure secrets:
```
JWT_ACCESS_SECRET=a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456
JWT_REFRESH_SECRET=9876543210fedcba0987654321fedcba0987654321fedcba0987654321fedcba
```

---

## 📋 How to Set in Railway:

1. Go to your Railway project dashboard
2. Click on your service
3. Go to "Variables" tab
4. Add each variable one by one
5. Click "Deploy" after adding all variables

---

## ⚠️ Important Notes:

- Replace the DATABASE_URL and DIRECT_URL with your actual Supabase connection strings
- The Cloudinary credentials are already filled in for you
- Generate strong JWT secrets (32+ characters)
- Update CORS_ORIGIN after you get your Vercel frontend URL