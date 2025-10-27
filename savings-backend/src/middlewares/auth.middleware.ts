import { Request, Response, NextFunction } from "express";
import { verifyToken, JwtPayload } from "../utils/jwt";
import { AppDataSource } from "../config/database";
import { User, UserRole } from "../entities/User";
import { Device } from "../entities/Device";

// Extend Express Request type
export interface AuthRequest extends Request {
  user?: User;
  deviceId?: string;
}

/**
 * Authenticate user via JWT token
 */
export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "No token provided" });
      return;
    }

    const token = authHeader.substring(7);
    const decoded: JwtPayload = verifyToken(token);

    // Fetch user from database
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id: decoded.userId },
      relations: ["devices"],
    });

    if (!user) {
      res.status(401).json({ error: "User not found" });
      return;
    }

    // Verify device
    const deviceRepository = AppDataSource.getRepository(Device);
    const device = await deviceRepository.findOne({
      where: {
        userId: user.id,
        deviceId: decoded.deviceId,
      },
    });

    if (!device) {
      res.status(401).json({ error: "Device not recognized" });
      return;
    }

    if (!device.isVerified) {
      res.status(403).json({
        error: "Device not verified. Please contact admin for verification.",
      });
      return;
    }

    // Update last used time
    device.lastUsedAt = new Date();
    await deviceRepository.save(device);

    req.user = user;
    req.deviceId = decoded.deviceId;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

/**
 * Authorize admin role
 */
export const authorizeAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }

  if (req.user.role !== UserRole.ADMIN) {
    res.status(403).json({ error: "Admin access required" });
    return;
  }

  next();
};

/**
 * Optional authentication - doesn't fail if no token
 */
export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      const decoded: JwtPayload = verifyToken(token);

      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({
        where: { id: decoded.userId },
      });

      if (user) {
        req.user = user;
        req.deviceId = decoded.deviceId;
      }
    }

    next();
  } catch (error) {
    // Ignore errors for optional auth
    next();
  }
};
