import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function AdminDashboard() {

    const [summary, setSummary] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {

        const fetchSummary = async () => {

            try {

                const token = localStorage.getItem("token");

                const response = await axios.get(
                    "https://localhost:7196/api/Dashboard/summary",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setSummary(response.data);

            } catch (error) {

                console.error(error);

                alert("Unable to load dashboard");
            }
        };

        fetchSummary();

    }, []);
    const logout = () => {

        localStorage.removeItem("token");

        navigate("/");
    };

    if (!summary) {
        return <h2>Loading Dashboard...</h2>;
    }

    return (
        <div style={{ padding: "20px" }}>

            <h1>Admin Dashboard</h1>

            <button onClick={logout}>
                Logout
            </button>

            <hr />

            <h3>Total Medicines: {summary.totalMedicines}</h3>

            <h3>Total Pharmacies: {summary.totalPharmacies}</h3>

            <h3>Total Inventory Records: {summary.totalInventoryRecords}</h3>

            <h3>Low Stock Count: {summary.lowStockCount}</h3>

        </div>
    );

}
export default AdminDashboard;

