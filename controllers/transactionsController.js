const express = require("express");
const { getTransactionsByUserId, addNewTransaction, deleteTransaction } = require("../queries/transactions")

const transactions = express.Router()

transactions.get("/:user_id", async (req, res) => {
    const { user_id } = req.params
    try {
        const allTransactions = await getTransactionsByUserId(user_id);
        if (!allTransactions.length) {
            throw new Error("No transactions found for this user.");
        }
        res.status(200).json(allTransactions);
    } catch (error) { 
        console.error("Error in transactions.get:", error);
        res.status(500).json({ error: "Transactions not found" });
    }
});

transactions.post("/", async (req, res) => {
    try {
        const newTransaction = await addNewTransaction({...req.body});
        if (!newTransaction.id) {
            throw new Error("Failed to add transaction");
        }
        console.log("new transaction added")
        const allTransactions = await getTransactionsByUserId(newTransaction.user_id);
        res.status(200).json(allTransactions);
    } catch (error) { 
        console.error("Error in transactions.post:", error);
        res.status(500).json({ error: "An unexpected error occurred while adding the transaction." });
    }
});

transactions.delete("/:transaction_id", async (req, res) => {
    try {
        const { transaction_id } = req.params;
        const deletedTransaction = await deleteTransaction(transaction_id);
        if (!deletedTransaction.id) {
            throw new Error("Transaction to delete not found")
        }
        res.status(200).json(deletedTransaction);
    } catch (error) { 
        console.error("Error in deleting transaction:", error);
        res.status(500).json({ error: "An unexpected error occurred while adding the transaction." });
    }
  });

module.exports = transactions;