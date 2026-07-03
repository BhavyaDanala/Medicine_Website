import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FaPills, FaStore, FaBox, FaExclamationTriangle, FaPlus, FaSync, FaEdit, FaTrash, FaChartLine, FaClipboardList, FaWarehouse, FaUserShield, FaBell, FaEnvelope } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
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
import Skeleton, { SkeletonGridItem } from "../components/ui/Skeleton";

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
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  color: ${theme.colors.white};
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);

  &:hover {
    transform: translateY(-2px);
    background: linear-gradient(135deg, #45a049 0%, #4CAF50 100%);
    box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: 10px 20px;
    font-size: 13px;
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    width: 100%;
    justify-content: center;
  }
`;

const RefreshButton = styled(ActionButton)`
  background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
  box-shadow: 0 4px 15px rgba(33, 150, 243, 0.3);

  &:hover {
    background: linear-gradient(135deg, #1976D2 0%, #2196F3 100%);
    box-shadow: 0 6px 20px rgba(33, 150, 243, 0.4);
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

const ActionCell = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
`;

const IconButton = styled.button`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border: none;
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSizes.sm};
  cursor: pointer;
  transition: all ${theme.transitions.normal};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  font-weight: ${theme.fontWeights.medium};
  font-family: ${theme.fonts.primary};

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.xs} ${theme.spacing.sm};
    font-size: ${theme.fontSizes.xs};
  }
`;

const EditButton = styled(IconButton)`
  background-color: ${theme.colors.primary};
  color: ${theme.colors.white};
  box-shadow: ${theme.shadows.sm};

  &:hover {
    background-color: ${theme.colors.primaryDark};
    transform: translateY(-1px);
    box-shadow: ${theme.shadows.md};
  }
`;

const DeleteButton = styled(IconButton)`
  background-color: ${theme.colors.error};
  color: ${theme.colors.white};
  box-shadow: ${theme.shadows.sm};

  &:hover {
    background-color: #c62828;
    transform: translateY(-1px);
    box-shadow: ${theme.shadows.md};
  }
