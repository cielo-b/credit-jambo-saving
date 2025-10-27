import { Router } from "express";
import authRoutes from "./auth.routes";
import transactionRoutes from "./transaction.routes";
import adminRoutes from "./admin.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/transactions", transactionRoutes);
router.use("/admin", adminRoutes);

// Health check
router.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

export default router;
