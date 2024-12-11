const { getTransactionsByUserId, addNewTransaction, deleteTransaction, updateTransaction } = require('../queries/transactions.js')

const db = require("../db/dbConfig")

jest.mock("../db/dbConfig")

describe('getTransactionsByUserId', ()=> {
    const mockTransactions = [{ id: 1, amount: '100', user_id: 1, transaction_date: '2024-12-01' }];

    it('should fetch transactions for a given user_id', async () => {
        const userId = 1

        db.any.mockResolvedValueOnce(mockTransactions);

        const result = await getTransactionsByUserId(userId)

        expect(result).toEqual(mockTransactions)
        
        expect(db.any).toHaveBeenCalledWith('SELECT * FROM transactions WHERE user_id = $1 ORDER BY transaction_date DESC', userId)

    });

    it('should throw an error if the database fails', async () => {
        const userId = 1;

        db.any.mockRejectedValueOnce(new Error("Error retreiving transactions"));

        await expect(getTransactionsByUserId(userId)).rejects.toThrow("Error retreiving transactions");
    });

    it(`should return an empty array if no transactions are found`, async () => {
        const userId = 1

        db.any.mockResolvedValueOnce([])

        const result = await getTransactionsByUserId(userId)

        expect(result).toEqual([])
        expect(db.any).toHaveBeenCalledWith(
            `SELECT * FROM transactions WHERE user_id = $1 ORDER BY transaction_date DESC`, userId)
    });

    it(`should throw an error if user_id is not provided`, async () => {
        await expect(getTransactionsByUserId(undefined)).rejects.toThrow("Invalid id provided")
    });

    it('should prevent SQL injection attempts', async () => {
        const maliciousUserId = "'; DROP TABLE transactions; --";
    
        db.any.mockResolvedValueOnce([])
    
        const result = await getTransactionsByUserId(maliciousUserId);
    
        expect(result).toEqual([]);
        expect(db.any).toHaveBeenCalledWith(
            `SELECT * FROM transactions WHERE user_id = $1 ORDER BY transaction_date DESC`,
            maliciousUserId
        );
    });
    
});

describe('addNewTransaction', () => {
    const newTransaction = [{ amount: '100', user_id: 1, transaction_date: '2024-12-01', transaction_type: 'expense', category: 'Pets' }]

    it(`should add a new transaction and return the updated list`, async () => {
        const mockResponse = { ...newTransaction, id: 2 }

        db.one.mockResolvedValueOnce(mockResponse)

        const result = await addNewTransaction(newTransaction)

        expect(result).toEqual(mockResponse)
        expect(db.one).toHaveBeenCalledWith(
            `INSERT INTO transactions (user_id, transaction_type, amount, category, transaction_date ) VALUES($1, $2, $3, $4, $5) RETURNING *`,
            [
                newTransaction.user_id,
                newTransaction.transaction_type,
                newTransaction.amount,
                newTransaction.category,
                newTransaction.transaction_date
            ]
        )
    });

    it(`should throw an error if the database fails`, async () => {
        db.one.mockRejectedValueOnce(new Error("Failed to add a new transaction"))

        await expect(addNewTransaction(newTransaction)).rejects.toThrow('Failed to add a new transaction')
    });
});