import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FaPills, FaStore, FaBox, FaExclamationTriangle, FaPlus, FaSync, FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { theme } from "../styles/theme";
import Layout from "../components/layout/Layout";
import DashboardCard from "../components/ui/DashboardCard";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import TabNavigation from "../components/ui/TabNavigation";
import DataTable from "../components/ui/DataTable";
import SearchBar from "../components/ui/SearchBar";
import AddMedicineModal from "../components/ui/AddMedicineModal";
import AddPharmacyModal from "../components/ui/AddPharmacyModal";
import EditMedicineModal from "../components/ui/EditMedicineModal";
import EditPharmacyModal from "../components/ui/EditPharmacyModal";
import ConfirmationDialog from "../components/ui/ConfirmationDialog";

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

const ActionButtons = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.xl};
  flex-wrap: wrap;

  @media (max-width: ${theme.breakpoints.mobile}) {
    gap: ${theme.spacing.sm};
  }
`;

const ActionButton = styled.button`
  background: linear-gradient(135deg, ${theme.colors.medicalBlue} 0%, ${theme.colors.medicalBlueDark} 100%);
  color: ${theme.colors.white};
  border: none;
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border-radius: ${theme.spacing.md};
  font-size: ${theme.fontSizes.md};
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 119, 182, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    font-size: ${theme.fontSizes.sm};
  }
`;

const RefreshButton = styled(ActionButton)`
  background: linear-gradient(135deg, ${theme.colors.mintGreen} 0%, ${theme.colors.mintGreenDark} 100%);
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

const ActionCell = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
`;

const IconButton = styled.button`
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border: none;
  border-radius: ${theme.spacing.sm};
  font-size: ${theme.fontSizes.sm};
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.xs};
    font-size: ${theme.fontSizes.xs};
  }
`;

const EditButton = styled(IconButton)`
  background-color: ${theme.colors.medicalBlue};
  color: ${theme.colors.white};

  &:hover {
    background-color: ${theme.colors.medicalBlueDark};
    transform: translateY(-1px);
  }
`;

const DeleteButton = styled(IconButton)`
  background-color: ${theme.colors.error};
  color: ${theme.colors.white};

  &:hover {
    background-color: #c62828;
    transform: translateY(-1px);
  }
