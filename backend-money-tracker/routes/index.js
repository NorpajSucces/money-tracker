const router = require('express').Router();
const authRoutes = require('./auth');
const transactionRoutes = require('./transactions');
const authentication = require('../middlewares/authentication');

router.use(authRoutes);

router.use(authentication);
router.use('/transactions', transactionRoutes);

module.exports = router;