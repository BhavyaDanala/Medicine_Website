import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FaBox, FaExclamationTriangle, FaPlus, FaEdit, FaWarehouse, FaInbox, FaStore } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { theme } from "../styles/theme";
import Layout from "../components/layout/Layout";
import DashboardCard from "../components/ui/DashboardCard";
import ResultCard, { ResultCardGrid } from "../components/ui/ResultCard";
import AddInventoryModal from "../components/ui/AddInventoryModal";
import EditInventoryModal from "../components/ui/EditInventoryModal";
import Skeleton from "../components/ui/Skeleton";

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${theme.spacing.xl};
  margin-bottom: ${theme.spacing.xxl};

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: ${theme.spacing.lg};
    margin-bottom: ${theme.spacing.xl};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.md};
    margin-bottom: ${theme.spacing.lg};
  }
`;

const SectionTitle = styled.h2`
  font-size: ${theme.fontSizes.xxl};
  color: ${theme.colors.darkerGray};
  margin-bottom: ${theme.spacing.xl};
  margin-top: ${theme.spacing.xxl};
  font-weight: ${theme.fontWeights.extrabold};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: ${theme.fontSizes.xl};
    margin-top: ${theme.spacing.xl};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.fontSizes.lg};
    margin-top: ${theme.spacing.lg};
  }
`;

const WelcomeSection = styled.div`
  margin-bottom: ${theme.spacing.xxl};
  background: linear-gradient(135deg, #1a56db 0%, #0891b2 100%);
  border-radius: ${theme.borderRadius.xxl};
  padding: ${theme.spacing.xxl};
  color: ${theme.colors.white};
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(26, 86, 219, 0.3);

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
    padding: ${theme.spacing.xl};
    border-radius: ${theme.borderRadius.lg};
  }
`;

const WelcomeTitle = styled.h1`
  font-size: 36px;
  color: ${theme.colors.white};
  margin-bottom: ${theme.spacing.sm};
  font-weight: 800;
  letter-spacing: -0.5px;
  position: relative;
  z-index: 1;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: 28px;
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 24px;
  }
`;

const WelcomeSubtitle = styled.p`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
  position: relative;
  z-index: 1;
  line-height: 1.6;

  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: 14px;
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 13px;
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

const EmptyIcon = styled.div`
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

const EmptyTitle = styled.h3`
  font-size: 20px;
  color: #1a1a2e;
  margin: 0;
  font-weight: 700;
  letter-spacing: -0.3px;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 18px;
  }
`;

const EmptyText = styled.p`
  font-size: 15px;
  color: #666;
  margin: 0;
  max-width: 400px;
  line-height: 1.6;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 14px;
  }
`;

const AddButton = styled.button`
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  color: ${theme.colors.white};
  border: none;
  padding: ${theme.spacing.lg} ${theme.spacing.xxl};
  border-radius: ${theme.borderRadius.lg};
  font-size: ${theme.fontSizes.md};
  font-weight: ${theme.fontWeights.semibold};
  font-family: ${theme.fonts.primary};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  transition: all ${theme.transitions.normal};
  cursor: pointer;
  margin-bottom: ${theme.spacing.lg};
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
    background: linear-gradient(135deg, #45a049 0%, #4CAF50 100%);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing.md} ${theme.spacing.lg};
    font-size: ${theme.fontSizes.sm};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    font-size: ${theme.fontSizes.sm};
  }
`;

const EditButton = styled.button`
  background-color: ${theme.colors.primary};
  color: ${theme.colors.white};
  border: none;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
  font-family: ${theme.fonts.primary};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  transition: all ${theme.transitions.normal};
  cursor: pointer;
  margin-top: ${theme.spacing.md};
  box-shadow: ${theme.shadows.sm};

  &:hover {
    background-color: ${theme.colors.primaryDark};
    transform: translateY(-1px);
    box-shadow: ${theme.shadows.md};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.xs} ${theme.spacing.sm};
    font-size: ${theme.fontSizes.xs};
  }
