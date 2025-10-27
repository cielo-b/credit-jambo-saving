import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { RegisterDto, LoginDto } from "../dtos/auth.dto";
import { AuthRequest } from "../middlewares/auth.middleware";

export class AuthController {
  private authService = new AuthService();

  /**
   * Register new user
   * POST /api/auth/register
   */
  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const data: RegisterDto = req.body;
      const result = await this.authService.register(data);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  /**
   * Login user
   * POST /api/auth/login
   */
  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const data: LoginDto = req.body;
      const result = await this.authService.login(data);

      if (result.requiresVerification) {
        res.status(403).json(result);
      } else {
        res.status(200).json(result);
      }
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  /**
   * Get current user profile
   * GET /api/auth/me
   */
  getMe = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Not authenticated" });
        return;
      }

      const profile = await this.authService.getProfile(req.user.id);
      res.status(200).json(profile);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };
}
