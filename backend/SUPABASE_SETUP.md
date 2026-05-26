# Supabase Connection Setup

## Issue: Can't reach database server

This usually means:
1. **Project is paused** (most common for free tier)
2. **Wrong connection string**
3. **Network/firewall issue**

## Solution Steps:

### Step 1: Get Your Connection String from Supabase

1. Go to: https://supabase.com/dashboard
2. Select your project: `yttmzraxtjpdqvuijtib`
3. Click on **Settings** (gear icon in sidebar)
4. Click on **Database**
5. Scroll to **Connection string** section
6. Select **URI** tab
7. Copy the connection string

It should look like:
```
postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

**Important:** The format might be different from what you provided!

### Step 2: Check Project Status

In your Supabase dashboard:
- Look for project status indicator
- If it says "Paused" or "Inactive", click **Resume** or **Restore**
- Wait 1-2 minutes for the database to start

### Step 3: Update Your .env File

Replace the DATABASE_URL in your `.env` file with the correct one from Supabase.

**Important Notes:**
- Use the **Transaction mode** connection string (port 6543 with pooler)
- For migrations, you might need the **Direct connection** (port 5432)
- Replace `[YOUR-PASSWORD]` with your actual password
- URL-encode special characters in password:
  - `@` → `%40`
  - `#` → `%23`
  - `$` → `%24`
  - `%` → `%25`
  - `&` → `%26`

### Step 4: Test Connection

```bash
# Test with psql (if installed)
psql "postgresql://postgres:Santhosh13%4020@db.yttmzraxtjpdqvuijtib.supabase.co:5432/postgres"

# Or test with Prisma
npx prisma db execute --stdin <<< "SELECT 1;"
```

### Step 5: Alternative - Use Supabase Pooler

If direct connection doesn't work, try the pooler connection:

```env
# Connection Pooler (for application)
DATABASE_URL="postgresql://postgres.yttmzraxtjpdqvuijtib:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct Connection (for migrations)
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.yttmzraxtjpdqvuijtib.supabase.co:5432/postgres"
```

Then update `schema.prisma`:
```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

## Common Issues & Solutions

### Issue 1: Project Paused
**Symptom:** Can't reach database server
**Solution:** 
1. Go to Supabase dashboard
2. Click "Resume" or "Restore" on your project
3. Wait 1-2 minutes
4. Try connection again

### Issue 2: Wrong Password
**Symptom:** Authentication failed
**Solution:**
1. Reset database password in Supabase Settings → Database
2. Update .env with new password (URL-encoded)
3. Try again

### Issue 3: Wrong Connection String Format
**Symptom:** Can't reach database server
**Solution:**
1. Get fresh connection string from Supabase dashboard
2. Make sure you're using the correct format
3. Check if you need pooler vs direct connection

### Issue 4: Firewall/Network
**Symptom:** Timeout or connection refused
**Solution:**
1. Check your internet connection
2. Try from different network
3. Check if corporate firewall blocks Supabase
4. Try using VPN

## Quick Test Script

Create a file `test-connection.js`:

```javascript
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
});

async function testConnection() {
  try {
    console.log('Testing Supabase connection...');
    await prisma.$connect();
    console.log('✅ Connected successfully!');
    
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Query executed:', result);
    
    await prisma.$disconnect();
    console.log('✅ Disconnected successfully!');
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();
```

Run it:
```bash
node test-connection.js
```

## What to Do Right Now

1. **Open Supabase Dashboard:**
   ```
   https://supabase.com/dashboard/project/yttmzraxtjpdqvuijtib
   ```

2. **Check Project Status:**
   - Is it showing "Active" or "Paused"?
   - If paused, click "Resume"

3. **Get Fresh Connection String:**
   - Settings → Database → Connection string
   - Copy the URI format

4. **Update .env:**
   - Replace DATABASE_URL with the new string
   - Make sure password is URL-encoded

5. **Try Migration Again:**
   ```bash
   npm run prisma:push
   ```

## Still Not Working?

If you're still having issues, you have two options:

### Option A: Use Local PostgreSQL (Temporary)
```bash
# Install PostgreSQL locally
brew install postgresql@15
brew services start postgresql@15

# Create database
createdb internflow

# Update .env
DATABASE_URL="postgresql://postgres:@localhost:5432/internflow?schema=public"

# Run migration
npm run prisma:push
```

### Option B: Create New Supabase Project
1. Go to https://supabase.com/dashboard
2. Create new project
3. Wait for it to be ready
4. Get connection string
5. Update .env
6. Run migration

## Need Help?

Share the following information:
1. Project status from Supabase dashboard (Active/Paused)
2. Connection string format you're using (hide password)
3. Error message you're getting
4. Output of: `npx prisma db execute --stdin <<< "SELECT 1;"`