`;

function PharmacyDashboard() {
    const [inventory, setInventory] = useState([]);
    const [lowStock, setLowStock] = useState([]);
    const [pharmacies, setPharmacies] = useState([]);
    const [medicines, setMedicines] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [activeTab, setActiveTab] = useState("overview");

    const tabs = [
        { id: 'overview', label: 'Overview', icon: <FaStore /> },
        { id: 'inventory', label: 'Inventory', icon: <FaWarehouse /> },
        { id: 'lowstock', label: 'Low Stock', icon: <FaExclamationTriangle /> },
    ];
    const [pharmacyName, setPharmacyName] = useState("");
    const [userName, setUserName] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                const name = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || decoded.name;
                setUserName(name || "Pharmacy User");
            } catch (error) {
                console.error("Error decoding token:", error);
            }
        }
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("token");

            const [inventoryResponse, lowStockResponse, pharmaciesResponse, medicinesResponse] = await Promise.all([
                axios.get("https://localhost:7191/api/Pharmacies/inventory", {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get("https://localhost:7191/api/Pharmacies/low-stock", {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get("https://localhost:7191/api/Pharmacies"),
                axios.get("https://localhost:7194/api/Medicines")
            ]);

            setInventory(inventoryResponse.data);
            setLowStock(lowStockResponse.data);
            setPharmacies(pharmaciesResponse.data);
            setMedicines(medicinesResponse.data);

            // Set pharmacy name from the first pharmacy in inventory
            if (inventoryResponse.data.length > 0) {
                const firstPharmacyId = inventoryResponse.data[0].pharmacyId;
                const pharmacy = pharmaciesResponse.data.find(p => p.pharmacyId === firstPharmacyId);
                if (pharmacy) {
                    setPharmacyName(pharmacy.pharmacyName);
                }
            }

        } catch (error) {
            console.error(error);
            toast.error("Unable to load pharmacy dashboard");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    const handleAddInventory = async (data) => {
        try {
            const token = localStorage.getItem("token");
            let finalMedicineId = data.medicineId;

            if (data.isOthers) {
                const newMedResponse = await axios.post("https://localhost:7194/api/Medicines", {
                    medicineName: data.newMedicineName,
                    category: data.category,
                    manufacturer: data.manufacturer,
                    symptoms: data.symptoms
                });
                finalMedicineId = newMedResponse.data.medicineId;
            }

            await axios.post(
                "https://localhost:7191/api/Pharmacies/inventory",
                {
                    medicineId: finalMedicineId,
                    quantity: data.quantity,
                    price: data.price
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (data.isOthers) {
                toast.success("Medicine added successfully and synced across the system.");
            } else {
                toast.success("Inventory added successfully");
            }
            setShowAddModal(false);
            loadData();
        } catch (error) {
            console.error(error);
            const msg = error.response?.data;
            if (typeof msg === 'string') {
                toast.error(msg);
            } else {
                toast.error(data.isOthers ? "Failed to add new medicine and sync inventory" : "Failed to add inventory");
            }
        }
    };

    const handleEditInventory = async (data) => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(
                "https://localhost:7191/api/Pharmacies/update-inventory",
                data,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            toast.success("Inventory updated successfully");
            setShowEditModal(false);
            setEditingItem(null);
            loadData();
        } catch (error) {
            console.error(error);
            toast.error("Failed to update inventory");
        }
    };

    const openEditModal = (item) => {
        setEditingItem(item);
        setShowEditModal(true);
    };

    const getPharmacyName = (pharmacyId) => {
        const pharmacy = pharmacies.find(p => p.pharmacyId === pharmacyId);
        return pharmacy ? pharmacy.pharmacyName : "Unknown";
    };

    const getMedicineName = (medicineId) => {
        const medicine = medicines.find(m => m.medicineId === medicineId);
        return medicine ? medicine.medicineName : "Unknown";
    };

    return (
        <Layout userRole="Pharmacy" onLogout={logout} activeTab={activeTab} onTabChange={setActiveTab} sidebarItems={tabs}>
            <WelcomeSection>
                <WelcomeTitle>{pharmacyName ? `🏥 ${pharmacyName} Dashboard` : "Pharmacy Dashboard"}</WelcomeTitle>
                <WelcomeSubtitle>Welcome back, {userName}! Manage your pharmacy inventory efficiently</WelcomeSubtitle>
            </WelcomeSection>

            {activeTab === 'overview' && (
                <>
                    {isLoading ? (
                        <DashboardGrid>
                            <Skeleton type="dashboard" />
                            <Skeleton type="dashboard" />
                        </DashboardGrid>
                    ) : (
                        <DashboardGrid>
                            <DashboardCard
                                title="Total Inventory Records"
                                value={inventory.length}
                                icon={FaBox}
                                color={theme.colors.medicalBlue}
                            />
                            <DashboardCard
                                title="Low Stock Items"
                                value={lowStock.length}
                                icon={FaExclamationTriangle}
                                color={theme.colors.warning}
                            />
                        </DashboardGrid>
                    )}
                </>
            )}

            {activeTab === 'lowstock' && (
                <>
                    <SectionTitle><FaExclamationTriangle /> Low Stock Alerts</SectionTitle>
                    {lowStock.length > 0 ? (
                        <ResultCardGrid>
                            {lowStock.map((item, index) => (
                                <ResultCard
                                    key={index}
                                    title={item.medicineName}
                                    type="warning"
                                    data={[
                                        { label: "Pharmacy", value: item.pharmacyName },
                                        { label: "Quantity", value: item.quantity },
                                        { label: "Last Updated", value: new Date(item.lastUpdated).toLocaleDateString() },
                                    ]}
                                />
                            ))}
                        </ResultCardGrid>
                    ) : (
                        <EmptyState>
                            <EmptyIcon>
                                <FaExclamationTriangle />
                            </EmptyIcon>
                            <EmptyTitle>No Low Stock Items</EmptyTitle>
                            <EmptyText>All your medicines are well stocked right now.</EmptyText>
                        </EmptyState>
                    )}
                </>
            )}

            {activeTab === 'inventory' && (
                <>
                    <SectionTitle><FaWarehouse /> Inventory Overview</SectionTitle>
                    <AddButton onClick={() => setShowAddModal(true)}>
                        <FaPlus />
                        Add Inventory
                    </AddButton>
                    {inventory.length > 0 ? (
                        <ResultCardGrid>
                            {inventory.map((item) => (
                                <ResultCard
                                    key={item.id}
                                    title={getMedicineName(item.medicineId)}
                                    data={[
                                        { label: "Inventory ID", value: item.id },
                                        { label: "Pharmacy", value: getPharmacyName(item.pharmacyId) },
                                        { label: "Medicine", value: getMedicineName(item.medicineId) },
                                        { label: "Quantity", value: item.quantity },
                                        { label: "Price", value: `Rs. ${item.price}` },
                                        { label: "Last Updated", value: item.lastUpdated ? new Date(item.lastUpdated).toLocaleDateString() : "N/A" },
                                    ]}
                                    actionButton={
                                        <EditButton onClick={() => openEditModal(item)}>
                                            <FaEdit />
                                            Edit
                                        </EditButton>
                                    }
                                />
                            ))}
                        </ResultCardGrid>
                    ) : (
                        <EmptyState>
                            <EmptyIcon>
                                <FaInbox />
                            </EmptyIcon>
                            <EmptyTitle>No Inventory Records</EmptyTitle>
                            <EmptyText>Your inventory is empty. Add medicines to start tracking your pharmacy stock efficiently.</EmptyText>
                        </EmptyState>
                    )}
                </>
            )}

            {showAddModal && (
                <AddInventoryModal
                    medicines={medicines}
                    onClose={() => setShowAddModal(false)}
                    onSubmit={handleAddInventory}
                />
            )}

            {showEditModal && editingItem && (
                <EditInventoryModal
                    inventoryItem={editingItem}
                    onClose={() => {
                        setShowEditModal(false);
                        setEditingItem(null);
                    }}
                    onSubmit={handleEditInventory}
                />
            )}
        </Layout>
    );
}

export default PharmacyDashboard;