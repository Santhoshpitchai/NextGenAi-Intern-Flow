import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function testConnection() {
  try {
    console.log('🔄 Testing database connection...\n');
    
    // Test 1: Basic connection
    await prisma.$connect();
    console.log('✅ Database connected successfully!\n');
    
    // Test 2: Count users
    const userCount = await prisma.user.count();
    console.log(`✅ Found ${userCount} users in database\n`);
    
    // Test 3: Count other tables (if they exist)
    try {
      const [assignmentCount, dailyUpdateCount, requestCount, messageCount] = await Promise.all([
        prisma.assignment.count().catch(() => 0),
        prisma.dailyUpdate.count().catch(() => 0),
        prisma.request.count().catch(() => 0),
        prisma.message.count().catch(() => 0),
      ]);
      
      console.log('📊 Database Statistics:');
      console.log(`   - Users: ${userCount}`);
      console.log(`   - Assignments: ${assignmentCount}`);
      console.log(`   - Daily Updates: ${dailyUpdateCount}`);
      console.log(`   - Requests: ${requestCount}`);
      console.log(`   - Messages: ${messageCount}\n`);
    } catch (err) {
      console.log('⚠️  Some tables may not exist yet\n');
    }
    
    console.log('✅ All connection tests passed!\n');
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
