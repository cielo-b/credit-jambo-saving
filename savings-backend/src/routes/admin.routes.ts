import { Router } from "express";
import { AdminController } from "../controllers/admin.controller";
import { authenticate, authorizeAdmin } from "../middlewares/auth.middleware";

const router = Router();
const adminController = new AdminController();

// All routes require authentication and admin role
router.use(authenticate);
router.use(authorizeAdmin);

router.get("/users", adminController.getUsers);
router.post("/verify-device", adminController.verifyDevice);
router.get("/transactions", adminController.getTransactions);
router.get("/stats", adminController.getStats);
router.get("/pending-devices", adminController.getPendingDevices);

export default router;
