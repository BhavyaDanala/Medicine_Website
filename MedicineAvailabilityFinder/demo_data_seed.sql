-- =========================================
-- MEDIFIND DEMO DATASET SEED SCRIPT
-- =========================================
-- IMPORTANT: Run this script in SQL Server Management Studio (SSMS) 
-- connected to your (localdb)\MSSQLLocalDB instance.

-----------------------------------------------------------
-- 1. CLEANUP PHASE
-----------------------------------------------------------
USE MedicineAvailabilityAuthDb;
GO

-- Clean up Users table (Keep ONLY the existing Admin)
DELETE FROM Users WHERE Role != 'Admin';
GO

USE MedicineAvailabilityDB;
GO

-- Clean up Pharmacies, Medicines, and Inventory
DELETE FROM PharmacyMedicines;
DELETE FROM Pharmacies;
DELETE FROM Medicines;
GO


-----------------------------------------------------------
-- 2. SEEDING MedicineAvailabilityDB (Medicines)
-----------------------------------------------------------
USE MedicineAvailabilityDB;
GO

SET IDENTITY_INSERT Medicines ON;
INSERT INTO Medicines (MedicineId, MedicineName, Category, Manufacturer, Symptoms) VALUES 
(301, 'Dolo 650', 'Tablet', 'Micro Labs', 'Fever, Body Ache, Headache'),
(302, 'Dolo 650 Advanced', 'Tablet', 'Micro Labs', 'Severe Fever, Pain'),
(303, 'Paracetamol 500', 'Tablet', 'GSK', 'Fever, Pain'),
(304, 'Crocin Advance', 'Tablet', 'GSK', 'Fever, Headache'),
(305, 'Azithromycin 500', 'Antibiotic', 'Pfizer', 'Throat Infection, Cough'),
(306, 'Cetirizine', 'Antihistamine', 'Cipla', 'Allergy, Cold, Sneezing'),
(307, 'Amoxicillin', 'Antibiotic', 'Sun Pharma', 'Infection, Cough'),
(308, 'Metformin', 'Anti-diabetic', 'Abbott', 'Diabetes'),
(309, 'Omeprazole', 'Antacid', 'Dr. Reddys', 'Acidity, Heartburn'),
(310, 'Insulin', 'Injection', 'Novo Nordisk', 'Diabetes'),
(311, 'Vitamin D3', 'Supplement', 'Torrent Pharma', 'Bone Health, Fatigue'),
(312, 'Pantoprazole', 'Antacid', 'Sun Pharma', 'Acidity, Stomach Ulcer'),
(313, 'ORS Sachet', 'Hydration', 'FDC', 'Dehydration, Weakness'),
(314, 'Zinc Tablets', 'Supplement', 'Mankind', 'Immunity, Weakness'),
(315, 'Ibuprofen', 'Painkiller', 'Abbott', 'Body Ache, Joint Pain'),
(316, 'Levocetirizine', 'Antihistamine', 'Cipla', 'Allergy, Cold'),
(317, 'Amlodipine', 'Blood Pressure', 'Lupin', 'High BP'),
(318, 'Telmisartan', 'Blood Pressure', 'Sun Pharma', 'High BP'),
(319, 'Calcium Tablets', 'Supplement', 'Shelcal', 'Bone Health'),
(320, 'Multivitamin Capsules', 'Supplement', 'Pfizer', 'Fatigue, Weakness');
SET IDENTITY_INSERT Medicines OFF;
GO

-----------------------------------------------------------
-- 3. SEEDING MedicineAvailabilityAuthDb (Users)
-----------------------------------------------------------
USE MedicineAvailabilityAuthDb;
GO

SET IDENTITY_INSERT Users ON;

-- Hash for Pharmacy@123
DECLARE @PharmacyHash NVARCHAR(MAX) = '$2a$11$P1hd4DViW4hVt6yfuzfNDOJpbdJ6l6dufKGa7dwRTskqw.beSiECS';

-- Hash for Customer@123
DECLARE @CustomerHash NVARCHAR(MAX) = '$2a$11$J/HRCZkjfcRfeXqla0NUa.kZ8BoLfgOP8a025TJ0w4nAruIv/Duly';
DECLARE @CurrentTime DATETIME2 = GETUTCDATE();

