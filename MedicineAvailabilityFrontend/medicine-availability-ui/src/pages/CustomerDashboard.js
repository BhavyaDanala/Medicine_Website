import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FaMapMarkerAlt, FaSearch, FaPills, FaLocationArrow, FaClock, FaShieldAlt, FaBoxOpen, FaSearch as FaSearchIcon, FaStore, FaRoad, FaRegClock, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import { theme } from "../styles/theme";
import Layout from "../components/layout/Layout";
import SearchPanel from "../components/ui/SearchPanel";
import SearchPanelWithAutocomplete from "../components/ui/SearchPanelWithAutocomplete";
import ResultCard, { ResultCardGrid } from "../components/ui/ResultCard";
import DidYouMean from "../components/ui/DidYouMean";
import FuzzySearchResults from "../components/ui/FuzzySearchResults";
import SymptomChips from "../components/ui/SymptomChips";
import NearbyMedicineResults from "../components/ui/NearbyMedicineResults";
import PriceComparisonResults from "../components/ui/PriceComparisonResults";
import PharmacyMap from "../components/PharmacyMap";
import Skeleton, { SkeletonGridItem } from "../components/ui/Skeleton";
import TabNavigation from "../components/ui/TabNavigation";
import AddressSelectionModal from "../components/ui/AddressSelectionModal";
import AddressFormModal from "../components/ui/AddressFormModal";
import AboutMediFind from "../components/ui/AboutMediFind";
import StaticStateDisplay from "../components/ui/StaticStateDisplay";
import { FaThermometerHalf, FaUserInjured, FaLeaf, FaFirstAid, FaStoreAlt, FaMoneyBillWave, FaMapMarkedAlt, FaWalking, FaClinicMedical } from "react-icons/fa";

const HeroSection = styled.div`
  background: linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%);
  border-radius: ${theme.borderRadius.xxl};
  padding: ${theme.spacing.xxxl};
  margin-bottom: ${theme.spacing.xxl};
  position: relative;
  overflow: hidden;
  box-shadow: ${theme.shadows.xl};

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing.xxl};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.xl};
    border-radius: ${theme.borderRadius.lg};
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 1;
`;

const HeroTitle = styled.h1`
  font-size: ${theme.fontSizes.xxxl};
  color: ${theme.colors.white};
  margin-bottom: ${theme.spacing.md};
  font-weight: ${theme.fontWeights.extrabold};
  line-height: 1.2;

  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: ${theme.fontSizes.xxl};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.fontSizes.xl};
  }
`;

const HeroSubtitle = styled.p`
  font-size: ${theme.fontSizes.lg};
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: ${theme.spacing.xl};
  font-weight: ${theme.fontWeights.normal};

  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: ${theme.fontSizes.md};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.fontSizes.sm};
  }
`;

const QuickActions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${theme.spacing.lg};
  margin-top: ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.md};
  }
`;

const QuickActionCard = styled.div`
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.lg};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing.sm};
  cursor: pointer;
  transition: all ${theme.transitions.normal};

  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateY(-2px);
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.md};
  }
`;

const QuickActionIcon = styled.div`
  font-size: ${theme.fontSizes.xxl};
  color: ${theme.colors.white};

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.fontSizes.xl};
  }
`;

const QuickActionLabel = styled.span`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.white};
  font-weight: ${theme.fontWeights.medium};
  text-align: center;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.fontSizes.xs};
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
  padding: ${theme.spacing.xxxl};
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  border-radius: ${theme.borderRadius.xl};
  border: 2px dashed rgba(102, 126, 234, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing.lg};
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(102, 126, 234, 0.4);
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%);
  }
`;

const EmptyStateIcon = styled.div`
  font-size: 80px;
  color: #667eea;
  opacity: 0.6;
  filter: drop-shadow(0 4px 8px rgba(102, 126, 234, 0.2));
  animation: float 3s ease-in-out infinite;

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 60px;
  }
`;

const EmptyStateTitle = styled.h3`
  font-size: 20px;
  color: #1a1a2e;
  margin: 0;
  font-weight: 700;
  letter-spacing: -0.3px;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 18px;
  }
`;

const EmptyStateText = styled.p`
  font-size: 15px;
  color: #666;
  margin: 0;
  max-width: 400px;
  line-height: 1.6;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 14px;
  }
`;

const PopularSearchesContainer = styled.div`
  margin-top: 24px;
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  animation: fadeIn 0.5s ease-in-out;
`;

const PopularSearchesTitle = styled.h4`
  font-size: 15px;
  color: #475569;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
`;

const PopularChipsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const PopularChip = styled.button`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  color: #334155;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    background: #eff6ff;
    color: #1d4ed8;
    border-color: #bfdbfe;
    transform: translateY(-2px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  }
`;

// Enhanced Availability Card Styles
const AvailabilityCardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: ${theme.spacing.md};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.md};
  }
`;

