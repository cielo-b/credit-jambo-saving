import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Credit Jambo API",
      version: "1.0.0",
      description:
        "Credit Jambo Savings Management System API - A comprehensive platform for managing user savings, transactions, and device authentication",
      contact: {
        name: "Credit Jambo Support",
        email: "support@creditjambo.com",
      },
      license: {
        name: "Private",
        url: "https://creditjambo.com/license",
      },
    },
    servers: [
      {
        url: "http://localhost:5000/api",
        description: "Development server",
      },
      {
        url: "https://api.creditjambo.com/api",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token in the format: Bearer {token}",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              description: "User unique identifier",
            },
            email: {
              type: "string",
              format: "email",
              description: "User email address",
            },
            fullName: {
              type: "string",
              description: "User full name",
            },
            phoneNumber: {
              type: "string",
              description: "User phone number",
            },
            balance: {
              type: "number",
              format: "float",
              description: "Current account balance",
            },
            role: {
              type: "string",
              enum: ["customer", "admin"],
              description: "User role",
            },
            isVerified: {
              type: "boolean",
              description: "Device verification status",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Account creation timestamp",
            },
          },
        },
        Device: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              description: "Device unique identifier",
            },
            deviceId: {
              type: "string",
              description: "Device unique ID from client",
            },
            deviceName: {
              type: "string",
              description: "Device name",
            },
            deviceModel: {
              type: "string",
              description: "Device model",
            },
            isVerified: {
              type: "boolean",
              description: "Device verification status",
            },
            lastUsedAt: {
              type: "string",
              format: "date-time",
              description: "Last time device was used",
            },
          },
        },
        Transaction: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              description: "Transaction unique identifier",
            },
            type: {
              type: "string",
              enum: ["deposit", "withdrawal"],
              description: "Transaction type",
            },
            amount: {
              type: "number",
              format: "float",
              description: "Transaction amount",
            },
            balanceBefore: {
              type: "number",
              format: "float",
              description: "Balance before transaction",
            },
            balanceAfter: {
              type: "number",
              format: "float",
              description: "Balance after transaction",
            },
            status: {
              type: "string",
              enum: ["pending", "completed", "failed"],
              description: "Transaction status",
            },
            description: {
              type: "string",
              description: "Transaction description",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Transaction timestamp",
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "Error message",
            },
            errors: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  field: { type: "string" },
                  message: { type: "string" },
                },
              },
              description: "Validation errors",
            },
          },
        },
        RegisterRequest: {
          type: "object",
          required: ["email", "password", "fullName", "phoneNumber"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "user@example.com",
            },
            password: {
              type: "string",
              format: "password",
              minLength: 8,
              example: "SecurePass123!",
            },
            fullName: {
              type: "string",
              example: "John Doe",
            },
            phoneNumber: {
              type: "string",
              example: "1234567890",
            },
            deviceId: {
              type: "string",
              example: "device-unique-id-123",
            },
            deviceName: {
              type: "string",
              example: "iPhone 13",
            },
            deviceModel: {
              type: "string",
              example: "iOS 16.0",
            },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "user@example.com",
            },
            password: {
              type: "string",
              format: "password",
              example: "SecurePass123!",
            },
            deviceId: {
              type: "string",
              example: "device-unique-id-123",
            },
            deviceName: {
              type: "string",
              example: "iPhone 13",
            },
            deviceModel: {
              type: "string",
              example: "iOS 16.0",
            },
          },
        },
        AuthResponse: {
          type: "object",
          properties: {
            token: {
              type: "string",
              description: "JWT authentication token",
            },
            user: {
              $ref: "#/components/schemas/User",
            },
          },
        },
        TransactionRequest: {
          type: "object",
          required: ["amount"],
          properties: {
            amount: {
              type: "number",
              format: "float",
              minimum: 0.01,
              example: 100.0,
            },
            description: {
              type: "string",
              example: "Monthly savings",
            },
          },
        },
        BalanceResponse: {
          type: "object",
          properties: {
            balance: {
              type: "number",
              format: "float",
              description: "Current account balance",
            },
            currency: {
              type: "string",
              default: "USD",
            },
          },
        },
        StatsResponse: {
          type: "object",
          properties: {
            totalUsers: {
              type: "number",
              description: "Total number of users",
            },
            totalTransactions: {
              type: "number",
              description: "Total number of transactions",
            },
            totalDeposits: {
              type: "number",
              format: "float",
              description: "Total deposit amount",
            },
            totalWithdrawals: {
              type: "number",
              format: "float",
              description: "Total withdrawal amount",
            },
            pendingDevices: {
              type: "number",
              description: "Number of pending device verifications",
            },
          },
        },
      },
      responses: {
        UnauthorizedError: {
          description: "Authentication token is missing or invalid",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
              example: {
                message: "No token provided",
              },
            },
          },
        },
        ForbiddenError: {
          description: "User does not have required permissions",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
              example: {
                message: "Admin access required",
              },
            },
          },
        },
        ValidationError: {
          description: "Request validation failed",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
              example: {
                message: "Validation failed",
                errors: [
                  {
                    field: "email",
                    message: "Invalid email format",
                  },
                ],
              },
            },
          },
        },
        NotFoundError: {
          description: "Resource not found",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
              example: {
                message: "Resource not found",
              },
            },
          },
        },
      },
    },
    tags: [
      {
        name: "Authentication",
        description: "User authentication and registration endpoints",
      },
      {
        name: "Transactions",
        description: "Transaction management endpoints (deposits, withdrawals, history)",
      },
      {
        name: "Admin",
        description: "Administrative endpoints (requires admin role)",
      },
      {
        name: "Health",
        description: "System health check",
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;

