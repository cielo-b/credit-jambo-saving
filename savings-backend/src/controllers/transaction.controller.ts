import { Response } from "express";
import { TransactionService } from "../services/transaction.service";
import {
  CreateTransactionDto,
  TransactionQueryDto,
} from "../dtos/transaction.dto";
import { AuthRequest } from "../middlewares/auth.middleware";

export class TransactionController {
  private transactionService = new TransactionService();

  /**
   * Create deposit
   * POST /api/transactions/deposit
   */
  deposit = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user || !req.deviceId) {
        res.status(401).json({ error: "Not authenticated" });
        return;
      }

      const data: CreateTransactionDto = req.body;
      const result = await this.transactionService.deposit(
        req.user.id,
        data,
        req.deviceId
      );
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  /**
   * Create withdrawal
   * POST /api/transactions/withdraw
   */
  withdraw = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user || !req.deviceId) {
        res.status(401).json({ error: "Not authenticated" });
        return;
      }

      const data: CreateTransactionDto = req.body;
      const result = await this.transactionService.withdraw(
        req.user.id,
        data,
        req.deviceId
      );
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  /**
   * Get transaction history
   * GET /api/transactions/history
   */
  getHistory = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Not authenticated" });
        return;
      }

      const query: TransactionQueryDto = {
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit
          ? parseInt(req.query.limit as string)
          : undefined,
        type: req.query.type as any,
      };

      const result = await this.transactionService.getHistory(
        req.user.id,
        query
      );
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  /**
   * Get balance
   * GET /api/transactions/balance
   */
  getBalance = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Not authenticated" });
        return;
      }

      const result = await this.transactionService.getBalance(req.user.id);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };
}
