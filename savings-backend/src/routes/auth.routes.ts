import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { validateBody } from "../middlewares/validation.middleware";
import { authenticate } from "../middlewares/auth.middleware";
import { RegisterDto, LoginDto } from "../dtos/auth.dto";

const router = Router();
const authController = new AuthController();

// Public routes
router.post("/register", validateBody(RegisterDto), authController.register);
router.post("/login", validateBody(LoginDto), authController.login);

// Protected routes
router.get("/me", authenticate, authController.getMe);

export default router;
