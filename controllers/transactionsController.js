const getTransactionsByUserId = require("../queries/transactions")
const express = require("express");

const transactions = express.Router()

transactions.get("/:user_id", async (req, res) => {
    const { user_id } = req.params
    try {
        const allTransactions = await getTransactionsByUserId(user_id);
        if(allTransactions[0]){
            res.status(200).json(allTransactions);
        } else {
            res.status(404).json({ error: "No transactions found for this user." });
        }
    } catch (error) { 
        console.error(error);
        res.status(500).json({ error: "Transactions not found" });
    }
})

module.exports = transactions;