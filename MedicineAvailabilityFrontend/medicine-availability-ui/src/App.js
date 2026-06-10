import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import PharmacyDashboard from "./pages/PharmacyDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={<LoginPage />}
                />

                <Route
                    path="/admin-dashboard"
                    element={
                        <ProtectedRoute allowedRole="Admin">
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/pharmacy-dashboard"
                    element={
                        <ProtectedRoute allowedRole="Pharmacy">
                            <PharmacyDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/customer-dashboard"
                    element={
                        <ProtectedRoute allowedRole="Customer">
                            <CustomerDashboard />
                        </ProtectedRoute>
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;