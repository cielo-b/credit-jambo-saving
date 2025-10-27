import { AppDataSource } from "../config/database";
import { User, UserRole } from "../entities/User";
import { Device } from "../entities/Device";
import { Transaction } from "../entities/Transaction";
import { VerifyDeviceDto, UserFilterDto } from "../dtos/admin.dto";
import { Like } from "typeorm";

export class AdminService {
  private userRepository = AppDataSource.getRepository(User);
  private deviceRepository = AppDataSource.getRepository(Device);
  private transactionRepository = AppDataSource.getRepository(Transaction);

  /**
   * Get all users with filters
   */
  async getUsers(filters: UserFilterDto) {
    const queryBuilder = this.userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.devices", "device");

    // Apply filters
    if (filters.search) {
      queryBuilder.andWhere(
        "(user.email LIKE :search OR user.firstName LIKE :search OR user.lastName LIKE :search)",
        { search: `%${filters.search}%` }
      );
    }

    if (filters.isVerified !== undefined) {
      queryBuilder.andWhere("user.isVerified = :isVerified", {
        isVerified: filters.isVerified,
      });
    }

    // Sorting
    const sortBy = filters.sortBy || "createdAt";
    const order = filters.order || "DESC";
    queryBuilder.orderBy(`user.${sortBy}`, order);

    const users = await queryBuilder.getMany();

    return users.map((user) => ({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      balance: user.balance,
      role: user.role,
      isVerified: user.isVerified,
      devices: user.devices.map((d) => ({
        id: d.id,
        deviceId: d.deviceId,
        deviceName: d.deviceName,
        deviceModel: d.deviceModel,
        isVerified: d.isVerified,
        lastUsedAt: d.lastUsedAt,
        createdAt: d.createdAt,
      })),
      createdAt: user.createdAt,
    }));
  }

  /**
   * Verify or unverify device
   */
  async verifyDevice(deviceId: string, adminId: string, isVerified: boolean) {
    const device = await this.deviceRepository.findOne({
      where: { id: deviceId },
      relations: ["user"],
    });

    if (!device) {
      throw new Error("Device not found");
    }

    device.isVerified = isVerified;
    device.verifiedBy = isVerified ? adminId : undefined;
    device.verifiedAt = isVerified ? new Date() : undefined;

    await this.deviceRepository.save(device);

    // Update user verification status
    // User is verified if they have at least one verified device
    const hasVerifiedDevice = await this.deviceRepository.findOne({
      where: {
        userId: device.userId,
        isVerified: true,
      },
    });

    device.user.isVerified = !!hasVerifiedDevice;
    await this.userRepository.save(device.user);

    return {
      device: {
        id: device.id,
        deviceId: device.deviceId,
        deviceName: device.deviceName,
        isVerified: device.isVerified,
        verifiedAt: device.verifiedAt,
      },
      message: `Device ${isVerified ? "verified" : "unverified"} successfully`,
    };
  }

  /**
   * Get all transactions
   */
  async getAllTransactions(page = 1, limit = 50) {
    const skip = (page - 1) * limit;

    const [transactions, total] = await this.transactionRepository.findAndCount(
      {
        relations: ["user"],
        order: { createdAt: "DESC" },
        skip,
        take: limit,
      }
    );

    return {
      transactions: transactions.map((t) => ({
        id: t.id,
        type: t.type,
        amount: t.amount,
        balanceBefore: t.balanceBefore,
        balanceAfter: t.balanceAfter,
        description: t.description,
        status: t.status,
        user: {
          id: t.user.id,
          email: t.user.email,
          firstName: t.user.firstName,
          lastName: t.user.lastName,
        },
        createdAt: t.createdAt,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get dashboard statistics
   */
  async getDashboardStats() {
    const totalUsers = await this.userRepository.count();
    const verifiedUsers = await this.userRepository.count({
      where: { isVerified: true },
    });
    const pendingDevices = await this.deviceRepository.count({
      where: { isVerified: false },
    });

    const totalTransactions = await this.transactionRepository.count();

    const totalDeposits = await this.transactionRepository
      .createQueryBuilder("transaction")
      .select("SUM(transaction.amount)", "total")
      .where("transaction.type = :type", { type: "deposit" })
      .getRawOne();

    const totalWithdrawals = await this.transactionRepository
      .createQueryBuilder("transaction")
      .select("SUM(transaction.amount)", "total")
      .where("transaction.type = :type", { type: "withdrawal" })
      .getRawOne();

    const totalBalance = await this.userRepository
      .createQueryBuilder("user")
      .select("SUM(user.balance)", "total")
      .getRawOne();

    return {
      users: {
        total: totalUsers,
        verified: verifiedUsers,
        unverified: totalUsers - verifiedUsers,
      },
      devices: {
        pendingVerification: pendingDevices,
      },
      transactions: {
        total: totalTransactions,
      },
      financials: {
        totalDeposits: parseFloat(totalDeposits?.total || 0),
        totalWithdrawals: parseFloat(totalWithdrawals?.total || 0),
        totalBalance: parseFloat(totalBalance?.total || 0),
      },
    };
  }

  /**
   * Get pending devices for verification
   */
  async getPendingDevices() {
    const devices = await this.deviceRepository.find({
      where: { isVerified: false },
      relations: ["user"],
      order: { createdAt: "ASC" },
    });

    return devices.map((d) => ({
      id: d.id,
      deviceId: d.deviceId,
      deviceName: d.deviceName,
      deviceModel: d.deviceModel,
      osVersion: d.osVersion,
      user: {
        id: d.user.id,
        email: d.user.email,
        firstName: d.user.firstName,
        lastName: d.user.lastName,
      },
      createdAt: d.createdAt,
    }));
  }
}
