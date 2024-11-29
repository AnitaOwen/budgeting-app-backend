
const db = require("../db/dbConfig");


const getTransactionsByUserId = async (user_id) => {
    try {
        const allTransactions = await db.any(`SELECT * FROM transactions WHERE user_id = $1 ORDER BY date DESC`, user_id)
        return allTransactions
    } catch(error){
        console.error("Error retreiving transactions", error)
        throw error;
    }
}

module.exports = getTransactionsByUserId