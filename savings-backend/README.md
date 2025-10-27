# Savings Management System - Backend API

A secure and scalable Node.js backend API for a savings management system with device verification, transaction management, and admin controls.

## 🚀 Features

- **Authentication & Security**

  - User registration and login with SHA-512 password hashing
  - JWT-based authentication with device verification
  - Admin device verification system
  - Rate limiting on authentication endpoints
  - Secure headers with Helmet.js

- **Savings Operations**

  - Deposit and withdrawal transactions
  - Balance checking
  - Transaction history with pagination
  - Prevent over-withdrawal validation

- **Admin Features**
  - User management
  - Device verification
  - Transaction monitoring
  - Dashboard statistics
  - Pending device approvals

## 📋 Technology Stack

- **Runtime:** Node.js + TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL + TypeORM
- **Authentication:** JWT (jsonwebtoken)
- **Security:** Helmet, express-rate-limit, SHA-512 hashing
- **Validation:** class-validator, class-transformer

## 🛠️ Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

## 📦 Installation

1. **Clone the repository** (if not already done)

   ```bash
   cd savings-backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up PostgreSQL database**

   ```bash
   # Login to PostgreSQL
   psql -U postgres

   # Create database
   CREATE DATABASE savings_db;
   ```

4. **Configure environment variables**

   Create a `.env` file in the root directory:

   ```env
   # Server Configuration
   NODE_ENV=development
   PORT=5000

   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your_postgres_password
   DB_DATABASE=savings_db

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d

   # Security
   BCRYPT_ROUNDS=10

   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100

   # CORS
   CORS_ORIGIN=http://localhost:3000,http://localhost:19006
   ```

5. **Seed the database** (optional - creates admin user)

   ```bash
   npm run seed
   ```

   Default credentials after seeding:

   - **Admin:** admin@savings.com / admin123
   - **Customer:** customer1@example.com / password123

## 🚀 Running the Application

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm run build
npm start
```

The server will start on `http://localhost:5000`

## 📚 API Documentation

### 🎯 Interactive Swagger Documentation

The API includes **comprehensive Swagger/OpenAPI 3.0 documentation**:

- **Swagger UI**: http://localhost:5000/api-docs
  - Interactive API explorer
  - Try endpoints directly from browser
  - View schemas and examples
  - Test authentication

- **OpenAPI JSON**: http://localhost:5000/api-docs.json
  - Machine-readable API specification
  - Import into Postman, Insomnia, etc.
  - Generate client SDKs

📖 **For complete API documentation with examples**, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

## 📚 API Endpoints Quick Reference

### Authentication

| Method | Endpoint             | Description              | Auth Required |
| ------ | -------------------- | ------------------------ | ------------- |
| POST   | `/api/auth/register` | Register new user        | No            |
| POST   | `/api/auth/login`    | Login user               | No            |
| GET    | `/api/auth/me`       | Get current user profile | Yes           |

### Transactions

| Method | Endpoint                     | Description             | Auth Required |
| ------ | ---------------------------- | ----------------------- | ------------- |
| POST   | `/api/transactions/deposit`  | Create deposit          | Yes           |
| POST   | `/api/transactions/withdraw` | Create withdrawal       | Yes           |
| GET    | `/api/transactions/history`  | Get transaction history | Yes           |
| GET    | `/api/transactions/balance`  | Get current balance     | Yes           |

### Admin

| Method | Endpoint                     | Description                      | Auth Required |
| ------ | ---------------------------- | -------------------------------- | ------------- |
| GET    | `/api/admin/users`           | Get all users                    | Yes (Admin)   |
| POST   | `/api/admin/verify-device`   | Verify user device               | Yes (Admin)   |
| GET    | `/api/admin/transactions`    | Get all transactions             | Yes (Admin)   |
| GET    | `/api/admin/stats`           | Get dashboard statistics         | Yes (Admin)   |
| GET    | `/api/admin/pending-devices` | Get pending device verifications | Yes (Admin)   |

### Health Check

| Method | Endpoint      | Description       |
| ------ | ------------- | ----------------- |
| GET    | `/api/health` | API health status |

## 🔐 API Usage Examples

### Register User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "deviceId": "unique-device-id",
    "deviceName": "iPhone 13",
    "deviceModel": "iPhone",
    "osVersion": "iOS 17"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "deviceId": "unique-device-id",
    "deviceName": "iPhone 13"
  }'
```

### Make Deposit (with authentication)

```bash
curl -X POST http://localhost:5000/api/transactions/deposit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "amount": 100.50,
    "description": "Monthly savings"
  }'
```

### Verify Device (Admin)

```bash
curl -X POST http://localhost:5000/api/admin/verify-device \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
  -d '{
    "deviceId": "device-uuid",
    "isVerified": true
  }'
```

## 🗄️ Database Schema

### Users Table

- `id` (UUID) - Primary key
- `email` (String) - Unique
- `password` (String) - SHA-512 hashed
- `role` (Enum) - customer | admin
- `balance` (Decimal) - Current balance
- `isVerified` (Boolean) - Verification status
- `firstName`, `lastName` (String)
- `createdAt`, `updatedAt` (Timestamp)

### Devices Table

- `id` (UUID) - Primary key
- `deviceId` (String) - Device identifier
- `deviceName` (String) - Device name
- `deviceModel`, `osVersion` (String)
- `isVerified` (Boolean) - Verification status
- `verifiedAt` (Timestamp)
- `verifiedBy` (UUID) - Admin who verified
- `userId` (UUID) - Foreign key to users

### Transactions Table

- `id` (UUID) - Primary key
- `type` (Enum) - deposit | withdrawal
- `amount` (Decimal) - Transaction amount
- `balanceBefore`, `balanceAfter` (Decimal)
- `status` (Enum) - pending | completed | failed
- `description` (String)
- `deviceId` (String)
- `userId` (UUID) - Foreign key to users
- `createdAt` (Timestamp)

## 🔒 Security Features

1. **Password Hashing:** SHA-512 algorithm
2. **JWT Authentication:** Secure token-based authentication
3. **Device Verification:** Admin must approve devices before full access
4. **Rate Limiting:** Prevents brute force attacks
5. **CORS:** Configured for specific origins
6. **Helmet:** Security headers
7. **Input Validation:** DTO validation with class-validator
8. **SQL Injection Prevention:** TypeORM parameterized queries

## 🧪 Testing

The application structure is ready for testing. You can add tests in the `src/test` directory.

Recommended testing libraries:

- Jest for unit tests
- Supertest for API integration tests

## 📝 Project Structure

```
savings-backend/
├── src/
│   ├── config/          # Database configuration
│   ├── controllers/     # Request handlers
│   ├── dtos/           # Data transfer objects
│   ├── entities/       # TypeORM entities
│   ├── middlewares/    # Express middlewares
│   ├── routes/         # API routes
│   ├── scripts/        # Utility scripts (seed, etc.)
│   ├── services/       # Business logic
│   ├── utils/          # Helper functions
│   └── server.ts       # Application entry point
├── .env               # Environment variables
├── package.json       # Dependencies
└── tsconfig.json      # TypeScript configuration
```

## 🐛 Troubleshooting

### Database Connection Error

- Ensure PostgreSQL is running
- Verify database credentials in `.env`
- Check if database `savings_db` exists

### Port Already in Use

- Change `PORT` in `.env` file
- Kill the process using port 5000: `lsof -ti:5000 | xargs kill`

### JWT Token Errors

- Ensure `JWT_SECRET` is set in `.env`
- Check token expiration settings

## 📄 License

This project is part of the Savings Management System.

## 👥 Support

For issues and questions, please refer to the main project documentation.
