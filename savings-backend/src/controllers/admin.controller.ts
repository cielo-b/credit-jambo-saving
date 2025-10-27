import { Request, Response } from "express";
import { AdminService } from "../services/admin.service";
import { UserFilterDto, VerifyDeviceDto } from "../dtos/admin.dto";
import { AuthRequest } from "../middlewares/auth.middleware";

export class AdminController {
  private adminService = new AdminService();

  /**
   * Get all users
   * GET /api/admin/users
   */
  getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const filters: UserFilterDto = {
        search: req.query.search as string,
        isVerified:
          req.query.isVerified === "true"
            ? true
            : req.query.isVerified === "false"
            ? false
            : undefined,
        sortBy: req.query.sortBy as any,
        order: req.query.order as any,
      };

      const users = await this.adminService.getUsers(filters);
      res.status(200).json(users);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  /**
   * Verify device
   * POST /api/admin/verify-device
   */
  verifyDevice = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Not authenticated" });
        return;
      }

      const { deviceId, isVerified } = req.body;
      const result = await this.adminService.verifyDevice(
        deviceId,
        req.user.id,
        isVerified
      );
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  /**
   * Get all transactions
   * GET /api/admin/transactions
   */
  getTransactions = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;

      const result = await this.adminService.getAllTransactions(page, limit);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  /**
   * Get dashboard statistics
   * GET /api/admin/stats
   */
  getStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const stats = await this.adminService.getDashboardStats();
      res.status(200).json(stats);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  /**
   * Get pending devices
   * GET /api/admin/pending-devices
   */
  getPendingDevices = async (req: Request, res: Response): Promise<void> => {
    try {
      const devices = await this.adminService.getPendingDevices();
      res.status(200).json(devices);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };
}
