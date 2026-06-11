import { BrowserRouter, Routes, Route } from "react-router-dom";
import GlobalStyles from "./styles/GlobalStyles";
import ToastContainer from "./components/ui/ToastContainer";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import AdminDashboard from "./pages/AdminDashboard";
import PharmacyDashboard from "./pages/PharmacyDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <BrowserRouter>
            <GlobalStyles />
            <ToastContainer />
            <Routes>
                <Route
                    path="/"
                    element={<LoginPage />}
                />

                <Route
                    path="/register"
                    element={<RegisterPage />}
                />

                <Route
                    path="/forgot-password"
                    element={<ForgotPasswordPage />}
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