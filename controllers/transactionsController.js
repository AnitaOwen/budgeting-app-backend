const express = require("express");
const { getTransactionsByUserId, addNewTransaction } = require("../queries/transactions")

const transactions = express.Router()

transactions.get("/:user_id", async (req, res) => {
    const { user_id } = req.params
    console.log("user id tranactions params", user_id)
    try {
        const allTransactions = await getTransactionsByUserId(user_id);
        if(allTransactions.length > 0){
            res.status(200).json(allTransactions);
        } else {
            res.status(404).json({ error: "No transactions found for this user." });
        }
    } catch (error) { 
        console.error(error);
        res.status(500).json({ error: "Transactions not found" });
    }
});

transactions.post("/", async (req, res) => {
    try {
        const newTransaction = await addNewTransaction({...req.body});
        if(newTransaction.id){
            const allTransactions = await getTransactionsByUserId(newTransaction.user_id);
            res.status(200).json(allTransactions);
        } else {
            res.status(404).json({ error: "Failed to add transaction" });
        }
    } catch (error) { 
        console.error("Error in transactions.post:", error);
        res.status(500).json({ error: "An unexpected error occurred while adding the transaction." });
    }
});

module.exports = transactions;