-- A. Insert Pharmacy Users (IDs 101 to 108)
INSERT INTO Users (UserId, Name, Email, PasswordHash, Role, CreatedAt, IsActive, PharmacyId, ApprovalStatus) VALUES
(101, 'Apollo Pharmacy', 'bhavyad18102004@gmail.com', @PharmacyHash, 'Pharmacy', @CurrentTime, 1, 101, 'Approved'),
(102, 'MedPlus Pharmacy', 'medplus@demo.com', @PharmacyHash, 'Pharmacy', @CurrentTime, 1, 102, 'Approved'),
(103, 'Wellness Forever', 'wellness@demo.com', @PharmacyHash, 'Pharmacy', @CurrentTime, 1, 103, 'Approved'),
(104, 'Care Pharmacy', 'care@demo.com', @PharmacyHash, 'Pharmacy', @CurrentTime, 1, 104, 'Approved'),
(105, 'Lifecare Pharmacy', 'lifecare@demo.com', @PharmacyHash, 'Pharmacy', @CurrentTime, 1, 105, 'Approved'),
(106, 'Green Cross Pharmacy', 'greencross@demo.com', @PharmacyHash, 'Pharmacy', @CurrentTime, 1, 106, 'Approved'),
(107, 'Health First Pharmacy', 'healthfirst@demo.com', @PharmacyHash, 'Pharmacy', @CurrentTime, 1, 107, 'Approved'),
(108, 'City Medicos', 'citymedicos@demo.com', @PharmacyHash, 'Pharmacy', @CurrentTime, 1, 108, 'Approved');

-- B. Insert Customer Users (IDs 201 to 205)
INSERT INTO Users (UserId, Name, Email, PasswordHash, Role, CreatedAt, IsActive, PharmacyId, ApprovalStatus) VALUES
(201, 'Rahul Sharma', 'rahul@demo.com', @CustomerHash, 'Customer', @CurrentTime, 1, NULL, 'Approved'),
(202, 'Priya Reddy', 'priya@demo.com', @CustomerHash, 'Customer', @CurrentTime, 1, NULL, 'Approved'),
(203, 'Arjun Kumar', 'arjun@demo.com', @CustomerHash, 'Customer', @CurrentTime, 1, NULL, 'Approved'),
(204, 'Sneha Patel', 'sneha@demo.com', @CustomerHash, 'Customer', @CurrentTime, 1, NULL, 'Approved'),
(205, 'Kiran Verma', 'kiran@demo.com', @CustomerHash, 'Customer', @CurrentTime, 1, NULL, 'Approved');

SET IDENTITY_INSERT Users OFF;
GO

-----------------------------------------------------------
-- 4. SEEDING MedicineAvailabilityDB (Pharmacies)
-----------------------------------------------------------
USE MedicineAvailabilityDB;
GO

SET IDENTITY_INSERT Pharmacies ON;
INSERT INTO Pharmacies (PharmacyId, PharmacyName, Address, PhoneNumber, Email, Latitude, Longitude, UserId, OpeningTime, ClosingTime) VALUES 
(101, 'Apollo Pharmacy', 'Kokapet, Hyderabad', '9876543210', 'bhavyad18102004@gmail.com', 17.3941, 78.3304, 101, '08:00', '22:00'),
(102, 'MedPlus Pharmacy', 'Gachibowli, Hyderabad', '9876543211', 'medplus@demo.com', 17.4401, 78.3489, 102, '07:30', '23:00'),
(103, 'Wellness Forever', 'Hitech City, Hyderabad', '9876543212', 'wellness@demo.com', 17.4435, 78.3772, 103, '00:00', '23:59'),
(104, 'Care Pharmacy', 'Madhapur, Hyderabad', '9876543213', 'care@demo.com', 17.4483, 78.3915, 104, '08:00', '22:00'),
(105, 'Lifecare Pharmacy', 'Kondapur, Hyderabad', '9876543214', 'lifecare@demo.com', 17.4622, 78.3568, 105, '09:00', '21:00'),
(106, 'Green Cross Pharmacy', 'Financial District, Hyderabad', '9876543215', 'greencross@demo.com', 17.4146, 78.3444, 106, '08:30', '22:30'),
(107, 'Health First Pharmacy', 'Manikonda, Hyderabad', '9876543216', 'healthfirst@demo.com', 17.4005, 78.3847, 107, '08:00', '22:00'),
(108, 'City Medicos', 'Narsingi, Hyderabad', '9876543217', 'citymedicos@demo.com', 17.3813, 78.3546, 108, '07:00', '23:00');
SET IDENTITY_INSERT Pharmacies OFF;
GO

