UPDATE Medicines
SET Symptoms = 'Infection,Fever'
WHERE MedicineName = 'Azithromycin';


UPDATE Medicines
SET Symptoms = 'Infection'
WHERE MedicineName = 'Amoxicillin';

UPDATE Medicines
SET Symptoms = 'Allergy,Cold'
WHERE MedicineName = 'Cetirizine';

UPDATE Medicines
SET Symptoms = 'Diabetes'
WHERE MedicineName = 'Insulin';


UPDATE Medicines
SET Symptoms = 'Fever,Body Pain,Headache'
WHERE MedicineName = 'Paracetamol';


UPDATE Medicines
SET Symptoms = 'Fever,Body Pain,Headache'
WHERE MedicineName = 'Dolo 650';

UPDATE Medicines
SET Symptoms = 'Fever,Headache'
WHERE MedicineName = 'Crocin';

SELECT PharmacyId,
       PharmacyName,
       Latitude,
       Longitude
FROM Pharmacies