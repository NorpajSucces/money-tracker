const express = require('express');
const router = express.Router();
const TransactionsController = require('../controllers/transactionsController');

/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Get semua transaksi milik user
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List transaksi
 *       401:
 *         description: Unauthorized
 */
router.get('/', TransactionsController.getAllTransactions);

/**
 * @swagger
 * /transactions/summary:
 *   get:
 *     summary: Get ringkasan income, expense, dan total balance
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Summary data
 */
router.get('/summary', TransactionsController.getSummary);

/**
 * @swagger
 * /transactions/{id}:
 *   get:
 *     summary: Get transaksi by ID
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Transaction ID
 *     responses:
 *       200:
 *         description: Data transaksi
 *       404:
 *         description: Transaction not found
 */
router.get('/:id', TransactionsController.getTransactionById);

/**
 * @swagger
 * /transactions:
 *   post:
 *     summary: Buat transaksi baru
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - amount
 *               - type
 *             properties:
 *               title:
 *                 type: string
 *                 example: Gaji Bulanan
 *               amount:
 *                 type: number
 *                 example: 5000000
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *                 example: income
 *     responses:
 *       201:
 *         description: Transaksi berhasil dibuat
 *       400:
 *         description: Validation error
 */
router.post('/', TransactionsController.createTransaction);

/**
 * @swagger
 * /transactions/{id}:
 *   put:
 *     summary: Update transaksi
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               amount:
 *                 type: number
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *     responses:
 *       200:
 *         description: Transaksi berhasil diupdate
 *       404:
 *         description: Transaction not found
 */
router.put('/:id', TransactionsController.updateTransaction);

/**
 * @swagger
 * /transactions/{id}:
 *   delete:
 *     summary: Hapus transaksi
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transaksi berhasil dihapus
 *       404:
 *         description: Transaction not found
 */
router.delete('/:id', TransactionsController.deleteTransaction);

module.exports = router;
