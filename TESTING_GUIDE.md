# Credit Jambo - Testing Guide

Comprehensive guide for testing all Credit Jambo applications using Jest.

## 📋 Table of Contents

- [Overview](#overview)
- [Backend Testing](#backend-testing)
- [Admin Frontend Testing](#admin-frontend-testing)
- [Mobile App Testing](#mobile-app-testing)
- [Running Tests](#running-tests)
- [Writing Tests](#writing-tests)
- [Coverage Reports](#coverage-reports)
- [CI/CD Integration](#cicd-integration)

## Overview

All Credit Jambo applications use **Jest** as the testing framework with the following setup:

- **Backend**: Jest + ts-jest + supertest
- **Admin Frontend**: Jest + React Testing Library
- **Mobile App**: Jest + React Native Testing Library + jest-expo

### Test Coverage Goals

- **Minimum Coverage**: 70% across all metrics
- **Target Coverage**: 80%+
- **Critical Paths**: 90%+

## Backend Testing

### Test Structure

```
savings-backend/
├── src/
│   ├── utils/
│   │   ├── __tests__/
│   │   │   ├── validator.test.ts
│   │   │   ├── hash.test.ts
│   │   │   └── jwt.test.ts
│   ├── services/
│   │   └── __tests__/
│   ├── controllers/
│   │   └── __tests__/
├── jest.config.js
└── package.json
```

### Running Backend Tests

```bash
cd savings-backend

# Run all tests
npm test

# Watch mode
npm run test:watch

# CI mode
npm run test:ci

# With coverage
npm test -- --coverage
```

### Example Backend Test

```typescript
import { validateEmail } from "../validator";

describe("Validator Utils", () => {
  describe("validateEmail", () => {
    it("should validate correct email addresses", () => {
      expect(validateEmail("test@example.com")).toBe(true);
    });

    it("should reject invalid email addresses", () => {
      expect(validateEmail("invalid")).toBe(false);
    });
  });
});
```

### Testing API Endpoints

```typescript
import request from "supertest";
import app from "../../server";

describe("Auth API", () => {
  it("POST /api/auth/register - should create new user", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        email: "test@example.com",
        password: "SecurePass123!",
        fullName: "Test User",
        phoneNumber: "1234567890",
      })
      .expect(201);

    expect(response.body).toHaveProperty("token");
    expect(response.body.user).toHaveProperty("email", "test@example.com");
  });
});
```

## Admin Frontend Testing

### Test Structure

```
admin-frontend/
├── src/
│   ├── components/
│   │   ├── __tests__/
│   │   │   └── Layout.test.tsx
│   ├── pages/
│   │   └── __tests__/
│   ├── store/
│   │   └── __tests__/
│   │       └── authSlice.test.ts
│   └── setupTests.ts
└── package.json
```

### Running Frontend Tests

```bash
cd admin-frontend

# Run all tests
npm test

# Watch mode
npm run test:watch

# CI mode
npm run test:ci
```

### Example Component Test

```typescript
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import Layout from "../Layout";
import { store } from "../../store";

describe("Layout Component", () => {
  it("should render children content", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Layout>
            <div>Test Content</div>
          </Layout>
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });
});
```

### Testing Redux Slices

```typescript
import authReducer, { setCredentials, logout } from "../authSlice";

describe("authSlice", () => {
  it("should handle setCredentials", () => {
    const actual = authReducer(
      initialState,
      setCredentials({ admin: mockAdmin, token: "token" })
    );

    expect(actual.isAuthenticated).toBe(true);
  });
});
```

## Mobile App Testing

### Test Structure

```
client-mobile/
├── src/
│   ├── screens/
│   │   └── __tests__/
│   │       └── LoginScreen.test.tsx
│   ├── store/
│   │   └── __tests__/
│   │       └── authSlice.test.ts
├── jest.config.js
├── jest.setup.js
└── package.json
```

### Running Mobile Tests

```bash
cd client-mobile

# Run all tests
npm test

# Watch mode
npm run test:watch

# CI mode
npm run test:ci
```

### Example Screen Test

```typescript
import { render, screen } from "@testing-library/react-native";
import { Provider } from "react-redux";
import LoginScreen from "../LoginScreen";
import { store } from "../../store";

describe("LoginScreen", () => {
  it("should render login form", () => {
    render(
      <Provider store={store}>
        <LoginScreen />
      </Provider>
    );

    expect(screen.getByText(/Welcome to Credit Jambo/i)).toBeTruthy();
    expect(screen.getByPlaceholderText(/Email/i)).toBeTruthy();
  });
});
```

## Running Tests

### All Tests (Entire Project)

From the root directory:

```bash
# Backend tests
cd savings-backend && npm test

# Frontend tests
cd admin-frontend && npm test

# Mobile tests
cd client-mobile && npm test
```

### Docker-Based Testing

```bash
# Backend
docker-compose exec backend npm test

# Frontend
docker-compose exec admin npm test

# Mobile
docker-compose exec mobile-web npm test
```

### Watch Mode

Watch mode automatically re-runs tests when files change:

```bash
# Backend
cd savings-backend
npm run test:watch

# Frontend
cd admin-frontend
npm run test:watch

# Mobile
cd client-mobile
npm run test:watch
```

### CI Mode

CI mode runs tests once with coverage:

```bash
npm run test:ci
```

## Writing Tests

### Best Practices

1. **Descriptive Test Names**

   ```typescript
   // ✅ Good
   it("should return 401 when user is not authenticated", () => {});

   // ❌ Bad
   it("test auth", () => {});
   ```

2. **Arrange-Act-Assert Pattern**

   ```typescript
   it("should calculate total correctly", () => {
     // Arrange
     const amount = 100;
     const fee = 10;

     // Act
     const total = calculateTotal(amount, fee);

     // Assert
     expect(total).toBe(110);
   });
   ```

3. **Test One Thing**

   ```typescript
   // ✅ Good - separate tests
   it("should validate email format", () => {});
   it("should validate email length", () => {});

   // ❌ Bad - testing multiple things
   it("should validate email", () => {
     // tests format, length, special chars...
   });
   ```

4. **Mock External Dependencies**

   ```typescript
   jest.mock("axios");

   it("should fetch user data", async () => {
     mockedAxios.get.mockResolvedValue({ data: mockUser });
     // ... test code
   });
   ```

### Coverage Thresholds

Configured in `jest.config.js`:

```javascript
coverageThreshold: {
  global: {
    branches: 70,
    functions: 70,
    lines: 70,
    statements: 70,
  },
}
```

## Coverage Reports

### Generating Coverage Reports

```bash
# Backend
cd savings-backend
npm test -- --coverage

# Frontend
cd admin-frontend
npm test -- --coverage

# Mobile
cd client-mobile
npm test -- --coverage
```

### Viewing Coverage

After running tests with coverage:

```bash
# Open HTML report
open coverage/lcov-report/index.html

# Linux
xdg-open coverage/lcov-report/index.html

# Windows
start coverage/lcov-report/index.html
```

### Coverage Report Structure

```
coverage/
├── lcov-report/
│   └── index.html         # Interactive HTML report
├── lcov.info              # Coverage data
└── coverage-final.json    # JSON coverage data
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Test Suite

on: [push, pull_request]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: "18"
      - name: Install dependencies
        run: cd savings-backend && npm ci
      - name: Run tests
        run: cd savings-backend && npm run test:ci
      - name: Upload coverage
        uses: codecov/codecov-action@v2
        with:
          files: ./savings-backend/coverage/lcov.info

  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: "18"
      - name: Install dependencies
        run: cd admin-frontend && npm ci
      - name: Run tests
        run: cd admin-frontend && npm run test:ci
```

### Pre-commit Hooks

Using Husky to run tests before commit:

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm test",
      "pre-push": "npm run test:ci"
    }
  }
}
```

## Debugging Tests

### VS Code Debug Configuration

`.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Jest Backend",
      "program": "${workspaceFolder}/savings-backend/node_modules/.bin/jest",
      "args": ["--runInBand"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

### Debug Individual Test

```bash
# Run specific test file
npm test -- validator.test.ts

# Run specific test
npm test -- -t "should validate email"

# Debug mode
node --inspect-brk node_modules/.bin/jest --runInBand
```

## Common Testing Patterns

### Mocking API Calls

```typescript
import axios from "axios";
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

it("should fetch data", async () => {
  mockedAxios.get.mockResolvedValue({ data: mockData });
  // ... test
});
```

### Testing Async Operations

```typescript
it("should handle async operation", async () => {
  const result = await asyncFunction();
  expect(result).toBeDefined();
});
```

### Testing Error Cases

```typescript
it("should throw error for invalid input", () => {
  expect(() => validateInput(null)).toThrow("Invalid input");
});
```

## Test Maintenance

### Regular Tasks

- [ ] Review test coverage monthly
- [ ] Update tests when features change
- [ ] Remove obsolete tests
- [ ] Refactor duplicated test code
- [ ] Keep mocks up to date

### Performance

- Use `describe.skip()` for slow tests during development
- Run only changed tests: `npm test -- --onlyChanged`
- Optimize test setup/teardown

---

**Remember**: Good tests are the foundation of reliable software! 🧪
