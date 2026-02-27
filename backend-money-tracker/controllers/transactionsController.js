const Transaction = require('../models/Transaction');
const createError = require('../helpers/createError');

class TransactionsController {

    static async getAllTransactions(req, res, next) {
        try {
            const transactions = await Transaction.find({ userId: req.user._id });
            res.status(200).json({
                userId: req.user._id,
                success: true,
                data: transactions
            });
        } catch (error) {
            next(error);
        }
    }

    static async getTransactionById(req, res, next) {
        try {
            const { id } = req.params;

            const transaction = await Transaction.findOne({
                _id: id,
                userId: req.user._id
            });

            if (!transaction) {
                throw createError('Transaction not found', 404);
            }

            res.status(200).json({
                success: true,
                data: transaction
            });
        } catch (error) {
            next(error);
        }
    }

    static async createTransaction(req, res, next) {
        try {
            const { title, amount, type } = req.body;

            if (!title || amount === undefined || !type) {
                throw createError('Please provide title, amount, and type', 400);
            }

            const newTransaction = await Transaction.create({
                title,
                amount,
                type,
                userId: req.user.id
            });

            res.status(201).json({
                success: true,
                data: newTransaction
            });
        } catch (error) {
            next(error);
        }
    }

    static async updateTransaction(req, res, next) {
        try {
            const { id } = req.params;

            const updatedTransaction = await Transaction.findOneAndUpdate(
                { _id: id, userId: req.user._id },
                req.body,
                {
                    new: true,
                    runValidators: true
                }
            );

            if (!updatedTransaction) {
                throw createError('Transaction not found', 404);
            }

            res.status(200).json({
                success: true,
                data: updatedTransaction
            });
        } catch (error) {
            next(error);
        }
    }

    static async deleteTransaction(req, res, next) {
        try {
            const { id } = req.params;

            const deletedTransaction = await Transaction.findOneAndDelete({
                _id: id,
                userId: req.user._id
            });

            if (!deletedTransaction) {
                throw createError('Transaction not found', 404);
            }

            res.status(200).json({
                success: true,
                data: {}
            });
        } catch (error) {
            next(error);
        }
    }

    static async getSummary(req, res, next) {
        try {
            const transactions = await Transaction.find({
                userId: req.user._id
            });

            let total = 0;

            transactions.forEach(trx => {
                if (trx.type === 'income') total += trx.amount;
                if (trx.type === 'expense') total -= trx.amount;
            });

            res.json({
                total_balance: total
            });

        } catch (error) {
            next(error);
        }
    }
}

module.exports = TransactionsController;