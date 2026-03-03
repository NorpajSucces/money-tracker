const Transaction = require('../models/Transaction');
const createError = require('../helpers/createError');

class TransactionsController {

    static async getAllTransactions(req, res, next) {
        try {
            const transactions = await Transaction.find({ userId: req.user._id }).sort({ createdAt: -1 });

            res.status(200).json({
                success: true,
                data: transactions
            });
        } catch (error) {
            next(error);
        }
    }

    static async getTransactionById(req, res, next) {
        try {
            const transaction = await Transaction.findOne({
                _id: req.params.id,
                userId: req.user._id
            });

            if (!transaction) throw createError('Transaction not found', 404);

            res.status(200).json({ success: true, data: transaction });
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
                userId: req.user._id
            });

            res.status(201).json({ success: true, data: newTransaction });
        } catch (error) {
            next(error);
        }
    }

    static async updateTransaction(req, res, next) {
        try {
            // Destructure hanya field yang boleh diubah — cegah overwrite userId/createdAt
            const { title, amount, type } = req.body;

            const updatedTransaction = await Transaction.findOneAndUpdate(
                { _id: req.params.id, userId: req.user._id },
                { title, amount, type },
                { new: true, runValidators: true }
            );

            if (!updatedTransaction) throw createError('Transaction not found', 404);

            res.status(200).json({ success: true, data: updatedTransaction });
        } catch (error) {
            next(error);
        }
    }

    static async deleteTransaction(req, res, next) {
        try {
            const deletedTransaction = await Transaction.findOneAndDelete({
                _id: req.params.id,
                userId: req.user._id
            });

            if (!deletedTransaction) throw createError('Transaction not found', 404);

            res.status(200).json({ success: true, message: 'Transaction deleted' });
        } catch (error) {
            next(error);
        }
    }

    // Menggunakan aggregation pipeline — lebih efisien, tidak load semua dokumen ke JS
    static async getSummary(req, res, next) {
        try {
            const result = await Transaction.aggregate([
                { $match: { userId: req.user._id } },
                {
                    $group: {
                        _id: null,
                        income: {
                            $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] }
                        },
                        expense: {
                            $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] }
                        }
                    }
                }
            ]);

            const data = result[0] || { income: 0, expense: 0 };

            res.json({
                success: true,
                data: {
                    income: data.income,
                    expense: data.expense,
                    total_balance: data.income - data.expense
                }
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = TransactionsController;