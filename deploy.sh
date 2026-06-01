#!/bin/bash

# InternFlow AI - Production Deployment Script
# This script helps automate the deployment process

set -e

echo "🚀 InternFlow AI - Production Deployment"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 20+"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm"
        exit 1
    fi
    
    print_success "Dependencies check passed"
}

# Install dependencies
install_dependencies() {
    print_status "Installing frontend dependencies..."
    npm install
    
    print_status "Installing backend dependencies..."
    cd backend
    npm install
    cd ..
    
    print_success "Dependencies installed"
}

# Build applications
build_applications() {
    print_status "Building backend..."
    cd backend
    npm run build
    cd ..
    
    print_status "Building frontend..."
    npm run build
    
    print_success "Applications built successfully"
}

# Deploy to Railway (Backend)
deploy_backend() {
    print_status "Deploying backend to Railway..."
    
    if ! command -v railway &> /dev/null; then
        print_warning "Railway CLI not found. Installing..."
        npm install -g @railway/cli
    fi
    
    cd backend
    
    # Check if railway is initialized
    if [ ! -f "railway.json" ]; then
        print_status "Initializing Railway project..."
        railway init
    fi
    
    print_status "Deploying to Railway..."
    railway up
    
    print_status "Running database migrations..."
    railway run npx prisma migrate deploy
    
    cd ..
    print_success "Backend deployed to Railway"
}

# Deploy to Vercel (Frontend)
deploy_frontend() {
    print_status "Deploying frontend to Vercel..."
    
    if ! command -v vercel &> /dev/null; then
        print_warning "Vercel CLI not found. Installing..."
        npm install -g vercel
    fi
    
    print_status "Deploying to Vercel..."
    vercel --prod
    
    print_success "Frontend deployed to Vercel"
}

# Main deployment function
main() {
    echo ""
    print_status "Starting deployment process..."
    echo ""
    
    check_dependencies
    install_dependencies
    build_applications
    
    echo ""
    print_warning "Before deploying, make sure you have:"
    print_warning "1. Set up Cloudinary account and credentials"
    print_warning "2. Configured environment variables in Railway"
    print_warning "3. Set VITE_API_URL in Vercel environment"
    echo ""
    
    read -p "Do you want to continue with deployment? (y/N): " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        deploy_backend
        deploy_frontend
        
        echo ""
        print_success "🎉 Deployment completed successfully!"
        print_status "Next steps:"
        print_status "1. Update CORS_ORIGIN in Railway with your Vercel URL"
        print_status "2. Test your application thoroughly"
        print_status "3. Monitor logs for any issues"
        echo ""
    else
        print_status "Deployment cancelled by user"
    fi
}

# Run main function
main