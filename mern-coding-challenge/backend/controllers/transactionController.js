const axios = require('axios');
const Transaction = require('../models/Transaction');

// Initialize the database with seed data
const initializeDatabase = async (req, res) => {
    try {
        const response = await axios.get(process.env.THIRD_PARTY_API_URL);
        const transactions = response.data;

        // Clear existing data and seed new data
        await Transaction.deleteMany();
        await Transaction.insertMany(transactions);

        res.status(200).json({ message: 'Database initialized with seed data' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// List transactions with search and pagination
const getTransactions = async (req, res) => {
    const { page = 1, perPage = 10, search = '', month } = req.query;
    const regex = new RegExp(search, 'i');
    const skip = (page - 1) * perPage;

    try {
        const transactions = await Transaction.find({
            dateOfSale: { $regex: `-${month.padStart(2, '0')}-` },
            $or: [
                { title: regex },
                { description: regex },
                { price: regex }
            ]
        })
        .skip(skip)
        .limit(parseInt(perPage));

        const total = await Transaction.countDocuments({
            dateOfSale: { $regex: `-${month.padStart(2, '0')}-` },
            $or: [
                { title: regex },
                { description: regex },
                { price: regex }
            ]
        });

        res.status(200).json({ transactions, total });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Export all controllers
module.exports = {
    initializeDatabase,
    getTransactions,
};