`;

function AdminDashboard() {
    const [summary, setSummary] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [medicines, setMedicines] = useState([]);
    const [pharmacies, setPharmacies] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [lowStock, setLowStock] = useState([]);
    const [showAddMedicineModal, setShowAddMedicineModal] = useState(false);
    const [showAddPharmacyModal, setShowAddPharmacyModal] = useState(false);
    const [showEditMedicineModal, setShowEditMedicineModal] = useState(false);
    const [showEditPharmacyModal, setShowEditPharmacyModal] = useState(false);
    const [showDeleteMedicineDialog, setShowDeleteMedicineDialog] = useState(false);
    const [showDeletePharmacyDialog, setShowDeletePharmacyDialog] = useState(false);
    const [editingMedicine, setEditingMedicine] = useState(null);
    const [editingPharmacy, setEditingPharmacy] = useState(null);
    const [deletingMedicine, setDeletingMedicine] = useState(null);
    const [deletingPharmacy, setDeletingPharmacy] = useState(null);
    const [inventorySearch, setInventorySearch] = useState('');

    const navigate = useNavigate();

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'medicines', label: 'Medicines' },
        { id: 'pharmacies', label: 'Pharmacies' },
        { id: 'inventory', label: 'Inventory' },
        { id: 'lowstock', label: 'Low Stock' },
    ];

    const loadData = async () => {
        try {
            const token = localStorage.getItem("token");

            const [summaryResponse, medicinesResponse, pharmaciesResponse, inventoryResponse, lowStockResponse] = await Promise.all([
                axios.get("https://localhost:7196/api/Dashboard/summary", {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get("https://localhost:7194/api/Medicines"),
                axios.get("https://localhost:7191/api/Pharmacies"),
                axios.get("https://localhost:7191/api/Pharmacies/inventory", {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get("https://localhost:7191/api/Pharmacies/low-stock", {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);

            setSummary(summaryResponse.data);
            setMedicines(medicinesResponse.data);
            setPharmacies(pharmaciesResponse.data);
            setInventory(inventoryResponse.data);
            setLowStock(lowStockResponse.data);

        } catch (error) {
            console.error(error);
            toast.error("Unable to load dashboard data");
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    const handleAddMedicine = async (data) => {
        try {
            await axios.post("https://localhost:7194/api/Medicines", data);
            toast.success("Medicine added successfully");
            setShowAddMedicineModal(false);
            loadData();
        } catch (error) {
            console.error(error);
            toast.error("Failed to add medicine");
        }
    };

    const handleAddPharmacy = async (data) => {
        try {
            await axios.post("https://localhost:7191/api/Pharmacies", data);
            toast.success("Pharmacy added successfully");
            setShowAddPharmacyModal(false);
            loadData();
        } catch (error) {
            console.error(error);
            toast.error("Failed to add pharmacy");
        }
    };

    const handleEditMedicine = async (data) => {
        try {
            await axios.put("https://localhost:7194/api/Medicines", data);
            toast.success("Medicine updated successfully");
            setShowEditMedicineModal(false);
            setEditingMedicine(null);
            loadData();
        } catch (error) {
            console.error(error);
            toast.error("Failed to update medicine");
        }
    };

    const handleEditPharmacy = async (data) => {
        try {
            await axios.put("https://localhost:7191/api/Pharmacies", data);
            toast.success("Pharmacy updated successfully");
            setShowEditPharmacyModal(false);
            setEditingPharmacy(null);
            loadData();
        } catch (error) {
            console.error(error);
            toast.error("Failed to update pharmacy");
        }
    };

    const handleDeleteMedicine = async () => {
        try {
            await axios.delete(`https://localhost:7194/api/Medicines/${deletingMedicine.medicineId}`);
            toast.success("Medicine deleted successfully");
            setShowDeleteMedicineDialog(false);
            setDeletingMedicine(null);
            loadData();
        } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 400) {
                toast.error("Cannot delete medicine because inventory records exist.");
            } else {
                toast.error("Failed to delete medicine");
            }
        }
    };

    const handleDeletePharmacy = async () => {
        try {
            await axios.delete(`https://localhost:7191/api/Pharmacies/${deletingPharmacy.pharmacyId}`);
            toast.success("Pharmacy deleted successfully");
            setShowDeletePharmacyDialog(false);
            setDeletingPharmacy(null);
            loadData();
        } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 400) {
                toast.error("Cannot delete pharmacy because inventory records exist.");
            } else {
                toast.error("Failed to delete pharmacy");
            }
        }
    };

    const openEditMedicineModal = (medicine) => {
        setEditingMedicine(medicine);
        setShowEditMedicineModal(true);
    };

    const openEditPharmacyModal = (pharmacy) => {
        setEditingPharmacy(pharmacy);
        setShowEditPharmacyModal(true);
    };

    const openDeleteMedicineDialog = (medicine) => {
        setDeletingMedicine(medicine);
        setShowDeleteMedicineDialog(true);
    };

    const openDeletePharmacyDialog = (pharmacy) => {
        setDeletingPharmacy(pharmacy);
        setShowDeletePharmacyDialog(true);
    };

    const getPharmacyName = (pharmacyId) => {
        const pharmacy = pharmacies.find(p => p.pharmacyId === pharmacyId);
        return pharmacy ? pharmacy.pharmacyName : "Unknown";
    };

    const getMedicineName = (medicineId) => {
        const medicine = medicines.find(m => m.medicineId === medicineId);
        return medicine ? medicine.medicineName : "Unknown";
    };

    const filteredInventory = inventory.filter(item => {
        const search = inventorySearch.toLowerCase();
        const pharmacyName = getPharmacyName(item.pharmacyId).toLowerCase();
        const medicineName = getMedicineName(item.medicineId).toLowerCase();
        return pharmacyName.includes(search) || medicineName.includes(search);
    });

    if (!summary) {
        return (
            <Layout userRole="Admin" onLogout={logout}>
                <LoadingSpinner text="Loading Dashboard..." />
            </Layout>
        );
    }

    return (
        <Layout userRole="Admin" onLogout={logout}>
            <WelcomeSection>
                <WelcomeTitle>Admin Dashboard</WelcomeTitle>
                <WelcomeSubtitle>Overview of medicine availability system</WelcomeSubtitle>
            </WelcomeSection>

            <ActionButtons>
                <ActionButton onClick={() => setShowAddMedicineModal(true)}>
                    <FaPlus />
                    Add Medicine
                </ActionButton>
                <ActionButton onClick={() => setShowAddPharmacyModal(true)}>
                    <FaPlus />
                    Add Pharmacy
                </ActionButton>
                <RefreshButton onClick={loadData}>
                    <FaSync />
                    Refresh Data
                </RefreshButton>
            </ActionButtons>

            <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

            {activeTab === 'overview' && (
                <>
                    <DashboardGrid>
                        <DashboardCard
                            title="Total Medicines"
                            value={summary.totalMedicines}
                            icon={FaPills}
                            color={theme.colors.medicalBlue}
                        />
                        <DashboardCard
                            title="Total Pharmacies"
                            value={summary.totalPharmacies}
                            icon={FaStore}
                            color={theme.colors.mintGreen}
                        />
                        <DashboardCard
                            title="Total Inventory Records"
                            value={summary.totalInventoryRecords}
                            icon={FaBox}
                            color={theme.colors.medicalBlueDark}
                        />
                        <DashboardCard
                            title="Low Stock Count"
                            value={summary.lowStockCount}
                            icon={FaExclamationTriangle}
                            color={theme.colors.warning}
                        />
                    </DashboardGrid>
                </>
            )}

            {activeTab === 'medicines' && (
                <>
                    <SectionTitle>Medicine Management</SectionTitle>
                    <DataTable
                        columns={[
                            { header: "ID", accessor: "medicineId" },
                            { header: "Name", accessor: "medicineName" },
                            { header: "Category", accessor: "category" },
                            { header: "Manufacturer", accessor: "manufacturer" },
                            { header: "Symptoms", accessor: "symptoms" },
                            {
                                header: "Actions",
                                render: (row) => (
                                    <ActionCell>
                                        <EditButton onClick={() => openEditMedicineModal(row)}>
                                            <FaEdit />
                                            Edit
                                        </EditButton>
                                        <DeleteButton onClick={() => openDeleteMedicineDialog(row)}>
                                            <FaTrash />
                                            Delete
                                        </DeleteButton>
                                    </ActionCell>
                                )
                            },
                        ]}
                        data={medicines}
                        emptyMessage="No medicines found"
                    />
                </>
            )}

            {activeTab === 'pharmacies' && (
                <>
                    <SectionTitle>Pharmacy Management</SectionTitle>
                    <DataTable
                        columns={[
                            { header: "ID", accessor: "pharmacyId" },
                            { header: "Name", accessor: "pharmacyName" },
                            { header: "Address", accessor: "address" },
                            { header: "Phone", accessor: "phoneNumber" },
                            { header: "Latitude", accessor: "latitude" },
                            { header: "Longitude", accessor: "longitude" },
                            {
                                header: "Actions",
                                render: (row) => (
                                    <ActionCell>
                                        <EditButton onClick={() => openEditPharmacyModal(row)}>
                                            <FaEdit />
                                            Edit
                                        </EditButton>
                                        <DeleteButton onClick={() => openDeletePharmacyDialog(row)}>
                                            <FaTrash />
                                            Delete
                                        </DeleteButton>
                                    </ActionCell>
                                )
                            },
                        ]}
                        data={pharmacies}
                        emptyMessage="No pharmacies found"
                    />
                </>
            )}

            {activeTab === 'inventory' && (
                <>
                    <SectionTitle>Inventory Monitoring</SectionTitle>
                    <SearchBar
                        placeholder="Search by medicine or pharmacy name"
                        value={inventorySearch}
                        onChange={(e) => setInventorySearch(e.target.value)}
                    />
                    <DataTable
                        columns={[
                            { header: "ID", accessor: "id" },
                            { 
                                header: "Pharmacy", 
                                render: (row) => getPharmacyName(row.pharmacyId)
                            },
                            { 
                                header: "Medicine", 
                                render: (row) => getMedicineName(row.medicineId)
                            },
                            { header: "Quantity", accessor: "quantity" },
                            { header: "Price", render: (row) => `Rs. ${row.price}` },
                            { 
                                header: "Last Updated", 
                                render: (row) => row.lastUpdated ? new Date(row.lastUpdated).toLocaleDateString() : "N/A"
                            },
                        ]}
                        data={filteredInventory}
                        emptyMessage="No inventory records found"
                    />
                </>
            )}

            {activeTab === 'lowstock' && (
                <>
                    <SectionTitle>Low Stock Medicines</SectionTitle>
                    <DataTable
                        columns={[
                            { 
                                header: "Pharmacy", 
                                render: (row) => row.pharmacyName || getPharmacyName(row.pharmacyId)
                            },
                            { 
                                header: "Medicine", 
                                render: (row) => row.medicineName || getMedicineName(row.medicineId)
                            },
                            { header: "Quantity", accessor: "quantity" },
                            { 
                                header: "Last Updated", 
                                render: (row) => row.lastUpdated ? new Date(row.lastUpdated).toLocaleDateString() : "N/A"
                            },
                        ]}
                        data={lowStock}
                        emptyMessage="No low stock items found"
                    />
                </>
            )}

            {showAddMedicineModal && (
                <AddMedicineModal
                    onClose={() => setShowAddMedicineModal(false)}
                    onSubmit={handleAddMedicine}
                />
            )}

            {showAddPharmacyModal && (
                <AddPharmacyModal
                    onClose={() => setShowAddPharmacyModal(false)}
                    onSubmit={handleAddPharmacy}
                />
            )}

            {showEditMedicineModal && editingMedicine && (
                <EditMedicineModal
                    medicine={editingMedicine}
                    onClose={() => {
                        setShowEditMedicineModal(false);
                        setEditingMedicine(null);
                    }}
                    onSubmit={handleEditMedicine}
                />
            )}

            {showEditPharmacyModal && editingPharmacy && (
                <EditPharmacyModal
                    pharmacy={editingPharmacy}
                    onClose={() => {
                        setShowEditPharmacyModal(false);
                        setEditingPharmacy(null);
                    }}
                    onSubmit={handleEditPharmacy}
                />
            )}

            {showDeleteMedicineDialog && deletingMedicine && (
                <ConfirmationDialog
                    title="Delete Medicine"
                    message={`Are you sure you want to delete "${deletingMedicine.medicineName}"?`}
                    onConfirm={handleDeleteMedicine}
                    onClose={() => {
                        setShowDeleteMedicineDialog(false);
                        setDeletingMedicine(null);
                    }}
                />
            )}

            {showDeletePharmacyDialog && deletingPharmacy && (
                <ConfirmationDialog
                    title="Delete Pharmacy"
                    message={`Are you sure you want to delete "${deletingPharmacy.pharmacyName}"?`}
                    onConfirm={handleDeletePharmacy}
                    onClose={() => {
                        setShowDeletePharmacyDialog(false);
                        setDeletingPharmacy(null);
                    }}
                />
            )}
        </Layout>
    );
}

export default AdminDashboard;

