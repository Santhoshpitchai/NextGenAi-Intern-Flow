#!/bin/bash

# Supabase Migration Script
# This script helps migrate your database to Supabase

set -e

echo "🚀 InternFlow AI - Supabase Migration Script"
echo "=============================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${RED}❌ Error: .env file not found${NC}"
    echo "Please create a .env file with your Supabase connection string"
    exit 1
fi

echo "📋 Step 1: Checking environment variables..."
if grep -q "DATABASE_URL" .env; then
    echo -e "${GREEN}✅ DATABASE_URL found${NC}"
else
    echo -e "${RED}❌ DATABASE_URL not found in .env${NC}"
    exit 1
fi

echo ""
echo "📋 Step 2: Checking Supabase connection..."
echo "Attempting to connect to Supabase..."

# Test connection
if npx prisma db execute --stdin <<< "SELECT 1;" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Successfully connected to Supabase${NC}"
else
    echo -e "${RED}❌ Failed to connect to Supabase${NC}"
    echo ""
    echo "Possible issues:"
    echo "1. Your Supabase project might be paused (free tier)"
    echo "   → Go to https://supabase.com/dashboard and resume your project"
    echo "2. Password might not be URL-encoded correctly"
    echo "   → Special characters like @ should be %40"
    echo "3. Network/firewall issues"
    echo "   → Check your internet connection"
    echo ""
    exit 1
fi

echo ""
echo "📋 Step 3: Generating Prisma Client..."
npm run prisma:generate

echo ""
echo "📋 Step 4: Pushing schema to Supabase..."
echo -e "${YELLOW}⚠️  This will create/update tables in your Supabase database${NC}"
read -p "Continue? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Migration cancelled"
    exit 0
fi

npm run prisma:push

echo ""
echo -e "${GREEN}✅ Migration completed successfully!${NC}"
echo ""
echo "📊 Next steps:"
echo "1. Verify tables in Supabase Dashboard: https://supabase.com/dashboard"
echo "2. Test the application: npm run dev"
echo "3. Create test users (admin and intern)"
echo "4. Test RBAC permissions"
echo ""
echo "📚 For more information, see SUPABASE_MIGRATION_GUIDE.md"
