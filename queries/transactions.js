const db = require("../db/dbConfig");

const getTransactionsByUserId = async (user_id) => {
    try {
        const allTransactions = await db.any(`SELECT * FROM transactions WHERE user_id = $1 ORDER BY transaction_date DESC`, user_id)

        return allTransactions
    } catch(error){
        console.error(`Error retrieving transactions for user_id ${user_id}:`, error);
        throw new Error("Error retreiving transactions");
    }
};

const addNewTransaction = async (transaction) => {
    try {
        const { user_id, transaction_type, amount, category, transaction_date } = transaction

        const newTransaction = await db.one(`INSERT INTO transactions (user_id, transaction_type, amount, category, transaction_date ) VALUES($1, $2, $3, $4, $5) RETURNING *`, [user_id, transaction_type, amount, category, transaction_date ])

        return newTransaction
    } catch(error){
        console.error("Error adding new transaction", error)
        throw new Error("Failed to add a new transaction");
    }
};

const deleteTransaction = async (transaction_id) => {
    try {

        const deletedTransaction = await db.one(`DELETE FROM transactions WHERE id=$1 RETURNING *`, transaction_id)

        return deletedTransaction
    } catch(error){
        console.error("Error deleting transaction:", error);
        throw new Error("Failed to delete the transaction.");
    }
};

const updateTransaction = async (transaction) => {
    const { transaction_type, amount, category, transaction_date, id } = transaction;
    try {

        const updatedTransaction = await db.one(`UPDATE transactions SET transaction_type=$1, amount=$2, category=$3, transaction_date=$4 WHERE id=$5 RETURNING *`, [transaction_type, amount, category, transaction_date, id])
        return updatedTransaction
    } catch(error) {
        console.error('Error updating transaction:', error);
        throw error;
    }
};



module.exports = { getTransactionsByUserId, addNewTransaction, deleteTransaction, updateTransaction }