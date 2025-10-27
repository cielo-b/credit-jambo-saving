import { Router } from "express";
import { TransactionController } from "../controllers/transaction.controller";
import { validateBody } from "../middlewares/validation.middleware";
import { authenticate } from "../middlewares/auth.middleware";
import { CreateTransactionDto } from "../dtos/transaction.dto";

const router = Router();
const transactionController = new TransactionController();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /transactions/deposit:
 *   post:
 *     summary: Make a deposit
 *     tags: [Transactions]
 *     description: Deposit money into user's account
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TransactionRequest'
 *     responses:
 *       201:
 *         description: Deposit successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 transaction:
 *                   $ref: '#/components/schemas/Transaction'
 *                 message:
 *                   type: string
 *                   example: Deposit successful
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post(
  "/deposit",
  validateBody(CreateTransactionDto),
  transactionController.deposit
);

/**
 * @swagger
 * /transactions/withdraw:
 *   post:
 *     summary: Make a withdrawal
 *     tags: [Transactions]
 *     description: Withdraw money from user's account
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TransactionRequest'
 *     responses:
 *       201:
 *         description: Withdrawal successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 transaction:
 *                   $ref: '#/components/schemas/Transaction'
 *                 message:
 *                   type: string
 *                   example: Withdrawal successful
 *       400:
 *         description: Insufficient balance or validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post(
  "/withdraw",
  validateBody(CreateTransactionDto),
  transactionController.withdraw
);

/**
 * @swagger
 * /transactions/history:
 *   get:
 *     summary: Get transaction history
 *     tags: [Transactions]
 *     description: Retrieve user's transaction history with pagination
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of items per page
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [deposit, withdrawal]
 *         description: Filter by transaction type
 *     responses:
 *       200:
 *         description: Transaction history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 transactions:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Transaction'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get("/history", transactionController.getHistory);

/**
 * @swagger
 * /transactions/balance:
 *   get:
 *     summary: Get current balance
 *     tags: [Transactions]
 *     description: Retrieve user's current account balance
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Balance retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BalanceResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get("/balance", transactionController.getBalance);

export default router;
