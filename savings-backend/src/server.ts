import "reflect-metadata";
import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import { initializeDatabase } from "./config/database";
import routes from "./routes";
import {
  errorHandler,
  notFoundHandler,
} from "./middlewares/errorHandler.middleware";

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:19006",
    "http://localhost:8081",
    "http://localhost:8082",
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100"), // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to auth routes
app.use("/api/auth", limiter);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/api", routes);

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Savings Management API",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      auth: "/api/auth",
      transactions: "/api/transactions",
      admin: "/api/admin",
    },
  });
});

// Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

// Initialize database and start server
const startServer = async () => {
  try {
    // Initialize database connection
    await initializeDatabase();

    // Start server
    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   💰 Savings Management System API                        ║
║                                                            ║
║   Server running on port ${PORT}                            ║
║   Environment: ${process.env.NODE_ENV || "development"}                     ║
║                                                            ║
║   API Endpoints:                                           ║
║   - Health: http://localhost:${PORT}/api/health             ║
║   - Auth: http://localhost:${PORT}/api/auth                 ║
║   - Transactions: http://localhost:${PORT}/api/transactions ║
║   - Admin: http://localhost:${PORT}/api/admin               ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on("unhandledRejection", (err: Error) => {
  console.error("Unhandled Promise Rejection:", err);
  process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT signal received: closing HTTP server");
  process.exit(0);
});

startServer();

export default app;
