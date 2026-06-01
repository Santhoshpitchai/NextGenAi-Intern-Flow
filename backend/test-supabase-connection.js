#!/usr/bin/env node

/**
 * Supabase Connection Test Script
 * Run this to diagnose connection issues
 */

require("dotenv").config();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
  log: ["error", "warn"],
});

console.log("🔍 Supabase Connection Diagnostic Tool");
console.log("=====================================\n");

async function testConnection() {
  console.log("📋 Step 1: Checking environment variables...");

  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL not found in .env file");
    process.exit(1);
  }

  // Hide password in output
  const urlWithoutPassword = process.env.DATABASE_URL.replace(/:[^:@]+@/, ":****@");
  console.log("✅ DATABASE_URL found:", urlWithoutPassword);

  // Parse connection string
  try {
    const url = new URL(process.env.DATABASE_URL);
    console.log("\n📊 Connection Details:");
    console.log("   Protocol:", url.protocol);
    console.log("   Host:", url.hostname);
    console.log("   Port:", url.port);
    console.log("   Database:", url.pathname.slice(1));
    console.log("   User:", url.username);
  } catch (error) {
    console.error("❌ Invalid DATABASE_URL format:", error.message);
    process.exit(1);
  }

  console.log("\n📋 Step 2: Testing database connection...");

  try {
    await prisma.$connect();
    console.log("✅ Successfully connected to Supabase!");
  } catch (error) {
    console.error("❌ Connection failed:", error.message);
    console.log("\n🔧 Troubleshooting:");
    console.log("1. Check if your Supabase project is paused");
    console.log("   → Go to: https://supabase.com/dashboard");
    console.log("   → Click on your project");
    console.log('   → Look for "Resume" or "Restore" button');
    console.log("");
    console.log("2. Verify your connection string");
    console.log("   → Settings → Database → Connection string");
    console.log("   → Copy the URI format");
    console.log("");
    console.log("3. Check password encoding");
    console.log("   → Special characters must be URL-encoded");
    console.log("   → @ becomes %40, # becomes %23, etc.");
    console.log("");
    process.exit(1);
  }

  console.log("\n📋 Step 3: Testing database query...");

  try {
    const result = await prisma.$queryRaw`SELECT 1 as test, NOW() as current_time`;
    console.log("✅ Query executed successfully!");
    console.log("   Result:", result);
  } catch (error) {
    console.error("❌ Query failed:", error.message);
    process.exit(1);
  }

  console.log("\n📋 Step 4: Checking database version...");

  try {
    const version = await prisma.$queryRaw`SELECT version()`;
    console.log(
      "✅ PostgreSQL version:",
      version[0].version.split(" ")[0],
      version[0].version.split(" ")[1],
    );
  } catch (error) {
    console.error("❌ Version check failed:", error.message);
  }

  console.log("\n📋 Step 5: Checking existing tables...");

  try {
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `;

    if (tables.length === 0) {
      console.log("ℹ️  No tables found (database is empty)");
      console.log("   This is normal for a new database");
      console.log("   Run: npm run prisma:push");
    } else {
      console.log(`✅ Found ${tables.length} tables:`);
      tables.forEach((t) => console.log("   -", t.table_name));
    }
  } catch (error) {
    console.error("❌ Table check failed:", error.message);
  }

  await prisma.$disconnect();

  console.log("\n✅ All tests passed!");
  console.log("\n📚 Next steps:");
  console.log("1. Run migration: npm run prisma:push");
  console.log("2. Start server: npm run dev");
  console.log("3. Test API endpoints");
}

testConnection().catch((error) => {
  console.error("\n💥 Unexpected error:", error);
  process.exit(1);
});
