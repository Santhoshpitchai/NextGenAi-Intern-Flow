#!/bin/bash

echo "🚀 Starting InternFlow Backend..."
echo ""

cd backend

echo "📦 Checking Prisma Client..."
npx prisma generate

echo ""
echo "🔥 Starting Backend Server..."
echo "Backend will run on: http://localhost:4000"
echo ""

npm run dev
