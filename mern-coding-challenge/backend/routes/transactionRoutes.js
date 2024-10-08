const express = require('express');
const router = express.Router();
const { initializeDatabase, getTransactions } = require('../controllers/transactionController');

// Route to initialize the database
router.get('/initialize', initializeDatabase);

// Route to list transactions
router.get('/list', getTransactions);

module.exports = router;
