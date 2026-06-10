import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CustomerDashboard() {

    const [searchTerm, setSearchTerm] = useState("");
    const [medicines, setMedicines] = useState([]);

    const [symptom, setSymptom] = useState("");
    const [symptomResults, setSymptomResults] = useState([]);

    const [medicineName, setMedicineName] = useState("");
    const [availabilityResults, setAvailabilityResults] = useState([]);
  
    const [nearbyPharmacies, setNearbyPharmacies] = useState([]);

    const navigate = useNavigate();

    const searchMedicine = async () => {

        try {

            const response = await axios.get(
                `https://localhost:7194/api/Medicines/search?searchTerm=${searchTerm}`
            );

            setMedicines(response.data);

        } catch (error) {

            console.error(error);
            alert("Error searching medicines");
        }
    };

    const searchBySymptom = async () => {

        try {

            if (!symptom.trim()) {
                alert("Please enter a symptom");
                return;
            }

            const response = await axios.get(
                `https://localhost:7194/api/Medicines/symptom-search?symptom=${symptom}`
            );

            setSymptomResults(response.data);

        } catch (error) {

            console.error(error);
            alert("Error searching by symptom");
        }
    };

    const checkAvailability = async () => {

        try {

            const response = await axios.get(
                `https://localhost:7191/api/Pharmacies/medicine-availability?medicineName=${medicineName}`
            );

            setAvailabilityResults(response.data);

        } catch (error) {

            console.error(error);
            alert("Error checking availability");
        }
    };

    const findNearby = () => {

        navigator.geolocation.getCurrentPosition(

            async (position) => {

                try {

                    const latitude = position.coords.latitude;

                    const longitude = position.coords.longitude;

                    const response = await axios.get(
                        `https://localhost:7191/api/Pharmacies/nearby?latitude=${latitude}&longitude=${longitude}`
                    );

                    setNearbyPharmacies(response.data);

                } catch (error) {

                    console.error(error);

                    alert("Error finding nearby pharmacies");
                }
            },

            (error) => {

                console.error(error);

                alert("Location access denied");
            }
        );
    };

    const logout = () => {

        localStorage.removeItem("token");

        navigate("/");
    };

    return (
        <div style={{ padding: "20px" }}>

            <h1>Customer Dashboard</h1>

            <button onClick={logout}>
                Logout
            </button>

            <hr />

            <h2>Search Medicine</h2>

            <input
                type="text"
                placeholder="Enter medicine name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            <button onClick={searchMedicine}>
                Search
            </button>

            {medicines.map((medicine) => (

                <div key={medicine.medicineId}>

                    <h4>{medicine.medicineName}</h4>

                    <p>Category: {medicine.category}</p>

                    <p>Manufacturer: {medicine.manufacturer}</p>

                    <hr />

                </div>

            ))}

            <h2>Search By Symptom</h2>

            <input
                type="text"
                placeholder="Enter symptom"
                value={symptom}
                onChange={(e) => setSymptom(e.target.value)}
            />

            <button onClick={searchBySymptom}>
                Search Symptom
            </button>

            {symptomResults.map((medicine) => (

                <div key={medicine.medicineId}>

                    <h4>{medicine.medicineName}</h4>

                    <p>Category: {medicine.category}</p>

                    <p>Manufacturer: {medicine.manufacturer}</p>

                    <hr />

                </div>

            ))}

            <h2>Medicine Availability</h2>

            <input
                type="text"
                placeholder="Enter medicine name"
                value={medicineName}
                onChange={(e) => setMedicineName(e.target.value)}
            />

            <button onClick={checkAvailability}>
                Check Availability
            </button>

            {availabilityResults.map((item, index) => (

                <div key={index}>

                    <h4>{item.pharmacyName}</h4>

                    <p>Medicine: {item.medicineName}</p>

                    <p>Quantity: {item.quantity}</p>

                    <p>Price: Rs. {item.price}</p>

                    <hr />

                </div>

            ))}

            <h2>Nearby Pharmacies</h2>

            <button onClick={findNearby}>
                Find Nearby
            </button>

            {nearbyPharmacies.map((pharmacy) => (

                <div key={pharmacy.pharmacyId}>

                    <h4>{pharmacy.pharmacyName}</h4>

                    <p>Address: {pharmacy.address}</p>

                    <p>Distance: {pharmacy.distanceKm.toFixed(2)} km</p>

                    <hr />

                </div>

            ))}

        </div>
    );
}

export default CustomerDashboard;