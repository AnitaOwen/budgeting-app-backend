\c budgeting_app;

INSERT INTO users (email, first_name, last_name, password_hash, is_verified) VALUES
('john.doe@example.com', 'John', 'Doe', '$2b$10$KcwToLoAoSNuXuwg0BrXaeqev92HlioOThHxluz4wmyxwUulFu.0K', TRUE),
('jane.smith@example.com', 'Jane', 'Smith', '$2b$10$KcwToLoAoSNuXuwg0BrXaeqev92HlioOThHxluz4wmyxwUulFu.0K', TRUE),
('missjanedoe2@gmail.com', 'Sam', 'Brown', '$2b$10$KcwToLoAoSNuXuwg0BrXaeqev92HlioOThHxluz4wmyxwUulFu.0K', TRUE),
('aveniia@gmail.com', 'Demo', 'User', '$2b$10$KcwToLoAoSNuXuwg0BrXaeqev92HlioOThHxluz4wmyxwUulFu.0K', TRUE);   

INSERT INTO transactions (user_id, transaction_type, amount, category, transaction_date) VALUES

(1, 'income', 3000.00, 'Salary & Wages', '2024-11-01'),
(1, 'income', 200.00, 'Investments', '2024-11-10'),
(1, 'expense', 1200.50, 'Housing', '2024-11-03'),
(1, 'expense', 300.00, 'Food & Dining', '2024-11-05'),
(1, 'expense', 150.00, 'Utilities', '2024-11-12'),
(1, 'expense', 100.00, 'Entertainment', '2024-11-15'),

-- Transactions for Jane Smith
(2, 'income', 4500.00, 'Business Income', '2024-11-01'),
(2, 'income', 300.00, 'Investments', '2024-11-15'),
(2, 'expense', 1500.00, 'Housing', '2024-11-02'),
(2, 'expense', 400.00, 'Food & Dining', '2024-11-05'),
(2, 'expense', 250.00, 'Debt Payments', '2024-11-08'),
(2, 'expense', 200.00, 'Childcare', '2024-11-20'),

-- Transactions for Sam Brown
(3, 'income', 3500.00, 'Rental Income', '2024-11-01'),
(3, 'income', 100.00, 'Government Benefits', '2024-11-10'),
(3, 'expense', 800.00, 'Housing', '2024-11-03'),
(3, 'expense', 200.00, 'Transportation', '2024-11-06'),
(3, 'expense', 50.00, 'Shopping', '2024-11-07'),
(3, 'expense', 300.00, 'Travel', '2024-11-15'),

-- Transactions for Demo User
(4, 'income', 2100.00, 'Salary & Wages', '2024-10-01'),
(4, 'income', 200.00, 'Investments', '2024-10-15'),
(4, 'expense', 500.00, 'Housing', '2024-10-03'),
(4, 'expense', 150.00, 'Food & Dining', '2024-10-05'),
(4, 'expense', 80.00, 'Utilities', '2024-10-12'),
(4, 'expense', 100.00, 'Pets', '2024-10-18'),
(4, 'expense', 120.00, 'Transportation', '2024-10-22'),
(4, 'expense', 60.00, 'Other Expense', '2024-10-28'),
(4, 'income', 2000.00, 'Salary & Wages', '2024-11-01'),
(4, 'income', 100.00, 'Other Income', '2024-11-10'),
(4, 'expense', 500.00, 'Housing', '2024-11-03'),
(4, 'expense', 150.00, 'Food & Dining', '2024-11-05'),
(4, 'expense', 75.00, 'Utilities', '2024-11-12'),
(4, 'expense', 100.00, 'Pets', '2024-11-20'),
(4, 'expense', 80.00, 'Other Expense', '2024-11-25'),
(4, 'income', 2200.00, 'Salary & Wages', '2024-09-01'),
(4, 'income', 250.00, 'Business Income', '2024-09-15'),
(4, 'expense', 550.00, 'Housing', '2024-09-03'),
(4, 'expense', 100.00, 'Debt Payments', '2024-09-07'),
(4, 'expense', 150.00, 'Transportation', '2024-09-12'),
(4, 'expense', 200.00, 'Shopping', '2024-09-15'),
(4, 'expense', 180.00, 'Food & Dining', '2024-09-20'),
(4, 'expense', 50.00, 'Travel', '2024-09-25'),
(4, 'income', 2100.00, 'Salary & Wages', '2024-08-01'),
(4, 'income', 200.00, 'Investments', '2024-08-20'),
(4, 'expense', 500.00, 'Housing', '2024-08-03'),
(4, 'expense', 120.00, 'Health & Wellness', '2024-08-07'),
(4, 'expense', 90.00, 'Utilities', '2024-08-10'),
(4, 'expense', 200.00, 'Childcare', '2024-08-15'),
(4, 'expense', 180.00, 'Food & Dining', '2024-08-18'),
(4, 'expense', 60.00, 'Pets', '2024-08-25'),
(4, 'income', 2000.00, 'Salary & Wages', '2024-07-01'),
(4, 'income', 150.00, 'Other Income', '2024-07-15'),
(4, 'expense', 500.00, 'Housing', '2024-07-03'),
(4, 'expense', 100.00, 'Utilities', '2024-07-10'),
(4, 'expense', 150.00, 'Transportation', '2024-07-12'),
(4, 'expense', 180.00, 'Food & Dining', '2024-07-15'),
(4, 'expense', 75.00, 'Entertainment', '2024-07-20'),
(4, 'expense', 50.00, 'Other Expense', '2024-07-25');