const express = require("express");
const { getTransactionsByUserId, addNewTransaction, deleteTransaction, updateTransaction } = require("../queries/transactions")

const transactions = express.Router()

transactions.get("/:user_id", async (req, res) => {
    const { user_id } = req.params
    try {
        const allTransactions = await getTransactionsByUserId(user_id);
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
    const { transaction_id } = req.params;
    try {
        const deletedTransaction = await deleteTransaction(transaction_id);
        if (!deletedTransaction) {
            throw new Error("There was an issue deleting the transaction.");
          }
        res.status(200).json(deletedTransaction);
    } catch (error) { 
        console.error("Error in deleting transaction:", error);
        res.status(500).json({ error: "An unexpected error occurred while adding the transaction." });
    }
});

transactions.put("/", async (req, res) => {
    console.log("req", req.body)
    try {
        const updatedTransaction = await updateTransaction({...req.body});
        if (!updatedTransaction || !updatedTransaction.id) {
            throw new Error("Failed to update transaction.");
        }
        
        console.log(`Transaction ${updatedTransaction.id} updated successfully.`);

        const allTransactions = await getTransactionsByUserId(updatedTransaction.user_id);
        if (!allTransactions) {
            throw new Error("Failed to fetch transactions after update.");
        }
        res.status(200).json(allTransactions);
    } catch (error) { 
        console.error("Error editing transaction:", error);
        res.status(500).json({ error: `An error occurred: ${error.message}` });
    }
});

module.exports = transactions;