-----------------------------------------------------------
-- 5. SEEDING MedicineAvailabilityDB (Inventory)
-----------------------------------------------------------
USE MedicineAvailabilityDB;
GO

DECLARE @CurrentTime DATETIME2 = GETUTCDATE();

-- Let's populate the Inventory (PharmacyMedicines table)
-- Some with low stock (e.g. Quantity <= 10) to demo low stock alerts

INSERT INTO PharmacyMedicines (PharmacyId, MedicineId, Quantity, Price, LastUpdated) VALUES 
-- Apollo Pharmacy (ID 101)
(101, 301, 50, 30.50, @CurrentTime), -- Dolo 650
(101, 304, 30, 25.00, @CurrentTime), -- Crocin Advance
(101, 306, 2,  15.00, @CurrentTime), -- Cetirizine (LOW STOCK)
(101, 310, 5,  150.00, @CurrentTime),-- Insulin (LOW STOCK)
(101, 311, 40, 120.00, @CurrentTime),-- Vitamin D3

-- MedPlus Pharmacy (ID 102)
(102, 303, 100, 22.00, @CurrentTime),-- Paracetamol 500
(102, 305, 15,  85.00, @CurrentTime),-- Azithromycin 500
(102, 309, 3,   45.00, @CurrentTime),-- Omeprazole (LOW STOCK)
(102, 301, 60,  28.00, @CurrentTime),-- Dolo 650 (Cheaper here)
(102, 314, 25,  95.00, @CurrentTime),-- Zinc Tablets

-- Wellness Forever (ID 103)
(103, 311, 80,  125.00, @CurrentTime),-- Vitamin D3
(103, 319, 45,  110.00, @CurrentTime),-- Calcium Tablets
(103, 320, 60,  140.00, @CurrentTime),-- Multivitamin Capsules
(103, 301, 4,   32.00,  @CurrentTime),-- Dolo 650 (LOW STOCK)

-- Care Pharmacy (ID 104)
(104, 316, 20, 35.00, @CurrentTime), -- Levocetirizine
(104, 315, 55, 40.00, @CurrentTime), -- Ibuprofen
(104, 302, 35, 45.00, @CurrentTime), -- Dolo 650 Advanced
(104, 306, 100, 12.00, @CurrentTime),-- Cetirizine (Plentiful here)

-- Lifecare Pharmacy (ID 105)
(105, 307, 40, 65.00, @CurrentTime), -- Amoxicillin
(105, 308, 120, 55.00, @CurrentTime),-- Metformin
(105, 317, 30,  70.00, @CurrentTime),-- Amlodipine
(105, 313, 200, 15.00, @CurrentTime),-- ORS Sachet
(105, 310, 4,  160.00, @CurrentTime),-- Insulin (LOW STOCK)

-- Green Cross Pharmacy (ID 106)
(106, 312, 60, 50.00, @CurrentTime), -- Pantoprazole
(106, 318, 50, 85.00, @CurrentTime), -- Telmisartan
(106, 301, 20, 30.00, @CurrentTime), -- Dolo 650
(106, 304, 5,  28.00, @CurrentTime), -- Crocin Advance (LOW STOCK)

-- Health First Pharmacy (ID 107)
(107, 310, 20, 145.00, @CurrentTime),-- Insulin (Cheapest here)
(107, 305, 40, 80.00, @CurrentTime), -- Azithromycin
(107, 319, 10, 105.00, @CurrentTime),-- Calcium Tablets

-- City Medicos (ID 108)
(108, 308, 80, 50.00, @CurrentTime), -- Metformin (Cheapest here)
(108, 320, 3,  135.00, @CurrentTime),-- Multivitamin (LOW STOCK)
(108, 303, 150, 20.00, @CurrentTime),-- Paracetamol
(108, 306, 40, 14.00, @CurrentTime); -- Cetirizine
GO

PRINT 'Demo dataset successfully generated!';
