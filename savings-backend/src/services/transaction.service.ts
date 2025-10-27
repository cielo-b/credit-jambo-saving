import { AppDataSource } from "../config/database";
import {
  Transaction,
  TransactionType,
  TransactionStatus,
} from "../entities/Transaction";
import { User } from "../entities/User";
import {
  CreateTransactionDto,
  TransactionQueryDto,
} from "../dtos/transaction.dto";

export class TransactionService {
  private transactionRepository = AppDataSource.getRepository(Transaction);
  private userRepository = AppDataSource.getRepository(User);

  /**
   * Create deposit transaction
   */
  async deposit(userId: string, data: CreateTransactionDto, deviceId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error("User not found");
    }

    const balanceBefore = parseFloat(user.balance.toString());
    const amount = parseFloat(data.amount.toString());
    const balanceAfter = balanceBefore + amount;

    // Create transaction
    const transaction = this.transactionRepository.create({
      type: TransactionType.DEPOSIT,
      amount: data.amount,
      balanceBefore,
      balanceAfter,
      status: TransactionStatus.COMPLETED,
      description: data.description || "Deposit",
      userId: user.id,
      deviceId,
    });

    // Update user balance
    user.balance = balanceAfter;

    // Save both in a transaction
    await AppDataSource.transaction(async (manager) => {
      await manager.save(user);
      await manager.save(transaction);
    });

    return {
      transaction: {
        id: transaction.id,
        type: transaction.type,
        amount: transaction.amount,
        balanceBefore: transaction.balanceBefore,
        balanceAfter: transaction.balanceAfter,
        description: transaction.description,
        status: transaction.status,
        createdAt: transaction.createdAt,
      },
      newBalance: balanceAfter,
    };
  }

  /**
   * Create withdrawal transaction
   */
  async withdraw(userId: string, data: CreateTransactionDto, deviceId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error("User not found");
    }

    const balanceBefore = parseFloat(user.balance.toString());
    const amount = parseFloat(data.amount.toString());
    const balanceAfter = balanceBefore - amount;

    // Check sufficient balance
    if (balanceAfter < 0) {
      throw new Error("Insufficient balance");
    }

    // Create transaction
    const transaction = this.transactionRepository.create({
      type: TransactionType.WITHDRAWAL,
      amount: data.amount,
      balanceBefore,
      balanceAfter,
      status: TransactionStatus.COMPLETED,
      description: data.description || "Withdrawal",
      userId: user.id,
      deviceId,
    });

    // Update user balance
    user.balance = balanceAfter;

    // Save both in a transaction
    await AppDataSource.transaction(async (manager) => {
      await manager.save(user);
      await manager.save(transaction);
    });

    return {
      transaction: {
        id: transaction.id,
        type: transaction.type,
        amount: transaction.amount,
        balanceBefore: transaction.balanceBefore,
        balanceAfter: transaction.balanceAfter,
        description: transaction.description,
        status: transaction.status,
        createdAt: transaction.createdAt,
      },
      newBalance: balanceAfter,
    };
  }

  /**
   * Get transaction history
   */
  async getHistory(userId: string, query: TransactionQueryDto) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const queryBuilder = this.transactionRepository
      .createQueryBuilder("transaction")
      .where("transaction.userId = :userId", { userId });

    if (query.type) {
      queryBuilder.andWhere("transaction.type = :type", { type: query.type });
    }

    queryBuilder
      .orderBy("transaction.createdAt", "DESC")
      .skip(skip)
      .take(limit);

    const [transactions, total] = await queryBuilder.getManyAndCount();

    return {
      transactions: transactions.map((t) => ({
        id: t.id,
        type: t.type,
        amount: t.amount,
        balanceBefore: t.balanceBefore,
        balanceAfter: t.balanceAfter,
        description: t.description,
        status: t.status,
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
   * Get user balance
   */
  async getBalance(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error("User not found");
    }

    return {
      balance: parseFloat(user.balance.toString()),
      userId: user.id,
    };
  }
}