const AvailabilityCard = styled.div`
  background: ${theme.colors.white};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.lg};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.06);
  transition: all ${theme.transitions.normal};
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    border-color: rgba(102, 126, 234, 0.3);
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.md};
    gap: ${theme.spacing.sm};
  }
`;

const AvailabilityCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  padding-bottom: ${theme.spacing.sm};
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
`;

const PharmacyIcon = styled.div`
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%);
  border-radius: ${theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.white};
  font-size: ${theme.fontSizes.lg};
  flex-shrink: 0;

  @media (max-width: ${theme.breakpoints.mobile}) {
    width: 40px;
    height: 40px;
    font-size: ${theme.fontSizes.md};
  }
`;

const PharmacyName = styled.h3`
  font-size: ${theme.fontSizes.lg};
  font-weight: ${theme.fontWeights.bold};
  color: ${theme.colors.text};
  margin: 0;
  flex: 1;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.fontSizes.md};
  }
`;

const AvailabilityBadge = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.semibold};
  white-space: nowrap;

  ${props => props.$isOpen ? `
    background: rgba(76, 175, 80, 0.1);
    color: #4CAF50;
  ` : `
    background: rgba(244, 67, 54, 0.1);
    color: #F44336;
  `}

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 10px;
    padding: 4px 8px;
  }
`;

const MedicineInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

const MedicineLabel = styled.span`
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.textSecondary};
  font-weight: ${theme.fontWeights.medium};
  text-transform: uppercase;
  letter-spacing: 0.5px;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 11px;
  }
`;

const MedicineValue = styled.span`
  font-size: ${theme.fontSizes.md};
  color: ${theme.colors.text};
  font-weight: ${theme.fontWeights.semibold};

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.fontSizes.sm};
  }
`;

const QuantityBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  color: ${theme.colors.primary};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.semibold};

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.fontSizes.xs};
  }
`;

const PriceValue = styled.span`
  font-size: ${theme.fontSizes.lg};
  color: ${theme.colors.text};
  font-weight: ${theme.fontWeights.bold};

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.fontSizes.md};
  }
`;

const PharmacyDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
  padding-top: ${theme.spacing.sm};
  border-top: 1px solid rgba(0, 0, 0, 0.06);
`;

const DetailRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.textSecondary};

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.fontSizes.xs};
  }
`;

const DetailIcon = styled.span`
  color: ${theme.colors.primary};
  font-size: ${theme.fontSizes.md};
  flex-shrink: 0;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.fontSizes.sm};
  }
`;

const DetailText = styled.span`
  flex: 1;
  font-weight: ${theme.fontWeights.medium};
`;

const HighlightText = styled.span`
  color: ${theme.colors.text};
  font-weight: ${theme.fontWeights.semibold};
