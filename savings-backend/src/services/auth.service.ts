import { AppDataSource } from "../config/database";
import { User, UserRole } from "../entities/User";
import { Device } from "../entities/Device";
import { hashPassword, comparePassword } from "../utils/hash";
import { generateToken } from "../utils/jwt";
import { RegisterDto, LoginDto } from "../dtos/auth.dto";

export class AuthService {
  private userRepository = AppDataSource.getRepository(User);
  private deviceRepository = AppDataSource.getRepository(Device);

  /**
   * Register new user
   */
  async register(data: RegisterDto) {
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Hash password
    const hashedPassword = hashPassword(data.password);

    // Create user
    const user = this.userRepository.create({
      email: data.email,
      password: hashedPassword,
      firstName: data.firstName,
      lastName: data.lastName,
      role: UserRole.CUSTOMER,
      balance: 0,
      isVerified: false,
    });

    await this.userRepository.save(user);

    // Create device
    const device = this.deviceRepository.create({
      deviceId: data.deviceId,
      deviceName: data.deviceName,
      deviceModel: data.deviceModel,
      osVersion: data.osVersion,
      userId: user.id,
      isVerified: false, // Requires admin verification
    });

    await this.deviceRepository.save(device);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        balance: user.balance,
        isVerified: user.isVerified,
        role: user.role,
      },
      message:
        "Registration successful. Please wait for admin to verify your device.",
    };
  }

  /**
   * Login user
   */
  async login(data: LoginDto) {
    // Find user
    const user = await this.userRepository.findOne({
      where: { email: data.email },
      relations: ["devices"],
    });

    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Verify password
    const isPasswordValid = comparePassword(data.password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    // Check or create device
    let device = await this.deviceRepository.findOne({
      where: {
        userId: user.id,
        deviceId: data.deviceId,
      },
    });

    if (!device) {
      // New device, create it
      device = this.deviceRepository.create({
        deviceId: data.deviceId,
        deviceName: data.deviceName,
        deviceModel: data.deviceModel,
        osVersion: data.osVersion,
        userId: user.id,
        isVerified: false,
      });
      await this.deviceRepository.save(device);
    }

    // Check if device is verified
    if (!device.isVerified) {
      return {
        requiresVerification: true,
        message: "Device not verified. Please contact admin for verification.",
        user: {
          id: user.id,
          email: user.email,
        },
      };
    }

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      deviceId: data.deviceId,
    });

    // Update last used
    device.lastUsedAt = new Date();
    await this.deviceRepository.save(device);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        balance: user.balance,
        role: user.role,
        isVerified: user.isVerified,
      },
    };
  }

  /**
   * Get current user profile
   */
  async getProfile(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ["devices"],
    });

    if (!user) {
      throw new Error("User not found");
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      balance: user.balance,
      role: user.role,
      isVerified: user.isVerified,
      devices: user.devices.map((d) => ({
        id: d.id,
        deviceName: d.deviceName,
        deviceModel: d.deviceModel,
        isVerified: d.isVerified,
        lastUsedAt: d.lastUsedAt,
      })),
      createdAt: user.createdAt,
    };
  }
}
