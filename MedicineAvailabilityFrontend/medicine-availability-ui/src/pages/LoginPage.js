import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import styled, { keyframes } from "styled-components";
import { FaHeartbeat, FaEnvelope, FaLock, FaSignInAlt, FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import loginIllustration from "../assets/login-illustration.png";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideInLeft = keyframes`
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
`;

const slideInRight = keyframes`
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
`;

const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0px); }
`;

const PageWrapper = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  background: #f8faff;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  overflow: hidden;
`;

/* ── LEFT PANEL ── */
const LeftPanel = styled.div`
  flex: 1;
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 60px 40px;
  position: relative;
  overflow: hidden;
  animation: ${slideInLeft} 0.5s ease-out;

  @media (max-width: 900px) {
    display: none;
  }

  &::before {
    content: '';
    position: absolute;
    top: -100px;
    right: -100px;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
    border-radius: 50%;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -100px;
    left: -100px;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%);
    border-radius: 50%;
  }
`;

const BrandRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  align-self: flex-start;
  z-index: 2;
`;

const BrandIcon = styled(FaHeartbeat)`
  font-size: 32px;
  color: #bfdbfe;
`;

const BrandName = styled.span`
  font-size: 24px;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.5px;
`;

const IllustrationWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1;
  width: 100%;
`;

const IllustrationImg = styled.img`
  width: 100%;
  max-width: 240px;
  border-radius: 16px;
  object-fit: cover;
  box-shadow: 0 20px 40px rgba(0,0,0,0.15);
  opacity: 0.9;
  animation: ${floatAnimation} 6s ease-in-out infinite;
`;

const WelcomeSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
  margin-top: 20px;
`;

const PanelHeading = styled.h1`
  font-size: 42px;
  font-weight: 800;
  color: #ffffff;
  text-align: center;
  line-height: 1.2;
  margin-bottom: 20px;
  letter-spacing: -1px;
  text-shadow: 0 4px 12px rgba(0,0,0,0.1);
`;

const PanelTagline = styled.p`
  font-size: 15px;
  color: rgba(255,255,255,0.9);
  text-align: center;
  line-height: 1.8;
  max-width: 340px;
  margin: 0 auto;
`;

/* ── RIGHT PANEL ── */
const RightPanel = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: #ffffff;
  animation: ${slideInRight} 0.5s ease-out;

  @media (max-width: 900px) {
    background: #f8faff;
  }
`;

const FormCard = styled.div`
  width: 100%;
  max-width: 400px;
  animation: ${fadeIn} 0.5s ease-out 0.1s both;
`;

const FormHeader = styled.div`
  margin-bottom: 32px;
  text-align: left;
`;

const FormTitle = styled.h2`
  font-size: 28px;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 8px;
  letter-spacing: -0.5px;
`;

const FormSubtitle = styled.p`
  font-size: 14px;
  color: #64748b;
  line-height: 1.5;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: #334155;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 14px;
  color: #94a3b8;
  font-size: 14px;
  pointer-events: none;
  transition: color 0.2s;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 14px 12px 40px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  background: #ffffff;
  color: #0f172a;
  transition: all 0.2s;
  outline: none;
  box-sizing: border-box;

  &::placeholder {
    color: #94a3b8;
  }

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &:focus + ${InputIcon},
  &:focus ~ ${InputIcon} {
    color: #3b82f6;
  }
`;

const EyeButton = styled.button`
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  font-size: 16px;
  padding: 4px;
  display: flex;
  align-items: center;

  &:hover { color: #3b82f6; }
`;

const ForgotLink = styled.button`
  background: none;
  border: none;
  color: #3b82f6;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  text-align: right;
  padding: 0;
  margin-top: -8px;
  align-self: flex-end;

  &:hover { color: #2563eb; text-decoration: underline; }
`;

const LoginBtn = styled.button`
  width: 100%;
  padding: 12px;
  background: #3b82f6;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;
  box-shadow: 0 2px 10px rgba(59, 130, 246, 0.2);
  margin-top: 8px;

  &:hover:not(:disabled) {
    background: #2563eb;
    box-shadow: 0 4px 14px rgba(37, 99, 235, 0.3);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 16px 0;

  &::before, &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #e2e8f0;
  }

  span {
    font-size: 12px;
    color: #64748b;
  }
`;

const RegisterRow = styled.div`
  text-align: center;
  font-size: 14px;
  color: #475569;

  button {
    background: none;
    border: none;
    color: #3b82f6;
    font-weight: 600;
    cursor: pointer;
    font-size: 14px;
    font-family: inherit;

    &:hover { color: #2563eb; text-decoration: underline; }
  }
`;

const ErrorBox = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
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
            const response = await axios.post("https://localhost:7240/api/Auth/login", { email, password });
            const token = response.data.token;
            localStorage.setItem("token", token);
            const decodedToken = jwtDecode(token);
            const role = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
            toast.success("Welcome back!");
            if (role === "Admin") navigate("/admin-dashboard");
            else if (role === "Pharmacy") navigate("/pharmacy-dashboard");
            else navigate("/customer-dashboard");
        } catch (error) {
            setError(error.response?.data?.message || "Invalid email or password. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageWrapper>
      <LeftPanel>
        <BrandRow>
          <BrandIcon />
          <BrandName>MediFind</BrandName>
        </BrandRow>
        
        <IllustrationWrapper>
          <IllustrationImg src={loginIllustration} alt="MediFind App" />
        </IllustrationWrapper>

        <WelcomeSection>
          <PanelHeading>Welcome to MediFind</PanelHeading>
          <PanelTagline>
            Find medicines, compare pharmacies, and locate healthcare resources with ease.
          </PanelTagline>
        </WelcomeSection>
      </LeftPanel>

            <RightPanel>
                <FormCard>
                    <FormHeader>
                        <FormTitle>Sign In</FormTitle>
                        <FormSubtitle>Enter your details to access your dashboard</FormSubtitle>
                    </FormHeader>

                    <Form onSubmit={login}>
                        <FieldGroup>
                            <Label htmlFor="email">Email</Label>
                            <InputWrapper>
                                <InputIcon><FaEnvelope /></InputIcon>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </InputWrapper>
                        </FieldGroup>

                        <FieldGroup>
                            <Label htmlFor="password">Password</Label>
                            <InputWrapper>
                                <InputIcon><FaLock /></InputIcon>
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <EyeButton type="button" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </EyeButton>
                            </InputWrapper>
                        </FieldGroup>

                        <ForgotLink type="button" onClick={() => navigate("/forgot-password")}>
                            Forgot password?
                        </ForgotLink>

                        {error && <ErrorBox>⚠ {error}</ErrorBox>}

                        <LoginBtn type="submit" disabled={loading}>
                            {loading ? "Signing in..." : <><FaSignInAlt /> Sign In</>}
                        </LoginBtn>

                        <Divider><span>or</span></Divider>

                        <RegisterRow>
                            Don't have an account?{" "}
                            <button type="button" onClick={() => navigate("/register")}>
                                Create account
                            </button>
                        </RegisterRow>
                    </Form>
                </FormCard>
            </RightPanel>
        </PageWrapper>
    );
}

export default LoginPage;