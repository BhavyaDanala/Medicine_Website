import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import styled from "styled-components";
import { FaHeartbeat, FaUser, FaLock, FaSignInAlt, FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { theme } from "../styles/theme";

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, ${theme.colors.medicalBlue} 0%, ${theme.colors.medicalBlueDark} 100%);
  padding: ${theme.spacing.md};
`;

const LoginCard = styled.div`
  background: ${theme.colors.white};
  border-radius: ${theme.spacing.xl};
  padding: ${theme.spacing.xxl};
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 450px;
  animation: fadeIn 0.5s ease-in;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.xl};
    max-width: 100%;
  }
`;

const LogoSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: ${theme.spacing.xl};
`;

const LogoIcon = styled(FaHeartbeat)`
  font-size: 64px;
  color: ${theme.colors.medicalBlue};
  margin-bottom: ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 48px;
  }
`;

const Title = styled.h1`
  font-size: ${theme.fontSizes.xl};
  color: ${theme.colors.medicalBlue};
  text-align: center;
  margin-bottom: ${theme.spacing.xs};
  font-weight: 700;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.fontSizes.lg};
  }
`;

const Subtitle = styled.h2`
  font-size: ${theme.fontSizes.lg};
  color: ${theme.colors.darkGray};
  text-align: center;
  margin-bottom: ${theme.spacing.xl};
  font-weight: 500;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.fontSizes.md};
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

const InputGroup = styled.div`
  position: relative;
`;

const InputIcon = styled.div`
  position: absolute;
  left: ${theme.spacing.md};
  top: 50%;
  transform: translateY(-50%);
  color: ${theme.colors.mediumGray};
  font-size: ${theme.fontSizes.md};
`;

const Input = styled.input`
  width: 100%;
  padding: ${theme.spacing.md} ${theme.spacing.md} ${theme.spacing.md} ${theme.spacing.xxl};
  border: 2px solid ${theme.colors.mediumGray};
  border-radius: ${theme.spacing.md};
  font-size: ${theme.fontSizes.md};
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${theme.colors.medicalBlue};
    box-shadow: 0 0 0 3px rgba(0, 119, 182, 0.1);
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.sm} ${theme.spacing.sm} ${theme.spacing.sm} ${theme.spacing.lg};
    font-size: ${theme.fontSizes.sm};
  }
`;

const TogglePassword = styled.button`
  position: absolute;
  right: ${theme.spacing.md};
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${theme.colors.mediumGray};
  cursor: pointer;
  font-size: ${theme.fontSizes.md};
  padding: 0;

  &:hover {
    color: ${theme.colors.medicalBlue};
  }
`;

const LoginButton = styled.button`
  background: linear-gradient(135deg, ${theme.colors.medicalBlue} 0%, ${theme.colors.medicalBlueDark} 100%);
  color: ${theme.colors.white};
  border: none;
  padding: ${theme.spacing.md} ${theme.spacing.xl};
  border-radius: ${theme.spacing.md};
  font-size: ${theme.fontSizes.lg};
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  transition: all 0.3s ease;
  cursor: pointer;
  margin-top: ${theme.spacing.md};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 119, 182, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.sm} ${theme.spacing.lg};
    font-size: ${theme.fontSizes.md};
  }
`;

const ErrorMessage = styled.div`
  background-color: ${theme.colors.error};
  color: ${theme.colors.white};
  padding: ${theme.spacing.md};
  border-radius: ${theme.spacing.sm};
  text-align: center;
  font-size: ${theme.fontSizes.sm};
  margin-top: ${theme.spacing.md};
  animation: shake 0.5s ease-in-out;

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }
`;

const LinksContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${theme.spacing.md};
  font-size: ${theme.fontSizes.sm};
`;

const Link = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.medicalBlue};
  cursor: pointer;
  font-weight: 500;
  transition: color 0.3s ease;

  &:hover {
    color: ${theme.colors.medicalBlueDark};
    text-decoration: underline;
  }
`;

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const login = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

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

            toast.success("Login successful!");

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
            setError("Invalid email or password. Please try again.");
            toast.error("Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <LoginContainer>
            <LoginCard>
                <LogoSection>
                    <LogoIcon />
                    <Title>MediFind</Title>
                    <Subtitle>Login to your account</Subtitle>
                </LogoSection>

                <Form onSubmit={login}>
                    <InputGroup>
                        <InputIcon>
                            <FaUser />
                        </InputIcon>
                        <Input
                            type="email"
                            placeholder="Enter Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </InputGroup>

                    <InputGroup>
                        <InputIcon>
                            <FaLock />
                        </InputIcon>
                        <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <TogglePassword
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </TogglePassword>
                    </InputGroup>

                    <LoginButton type="submit" disabled={loading}>
                        {loading ? "Logging in..." : (
                            <>
                                <FaSignInAlt />
                                Login
                            </>
                        )}
                    </LoginButton>

                    {error && <ErrorMessage>{error}</ErrorMessage>}

                    <LinksContainer>
                        <Link onClick={() => navigate("/forgot-password")}>
                            Forgot Password?
                        </Link>
                        <Link onClick={() => navigate("/register")}>
                            Don't have an account? Register
                        </Link>
                    </LinksContainer>
                </Form>
            </LoginCard>
        </LoginContainer>
    );
}

export default LoginPage;