`;

// Helper function to calculate distance using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const d = R * c; // Distance in km
  return Math.round(d * 10) / 10;
};

// Helper function to merge availability results with distance data
const mergeAvailabilityWithDistance = (availabilityResults, allPharmacies, userLocation) => {
  return availabilityResults.map(availability => {
    const pharmacy = allPharmacies.find(
      p => p.pharmacyName?.trim().toLowerCase() === availability.pharmacyName?.trim().toLowerCase()
    );
    
    let distanceKm = null;
    if (userLocation && pharmacy && pharmacy.latitude && pharmacy.longitude) {
      distanceKm = calculateDistance(userLocation.latitude, userLocation.longitude, pharmacy.latitude, pharmacy.longitude);
    } else if (pharmacy && pharmacy.distanceKm !== undefined) {
      distanceKm = pharmacy.distanceKm;
    }

    return {
      ...availability,
      distanceKm: distanceKm
    };
  });
};

// Helper function to parse time string (e.g., "08:00 AM") to minutes
const parseTimeToMinutes = (timeString) => {
  if (!timeString) return null;
  const [time, period] = timeString.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  return hours * 60 + minutes;
};

// Helper function to check if pharmacy is currently open
const isPharmacyOpen = (openingTime, closingTime) => {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const openMinutes = parseTimeToMinutes(openingTime);
  const closeMinutes = parseTimeToMinutes(closingTime);
  
  if (openMinutes === null || closeMinutes === null) return true;
  
  // Handle overnight pharmacies (e.g., 10 PM to 8 AM)
  if (closeMinutes < openMinutes) {
    return currentMinutes >= openMinutes || currentMinutes < closeMinutes;
  }
  
  return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
};

function CustomerDashboard() {
    const [activeTab, setActiveTab] = useState("about");
    const [hoveredPharmacyId, setHoveredPharmacyId] = useState(null);
    const [pharmacySearch, setPharmacySearch] = useState("");
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");



    const [symptom, setSymptom] = useState("");
    const [symptomResults, setSymptomResults] = useState([]);
    const [detectedSymptoms, setDetectedSymptoms] = useState([]);
    const [hasSearchedSymptom, setHasSearchedSymptom] = useState(false);
    const [loadingSymptoms, setLoadingSymptoms] = useState(false);

    const [medicineName, setMedicineName] = useState("");
    const [availabilityResults, setAvailabilityResults] = useState([]);
    const [loadingAvailability, setLoadingAvailability] = useState(false);
    const [hasSearchedAvailability, setHasSearchedAvailability] = useState(false);
    const [availabilityPriceSort, setAvailabilityPriceSort] = useState(""); // "low-high", "high-low"
    const [availabilityDistanceSort, setAvailabilityDistanceSort] = useState(""); // "near-far", "far-near"
    const [availabilityStatusFilter, setAvailabilityStatusFilter] = useState("all"); // "all", "open", "closed"
    const [findNearMeStatusFilter, setFindNearMeStatusFilter] = useState("all"); // "all", "open", "closed"
    const [selectedPharmacyForMap, setSelectedPharmacyForMap] = useState(null);
  
    const [nearbyPharmacies, setNearbyPharmacies] = useState([]);
    const [allPharmacies, setAllPharmacies] = useState([]);
    const [mapPharmacies, setMapPharmacies] = useState([]);
    const [loadingNearby, setLoadingNearby] = useState(false);

    // Find Near Me - combined nearby + medicine search
    const [nearbyMedicineName, setNearbyMedicineName] = useState("");
    const [nearbyMedicineResults, setNearbyMedicineResults] = useState([]);
    const [loadingNearbyMedicine, setLoadingNearbyMedicine] = useState(false);
    const [userLocation, setUserLocation] = useState(null);



    // Location Modals
    const [showAddressSelection, setShowAddressSelection] = useState(false);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [pendingAction, setPendingAction] = useState(null); // 'nearby' or 'nearbyMedicine'

    const navigate = useNavigate();

    const tabs = [
        { id: "symptom-search", label: "Search by Symptom" },
        { id: "availability-check", label: "Check Availability" },
        { id: "find-near-me", label: "Find Near Me" }
    ];

    // Fetch all pharmacies on initial load
    useEffect(() => {
        const fetchAllPharmacies = async () => {
            try {
                const response = await axios.get("https://localhost:7191/api/Pharmacies");
                setAllPharmacies(response.data);
                setMapPharmacies(response.data);
            } catch (error) { console.error(error); }
        };
        fetchAllPharmacies();

        // Decode user info from JWT
        try {
            const token = localStorage.getItem("token");
            if (token) {
                const decoded = jwtDecode(token);
                setUserName(decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || decoded.name || "");
                setUserEmail(decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] || decoded.email || "");
            }
        } catch(e) {}
    }, []);



    const searchBySymptom = async (searchQuery = symptom) => {
        const queryToSearch = searchQuery || symptom;
        if (!queryToSearch) {
            toast.warning("Please enter a symptom");
            return;
        }

        setHasSearchedSymptom(true);
        setLoadingSymptoms(true);
        setDetectedSymptoms([]);
        try {
            const response = await axios.get(
                `https://localhost:7194/api/Medicines/symptom-search?symptom=${encodeURIComponent(queryToSearch)}`
            );
            // Handle new response format with medicines and detectedSymptoms
            const { medicines, detectedSymptoms } = response.data;
            setSymptomResults(medicines || []);
            setDetectedSymptoms(detectedSymptoms || []);
        } catch (error) {
            console.error(error);
            toast.error("Error searching by symptom");
        } finally {
            setLoadingSymptoms(false);
        }
    };

    const checkAvailability = async (searchQuery = medicineName, customLocation = null) => {
        const queryToSearch = searchQuery || medicineName;
        const locToUse = customLocation || userLocation;
        if (!queryToSearch) return;

        setHasSearchedAvailability(true);
        setLoadingAvailability(true);
        try {
            const response = await axios.get(
                `https://localhost:7191/api/Pharmacies/medicine-availability?medicineName=${queryToSearch}`
            );
            
            // Merge availability results with distance data
            const availabilityWithDistance = mergeAvailabilityWithDistance(response.data, allPharmacies, locToUse);
            setAvailabilityResults(availabilityWithDistance);

            // Filter map pharmacies to show only those with the medicine in stock
            if (response.data.length > 0) {
                const availablePharmacyNames = response.data.map(item => item.pharmacyName);
                
                // If locToUse is present, calculate distance for allPharmacies to show on map
                let sourcePharmacies = [...allPharmacies];
                if (locToUse) {
                    sourcePharmacies = sourcePharmacies.map(p => ({
                        ...p,
                        distanceKm: calculateDistance(locToUse.latitude, locToUse.longitude, p.latitude, p.longitude)
                    }));
                } else if (nearbyPharmacies.length > 0) {
                    sourcePharmacies = nearbyPharmacies;
                }

                const filteredPharmacies = sourcePharmacies.filter(pharmacy =>
                    availablePharmacyNames.includes(pharmacy.pharmacyName)
                );
                setMapPharmacies(filteredPharmacies);
            } else {
                setMapPharmacies([]);
            }
        } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 404) {
                setAvailabilityResults([]);
                setMapPharmacies([]);
            } else {
                toast.error("Error checking availability");
            }
        } finally {
            setLoadingAvailability(false);
        }
    };

    const clearAvailabilitySearch = () => {
        setMedicineName("");
        setHasSearchedAvailability(false);
        setAvailabilityResults([]);
        setMapPharmacies(allPharmacies);
    };

    const promptLocationForAvailability = () => {
        setPendingAction('availability');
        setShowAddressSelection(true);
    };

    const executeSearch = async (latitude, longitude) => {
        if (pendingAction === 'nearby') {
            setLoadingNearby(true);
            try {
                setUserLocation({ latitude, longitude });
                const response = await axios.get(
                    `https://localhost:7191/api/Pharmacies/nearby?latitude=${latitude}&longitude=${longitude}`
                );
                setNearbyPharmacies(response.data);
                setMapPharmacies(response.data);
            } catch (error) {
                console.error(error);
                toast.error("Error finding nearby pharmacies");
            } finally {
                setLoadingNearby(false);
            }
        } else if (pendingAction === 'nearbyMedicine') {
            setLoadingNearbyMedicine(true);
            try {
                setUserLocation({ latitude, longitude });
                const response = await axios.get(
                    `https://localhost:7191/api/Pharmacies/nearby-medicine?latitude=${latitude}&longitude=${longitude}&medicineName=${encodeURIComponent(nearbyMedicineName)}`
                );
                setNearbyMedicineResults(response.data);
            } catch (error) {
                console.error(error);
                toast.error("Error finding nearby pharmacies with medicine");
            } finally {
                setLoadingNearbyMedicine(false);
            }
        } else if (pendingAction === 'availability') {
            const loc = { latitude, longitude };
            setUserLocation(loc);
            // Re-run availability check if medicine is already entered
            if (medicineName) {
                checkAvailability(medicineName, loc);
            }
        }
        setShowAddressSelection(false);
        setPendingAction(null);
    };

    const handleSelectCurrentLocation = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                executeSearch(position.coords.latitude, position.coords.longitude);
            },
            (error) => {
                console.error(error);
                toast.error("Location access denied. Please allow location access.");
                setLoadingNearby(false);
                setLoadingNearbyMedicine(false);
                setShowAddressSelection(false);
            }
        );
    };

    const handleSelectSavedAddress = (address) => {
        executeSearch(address.latitude, address.longitude);
    };

    const handleSaveNewAddress = async (data) => {
        try {
            const token = localStorage.getItem("token");
            await axios.post("https://localhost:7240/api/Addresses", data, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Address saved successfully");
            setShowAddressForm(false);
            executeSearch(data.latitude, data.longitude);
        } catch (error) {
            toast.error(error.response?.data || "Failed to save address");
        }
    };

    const findNearby = () => {
        setPendingAction('nearby');
        setShowAddressSelection(true);
    };

    const findNearbyMedicine = () => {
        if (!nearbyMedicineName.trim()) {
            toast.warning("Please enter a medicine name");
            return;
        }
        setPendingAction('nearbyMedicine');
        setShowAddressSelection(true);
    };

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    // Sort pharmacies: open first by distance, then closed
    const sortedNearbyPharmacies = [...mapPharmacies].sort((a, b) => {
        const aOpen = isPharmacyOpen(a.openingTime, a.closingTime);
        const bOpen = isPharmacyOpen(b.openingTime, b.closingTime);
        if (aOpen && !bOpen) return -1;
        if (!aOpen && bOpen) return 1;
        return (a.distanceKm || 999) - (b.distanceKm || 999);
    });

    const filteredPharmacies = sortedNearbyPharmacies.filter(p =>
        p.pharmacyName?.toLowerCase().includes(pharmacySearch.toLowerCase())
    );

    // Filter and Sort Availability Results
    let filteredAvailabilityResults = [...availabilityResults];

    if (availabilityStatusFilter === "open") {
        filteredAvailabilityResults = filteredAvailabilityResults.filter(item => isPharmacyOpen(item.openingTime, item.closingTime));
    } else if (availabilityStatusFilter === "closed") {
        filteredAvailabilityResults = filteredAvailabilityResults.filter(item => !isPharmacyOpen(item.openingTime, item.closingTime));
    }

    if (availabilityPriceSort === "low-high") {
        filteredAvailabilityResults.sort((a, b) => a.price - b.price);
    } else if (availabilityPriceSort === "high-low") {
        filteredAvailabilityResults.sort((a, b) => b.price - a.price);
    } else if (availabilityDistanceSort === "near-far") {
        filteredAvailabilityResults.sort((a, b) => (a.distanceKm || 999) - (b.distanceKm || 999));
    } else if (availabilityDistanceSort === "far-near") {
        filteredAvailabilityResults.sort((a, b) => (b.distanceKm || -1) - (a.distanceKm || -1));
    }

    // Filter and Sort Find Near Me Results
    let filteredNearMeResults = [...nearbyMedicineResults];
    if (findNearMeStatusFilter === "open") {
        filteredNearMeResults = filteredNearMeResults.filter(item => isPharmacyOpen(item.openingTime, item.closingTime));
    } else if (findNearMeStatusFilter === "closed") {
        filteredNearMeResults = filteredNearMeResults.filter(item => !isPharmacyOpen(item.openingTime, item.closingTime));
    }
    // Sorting: nearest first (distanceKm)
    filteredNearMeResults.sort((a, b) => (a.distanceKm || 999) - (b.distanceKm || 999));

    return (
        <Layout userRole="Customer" onLogout={logout} activeTab={activeTab} onTabChange={setActiveTab}>

            {activeTab === "about" && (
                <AboutMediFind onNavigate={(tab) => setActiveTab(tab)} />
            )}

            {activeTab === "symptom-search" && (
                <>
                    <div style={{
                        background: 'rgba(102, 126, 234, 0.1)',
                        border: '1px solid rgba(102, 126, 234, 0.3)',
                        borderRadius: '12px',
                        padding: '16px',
                        marginBottom: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                    }}>
                        <FaMapMarkerAlt style={{ color: '#667eea', fontSize: '20px' }} />
                        <span style={{ color: '#667eea', fontSize: '14px', fontWeight: '500' }}>
                            Note: You have to select the location so that you can see the distance.
                        </span>
                    </div>
                    <SearchPanelWithAutocomplete
                        placeholder="Enter symptoms (e.g., fever cough headache)"
                        value={symptom}
                        onChange={(value) => {
                            setSymptom(value);
                            setHasSearchedSymptom(false);
                            if (!value) {
                                setSymptomResults([]);
                                setDetectedSymptoms([]);
                            }
                        }}
                        onSearch={() => searchBySymptom(symptom)}
                        onSelect={(suggestion) => {
                            setSymptom(suggestion);
                            searchBySymptom(suggestion);
                        }}
                        apiUrl="https://localhost:7194/api/Medicines/symptom-suggest"
                        buttonText="Search Symptom"
                        disabled={loadingSymptoms}
                        debounceMs={300}
                        minChars={1}
                    />
                    <SymptomChips symptoms={detectedSymptoms} />
                    {loadingSymptoms ? (
                        <SkeletonGridItem count={3} />
                    ) : symptomResults.length > 0 ? (
                        <ResultCardGrid>
                            {symptomResults.map((medicine) => (
                                <ResultCard
                                    key={medicine.medicineId}
                                    title={medicine.medicineName}
                                    data={[
                                        { label: "Category", value: medicine.category },
                                        { label: "Manufacturer", value: medicine.manufacturer },
                                    ]}
                                    actionButton={
                                        <button
                                            onClick={() => {
                                                setMedicineName(medicine.medicineName);
                                                setActiveTab("availability-check");
                                                checkAvailability(medicine.medicineName);
                                            }}
                                            style={{
                                                background: 'linear-gradient(135deg, #1a56db 0%, #0891b2 100%)',
                                                color: '#fff',
                                                border: 'none',
                                                padding: '10px 16px',
                                                borderRadius: '8px',
                                                fontSize: '14px',
                                                fontWeight: '600',
                                                cursor: 'pointer',
                                                width: '100%',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                gap: '8px'
                                            }}
                                        >
                                            <FaPills /> Check Availability
                                        </button>
                                    }
                                />
                            ))}
                        </ResultCardGrid>
                    ) : symptomResults.length === 0 && hasSearchedSymptom && (
                        <EmptyState>
                            <EmptyStateIcon><FaSearchIcon /></EmptyStateIcon>
                            <EmptyStateTitle>No Results Found</EmptyStateTitle>
                            <EmptyStateText>We couldn't find any medicines for these symptoms. Try different symptoms or search directly by medicine name for better results.</EmptyStateText>
                        </EmptyState>
                    )}
                    
                    {!hasSearchedSymptom && !loadingSymptoms && symptomResults.length === 0 && (
                        <StaticStateDisplay 
                            title="🩺 Search Medicines by Symptoms"
                            description="Not sure which medicine to search for? Enter your symptoms and MediFind will help you discover commonly prescribed medicines available nearby."
                            cards={[
                                { icon: <FaThermometerHalf />, title: "Fever & Flu", description: "Find medicines commonly used for fever, cold, cough, and flu symptoms." },
                                { icon: <FaUserInjured />, title: "Pain Relief", description: "Explore medicines for headaches, body pain, and muscle discomfort." },
                                { icon: <FaLeaf />, title: "Allergies", description: "Search treatments for seasonal allergies, sneezing, and irritation." },
                                { icon: <FaFirstAid />, title: "Everyday Health", description: "Discover medicines used for common health conditions and minor illnesses." }
                            ]}
                            steps={[
                                "Enter Symptoms",
                                "View Suggested Medicines",
                                "Check Availability Nearby"
                            ]}
                        />
                    )}
                </>
            )}

            {activeTab === "availability-check" && (
                <>
                    {nearbyPharmacies.length === 0 && (
                        <div style={{
                            background: 'rgba(102, 126, 234, 0.1)',
                            border: '1px solid rgba(102, 126, 234, 0.3)',
                            borderRadius: '12px',
                            padding: '16px',
                            marginBottom: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '12px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <FaMapMarkerAlt style={{ color: '#667eea', fontSize: '20px' }} />
                                <span style={{ color: '#667eea', fontSize: '14px', fontWeight: '500' }}>
                                    Tip: Get your location to see distance information
                                </span>
                            </div>
                            <button
                                onClick={promptLocationForAvailability}
                                disabled={loadingNearby}
                                style={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    cursor: loadingNearby ? 'not-allowed' : 'pointer',
                                    opacity: loadingNearby ? 0.7 : 1
                                }}
                            >
                                {loadingNearby ? 'Getting Location...' : 'Get My Location'}
                            </button>
                        </div>
                    )}
                    <SearchPanelWithAutocomplete
                        placeholder="Enter medicine name"
                        value={medicineName}
                        onChange={(value) => {
                            setMedicineName(value);
                            setHasSearchedAvailability(false); // Reset search state when typing
                            if (!value) {
                                clearAvailabilitySearch();
                            }
                        }}
                        onSearch={() => checkAvailability(medicineName)}
                        onSelect={(suggestion) => {
                            setMedicineName(suggestion);
                            checkAvailability(suggestion);
                        }}
                        buttonText="Check Availability"
                        disabled={loadingAvailability}
                        debounceMs={300}
                        minChars={1}
                    />
                    {loadingAvailability ? (
                        <SkeletonGridItem count={3} />
                    ) : availabilityResults.length > 0 ? (
                        <>
                            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center', background: '#fff', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                <span style={{ fontSize: '14px', fontWeight: '600', color: '#475569', marginRight: '8px' }}>Filters:</span>
                                
                                <select 
                                    value={availabilityPriceSort} 
                                    onChange={e => { setAvailabilityPriceSort(e.target.value); setAvailabilityDistanceSort(""); }}
                                    style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                                >
                                    <option value="">Sort by Price</option>
                                    <option value="low-high">Price: Low to High</option>
                                    <option value="high-low">Price: High to Low</option>
                                </select>

                                <select 
                                    value={availabilityDistanceSort} 
                                    onChange={e => { setAvailabilityDistanceSort(e.target.value); setAvailabilityPriceSort(""); }}
                                    style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                                >
                                    <option value="">Sort by Distance</option>
                                    <option value="near-far">Distance: Near to Far</option>
                                    <option value="far-near">Distance: Far to Near</option>
                                </select>

                                <select 
                                    value={availabilityStatusFilter} 
                                    onChange={e => setAvailabilityStatusFilter(e.target.value)}
                                    style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                                >
                                    <option value="all">Status: All</option>
                                    <option value="open">Status: Open</option>
                                    <option value="closed">Status: Closed</option>
                                </select>
                                
                                {(availabilityPriceSort || availabilityDistanceSort || availabilityStatusFilter !== "all") && (
                                    <button 
                                        onClick={() => { setAvailabilityPriceSort(""); setAvailabilityDistanceSort(""); setAvailabilityStatusFilter("all"); }}
                                        style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '13px', fontWeight: '600', cursor: 'pointer', marginLeft: 'auto' }}
                                    >
                                        Clear Filters
                                    </button>
                                )}
                            </div>

                            {filteredAvailabilityResults.length > 0 ? (
                                <AvailabilityCardGrid>
                                    {filteredAvailabilityResults.map((item, index) => {
                                        const isOpen = isPharmacyOpen(item.openingTime, item.closingTime);
                                        return (
                                            <AvailabilityCard key={index}>
                                                <AvailabilityCardHeader>
                                                    <PharmacyIcon>
                                                        <FaStore />
                                                    </PharmacyIcon>
                                                    <PharmacyName>{item.pharmacyName}</PharmacyName>
                                                    <AvailabilityBadge $isOpen={isOpen}>
                                                        {isOpen ? <FaCheckCircle /> : <FaTimesCircle />}
                                                        {isOpen ? "Available Now" : "Currently Closed"}
                                                    </AvailabilityBadge>
                                                </AvailabilityCardHeader>
                                                
                                                <MedicineInfo>
                                                    <div>
                                                        <MedicineLabel>Medicine Name</MedicineLabel>
                                                        <MedicineValue>{item.medicineName}</MedicineValue>
                                                    </div>
                                                    <div style={{ display: 'flex', gap: theme.spacing.md, alignItems: 'center' }}>
                                                        <QuantityBadge>
                                                            <FaBoxOpen />
                                                            {item.quantity} Units
                                                        </QuantityBadge>
                                                        <PriceValue>₹{item.price}</PriceValue>
                                                    </div>
                                                </MedicineInfo>
                                                
                                                <PharmacyDetails>
                                                    <DetailRow>
                                                        <DetailIcon><FaRoad /></DetailIcon>
                                                        <DetailText>Distance: <HighlightText>{item.distanceKm ? `${Number(item.distanceKm).toFixed(2)} km` : "Not Available"}</HighlightText></DetailText>
                                                    </DetailRow>
                                                    <DetailRow>
                                                        <DetailIcon><FaRegClock /></DetailIcon>
                                                        <DetailText>Open Today: <HighlightText>{item.openingTime} - {item.closingTime}</HighlightText></DetailText>
                                                    </DetailRow>
                                                </PharmacyDetails>

                                                <div style={{ marginTop: '16px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                                                    <button 
                                                        onClick={() => {
                                                            const fullPharmacy = allPharmacies.find(p => p.pharmacyName === item.pharmacyName);
                                                            if (fullPharmacy && fullPharmacy.latitude) {
                                                                setSelectedPharmacyForMap(fullPharmacy);
                                                            } else {
                                                                toast.warning("Location data not available for this pharmacy.");
                                                            }
                                                        }}
                                                        style={{ width: '100%', background: '#eff6ff', color: '#1a56db', border: '1px solid #bfdbfe', padding: '10px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s' }}
                                                    >
                                                        <FaMapMarkerAlt /> View Location
                                                    </button>
                                                </div>
                                            </AvailabilityCard>
                                        );
                                    })}
                                </AvailabilityCardGrid>
                            ) : (
                                <EmptyState>
                                    <EmptyStateIcon><FaPills /></EmptyStateIcon>
                                    <EmptyStateTitle>No Results Match Filters</EmptyStateTitle>
                                    <EmptyStateText>Try adjusting your filters to see more results.</EmptyStateText>
                                </EmptyState>
                            )}
                        </>
                    ) : availabilityResults.length === 0 && hasSearchedAvailability && (
                        <EmptyState>
                            <EmptyStateIcon><FaPills /></EmptyStateIcon>
                            <EmptyStateTitle>No Availability Found</EmptyStateTitle>
                            <EmptyStateText>We couldn't find this medicine at any nearby pharmacies. Try searching for a different medicine or check nearby pharmacies first.</EmptyStateText>
                        </EmptyState>
                    )}

                    {!hasSearchedAvailability && !loadingAvailability && (
                        <PopularSearchesContainer>
                            <PopularSearchesTitle><FaSearchIcon style={{color: '#64748b'}}/> Popular Searches</PopularSearchesTitle>
                            <PopularChipsWrapper>
                                {["Dolo 650", "Paracetamol", "Crocin", "Azithromycin", "Cetirizine", "Amoxicillin"].map((medName, i) => (
                                    <PopularChip 
                                        key={i} 
                                        onClick={() => {
                                            setMedicineName(medName);
                                            // Call checkAvailability immediately with the new value
                                            // Since setMedicineName is async, we pass the value directly to the handler or wait
                                            // The simplest way is to simulate setting it then clicking
                                            setTimeout(() => {
                                                const fakeEvent = { preventDefault: () => {} };
                                                const searchFn = async () => {
                                                    if (!medName) return;
                                                    setLoadingAvailability(true);
                                                    setAvailabilityResults([]);
                                                    setHasSearchedAvailability(true);
                                                    try {
                                                        const userLat = localStorage.getItem("userLat");
                                                        const userLng = localStorage.getItem("userLng");
                                                        const queryParams = (userLat && userLng) ? `?latitude=${userLat}&longitude=${userLng}` : '';
                                                        const res = await axios.get(`https://localhost:7191/api/Pharmacies/medicine/${medName}/availability${queryParams}`);
                                                        setAvailabilityResults(res.data);
                                                        setAvailabilityPriceSort("");
                                                        setAvailabilityDistanceSort("");
                                                        setAvailabilityStatusFilter("all");
                                                    } catch (error) {
                                                        console.error(error);
                                                        toast.error("Error checking availability");
                                                    } finally {
                                                        setLoadingAvailability(false);
                                                    }
                                                };
                                                searchFn();
                                            }, 100);
                                        }}
                                    >
                                        {medName}
                                    </PopularChip>
                                ))}
                            </PopularChipsWrapper>
                        </PopularSearchesContainer>
                    )}

                    {!hasSearchedAvailability && !loadingAvailability && (
                        <StaticStateDisplay 
                            title="💊 Check Medicine Availability"
                            description="Find out which pharmacies currently have your required medicine in stock and compare available options before visiting."
                            cards={[
                                { icon: <FaStoreAlt />, title: "Multiple Pharmacy Comparison", description: "Compare medicine availability across nearby pharmacies." },
                                { icon: <FaMoneyBillWave />, title: "Price Transparency", description: "View medicine prices before visiting a pharmacy." },
                                { icon: <FaBoxOpen />, title: "Stock Visibility", description: "Check medicine availability and stock information." },
                                { icon: <FaClock />, title: "Pharmacy Status", description: "See whether pharmacies are currently open or closed." }
                            ]}
                            steps={[
                                "Search Medicine Name",
                                "View Available Pharmacies",
                                "Compare Price & Stock",
                                "Choose the Best Option"
                            ]}
                        />
                    )}
                </>
            )}



            {activeTab === "find-near-me" && (
                <>
                    <SearchPanelWithAutocomplete
                        placeholder="Enter medicine name (e.g., Paracetamol)"
                        value={nearbyMedicineName}
                        onChange={setNearbyMedicineName}
                        onSearch={findNearbyMedicine}
                        buttonText="Find Near Me"
                        disabled={loadingNearbyMedicine}
                        debounceMs={300}
                        minChars={1}
                    />
                    {loadingNearbyMedicine ? (
                        <SkeletonGridItem count={3} />
                    ) : nearbyMedicineResults.length > 0 ? (
                        <>
                            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', alignItems: 'center', background: '#fff', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                <span style={{ fontSize: '14px', fontWeight: '600', color: '#475569', marginRight: '8px' }}>Filter by Status:</span>
                                
                                <select 
                                    value={findNearMeStatusFilter} 
                                    onChange={e => setFindNearMeStatusFilter(e.target.value)}
                                    style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                                >
                                    <option value="all">All Pharmacies</option>
                                    <option value="open">Open Now</option>
                                    <option value="closed">Closed</option>
                                </select>
                            </div>
                            
                            {filteredNearMeResults.length > 0 ? (
                                <NearbyMedicineResults
                                    results={filteredNearMeResults}
                                    medicineName={nearbyMedicineName}
                                    onViewLocation={(pharmacy) => {
                                        const fullPharmacy = allPharmacies.find(p => p.pharmacyName === pharmacy.pharmacyName);
                                        if (fullPharmacy && fullPharmacy.latitude) {
                                            setSelectedPharmacyForMap(fullPharmacy);
                                        } else {
                                            toast.warning("Location data not available for this pharmacy.");
                                        }
                                    }}
                                />
                            ) : (
                                <EmptyState>
                                    <EmptyStateIcon><FaPills /></EmptyStateIcon>
                                    <EmptyStateTitle>No Results Match Filter</EmptyStateTitle>
                                    <EmptyStateText>Try changing the status filter to see more pharmacies.</EmptyStateText>
                                </EmptyState>
                            )}
                        </>
                    ) : nearbyMedicineResults.length === 0 && nearbyMedicineName && !loadingNearbyMedicine && (
                        <EmptyState>
                            <EmptyStateIcon><FaMapMarkerAlt /></EmptyStateIcon>
                            <EmptyStateTitle>No Pharmacies Found</EmptyStateTitle>
                            <EmptyStateText>We couldn't find any nearby pharmacies with {nearbyMedicineName} in stock. Try searching for a different medicine or expand your search area.</EmptyStateText>
                        </EmptyState>
                    )}

                    {!nearbyMedicineName && !loadingNearbyMedicine && nearbyMedicineResults.length === 0 && (
                        <StaticStateDisplay 
                            title="📍 Discover Nearby Pharmacies"
                            description="Locate pharmacies around you and find the most convenient option based on distance and availability."
                            cards={[
                                { icon: <FaMapMarkedAlt />, title: "Location-Based Search", description: "Discover pharmacies closest to your location." },
                                { icon: <FaWalking />, title: "Distance Information", description: "Compare nearby pharmacies by distance." },
                                { icon: <FaClinicMedical />, title: "Pharmacy Information", description: "View pharmacy details, timings, and contact information." },
                                { icon: <FaLocationArrow />, title: "Quick Navigation", description: "Access pharmacy locations directly from the platform." }
                            ]}
                            steps={[
                                "Share Your Location",
                                "Browse Nearby Pharmacies",
                                "View Location on Map",
                                "Visit the Nearest Pharmacy"
                            ]}
                        />
                    )}
                </>
            )}

            {showAddressSelection && (
                <AddressSelectionModal
                    onClose={() => setShowAddressSelection(false)}
                    onSelectCurrentLocation={handleSelectCurrentLocation}
                    onSelectSavedAddress={handleSelectSavedAddress}
                    onAddNewAddress={() => {
                        setShowAddressSelection(false);
                        setShowAddressForm(true);
                    }}
                />
            )}

            {showAddressForm && (
                <AddressFormModal
                    onClose={() => {
                        setShowAddressForm(false);
                        setPendingAction(null);
                    }}
                    onSubmit={handleSaveNewAddress}
                />
            )}

            {selectedPharmacyForMap && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: '#fff', borderRadius: '16px', width: '90%', maxWidth: '800px', height: '80vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #e2e8f0' }}>
                            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{selectedPharmacyForMap.pharmacyName} - Location</div>
                            <button onClick={() => setSelectedPharmacyForMap(null)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#64748b' }}>&times;</button>
                        </div>
                        <div style={{ flex: 1, position: 'relative' }}>
                            <PharmacyMap 
                                pharmacies={[selectedPharmacyForMap]} 
                                hoveredPharmacyId={selectedPharmacyForMap.pharmacyId} 
                                isOpenFn={isPharmacyOpen} 
                            />
                        </div>
                    </div>
                </div>
            )}

        </Layout>
    );
}

export default CustomerDashboard;