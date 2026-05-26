# Supabase Connection Pool Fix

## Problem
You're experiencing database connection errors:
- `Can't reach database server at aws-1-ap-south-1.pooler.supabase.com:5432`
- `Timed out fetching a new connection from the connection pool`
- `Connection pool timeout: 10, connection limit: 17`

## Root Causes

### 1. **Wrong Pooler Type**
You were using the **Session Pooler** (port 5432) which is not recommended for Prisma. Prisma works best with the **Transaction Pooler** (port 6543).

### 2. **Database Paused**
Supabase free tier databases pause after 1 week of inactivity. The database needs to be "woken up" by accessing it through the Supabase dashboard.

### 3. **No Connection Limits**
The connection string didn't have proper connection limits configured, causing connection pool exhaustion.

## Solution Applied

### 1. **Updated Prisma Schema**
Added `directUrl` for migrations:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

### 2. **Updated Connection Strings**
Changed from Session Pooler to Transaction Pooler:

**Before:**
```
DATABASE_URL="postgresql://...@aws-1-ap-south-1.pooler.supabase.com:5432/postgres"
```

**After:**
```
# Transaction pooler (port 6543) with pgbouncer and connection limit
DATABASE_URL="postgresql://...@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=5"

# Direct connection (port 5432) for migrations
DIRECT_URL="postgresql://...@aws-1-ap-south-1.pooler.supabase.com:5432/postgres"
```

### 3. **Connection String Parameters**
- `pgbouncer=true` - Enables PgBouncer connection pooling
- `connection_limit=5` - Limits connections to prevent pool exhaustion
- Port `6543` - Transaction pooler (better for Prisma)
- Port `5432` - Direct connection (for migrations only)

## Steps to Fix

### Step 1: Wake Up Your Supabase Database

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `yttmzraxtjpdqvuijtib`
3. Go to **Database** → **Connection Pooler**
4. If you see "Database paused", click **Resume Database**
5. Wait 30-60 seconds for the database to wake up

### Step 2: Verify Connection Strings

Your `.env` file has been updated with:
```env
DATABASE_URL="postgresql://postgres.yttmzraxtjpdqvuijtib:Santhosh13%4020@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=5"
DIRECT_URL="postgresql://postgres.yttmzraxtjpdqvuijtib:Santhosh13%4020@aws-1-ap-south-1.pooler.supabase.com:5432/postgres"
```

### Step 3: Regenerate Prisma Client

```bash
cd backend
npx prisma generate
```

### Step 4: Test Connection

```bash
# Test the connection
npx prisma db pull

# If successful, you should see:
# "Introspecting based on datasource defined in prisma/schema.prisma"
```

### Step 5: Restart Backend Server

```bash
# Stop the current server (Ctrl+C)
npm run dev
```

## Understanding Supabase Poolers

### Transaction Pooler (Port 6543) ✅ Recommended for Prisma
- Uses PgBouncer in transaction mode
- Each transaction gets a connection
- Best for Prisma and most ORMs
- Lower connection overhead

### Session Pooler (Port 5432) ❌ Not for Prisma
- Uses PgBouncer in session mode
- Each client gets a dedicated connection
- Can exhaust connection pool quickly
- Not recommended for Prisma

### Direct Connection (Port 5432 without pooler)
- Direct PostgreSQL connection
- Use only for migrations
- Limited to 15 concurrent connections on free tier

## Connection Limits

### Supabase Free Tier Limits:
- **Direct connections**: 15 max
- **Pooled connections**: 200 max (shared across all apps)
- **Recommended per app**: 5-10 connections

### Our Configuration:
- `connection_limit=5` - Limits this app to 5 connections
- Prevents pool exhaustion
- Leaves room for other apps/tools

## Troubleshooting

### Error: "Can't reach database server"
**Solution**: Database is paused. Wake it up in Supabase dashboard.

### Error: "Connection pool timeout"
**Solution**: 
1. Check if using Transaction Pooler (port 6543)
2. Verify `connection_limit=5` is in URL
3. Restart backend server

### Error: "Too many connections"
**Solution**: Lower `connection_limit` to 3 or 4:
```
DATABASE_URL="...?pgbouncer=true&connection_limit=3"
```

### Error: "Migrations fail"
**Solution**: Migrations need direct connection. Use:
```bash
DATABASE_URL="$DIRECT_URL" npx prisma migrate deploy
```

## Best Practices

1. **Always use Transaction Pooler** (port 6543) for Prisma
2. **Set connection limits** to prevent pool exhaustion
3. **Use directUrl** for migrations
4. **Monitor connection usage** in Supabase dashboard
5. **Keep database active** or expect 30-60s wake-up time

## Verification

After applying the fix, you should see:
```
✅ Database connected
✅ InternFlow API running on http://localhost:4000
✅ No connection timeout errors
✅ Fast query responses (<500ms)
```

## Additional Resources

- [Prisma with Supabase](https://www.prisma.io/docs/guides/database/supabase)
- [Supabase Connection Pooling](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler)
- [PgBouncer Documentation](https://www.pgbouncer.org/usage.html)
