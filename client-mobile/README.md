# Savings Management System - Mobile App

A beautiful React Native mobile application for customers to manage their savings accounts, built with Expo.

## 🚀 Features

- **User Authentication**

  - Registration with device tracking
  - Secure login with JWT
  - Device verification flow
  - Auto-login with stored credentials

- **Account Management**

  - View current balance
  - Real-time balance updates
  - Account status display
  - User profile information

- **Transactions**

  - Make deposits with quick amounts
  - Withdraw funds with balance validation
  - View transaction history
  - Filter transactions by type
  - Detailed transaction information

- **Modern UI/UX**
  - Clean, intuitive interface
  - Smooth animations
  - Pull-to-refresh
  - Loading states
  - Error handling with alerts

## 📋 Technology Stack

- **Framework:** React Native + Expo
- **Language:** TypeScript
- **State Management:** Redux Toolkit
- **Navigation:** React Navigation
- **HTTP Client:** Axios
- **Device Info:** expo-device
- **Storage:** AsyncStorage

## 🛠️ Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Emulator
- Running backend API (see `../savings-backend/README.md`)

## 📦 Installation

1. **Navigate to mobile app directory**

   ```bash
   cd client-mobile
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure API URL**

   Edit `src/api/axios.ts` and update the `API_URL`:

   ```typescript
   const API_URL = "http://YOUR_IP_ADDRESS:5000/api";
   ```

   **Note:** For testing on physical device, use your computer's IP address, not `localhost`.

## 🚀 Running the Application

### Start Development Server

```bash
npm start
```

### Run on iOS (Mac only)

```bash
npm run ios
```

### Run on Android

```bash
npm run android
```

### Run on Web

```bash
npm run web
```

### Scan QR Code

Use the Expo Go app on your phone to scan the QR code displayed in the terminal.

## 📱 App Screens

### 1. Login Screen

- Email and password authentication
- Device registration
- Navigation to registration

### 2. Registration Screen

- Create new account
- Automatic device registration
- Device verification message

### 3. Dashboard

- Current balance display
- Quick action buttons (Deposit/Withdraw)
- Recent transactions preview
- Account status
- User information

### 4. Deposit Screen

- Quick amount selection
- Custom amount input
- Description field
- Confirmation

### 5. Withdraw Screen

- Available balance display
- Quick amount selection
- Custom amount input
- Balance validation
- Confirmation dialog

### 6. Transactions Screen

- Complete transaction history
- Filter by type (All/Deposits/Withdrawals)
- Transaction details
- Pull to refresh
- Date and time stamps

## 🔐 User Flow

1. **New User:**

   - Register with email, password, name
   - Device automatically registered
   - Wait for admin device verification
   - Receive notification when verified
   - Login and access account

2. **Existing User:**
   - Login with credentials
   - If device is verified: Access account
   - If device is new: Wait for verification
   - View balance and transactions
   - Make deposits and withdrawals

## 🎨 Design Features

- **Color Scheme:**

  - Primary: Indigo (#4F46E5)
  - Success: Green (#10B981)
  - Danger: Red (#EF4444)
  - Background: Gray (#F9FAFB)

- **Typography:**

  - Headers: Bold, 24-28px
  - Body: Regular, 14-16px
  - Small: 12px

- **Components:**
  - Rounded corners (8-16px)
  - Shadows and elevation
  - Consistent padding (15-20px)
  - Color-coded actions

## 📂 Project Structure

```
client-mobile/
├── assets/              # Images and icons
├── src/
│   ├── api/            # API configuration
│   │   └── axios.ts
│   ├── hooks/          # Custom hooks
│   │   └── useAppDispatch.ts
│   ├── navigation/     # Navigation setup
│   │   └── AppNavigator.tsx
│   ├── screens/        # App screens
│   │   ├── DashboardScreen.tsx
│   │   ├── DepositScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── RegisterScreen.tsx
│   │   ├── TransactionsScreen.tsx
│   │   └── WithdrawScreen.tsx
│   └── store/          # Redux store
│       ├── authSlice.ts
│       ├── transactionSlice.ts
│       └── index.ts
├── App.tsx             # Main app component
├── app.json            # Expo configuration
├── package.json
└── tsconfig.json
```

## 🔧 Configuration

### app.json

```json
{
  "expo": {
    "name": "Savings Account",
    "slug": "savings-account",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#4F46E5"
    }
  }
}
```

## 🐛 Troubleshooting

### Cannot connect to backend

- Ensure backend is running
- Check API_URL in `src/api/axios.ts`
- Use computer's IP address, not localhost
- Ensure phone and computer are on same network

### Device verification issues

- Contact admin to verify your device
- Check backend admin panel
- Ensure device ID is correctly generated

### Build errors

- Clear cache: `expo start -c`
- Delete node_modules and reinstall
- Update Expo CLI: `npm install -g expo-cli`

## 📱 Testing

### Demo Account

After backend seeding:

- **Email:** customer1@example.com
- **Password:** password123

### Test Flow

1. Launch app
2. Login with demo credentials
3. View dashboard
4. Make a deposit
5. Make a withdrawal
6. View transaction history

## 🚀 Building for Production

### iOS

```bash
expo build:ios
```

### Android

```bash
expo build:android
```

## 🔔 Notifications (Future Enhancement)

The app includes expo-notifications for future push notification support:

- Transaction confirmations
- Device verification alerts
- Low balance warnings

## 📄 Environment Variables

Create a `.env` file:

```env
API_URL=http://YOUR_IP:5000/api
```

## 🤝 Integration with Backend

The app integrates with these backend endpoints:

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get user profile
- `POST /api/transactions/deposit` - Make deposit
- `POST /api/transactions/withdraw` - Make withdrawal
- `GET /api/transactions/history` - Get transactions
- `GET /api/transactions/balance` - Get balance

## 📝 License

This project is part of the Savings Management System.

## 👥 Support

For issues and questions, please refer to the main project documentation.
