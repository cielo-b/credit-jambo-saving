#!/bin/bash

# Savings Management System - Setup Script
# This script sets up the entire project for development

set -e

echo "========================================"
echo "   Savings Management System Setup"
echo "========================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed${NC}"
    echo "Please install Node.js 18 or higher from https://nodejs.org"
    exit 1
fi

echo -e "${GREEN}✓${NC} Node.js version: $(node -v)"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo -e "${YELLOW}⚠${NC} PostgreSQL is not installed or not in PATH"
    echo "Please install PostgreSQL 14 or higher"
fi

echo ""
echo "========================================"
echo "   Installing Dependencies"
echo "========================================"
echo ""

# Backend
echo -e "${YELLOW}→${NC} Installing backend dependencies..."
cd savings-backend
npm install
cd ..
echo -e "${GREEN}✓${NC} Backend dependencies installed"

# Admin Frontend
echo -e "${YELLOW}→${NC} Installing admin frontend dependencies..."
cd admin-frontend
npm install
cd ..
echo -e "${GREEN}✓${NC} Admin frontend dependencies installed"

# Mobile App
echo -e "${YELLOW}→${NC} Installing mobile app dependencies..."
cd client-mobile
npm install
cd ..
echo -e "${GREEN}✓${NC} Mobile app dependencies installed"

echo ""
echo "========================================"
echo "   Creating Environment Files"
echo "========================================"
echo ""

# Backend .env
if [ ! -f savings-backend/.env ]; then
    echo -e "${YELLOW}→${NC} Creating backend .env file..."
    cat > savings-backend/.env << EOF
# Server Configuration
NODE_ENV=development
PORT=5000

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=savings_db

# JWT Configuration
JWT_SECRET=$(openssl rand -base64 32)
JWT_EXPIRES_IN=7d

# Security
BCRYPT_ROUNDS=10

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:19006
EOF
    echo -e "${GREEN}✓${NC} Backend .env file created"
else
    echo -e "${GREEN}✓${NC} Backend .env file already exists"
fi

# Admin Frontend .env
if [ ! -f admin-frontend/.env ]; then
    echo -e "${YELLOW}→${NC} Creating admin frontend .env file..."
    echo "REACT_APP_API_URL=http://localhost:5000/api" > admin-frontend/.env
    echo -e "${GREEN}✓${NC} Admin frontend .env file created"
else
    echo -e "${GREEN}✓${NC} Admin frontend .env file already exists"
fi

echo ""
echo "========================================"
echo "   Database Setup"
echo "========================================"
echo ""

echo -e "${YELLOW}→${NC} Please ensure PostgreSQL is running and you have created the database:"
echo -e "   ${GREEN}createdb savings_db${NC}"
echo ""
read -p "Press enter to continue once database is ready..."

echo ""
echo "========================================"
echo "   Setup Complete!"
echo "========================================"
echo ""
echo "Next steps:"
echo ""
echo "1. Start the backend:"
echo -e "   ${GREEN}cd savings-backend && npm run seed && npm run dev${NC}"
echo ""
echo "2. Start the admin dashboard (new terminal):"
echo -e "   ${GREEN}cd admin-frontend && npm start${NC}"
echo ""
echo "3. Start the mobile app (new terminal):"
echo -e "   ${GREEN}cd client-mobile && npm start${NC}"
echo ""
echo "Default credentials:"
echo -e "   Admin: ${GREEN}admin@savings.com / admin123${NC}"
echo -e "   Customer: ${GREEN}customer1@example.com / password123${NC}"
echo ""
echo -e "${GREEN}Happy coding!${NC}"

