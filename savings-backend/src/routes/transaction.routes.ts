import { Router } from "express";
import { TransactionController } from "../controllers/transaction.controller";
import { validateBody } from "../middlewares/validation.middleware";
import { authenticate } from "../middlewares/auth.middleware";
import { CreateTransactionDto } from "../dtos/transaction.dto";

const router = Router();
const transactionController = new TransactionController();

// All routes require authentication
router.use(authenticate);

router.post(
  "/deposit",
  validateBody(CreateTransactionDto),
  transactionController.deposit
);

router.post(
  "/withdraw",
  validateBody(CreateTransactionDto),
  transactionController.withdraw
);

router.get("/history", transactionController.getHistory);
router.get("/balance", transactionController.getBalance);

export default router;
