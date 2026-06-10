import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function ProtectedRoute({ children, allowedRole }) {

    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/" />;
    }

    try {

        const decoded = jwtDecode(token);

        const role =
            decoded[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
            ];

        if (role !== allowedRole) {
            return <Navigate to="/" />;
        }

        return children;

    } catch {

        return <Navigate to="/" />;
    }
}

export default ProtectedRoute;
