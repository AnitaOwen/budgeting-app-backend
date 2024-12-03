const db = require("../db/dbConfig");

const getTransactionsByUserId = async (user_id) => {
    try {
        const allTransactions = await db.any(`SELECT * FROM transactions WHERE user_id = $1 ORDER BY transaction_date DESC`, user_id)

        return allTransactions
    } catch(error){
        console.error("Error retreiving transactions", error)
        throw error;
    }
};

const addNewTransaction = async (transaction) => {
    try {
        const { user_id, transaction_type, amount, category, transaction_date } = transaction

        const newTransaction = await db.one(`INSERT INTO transactions (user_id, transaction_type, amount, category, transaction_date ) VALUES($1, $2, $3, $4, $5) RETURNING *`, [user_id, transaction_type, amount, category, transaction_date ])

        return newTransaction
    } catch(error){
        console.error("Error adding new transaction", error)
        throw error;
    }
};


module.exports = { getTransactionsByUserId, addNewTransaction }