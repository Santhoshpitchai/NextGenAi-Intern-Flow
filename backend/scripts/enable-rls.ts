import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("--------------------------------------------------");
  console.log("🔒 SECURING DATABASE: ENABLING ROW LEVEL SECURITY (RLS)");
  console.log("--------------------------------------------------");

  try {
    // 1. Get all table names in the 'public' schema
    const tablesResult = await prisma.$queryRaw<Array<{ table_name: string }>>`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE';
    `;

    if (!tablesResult || tablesResult.length === 0) {
      console.log("⚠️ No tables found in public schema.");
      return;
    }

    console.log(`Found ${tablesResult.length} tables in public schema.`);
    console.log("Enabling RLS on all tables...");

    // 2. Loop and enable RLS on each table
    for (const row of tablesResult) {
      const tableName = row.table_name;
      try {
        await prisma.$executeRawUnsafe(`ALTER TABLE "public"."${tableName}" ENABLE ROW LEVEL SECURITY;`);
        console.log(`✅ Enabled RLS on: ${tableName}`);
      } catch (err: any) {
        console.error(`❌ Failed to enable RLS on "${tableName}":`, err.message || err);
      }
    }

    console.log("--------------------------------------------------");
    console.log("🎉 SUCCESS: Row Level Security has been enabled on all tables!");
    console.log("--------------------------------------------------");
  } catch (error: any) {
    console.error("❌ Critical failure during RLS execution:", error.message || error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
