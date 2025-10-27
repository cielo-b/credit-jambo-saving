# 💰 Credit Jambo - Savings Management System

A complete full-stack savings management application with device-based authentication, transaction tracking, and admin controls.

## 🌟 Overview

This project consists of three fully Dockerized applications:

1. **Backend API** - Node.js + TypeScript + PostgreSQL + Jest
2. **Admin Dashboard** - React.js + Redux + Tailwind CSS + Jest
3. **Mobile App** - React Native + Expo + Jest

## 📚 Documentation

- **[Docker Guide](DOCKER_GUIDE.md)** - Complete Docker deployment and management
- **[Testing Guide](TESTING_GUIDE.md)** - Comprehensive testing documentation
- **[Logo Design](LOGO_DESIGN.md)** - Brand identity and logo specifications
- **[Quick Start](QUICK_START.md)** - Get up and running quickly

## 🚀 Key Features

### 🔐 Security & Authentication

- **SHA-512 Password Hashing** - Secure password storage
- **JWT Authentication** - Token-based authentication with device tracking
- **Device Verification** - Admin must approve devices before full access
- **Rate Limiting** - Prevents brute force attacks
- **Input Validation** - DTO-based validation with class-validator
- **Secure Headers** - Helmet.js security middleware

### 💼 User Features (Mobile App)

- User registration with automatic device registration
- Secure login with device verification
- View current balance in real-time
- Make deposits with quick amounts
- Withdraw funds with balance validation
- Complete transaction history with filtering
- Pull-to-refresh for data updates
- Beautiful, modern UI/UX

### 👨‍💼 Admin Features (Web Dashboard)

- Comprehensive user management
- Device verification system
- Transaction monitoring (all users)
- Dashboard with statistics
- Search and filter capabilities
- Pending device approvals
- Financial overview

### 🏦 Transaction Management

- Deposit and withdrawal operations
- Balance tracking before/after transactions
- Transaction history with pagination
- Description support
- Prevent over-withdrawal
- Real-time balance updates

## 📋 Technology Stack

### Backend

- **Runtime:** Node.js 18+
- **Language:** TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL 14+
- **ORM:** TypeORM
- **Authentication:** JWT (jsonwebtoken)
- **Security:** Helmet, express-rate-limit, SHA-512
- **Validation:** class-validator, class-transformer
- **Testing:** Jest + ts-jest + supertest
- **Deployment:** Docker (multi-stage build)

### Admin Frontend

- **Framework:** React.js 19 + TypeScript
- **State Management:** Redux Toolkit
- **Styling:** Tailwind CSS
- **Routing:** React Router v7
- **HTTP:** Axios
- **UI:** Headless UI + Heroicons
- **Testing:** Jest + React Testing Library
- **Deployment:** Docker + Nginx

### Mobile App

- **Framework:** React Native + Expo
- **Language:** TypeScript
- **State Management:** Redux Toolkit
- **Navigation:** React Navigation
- **HTTP:** Axios
- **Storage:** AsyncStorage
- **Testing:** Jest + React Native Testing Library + jest-expo
- **Deployment:** Docker (Expo Web) + Nginx

## 🏗️ Project Structure

```
credit-jambo/
├── savings-backend/          # Backend API
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── controllers/     # Route controllers
│   │   ├── dtos/           # Data transfer objects
│   │   ├── entities/       # TypeORM entities
│   │   ├── middlewares/    # Express middlewares
│   │   ├── routes/         # API routes
│   │   ├── scripts/        # Utility scripts
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Helper functions
│   │   └── server.ts       # Entry point
│   ├── Dockerfile
│   └── package.json
│
├── admin-frontend/          # Admin Dashboard
│   ├── src/
│   │   ├── api/            # API configuration
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom hooks
│   │   ├── pages/          # Page components
│   │   ├── store/          # Redux store
│   │   └── App.tsx
│   ├── Dockerfile
│   └── package.json
│
├── client-mobile/           # Mobile App
│   ├── src/
│   │   ├── api/            # API configuration
│   │   ├── hooks/          # Custom hooks
│   │   ├── navigation/     # Navigation setup
│   │   ├── screens/        # App screens
│   │   └── store/          # Redux store
│   ├── App.tsx
│   └── package.json
│
└── docker-compose.yml       # Docker orchestration
```

## 🚀 Quick Start

### Prerequisites

- **Docker** (v20.10+) & **Docker Compose** (v2.0+) - Recommended
- OR Node.js 18+, PostgreSQL 14+, npm/yarn

