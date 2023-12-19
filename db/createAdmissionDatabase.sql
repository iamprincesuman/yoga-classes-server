-- Create Database
CREATE DATABASE IF NOT EXISTS yoga_classes;

-- Use the Database
USE yoga_classes;

-- Create Participants Table
CREATE TABLE IF NOT EXISTS participants (
  ParticipantID INT AUTO_INCREMENT PRIMARY KEY,
  Name VARCHAR(255) NOT NULL,
  Age INT NOT NULL,
  BatchID INT NOT NULL,
  EnrollmentDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  EndDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (BatchID) REFERENCES batches(BatchID)
);

-- Create Batches Table
CREATE TABLE IF NOT EXISTS batches (
  BatchID INT AUTO_INCREMENT PRIMARY KEY,
  StartTime TIME NOT NULL,
  EndTime TIME NOT NULL
);

-- Create Payments Table
CREATE TABLE IF NOT EXISTS payments (
  PaymentID INT AUTO_INCREMENT PRIMARY KEY,
  ParticipantID INT NOT NULL,
  PaymentDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  Amount DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (ParticipantID) REFERENCES participants(ParticipantID)
);