`;

function AdminDashboard() {
    const [summary, setSummary] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [medicines, setMedicines] = useState([]);
    const [pharmacies, setPharmacies] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [lowStock, setLowStock] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [pendingPharmacies, setPendingPharmacies] = useState([]);
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
    const [userName, setUserName] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                const name = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || decoded.name;
                setUserName(name || "Admin");
            } catch (error) {
                console.error("Error decoding token:", error);
            }
        }
    }, []);

    const tabs = [
        { id: 'overview', label: 'Overview', icon: <FaChartLine /> },
        { id: 'pending', label: 'Pending Approvals', icon: <FaUserShield /> },
        { id: 'medicines', label: 'Medicines', icon: <FaPills /> },
        { id: 'pharmacies', label: 'Pharmacies', icon: <FaStore /> },
        { id: 'inventory', label: 'Inventory', icon: <FaWarehouse /> },
        { id: 'lowstock', label: 'Low Stock', icon: <FaExclamationTriangle /> },
        { id: 'notifications', label: 'Notifications', icon: <FaBell /> },
    ];

    const loadData = async () => {
        try {
            const token = localStorage.getItem("token");

            const [summaryResponse, medicinesResponse, pharmaciesResponse, inventoryResponse, lowStockResponse, notificationsResponse, pendingResponse] = await Promise.all([
                axios.get("https://localhost:7196/api/Dashboard/summary", {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get("https://localhost:7194/api/Medicines"),
                axios.get("https://localhost:7191/api/Pharmacies"),
                axios.get("https://localhost:7191/api/Pharmacies/inventory/all", {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get("https://localhost:7191/api/Pharmacies/low-stocks/admin", {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get("https://localhost:7191/api/Pharmacies/notification-history?limit=50", {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get("https://localhost:7240/api/Auth/pending-pharmacies", {
                    headers: { Authorization: `Bearer ${token}` }
                }).catch(() => ({ data: [] }))
            ]);

            setSummary(summaryResponse.data);
            setMedicines(medicinesResponse.data);
            setPharmacies(pharmaciesResponse.data);
            setInventory(inventoryResponse.data);
            setLowStock(lowStockResponse.data);
            setNotifications(notificationsResponse.data);
            setPendingPharmacies(pendingResponse.data);

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
            const token = localStorage.getItem("token");
            const response = await axios.post("https://localhost:7240/api/Auth/admin-add-pharmacy", data, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success(response.data.message || "Pharmacy created successfully. Activation email has been sent to the pharmacy email address.");
            setShowAddPharmacyModal(false);
            loadData();
        } catch (error) {
            console.error("ADD PHARMACY ERROR:", error.response?.data);
            const msg = error.response?.data;
            toast.error(typeof msg === 'string' ? msg : JSON.stringify(msg));
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

    const handleApprovePharmacy = async (userId) => {
        if (!window.confirm("Are you sure you want to approve this pharmacy?")) return;
        try {
            const token = localStorage.getItem("token");
            await axios.post(`https://localhost:7240/api/Auth/approve-pharmacy/${userId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Pharmacy approved successfully");
            loadData();
        } catch (error) {
            console.error(error);
            toast.error("Failed to approve pharmacy");
        }
    };

    const handleRejectPharmacy = async (userId) => {
        if (!window.confirm("Are you sure you want to reject this pharmacy?")) return;
        try {
            const token = localStorage.getItem("token");
            await axios.post(`https://localhost:7240/api/Auth/reject-pharmacy/${userId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Pharmacy rejected successfully");
            loadData();
        } catch (error) {
            console.error(error);
            toast.error("Failed to reject pharmacy");
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
            <Layout userRole="Admin" onLogout={logout} activeTab={activeTab} onTabChange={setActiveTab} sidebarItems={tabs}>
                <WelcomeSection>
                    <WelcomeTitle>🛡️ Admin Dashboard</WelcomeTitle>
                    <WelcomeSubtitle>Welcome back, {userName}! Overview of medicine availability system</WelcomeSubtitle>
                </WelcomeSection>
                <DashboardGrid>
                    <Skeleton type="dashboard" />
                    <Skeleton type="dashboard" />
                    <Skeleton type="dashboard" />
                    <Skeleton type="dashboard" />
                </DashboardGrid>
            </Layout>
        );
    }

    return (
        <Layout userRole="Admin" onLogout={logout} activeTab={activeTab} onTabChange={setActiveTab} sidebarItems={tabs}>
            <WelcomeSection>
                <WelcomeTitle>🛡️ Admin Dashboard</WelcomeTitle>
                <WelcomeSubtitle>Welcome back, {userName}! Overview of medicine availability system</WelcomeSubtitle>
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
                        <DashboardCard
                            title="Low Stock Alerts Sent"
                            value={notifications?.length || 0}
                            icon={FaEnvelope}
                            color={theme.colors.error}
                        />
                    </DashboardGrid>
                </>
            )}

            {activeTab === 'pending' && (
                <>
                    <SectionTitle><FaUserShield /> Pending Pharmacy Approvals</SectionTitle>
                    <DataTable
                        columns={[
                            { header: "User ID", accessor: "userId" },
                            { header: "Pharmacy Name", accessor: "name" },
                            { header: "Email", accessor: "email" },
                            { 
                                header: "Registration Date", 
                                render: (row) => new Date(row.registrationDate).toLocaleDateString() 
                            },
                            {
                                header: "Status",
                                render: (row) => (
                                    <span style={{ 
                                        padding: '4px 12px', 
                                        borderRadius: '20px', 
                                        backgroundColor: '#fef3c7', 
                                        color: '#d97706',
                                        fontWeight: '600',
                                        fontSize: '12px'
                                    }}>
                                        Pending
                                    </span>
                                )
                            },
                            {
                                header: "Actions",
                                render: (row) => (
                                    <ActionCell>
                                        <ActionButton style={{ background: '#10b981', padding: '6px 12px' }} onClick={() => handleApprovePharmacy(row.userId)}>
                                            Approve
                                        </ActionButton>
                                        <DeleteButton style={{ padding: '6px 12px', fontSize: '13px' }} onClick={() => handleRejectPharmacy(row.userId)}>
                                            Reject
                                        </DeleteButton>
                                    </ActionCell>
                                )
                            },
                        ]}
                        data={pendingPharmacies}
                        emptyMessage="No pending pharmacy requests"
                    />
                </>
            )}

            {activeTab === 'medicines' && (
                <>
                    <SectionTitle><FaPills /> Medicine Management</SectionTitle>
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
                    <SectionTitle><FaStore /> Pharmacy Management</SectionTitle>
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
                    <SectionTitle><FaWarehouse /> Inventory Monitoring</SectionTitle>
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
                    <SectionTitle><FaExclamationTriangle /> Low Stock Medicines</SectionTitle>
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

            {activeTab === 'notifications' && (
                <>
                    <SectionTitle><FaBell /> Recent Low Stock Alerts</SectionTitle>
                    <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: theme.spacing.md,
                        marginBottom: theme.spacing.xl 
                    }}>
                        {notifications.length === 0 ? (
                            <div style={{
                                background: theme.colors.lightGray,
                                borderRadius: theme.borderRadius.lg,
                                padding: theme.spacing.xl,
                                textAlign: 'center',
                                color: theme.colors.textSecondary
                            }}>
                                <FaEnvelope size={48} style={{ marginBottom: theme.spacing.md, opacity: 0.5 }} />
                                <p>No email alerts sent yet. Alerts will appear here when inventory drops below threshold.</p>
                            </div>
                        ) : (
                            notifications.map((notification, index) => (
                                <div key={index} style={{
                                    background: theme.colors.white,
                                    borderRadius: theme.borderRadius.lg,
                                    padding: theme.spacing.lg,
                                    border: `2px solid ${notification.emailSent ? '#ffc107' : '#dc3545'}`,
                                    borderLeft: `6px solid ${notification.emailSent ? '#ffc107' : '#dc3545'}`,
                                    boxShadow: theme.shadows.sm,
                                    transition: 'all 0.3s ease'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        marginBottom: theme.spacing.md
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: theme.spacing.md
                                        }}>
                                            <div style={{
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '50%',
                                                background: notification.emailSent 
                                                    ? 'linear-gradient(135deg, #ffc107 0%, #ff9800 100%)' 
                                                    : 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'white',
                                                fontSize: theme.fontSizes.lg
                                            }}>
                                                {notification.emailSent ? '⚠️' : '❌'}
                                            </div>
                                            <div>
                                                <div style={{
                                                    fontSize: theme.fontSizes.md,
                                                    fontWeight: theme.fontWeights.bold,
                                                    color: theme.colors.text,
                                                    marginBottom: theme.spacing.xs
                                                }}>
                                                    ⚠️ {notification.medicineName || `Medicine ${notification.medicineId}`} running low
                                                </div>
                                                <div style={{
                                                    fontSize: theme.fontSizes.sm,
                                                    color: theme.colors.textSecondary
                                                }}>
                                                    Pharmacy: {notification.pharmacyName || `Pharmacy ${notification.pharmacyId}`}
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{
                                            background: notification.emailSent ? '#d4edda' : '#f8d7da',
                                            color: notification.emailSent ? '#155724' : '#721c24',
                                            padding: `${theme.spacing.xs} ${theme.spacing.md}`,
                                            borderRadius: theme.borderRadius.md,
                                            fontSize: theme.fontSizes.sm,
                                            fontWeight: theme.fontWeights.bold
                                        }}>
                                            Stock: {notification.quantity}
                                        </div>
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        fontSize: theme.fontSizes.sm,
                                        color: theme.colors.textSecondary
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: theme.spacing.sm
                                        }}>
                                            <FaEnvelope />
                                            <span>To: {notification.pharmacyEmail}</span>
                                        </div>
                                        <div>
                                            {new Date(notification.sentAt).toLocaleString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </div>
                                    </div>
                                    {notification.emailError && (
                                        <div style={{
                                            marginTop: theme.spacing.sm,
                                            padding: theme.spacing.sm,
                                            background: '#f8d7da',
                                            color: '#721c24',
                                            borderRadius: theme.borderRadius.md,
                                            fontSize: theme.fontSizes.sm
                                        }}>
                                            Error: {notification.emailError}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
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

