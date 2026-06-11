import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FaMapMarkerAlt } from "react-icons/fa";
import { theme } from "../styles/theme";
import Layout from "../components/layout/Layout";
import SearchPanel from "../components/ui/SearchPanel";
import ResultCard, { ResultCardGrid } from "../components/ui/ResultCard";
import PharmacyMap from "../components/PharmacyMap";

const SectionTitle = styled.h2`
  font-size: ${theme.fontSizes.xl};
  color: ${theme.colors.medicalBlue};
  margin-bottom: ${theme.spacing.lg};
  margin-top: ${theme.spacing.xl};
  font-weight: 600;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.fontSizes.lg};
  }
`;

const WelcomeSection = styled.div`
  margin-bottom: ${theme.spacing.xl};
`;

const WelcomeTitle = styled.h1`
  font-size: ${theme.fontSizes.xxl};
  color: ${theme.colors.medicalBlue};
  margin-bottom: ${theme.spacing.sm};
  font-weight: 700;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.fontSizes.xl};
  }
`;

const WelcomeSubtitle = styled.p`
  font-size: ${theme.fontSizes.md};
  color: ${theme.colors.darkGray};

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.fontSizes.sm};
  }
`;

const MapSection = styled.div`
  margin-top: ${theme.spacing.xl};
`;

const MapButton = styled.button`
  background: linear-gradient(135deg, ${theme.colors.mintGreen} 0%, ${theme.colors.mintGreenDark} 100%);
  color: ${theme.colors.white};
  border: none;
  padding: ${theme.spacing.md} ${theme.spacing.xl};
  border-radius: ${theme.spacing.md};
  font-size: ${theme.fontSizes.md};
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  transition: all 0.3s ease;
  cursor: pointer;
  margin-bottom: ${theme.spacing.lg};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.sm} ${theme.spacing.lg};
    font-size: ${theme.fontSizes.sm};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${theme.spacing.xxl};
  color: ${theme.colors.darkGray};
  font-size: ${theme.fontSizes.md};
`;

function CustomerDashboard() {
    const [searchTerm, setSearchTerm] = useState("");
    const [medicines, setMedicines] = useState([]);

    const [symptom, setSymptom] = useState("");
    const [symptomResults, setSymptomResults] = useState([]);

    const [medicineName, setMedicineName] = useState("");
    const [availabilityResults, setAvailabilityResults] = useState([]);
  
    const [nearbyPharmacies, setNearbyPharmacies] = useState([]);
    const [allPharmacies, setAllPharmacies] = useState([]);
    const [mapPharmacies, setMapPharmacies] = useState([]);

    const navigate = useNavigate();

    // Fetch all pharmacies on initial load
    useEffect(() => {
        const fetchAllPharmacies = async () => {
            try {
                const response = await axios.get(
                    "https://localhost:7191/api/Pharmacies"
                );
                setAllPharmacies(response.data);
                setMapPharmacies(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchAllPharmacies();
    }, []);

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
            
            // Filter map pharmacies to show only those with the medicine in stock
            if (response.data.length > 0) {
                const availablePharmacyNames = response.data.map(item => item.pharmacyName);
                const filteredPharmacies = allPharmacies.filter(pharmacy =>
                    availablePharmacyNames.includes(pharmacy.pharmacyName)
                );
                setMapPharmacies(filteredPharmacies);
            } else {
                setMapPharmacies([]);
            }
        } catch (error) {
            console.error(error);
            alert("Error checking availability");
        }
    };

    const clearAvailabilitySearch = () => {
        setMedicineName("");
        setAvailabilityResults([]);
        setMapPharmacies(allPharmacies);
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
        <Layout userRole="Customer" onLogout={logout}>
            <WelcomeSection>
                <WelcomeTitle>Customer Dashboard</WelcomeTitle>
                <WelcomeSubtitle>Find medicines and nearby pharmacies</WelcomeSubtitle>
            </WelcomeSection>

            <SectionTitle>🔍 Search Medicine</SectionTitle>
            <SearchPanel
                placeholder="Enter medicine name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onSearch={searchMedicine}
                buttonText="Search"
            />
            {medicines.length > 0 ? (
                <ResultCardGrid>
                    {medicines.map((medicine) => (
                        <ResultCard
                            key={medicine.medicineId}
                            title={medicine.medicineName}
                            data={[
                                { label: "Category", value: medicine.category },
                                { label: "Manufacturer", value: medicine.manufacturer },
                            ]}
                        />
                    ))}
                </ResultCardGrid>
            ) : medicines.length === 0 && searchTerm && (
                <EmptyState>No medicines found</EmptyState>
            )}

            <SectionTitle>🏥 Search By Symptom</SectionTitle>
            <SearchPanel
                placeholder="Enter symptom"
                value={symptom}
                onChange={(e) => setSymptom(e.target.value)}
                onSearch={searchBySymptom}
                buttonText="Search Symptom"
            />
            {symptomResults.length > 0 ? (
                <ResultCardGrid>
                    {symptomResults.map((medicine) => (
                        <ResultCard
                            key={medicine.medicineId}
                            title={medicine.medicineName}
                            data={[
                                { label: "Category", value: medicine.category },
                                { label: "Manufacturer", value: medicine.manufacturer },
                            ]}
                        />
                    ))}
                </ResultCardGrid>
            ) : symptomResults.length === 0 && symptom && (
                <EmptyState>No medicines found for this symptom</EmptyState>
            )}

            <SectionTitle>💊 Medicine Availability</SectionTitle>
            <SearchPanel
                placeholder="Enter medicine name"
                value={medicineName}
                onChange={(e) => {
                    setMedicineName(e.target.value);
                    if (!e.target.value) {
                        clearAvailabilitySearch();
                    }
                }}
                onSearch={checkAvailability}
                buttonText="Check Availability"
            />
            {availabilityResults.length > 0 ? (
                <ResultCardGrid>
                    {availabilityResults.map((item, index) => (
                        <ResultCard
                            key={index}
                            title={item.pharmacyName}
                            type="highlight"
                            data={[
                                { label: "Medicine", value: item.medicineName },
                                { label: "Quantity", value: item.quantity },
                                { label: "Price", value: `Rs. ${item.price}` },
                            ]}
                        />
                    ))}
                </ResultCardGrid>
            ) : availabilityResults.length === 0 && medicineName && (
                <EmptyState>No availability information found</EmptyState>
            )}

            <SectionTitle>📍 Nearby Pharmacies</SectionTitle>
            <MapSection>
                <MapButton onClick={findNearby}>
                    <FaMapMarkerAlt />
                    Find Nearby Pharmacies
                </MapButton>
                {mapPharmacies.length > 0 && (
                    <PharmacyMap pharmacies={mapPharmacies} />
                )}
                {nearbyPharmacies.length > 0 && (
                    <ResultCardGrid>
                        {nearbyPharmacies.map((pharmacy) => (
                            <ResultCard
                                key={pharmacy.pharmacyId}
                                title={pharmacy.pharmacyName}
                                type="highlight"
                                data={[
                                    { label: "Address", value: pharmacy.address },
                                    { label: "Distance", value: `${pharmacy.distanceKm.toFixed(2)} km` },
                                ]}
                            />
                        ))}
                    </ResultCardGrid>
                )}
            </MapSection>
        </Layout>
    );
}

export default CustomerDashboard;