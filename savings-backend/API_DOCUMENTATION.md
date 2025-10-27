# Credit Jambo API Documentation

## 📚 API Documentation

Credit Jambo provides comprehensive API documentation using **Swagger/OpenAPI 3.0**.

### Accessing the Documentation

#### Swagger UI (Interactive)
```
http://localhost:5000/api-docs
```

The Swagger UI provides an interactive interface where you can:
- ✅ View all available endpoints
- ✅ See request/response schemas
- ✅ Try out API calls directly from the browser
- ✅ Test authentication
- ✅ Download OpenAPI specification

#### OpenAPI JSON Specification
```
http://localhost:5000/api-docs.json
```

Download the complete OpenAPI 3.0 specification for use with:
- API clients (Postman, Insomnia)
- Code generators
- API testing tools
- Documentation generators

## 🔐 Authentication

Most endpoints require JWT authentication.

### Getting a Token

1. **Register a new user:**
```bash
POST /api/auth/register
```

2. **Login with credentials:**
```bash
POST /api/auth/login
```

Both endpoints return a JWT token:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

### Using the Token

#### In Swagger UI

1. Click the **"Authorize"** button at the top
2. Enter: `Bearer YOUR_TOKEN_HERE`
3. Click **"Authorize"**
4. Now you can test protected endpoints

#### In API Requests

Include the token in the Authorization header:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" \
     http://localhost:5000/api/auth/me
```

## 📋 API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | User login | No |
| GET | `/api/auth/me` | Get current user | Yes |

### Transaction Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/transactions/deposit` | Make a deposit | Yes |
| POST | `/api/transactions/withdraw` | Make a withdrawal | Yes |
| GET | `/api/transactions/history` | Get transaction history | Yes |
| GET | `/api/transactions/balance` | Get current balance | Yes |

### Admin Endpoints

| Method | Endpoint | Description | Auth Required | Admin Only |
|--------|----------|-------------|---------------|------------|
| GET | `/api/admin/users` | Get all users | Yes | Yes |
| POST | `/api/admin/verify-device` | Verify user device | Yes | Yes |
| GET | `/api/admin/transactions` | Get all transactions | Yes | Yes |
| GET | `/api/admin/stats` | Get dashboard stats | Yes | Yes |
| GET | `/api/admin/pending-devices` | Get pending devices | Yes | Yes |

### Health Check

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/health` | API health status | No |

## 🧪 Example Requests

### Register a New User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "fullName": "John Doe",
    "phoneNumber": "1234567890",
    "deviceId": "device-123",
    "deviceName": "iPhone 13",
    "deviceModel": "iOS 16.0"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "deviceId": "device-123"
  }'
```

### Make a Deposit

```bash
curl -X POST http://localhost:5000/api/transactions/deposit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "amount": 100.00,
    "description": "Monthly savings"
  }'
```

### Get Transaction History

```bash
curl -X GET "http://localhost:5000/api/transactions/history?page=1&limit=20" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Current Balance

```bash
curl -X GET http://localhost:5000/api/transactions/balance \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Admin: Get All Users

```bash
curl -X GET "http://localhost:5000/api/admin/users?page=1&limit=20" \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### Admin: Verify Device

```bash
curl -X POST http://localhost:5000/api/admin/verify-device \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{
    "deviceId": "device-uuid-to-verify"
  }'
```

### Admin: Get Statistics

```bash
curl -X GET http://localhost:5000/api/admin/stats \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

## 📊 Response Schemas

### Success Responses

All successful responses include appropriate data with HTTP status codes:
- `200` - OK
- `201` - Created
- `204` - No Content

### Error Responses

Error responses follow a consistent format:

```json
{
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

Common error codes:
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `500` - Internal Server Error

## 🔍 Filtering and Pagination

### Pagination

Most list endpoints support pagination:

```
GET /api/transactions/history?page=1&limit=20
```

Parameters:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)

Response includes pagination metadata:
```json
{
  "transactions": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

### Filtering

Transaction endpoints support filtering:

```
GET /api/transactions/history?type=deposit
GET /api/admin/transactions?userId=user-uuid&type=withdrawal
```

## 🛠️ Testing with Postman

1. **Import the OpenAPI specification:**
   - Download from `http://localhost:5000/api-docs.json`
   - In Postman: Import → Upload file

2. **Set up environment:**
   - Create variables: `baseUrl`, `token`
   - Set `baseUrl` to `http://localhost:5000/api`

3. **Test authentication:**
   - Use `/auth/login` to get token
   - Save token to environment variable
   - Use `{{token}}` in Authorization header

## 📱 Using with Client Applications

### JavaScript/TypeScript

```typescript
const API_BASE_URL = 'http://localhost:5000/api';

// Login
const login = async (email: string, password: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await response.json();
  return data.token;
};

// Make authenticated request
const getBalance = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/transactions/balance`, {
    headers: { 
      'Authorization': `Bearer ${token}` 
    }
  });
  return response.json();
};
```

### Python

```python
import requests

API_BASE_URL = 'http://localhost:5000/api'

# Login
response = requests.post(
    f'{API_BASE_URL}/auth/login',
    json={'email': 'user@example.com', 'password': 'password'}
)
token = response.json()['token']

# Make authenticated request
headers = {'Authorization': f'Bearer {token}'}
response = requests.get(
    f'{API_BASE_URL}/transactions/balance',
    headers=headers
)
balance = response.json()
```

## 🔒 Security Best Practices

1. **Always use HTTPS in production**
2. **Never commit tokens to version control**
3. **Rotate JWT secrets regularly**
4. **Implement token expiration**
5. **Use environment variables for sensitive config**
6. **Validate all input data**
7. **Implement rate limiting** (already configured)
8. **Monitor for suspicious activity**

## 🚀 Rate Limiting

Authentication endpoints are rate-limited:
- **Window**: 15 minutes
- **Max Requests**: 100 per IP

Headers in response:
```
RateLimit-Limit: 100
RateLimit-Remaining: 95
RateLimit-Reset: 1640000000
```

## 📖 Additional Resources

- **Swagger UI**: http://localhost:5000/api-docs
- **OpenAPI Spec**: http://localhost:5000/api-docs.json
- **Health Check**: http://localhost:5000/api/health
- **Main Repository**: https://github.com/cielo-b/jambo-saving

## 🤝 Support

For API support or questions:
- Email: support@creditjambo.com
- GitHub Issues: https://github.com/cielo-b/jambo-saving/issues

---

**Credit Jambo API** - Making savings accessible through technology! 💰