### Option 1: Docker Setup (⭐ Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd credit-jambo

# Start all services (builds images automatically)
docker-compose up -d

# Run database migrations and seed data
docker-compose exec backend npm run migration:run
docker-compose exec backend npm run seed

# View logs
docker-compose logs -f

# Run tests
docker-compose exec backend npm test
docker-compose exec admin npm test
docker-compose exec mobile-web npm test
```

**Access Applications:**

- 🌐 Backend API: http://localhost:5000
- 💼 Admin Dashboard: http://localhost:3000
- 📱 Mobile Web: http://localhost:8080
- 🗄️ PostgreSQL: localhost:5432

**See [DOCKER_GUIDE.md](DOCKER_GUIDE.md) for detailed Docker documentation.**

### Option 2: Manual Setup

#### 1. Backend Setup

```bash
cd savings-backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your database credentials

# Run database migrations (automatic with synchronize)
# Seed the database
npm run seed

# Start the server
npm run dev
```

Backend will run on http://localhost:5000

#### 2. Admin Dashboard Setup

```bash
cd admin-frontend

# Install dependencies
npm install

# Create .env file
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env

# Start the development server
npm start
```

Admin dashboard will open at http://localhost:3000

#### 3. Mobile App Setup

```bash
cd client-mobile

# Install dependencies
npm install

# Update API URL in src/api/axios.ts
# Use your computer's IP address instead of localhost

# Start Expo
npm start
```

Scan the QR code with Expo Go app or run in simulator.

## 🔑 Default Credentials

After seeding the database:

### Admin Account

- **Email:** admin@savings.com
- **Password:** admin123
- **Access:** Admin Dashboard

### Customer Account

- **Email:** customer1@example.com
- **Password:** password123
- **Access:** Mobile App

## 📡 API Documentation

### Swagger UI (Interactive Documentation)

The API includes comprehensive **Swagger/OpenAPI 3.0** documentation:

- **Swagger UI**: http://localhost:5000/api-docs
- **OpenAPI JSON**: http://localhost:5000/api-docs.json

### Quick API Reference

#### Authentication
```
POST   /api/auth/register      # Register new user
POST   /api/auth/login         # Login user
GET    /api/auth/me            # Get current user (protected)
```

#### Transactions (Protected)
```
POST   /api/transactions/deposit    # Make deposit
POST   /api/transactions/withdraw   # Make withdrawal
GET    /api/transactions/history    # Get transaction history (with pagination)
GET    /api/transactions/balance    # Get current balance
```

#### Admin (Protected - Admin Only)
```
GET    /api/admin/users            # Get all users (with pagination)
POST   /api/admin/verify-device    # Verify user device
GET    /api/admin/transactions     # Get all transactions (with filters)
GET    /api/admin/stats            # Get dashboard statistics
GET    /api/admin/pending-devices  # Get pending verifications
```

#### Health Check
```
GET    /api/health                 # API health status
```

📖 **For detailed API documentation, examples, and testing**, see [savings-backend/API_DOCUMENTATION.md](savings-backend/API_DOCUMENTATION.md)

## 🗄️ Database Schema

### Users

- id (UUID, Primary Key)
- email (String, Unique)
- password (String, SHA-512 hashed)
- role (Enum: customer, admin)
- balance (Decimal)
- isVerified (Boolean)
- firstName, lastName (String)
- createdAt, updatedAt (Timestamp)

### Devices

- id (UUID, Primary Key)
- deviceId (String)
- deviceName, deviceModel (String)
- isVerified (Boolean)
- verifiedBy (UUID, Foreign Key)
- lastUsedAt (Timestamp)
- userId (UUID, Foreign Key)

### Transactions

- id (UUID, Primary Key)
- type (Enum: deposit, withdrawal)
- amount (Decimal)
- balanceBefore, balanceAfter (Decimal)
- status (Enum: pending, completed, failed)
- description (String)
- userId (UUID, Foreign Key)
- createdAt (Timestamp)

## 🔒 Security Features

1. **Password Security**

   - SHA-512 hashing algorithm
   - No plain text password storage

2. **Authentication**

   - JWT tokens with expiration
   - Device-based authentication
   - Token refresh mechanism

3. **Authorization**

   - Role-based access control (RBAC)
   - Admin-only endpoints
   - Device verification required

4. **API Security**

   - Rate limiting (100 requests per 15 minutes)
   - CORS configuration
   - Helmet.js security headers
   - Input validation and sanitization

5. **Database Security**
   - TypeORM parameterized queries
   - SQL injection prevention
   - Cascading deletes

## 📱 User Workflow

### New User Registration

1. User registers via mobile app
2. Device is automatically registered
3. Account created with pending verification
4. Admin reviews and approves device
5. User receives access to full features

### Existing User Login

1. User logs in with credentials
2. System checks device verification
3. If verified: Grant access
4. If not verified: Show pending message

### Transaction Flow

1. User initiates deposit/withdrawal
2. System validates amount
3. Balance is checked (for withdrawals)
4. Transaction is created
5. Balance is updated
6. Transaction appears in history

## 🧪 Testing

All applications have comprehensive Jest testing configured with 70% minimum coverage.

### Quick Test Commands

```bash
# Backend tests (Utils, Services, Controllers)
cd savings-backend && npm test

