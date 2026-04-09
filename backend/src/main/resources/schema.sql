-- Smart Facility Management System - PostgreSQL Database Setup
-- Run this script to initialize the database schema

-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(30),
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_number VARCHAR(30);

-- Create Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    facility_name VARCHAR(255) NOT NULL,
    booking_date TIMESTAMP NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE
);

-- Create Indexes for better query performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_bookings_user_email ON bookings(user_email);
CREATE INDEX idx_bookings_facility_name ON bookings(facility_name);
CREATE INDEX idx_bookings_start_time ON bookings(start_time);

-- Insert sample data (optional)
INSERT INTO users (full_name, email, password, role) VALUES
    ('Admin User', 'admin@smartfacility.com', '$2a$10$slYQmyNdGzin7olVN3DOCe1RVSubLr4f59JRnWnWbVxVvqtoHlxMi', 'ADMIN'),
    ('Staff User', 'staff@smartfacility.com', '$2a$10$slYQmyNdGzin7olVN3DOCe1RVSubLr4f59JRnWnWbVxVvqtoHlxMi', 'STAFF'),
    ('Student User', 'student@smartfacility.com', '$2a$10$slYQmyNdGzin7olVN3DOCe1RVSubLr4f59JRnWnWbVxVvqtoHlxMi', 'STUDENT')
ON CONFLICT (email) DO NOTHING;

-- Create Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    type VARCHAR(50) NOT NULL DEFAULT 'INFO',
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    related_entity VARCHAR(100),
    related_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE
);
