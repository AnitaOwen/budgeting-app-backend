\c budgeting_app;

INSERT INTO users (email, first_name, last_name, password_hash) VALUES
('john.doe@example.com', 'John', 'Doe', 'hashedpassword1'),
('jane.smith@example.com', 'Jane', 'Smith', 'hashedpassword2'),
('sam.brown@example.com', 'Sam', 'Brown', 'hashedpassword3');

INSERT INTO transactions (user_id, transaction_type, amount, item_name, transaction_date) VALUES
-- Transactions for John Doe
(1, 'income', 3000.00, 'Salary', '2024-11-01'),
(1, 'expense', 1200.50, 'Rent', '2024-11-03'),
(1, 'expense', 300.00, 'Groceries', '2024-11-05'),
(1, 'income', 200.00, 'Freelance Project', '2024-11-10'),
(1, 'expense', 150.00, 'Utilities', '2024-11-12'),

-- Transactions for Jane Smith
(2, 'income', 4500.00, 'Salary', '2024-11-01'),
(2, 'expense', 1500.00, 'Mortgage', '2024-11-02'),
(2, 'expense', 400.00, 'Groceries', '2024-11-05'),
(2, 'expense', 250.00, 'Insurance', '2024-11-08'),
(2, 'income', 300.00, 'Side Job', '2024-11-15'),

-- Transactions for Sam Brown
(3, 'income', 3500.00, 'Salary', '2024-11-01'),
(3, 'expense', 800.00, 'Rent', '2024-11-03'),
(3, 'expense', 200.00, 'Transportation', '2024-11-06'),
(3, 'expense', 50.00, 'Coffee', '2024-11-07'),
(3, 'income', 100.00, 'Gift', '2024-11-10');
