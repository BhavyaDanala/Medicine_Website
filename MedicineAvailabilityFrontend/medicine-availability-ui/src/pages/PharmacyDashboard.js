import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function PharmacyDashboard() {

    const [inventory, setInventory] = useState([]);
    const [lowStock, setLowStock] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {

        const loadData = async () => {

            try {

                const token = localStorage.getItem("token");

                const inventoryResponse = await axios.get(
                    "https://localhost:7191/api/Pharmacies/inventory",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const lowStockResponse = await axios.get(
                    "https://localhost:7191/api/Pharmacies/low-stock",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setInventory(inventoryResponse.data);
                setLowStock(lowStockResponse.data);

            } catch (error) {

                console.error(error);

                alert("Unable to load pharmacy dashboard");
            }
        };

        loadData();

    }, []);

    const logout = () => {

        localStorage.removeItem("token");

        navigate("/");
    };

    return (
        <div style={{ padding: "20px" }}>

            <h1>Pharmacy Dashboard</h1>

            <button onClick={logout}>
                Logout
            </button>

            <hr />

            <h3>Total Inventory Records : {inventory.length}</h3>

            <h3>Low Stock Items : {lowStock.length}</h3>

        </div>
    );
}

export default PharmacyDashboard;