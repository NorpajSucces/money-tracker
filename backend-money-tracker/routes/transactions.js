const express = require('express');
const router = express.Router();
const TransactionsController = require('../controllers/transactionsController');

router.get('/', TransactionsController.getAllTransactions);
router.get('/summary', TransactionsController.getSummary);
router.get('/:id', TransactionsController.getTransactionById);
router.post('/', TransactionsController.createTransaction);
router.put('/:id', TransactionsController.updateTransaction);
router.delete('/:id', TransactionsController.deleteTransaction);

module.exports = router;
