\c budgeting_app;

INSERT INTO users (email, first_name, last_name, password_hash, verification_token, is_verified, created_at) VALUES
('john.doe@example.com', 'John', 'Doe', '$2b$10$KcwToLoAoSNuXuwg0BrXaeqev92HlioOThHxluz4wmyxwUulFu.0K', NULL, FALSE, CURRENT_TIMESTAMP),
('jane.smith@example.com', 'Jane', 'Smith', '$2b$10$KcwToLoAoSNuXuwg0BrXaeqev92HlioOThHxluz4wmyxwUulFu.0K', NULL, FALSE, CURRENT_TIMESTAMP),
('sam.brown@example.com', 'Sam', 'Brown', '$2b$10$KcwToLoAoSNuXuwg0BrXaeqev92HlioOThHxluz4wmyxwUulFu.0K', NULL, FALSE, CURRENT_TIMESTAMP),
('aveniia@gmail.com', 'Demo', 'User', '$2b$10$KcwToLoAoSNuXuwg0BrXaeqev92HlioOThHxluz4wmyxwUulFu.0K', NULL, TRUE, CURRENT_TIMESTAMP);  

INSERT INTO transactions (user_id, transaction_type, amount, category, transaction_date) VALUES
-- Transactions for John Doe
(1, 'income', 3000.00, 'Salary/Income', '2024-11-01'),
(1, 'income', 200.00, 'Investment', '2024-11-10'),
(1, 'expense', 1200.50, 'Rent/Mortgage', '2024-11-03'),
(1, 'expense', 300.00, 'Groceries', '2024-11-05'),
(1, 'expense', 150.00, 'Utilities', '2024-11-12'),
(1, 'expense', 75.00, 'Transportation', '2024-11-15'),

-- Transactions for Jane Smith
(2, 'income', 4500.00, 'Salary/Income', '2024-11-01'),
(2, 'income', 300.00, 'Salary/Income', '2024-11-15'),
(2, 'expense', 1500.00, 'Rent/Mortgage', '2024-11-02'),
(2, 'expense', 400.00, 'Groceries', '2024-11-05'),
(2, 'expense', 250.00, 'Insurance', '2024-11-08'),
(2, 'expense', 200.00, 'Education', '2024-11-20'),

-- Transactions for Sam Brown
(3, 'income', 3500.00, 'Salary/Income', '2024-11-01'),
(3, 'income', 100.00, 'Gifts/Donations', '2024-11-10'),
(3, 'expense', 800.00, 'Rent/Mortgage', '2024-11-03'),
(3, 'expense', 200.00, 'Transportation', '2024-11-06'),
(3, 'expense', 50.00, 'Dining Out', '2024-11-07'),
(3, 'expense', 300.00, 'Savings', '2024-11-15'),

-- Transactions for Demo User
(4, 'income', 2000.00, 'Salary/Income', '2024-11-01'),
(4, 'income', 100.00, 'Salary/Income', '2024-11-10'),
(4, 'expense', 500.00, 'Rent/Mortgage', '2024-11-03'),
(4, 'expense', 150.00, 'Groceries', '2024-11-05'),
(4, 'expense', 75.00, 'Utilities', '2024-11-12'),
(4, 'expense', 100.00, 'Entertainment', '2024-11-20');