# Frontend tests (Components, Redux)
cd admin-frontend && npm test

# Mobile tests (Screens, Store)
cd client-mobile && npm test

# With coverage reports
npm test -- --coverage

# Watch mode
npm run test:watch

# CI mode
npm run test:ci
```

### Docker Testing

```bash
# Run tests in Docker containers
docker-compose exec backend npm test
docker-compose exec admin npm test
docker-compose exec mobile-web npm test
```

**See [TESTING_GUIDE.md](TESTING_GUIDE.md) for comprehensive testing documentation.**

### Test Coverage

- ✅ Utility functions (validators, hash, JWT)
- ✅ Redux slices and state management
- ✅ React components and screens
- ✅ API integrations
- ✅ Business logic and services

## 🐛 Troubleshooting

### Database Connection Issues

- Verify PostgreSQL is running
- Check database credentials in .env
- Ensure database exists

### CORS Errors

- Update CORS_ORIGIN in backend .env
- Include all frontend URLs

### Mobile App Connection

- Use computer's IP address, not localhost
- Ensure phone and computer are on same network
- Check firewall settings

### Docker Issues

```bash
# View service logs
docker-compose logs -f backend

# Restart a service
docker-compose restart backend

# Rebuild and restart
docker-compose up -d --build backend

# Clean everything and start fresh
docker-compose down -v
docker-compose up -d --build

# Check health status
docker-compose ps
```

**See [DOCKER_GUIDE.md](DOCKER_GUIDE.md) for detailed troubleshooting.**

## 📝 Development Guidelines

### Code Style

- Use TypeScript strict mode
- Follow ESLint rules
- Write meaningful commit messages
- Document complex functions

### Git Workflow

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request
5. Code review
6. Merge to main

### Adding Features

1. Update database schema (if needed)
2. Create/update DTOs
3. Implement service logic
4. Add controller endpoints
5. Update routes
6. Test API endpoints
7. Update frontend/mobile
8. Update documentation

## 🚢 Deployment

### Production Deployment with Docker

```bash
# 1. Set environment variables
cp .env.example .env
# Edit .env with production values

# 2. Build production images
docker-compose build --no-cache

# 3. Start services
docker-compose up -d

# 4. Run migrations
docker-compose exec backend npm run migration:run

# 5. Seed initial data
docker-compose exec backend npm run seed

# 6. Verify health
docker-compose ps
curl http://localhost:5000/api/health
```

### Docker Images

All images use **multi-stage builds** for optimization:

- Backend: ~150MB (vs ~1GB unoptimized)
- Admin: ~25MB (nginx-alpine)
- Mobile: ~25MB (nginx-alpine)

### Security Features

✅ Non-root users in all containers  
✅ Multi-stage builds for minimal attack surface  
✅ Health checks for all services  
✅ No secrets in images (.dockerignore configured)  
✅ Security headers in nginx  
✅ Resource limits configurable

**See [DOCKER_GUIDE.md](DOCKER_GUIDE.md) for production deployment best practices.**

## 📄 License

This project is private and proprietary.

## 👥 Contributors

- Development Team

## 📞 Support

For support and questions:

- Email: support@savings.com
- Documentation: See individual README files
- Issues: GitHub Issues

## 🎯 Future Enhancements

- [ ] Push notifications for transactions
- [ ] Email notifications
- [ ] Two-factor authentication (2FA)
- [ ] Biometric authentication
- [ ] Transaction receipts (PDF)
- [ ] Spending analytics
- [ ] Savings goals
- [ ] Recurring deposits
- [ ] Multi-currency support
- [ ] Export transaction history

## 🙏 Acknowledgments

Built with modern technologies and best practices for security and user experience.

---

**Built with ❤️ using Node.js, React, and React Native**
