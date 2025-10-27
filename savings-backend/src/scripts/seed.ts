import "reflect-metadata";
import { AppDataSource, initializeDatabase } from "../config/database";
import { User, UserRole } from "../entities/User";
import { Device } from "../entities/Device";
import { hashPassword } from "../utils/hash";

/**
 * Seed database with initial admin user
 */
async function seedDatabase() {
  try {
    console.log("🌱 Starting database seed...");

    // Initialize database
    await initializeDatabase();

    const userRepository = AppDataSource.getRepository(User);
    const deviceRepository = AppDataSource.getRepository(Device);

    // Check if admin already exists
    const existingAdmin = await userRepository.findOne({
      where: { email: "admin@savings.com" },
    });

    if (existingAdmin) {
      console.log("⚠️  Admin user already exists. Skipping seed.");
      process.exit(0);
    }

    // Create admin user
    const adminUser = userRepository.create({
      email: "admin@savings.com",
      password: hashPassword("admin123"), // Change this in production
      firstName: "Admin",
      lastName: "User",
      role: UserRole.ADMIN,
      balance: 0,
      isVerified: true,
    });

    await userRepository.save(adminUser);
    console.log("✅ Admin user created: admin@savings.com / admin123");

    // Create admin device (for testing)
    const adminDevice = deviceRepository.create({
      deviceId: "admin-web-device",
      deviceName: "Admin Web Browser",
      deviceModel: "Browser",
      osVersion: "Web",
      userId: adminUser.id,
      isVerified: true,
      verifiedAt: new Date(),
      verifiedBy: adminUser.id,
    });

    await deviceRepository.save(adminDevice);
    console.log("✅ Admin device created");

    // Create sample customer users
    const customer1 = userRepository.create({
      email: "customer1@example.com",
      password: hashPassword("password123"),
      firstName: "John",
      lastName: "Doe",
      role: UserRole.CUSTOMER,
      balance: 1000,
      isVerified: true,
    });

    await userRepository.save(customer1);

    const customer1Device = deviceRepository.create({
      deviceId: "customer1-device",
      deviceName: "iPhone 13",
      deviceModel: "iPhone",
      osVersion: "iOS 17",
      userId: customer1.id,
      isVerified: true,
      verifiedAt: new Date(),
      verifiedBy: adminUser.id,
    });

    await deviceRepository.save(customer1Device);
    console.log(
      "✅ Sample customer created: customer1@example.com / password123"
    );

    console.log("🎉 Database seeding completed successfully!");
    console.log("\n📋 Login credentials:");
    console.log("   Admin: admin@savings.com / admin123");
    console.log("   Customer: customer1@example.com / password123");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
