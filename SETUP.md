# Setup Instructions

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18 or higher ([Download](https://nodejs.org))
- **PostgreSQL** 14 or higher ([Download](https://www.postgresql.org/download/))
- **npm** or **yarn** (comes with Node.js)
- **Expo CLI** (for mobile app): `npm install -g expo-cli`
- **Git** ([Download](https://git-scm.com/))

## Quick Setup (Recommended)

### Using the Setup Script (Linux/Mac)

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd credit-jambo
   ```

2. **Make the setup script executable**

   ```bash
   chmod +x setup.sh
   ```

3. **Run the setup script**

   ```bash
   ./setup.sh
   ```

4. **Create the database**

   ```bash
   # Login to PostgreSQL
   psql -U postgres

   # Create database
   CREATE DATABASE savings_db;

   # Exit
   \q
   ```

5. **Seed the database**
   ```bash
   cd savings-backend
   npm run seed
   ```

### Using Docker (Easiest)

1. **Install Docker and Docker Compose**

   - [Docker Desktop](https://www.docker.com/products/docker-desktop)

2. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd credit-jambo
   ```

3. **Start all services**

   ```bash
   docker-compose up -d
   ```

4. **Seed the database**

   ```bash
   docker exec -it savings-backend npm run seed
   ```

5. **Access the applications**
   - Backend API: http://localhost:5000
   - Admin Dashboard: http://localhost:3000
   - API Health: http://localhost:5000/api/health

## Manual Setup

### 1. Backend Setup

```bash
cd savings-backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=savings_db
JWT_SECRET=$(openssl rand -base64 32)
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000,http://localhost:19006
EOF

# Create database
createdb savings_db

# Seed the database
npm run seed

# Start development server
npm run dev
```

### 2. Admin Frontend Setup

```bash
cd admin-frontend

# Install dependencies
npm install

# Create .env file
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env

# Start development server
npm start
```

### 3. Mobile App Setup

```bash
cd client-mobile

# Install dependencies
npm install

# Update API URL
# Edit src/api/axios.ts and change API_URL to your computer's IP
# Example: const API_URL = 'http://192.168.1.100:5000/api';

# Start Expo
npm start
```

## Verification

### Test Backend

```bash
curl http://localhost:5000/api/health
# Should return: {"status":"ok","timestamp":"..."}
```

### Test Admin Dashboard

- Open http://localhost:3000
- Login with: admin@savings.com / admin123
- You should see the dashboard

### Test Mobile App

- Scan QR code with Expo Go app
- Or press 'i' for iOS simulator / 'a' for Android emulator
- Login with: customer1@example.com / password123

## Default Accounts

After running `npm run seed`:

### Admin Account

- Email: admin@savings.com
- Password: admin123
- Access: Admin Dashboard

### Customer Account

- Email: customer1@example.com
- Password: password123
- Access: Mobile App
- Initial Balance: $1000

## Common Issues

### Port Already in Use

**Backend (5000)**

```bash
# Find process
lsof -ti:5000
# Kill process
lsof -ti:5000 | xargs kill
```

**Admin Frontend (3000)**

```bash
lsof -ti:3000 | xargs kill
```

### Database Connection Error

1. Ensure PostgreSQL is running:

   ```bash
   # Mac
   brew services start postgresql

   # Linux
   sudo systemctl start postgresql
   ```

2. Verify credentials in `.env`
3. Check if database exists:
   ```bash
   psql -U postgres -l
   ```

### Cannot Connect from Mobile App

1. **Use your computer's IP address**, not `localhost`

   ```bash
   # Find your IP
   # Mac/Linux
   ifconfig | grep "inet "

   # Windows
   ipconfig
   ```

2. **Update API_URL** in `client-mobile/src/api/axios.ts`:

   ```typescript
   const API_URL = "http://YOUR_IP_ADDRESS:5000/api";
   ```

3. **Ensure firewall allows connections** on port 5000

### Docker Issues

**Reset everything:**

```bash
docker-compose down -v
docker-compose up --build -d
```

**View logs:**

```bash
docker-compose logs -f backend
docker-compose logs -f admin
```

**Access database:**

```bash
docker exec -it savings-db psql -U postgres savings_db
```

## Environment Variables

### Backend (.env)

| Variable       | Description       | Default                 |
| -------------- | ----------------- | ----------------------- |
| NODE_ENV       | Environment       | development             |
| PORT           | Server port       | 5000                    |
| DB_HOST        | Database host     | localhost               |
| DB_PORT        | Database port     | 5432                    |
| DB_USERNAME    | Database user     | postgres                |
| DB_PASSWORD    | Database password | postgres                |
| DB_DATABASE    | Database name     | savings_db              |
| JWT_SECRET     | JWT secret key    | (generate with openssl) |
| JWT_EXPIRES_IN | Token expiration  | 7d                      |
| CORS_ORIGIN    | Allowed origins   | localhost URLs          |

### Admin Frontend (.env)

| Variable          | Description     | Default                   |
| ----------------- | --------------- | ------------------------- |
| REACT_APP_API_URL | Backend API URL | http://localhost:5000/api |

## Production Deployment

### Backend

1. Build TypeScript:

   ```bash
   npm run build
   ```

2. Set production environment:

   ```bash
   export NODE_ENV=production
   export DB_HOST=your-db-host
   export JWT_SECRET=strong-secret-key
   ```

3. Start server:
   ```bash
   npm start
   ```

### Admin Frontend

1. Build for production:

   ```bash
   npm run build
   ```

2. Serve with nginx or static hosting
3. Update API URL to production backend

### Database

1. Use managed PostgreSQL service (AWS RDS, DigitalOcean, etc.)
2. Enable SSL
3. Set up automated backups
4. Configure connection pooling

## Next Steps

1. ✅ Start all three applications
2. ✅ Login to admin dashboard
3. ✅ Login to mobile app
4. ✅ Test deposit/withdrawal
5. ✅ Verify device from admin
6. ✅ Check transaction history

## Support

- **Documentation**: See individual README files in each directory
- **Backend**: `savings-backend/README.md`
- **Admin**: `admin-frontend/README.md`
- **Mobile**: `client-mobile/README.md`

## Security Notes

⚠️ **Important for Production:**

1. Change all default passwords
2. Use strong JWT_SECRET (32+ characters)
3. Enable HTTPS/SSL
4. Set up proper firewall rules
5. Use environment-specific configs
6. Enable database backups
7. Implement monitoring and logging
8. Use secrets management (AWS Secrets Manager, etc.)

---

**Need help?** Check the troubleshooting section or individual README files.
