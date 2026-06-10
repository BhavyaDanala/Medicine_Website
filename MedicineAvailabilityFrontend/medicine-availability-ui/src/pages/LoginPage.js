import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

function LoginPage() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const login = async () => {

        try {

            const response = await axios.post(
                "https://localhost:7240/api/Auth/login",
                {
                    email,
                    password
                }
            );

            const token = response.data.token;

            localStorage.setItem("token", token);

            const decodedToken = jwtDecode(token);

            console.log(decodedToken);

            const role =
                decodedToken[
                "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
                ];

            if (role === "Admin") {
                navigate("/admin-dashboard");
            }
            else if (role === "Pharmacy") {
                navigate("/pharmacy-dashboard");
            }
            else {
                navigate("/customer-dashboard");
            }

        }
        catch (error) {

            console.error(error);

            alert("Invalid Login");
        }
    };

    return (
        <div style={{ padding: "20px" }}>

            <h1>Medicine Availability Finder</h1>

            <h2>Login</h2>

            <input
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <br /><br />

            <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <br /><br />

            <button onClick={login}>
                Login
            </button>

        </div>
    );
}

export default LoginPage;