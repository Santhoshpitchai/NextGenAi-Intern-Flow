# How to Get Your Supabase Connection String

## Step-by-Step Instructions:

### 1. Open Supabase Dashboard
Go to: https://supabase.com/dashboard/project/yttmzraxtjpdqvuijtib

### 2. Navigate to Database Settings
- Click on **Settings** (gear icon) in the left sidebar
- Click on **Database**

### 3. Find Connection String Section
Scroll down to find **"Connection string"** or **"Connection info"**

### 4. Get the Connection Pooling String (Recommended)
Look for **"Connection Pooling"** section and copy the **URI** format.

It should look like:
```
postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

**OR** if using Session mode:
```
postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres
```

### 5. Alternative: Direct Connection
If pooling doesn't work, use the direct connection:
```
postgresql://postgres:[YOUR-PASSWORD]@db.yttmzraxtjpdqvuijtib.supabase.co:5432/postgres
```

### 6. Replace Password
Replace `[YOUR-PASSWORD]` with: `Santhosh13@20`

**Important:** URL-encode the password:
- `@` becomes `%40`
- So `Santhosh13@20` becomes `Santhosh13%4020`

### 7. What to Copy

Please copy the **EXACT** connection string from your Supabase dashboard and share it here (you can replace the password with `****` for security).

The format should be one of these:

**Option A: Connection Pooler (Recommended)**
```
postgresql://postgres.[something]:[PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres
```

**Option B: Direct Connection**
```
postgresql://postgres:[PASSWORD]@db.yttmzraxtjpdqvuijtib.supabase.co:5432/postgres
```

**Option C: IPv4 Direct**
```
postgresql://postgres:[PASSWORD]@[IP-ADDRESS]:5432/postgres
```

---

## Current Issue

The connection is timing out, which usually means:

1. **Port 5432 is blocked** - Supabase free tier might require connection pooling
2. **IPv6 issue** - Your network might not support IPv6
3. **Firewall** - Corporate/home firewall blocking the connection
4. **Wrong region** - The pooler URL needs the correct AWS region

## Quick Test

Once you have the correct connection string, test it with:

```bash
# Test with psql (if installed)
psql "YOUR_CONNECTION_STRING_HERE"

# Or test with our script
node test-supabase-connection.js
```

## What I Need From You

Please go to your Supabase dashboard and copy the **exact connection string** from:

**Settings → Database → Connection string → URI**

And also check if there's a **"Connection Pooling"** section with a different URL.

Share both URLs here (hide the password) and I'll configure it correctly.
