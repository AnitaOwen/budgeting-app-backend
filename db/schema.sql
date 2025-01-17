DROP DATABASE IF EXISTS budgeting_app;

CREATE DATABASE budgeting_app;

\c budgeting_app;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    password_hash TEXT NOT NULL, 
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    transaction_type VARCHAR(20) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    transaction_date DATE NOT NULL
);

CREATE TABLE user_otps (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    otp VARCHAR(255) NOT NULL,
    expiration_time TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

