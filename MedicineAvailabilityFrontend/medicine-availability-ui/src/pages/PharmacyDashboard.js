import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FaBox, FaExclamationTriangle, FaPlus, FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import { theme } from "../styles/theme";
import Layout from "../components/layout/Layout";
import DashboardCard from "../components/ui/DashboardCard";
import ResultCard, { ResultCardGrid } from "../components/ui/ResultCard";
import AddInventoryModal from "../components/ui/AddInventoryModal";
import EditInventoryModal from "../components/ui/EditInventoryModal";

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${theme.spacing.xl};
  margin-bottom: ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.lg};
  }
`;

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

const EmptyState = styled.div`
  text-align: center;
  padding: ${theme.spacing.xxl};
  color: ${theme.colors.darkGray};
  font-size: ${theme.fontSizes.md};
`;

const AddButton = styled.button`
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

const EditButton = styled.button`
  background-color: ${theme.colors.medicalBlue};
  color: ${theme.colors.white};
  border: none;
  padding: ${theme.spacing.xs} ${theme.spacing.md};
  border-radius: ${theme.spacing.sm};
  font-size: ${theme.fontSizes.sm};
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  transition: all 0.3s ease;
  cursor: pointer;
  margin-top: ${theme.spacing.md};

  &:hover {
    background-color: ${theme.colors.medicalBlueDark};
    transform: translateY(-1px);
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

    const navigate = useNavigate();

    const loadData = async () => {
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

        } catch (error) {
            console.error(error);
            alert("Unable to load pharmacy dashboard");
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
            await axios.post(
                "https://localhost:7191/api/Pharmacies/inventory",
                data,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            toast.success("Inventory added successfully");
            setShowAddModal(false);
            loadData();
        } catch (error) {
            console.error(error);
            toast.error("Failed to add inventory");
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
        <Layout userRole="Pharmacy" onLogout={logout}>
            <WelcomeSection>
                <WelcomeTitle>Pharmacy Dashboard</WelcomeTitle>
                <WelcomeSubtitle>Manage your pharmacy inventory</WelcomeSubtitle>
            </WelcomeSection>

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

            {lowStock.length > 0 && (
                <>
                    <SectionTitle>⚠️ Low Stock Alerts</SectionTitle>
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
                </>
            )}

            <SectionTitle>Inventory Overview</SectionTitle>
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
                <EmptyState>No inventory records found</EmptyState>
            )}

            {showAddModal && (
                <AddInventoryModal
                    pharmacies={pharmacies}
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