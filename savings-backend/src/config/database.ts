import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { User } from "../entities/User";
import { Device } from "../entities/Device";
import { Transaction } from "../entities/Transaction";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_DATABASE || "savings_db",
  synchronize: process.env.NODE_ENV === "development", // Auto-sync in dev only
  logging: process.env.NODE_ENV === "development",
  entities: [User, Device, Transaction],
  migrations: ["src/migrations/**/*.ts"],
  subscribers: [],
});

export const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log("✅ Database connection established successfully");
  } catch (error) {
    console.error("❌ Error during database initialization:", error);
    throw error;
  }
};
