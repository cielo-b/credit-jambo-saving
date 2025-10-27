# Savings Management System - Admin Dashboard

A modern React admin dashboard for managing users, devices, and transactions in the savings management system.

## 🚀 Features

- **User Management**

  - View all registered users
  - Search and filter users
  - Monitor user balances
  - Track verification status

- **Device Verification**

  - Review pending device verifications
  - Approve or reject user devices
  - View all registered devices
  - Track device usage

- **Transaction Monitoring**

  - View all transactions system-wide
  - Filter by transaction type
  - Monitor deposits and withdrawals
  - Track balance changes

- **Dashboard Analytics**
  - Real-time statistics
  - Financial overview
  - User metrics
  - Pending verifications

## 📋 Technology Stack

- **Framework:** React.js 19 + TypeScript
- **State Management:** Redux Toolkit
- **Styling:** Tailwind CSS
- **Routing:** React Router v7
- **HTTP Client:** Axios
- **UI Components:** Headless UI + Heroicons

## 🛠️ Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Running backend API (see `../savings-backend/README.md`)

## 📦 Installation

1. **Navigate to admin frontend directory**

   ```bash
   cd admin-frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the root directory:

   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

## 🚀 Running the Application

### Development Mode

```bash
npm start
```

The app will open at `http://localhost:3000`

### Production Build

```bash
npm run build
npm install -g serve
serve -s build
```

## 🔐 Login Credentials

After seeding the backend database, use these credentials:

- **Email:** admin@savings.com
- **Password:** admin123

## 📱 Pages Overview

### 1. Dashboard (`/`)

- System statistics overview
- User metrics (total, verified, unverified)
- Financial overview (deposits, withdrawals, balance)
- Pending device verifications preview

### 2. Users Management (`/users`)

- Complete user list with details
- Search by email or name
- Filter by verification status
- View user balance and devices
- Sort by various criteria

### 3. Device Verification (`/devices`)

- Pending device approvals
- One-click approve/reject
- View all registered devices
- Track device usage and status
- Revoke device access

### 4. Transactions (`/transactions`)

- System-wide transaction history
- View transaction details
- Monitor balance changes
- Filter by type (deposit/withdrawal)
- Pagination support

## 🎨 UI/UX Features

- **Modern Design:** Clean, professional interface using Tailwind CSS
- **Responsive:** Works on desktop, tablet, and mobile
- **Real-time Updates:** Data refreshes automatically
- **Color-coded Status:** Visual indicators for verification, transaction types
- **Search & Filters:** Quick access to specific data
- **Pagination:** Handle large datasets efficiently

## 🔒 Security

- JWT token authentication
- Automatic token refresh
- Protected routes (admin only)
- Secure API communication
- Auto-logout on token expiration

## 📂 Project Structure

```
admin-frontend/
├── public/              # Static files
├── src/
│   ├── api/            # Axios configuration
│   ├── components/     # Reusable components
│   │   ├── Layout.tsx
│   │   └── ProtectedRoute.tsx
│   ├── hooks/          # Custom hooks
│   ├── pages/          # Page components
│   │   ├── Dashboard.tsx
│   │   ├── Devices.tsx
│   │   ├── Login.tsx
│   │   ├── Transactions.tsx
│   │   └── Users.tsx
│   ├── store/          # Redux store
│   │   ├── adminSlice.ts
│   │   ├── authSlice.ts
│   │   └── index.ts
│   ├── App.tsx         # Main app component
│   └── index.tsx       # Entry point
├── .env               # Environment variables
├── package.json
└── tailwind.config.js
```

## 🧪 Testing

```bash
npm test
```

## 🐛 Troubleshooting

### Cannot connect to backend

- Ensure backend is running on `http://localhost:5000`
- Check `REACT_APP_API_URL` in `.env`
- Verify CORS settings in backend

### Login fails

- Ensure backend database is seeded
- Check credentials
- Verify backend is running

### Styles not loading

- Run `npm install` to ensure Tailwind is installed
- Check `tailwind.config.js` configuration
- Clear browser cache

## 📄 Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App (irreversible)

## 🔄 API Integration

The dashboard communicates with the backend API:

- **Authentication:** `/api/auth/login`, `/api/auth/me`
- **Users:** `/api/admin/users`
- **Devices:** `/api/admin/pending-devices`, `/api/admin/verify-device`
- **Transactions:** `/api/admin/transactions`
- **Statistics:** `/api/admin/stats`

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📝 License

This project is part of the Savings Management System.

## 👥 Support

For issues and questions, please refer to the main project documentation.
