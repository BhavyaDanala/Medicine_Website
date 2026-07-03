import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled, { keyframes } from "styled-components";
import { FaHeartbeat, FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowLeft, FaUserPlus, FaPills, FaStethoscope, FaClinicMedical, FaBuilding, FaMapMarkerAlt, FaPhone, FaShieldAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { theme } from "../styles/theme";
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
  min-height: 100vh;
  width: 100vw;
  display: flex;
  background: #f8faff;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
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
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 50vw;
  overflow: hidden;
  animation: slideInLeft 0.5s ease-out;

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
  margin-left: 50vw;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: #ffffff;
  animation: slideInRight 0.5s ease-out;
  min-height: 100vh;

  @media (max-width: 900px) {
    margin-left: 0;
    width: 100vw;
    background: #f8faff;
  }
`;

const FormCard = styled.div`
  width: 100%;
  max-width: 480px;
  animation: fadeIn 0.5s ease-out 0.1s both;
  padding-bottom: 40px;
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

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const InputLabel = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: #334155;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  font-size: 14px;
  pointer-events: none;
  transition: color 0.2s;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const TogglePassword = styled.button`
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

  ${({ $hasError }) => $hasError && `
    border-color: #ef4444;
    &:focus {
      border-color: #ef4444;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
  `}
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  background: #ffffff;
  color: #0f172a;
  transition: all 0.2s;
  outline: none;
  box-sizing: border-box;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 12px;
  font-weight: 500;
  margin-top: -4px;
`;

const PasswordRequirementsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 8px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
`;

const RequirementItem = styled.div`
  font-size: 13px;
  color: ${props => props.$met ? '#10b981' : '#64748b'};
  display: flex;
  align-items: center;
  gap: 6px;
  
  &::before {
    content: '${props => props.$met ? '✓' : '○'}';
    font-weight: bold;
  }
`;

const StrengthBarContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 12px;
  margin-bottom: 4px;
`;

const StrengthBarBackground = styled.div`
  flex: 1;
  height: 6px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
`;

const StrengthBarFill = styled.div`
  height: 100%;
  width: ${props => props.$percent}%;
  background: ${props => props.$color};
  transition: all 0.3s ease;
`;

const StrengthLabel = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${props => props.$color};
  min-width: 60px;
  text-align: right;
`;

const RegisterButton = styled.button`
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

const BackLink = styled.button`
  background: none;
  border: none;
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 12px;
  transition: color 0.2s;
  width: 100%;

  &:hover {
    color: #334155;
  }
`;

function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("Customer");
  const [pharmacyName, setPharmacyName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [openingTime, setOpeningTime] = useState("");
  const [closingTime, setClosingTime] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState("form");
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [pendingData, setPendingData] = useState(null);

  const navigate = useNavigate();

  const detectLocation = () => {
    if (!navigator.geolocation) { toast.error("Geolocation not supported"); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => { setLatitude(pos.coords.latitude.toString()); setLongitude(pos.coords.longitude.toString()); toast.success("Location detected!"); },
      () => toast.error("Could not detect location. Please enter manually.")
    );
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (value) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(value);
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setPhoneNumber(value);
  };

  const getPasswordRequirements = (pwd) => {
    return {
      length: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      special: /[^A-Za-z0-9]/.test(pwd)
    };
  };

  const getPasswordStrength = (reqs) => {
    const passedCount = Object.values(reqs).filter(Boolean).length;
    if (passedCount === 0) return { label: "", color: "transparent", percent: 0 };
    if (passedCount <= 2) return { label: "Weak", color: "#ef4444", percent: 33 };
    if (passedCount <= 4) return { label: "Medium", color: "#f59e0b", percent: 66 };
    return { label: "Strong", color: "#10b981", percent: 100 };
  };

  const validateForm = () => {
    const newErrors = {};

    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else {
      const reqs = getPasswordRequirements(password);
      if (!Object.values(reqs).every(Boolean)) {
        newErrors.password = "Password does not meet all requirements";
      }
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (role === "Pharmacy") {
      if (!pharmacyName.trim()) newErrors.pharmacyName = "Pharmacy name is required";
      if (!phoneNumber) {
        newErrors.phoneNumber = "Phone number is required";
      } else if (!validatePhoneNumber(phoneNumber)) {
        newErrors.phoneNumber = "Phone number must contain exactly 10 digits";
      }
      if (!address.trim()) newErrors.address = "Address is required";
      if (!latitude) {
        newErrors.latitude = "Latitude is required";
      } else if (isNaN(parseFloat(latitude))) {
        newErrors.latitude = "Enter a valid number";
      }
      if (!longitude) {
        newErrors.longitude = "Longitude is required";
      } else if (isNaN(parseFloat(longitude))) {
        newErrors.longitude = "Enter a valid number";
      }
      if (!openingTime.trim()) newErrors.openingTime = "Opening time is required";
      if (!closingTime.trim()) newErrors.closingTime = "Closing time is required";
      if (openingTime && closingTime && closingTime <= openingTime) {
        newErrors.closingTime = "Closing time must be after opening time";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const register = async (e) => {
    if (e) e.preventDefault();
    setErrors({});

    if (!validateForm()) return;

    setLoading(true);
    try {
      await axios.post("https://localhost:7240/api/Auth/send-otp", {
        Email: email,
        Purpose: "Register"
      });
      setPendingData({ fullName, email, password, role, pharmacyName, phoneNumber, address, latitude, longitude, openingTime, closingTime });
      setStep("otp");
      toast.success(`OTP sent to ${email}. Check your inbox.`);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const verifyAndRegister = async (e) => {
    e.preventDefault();
    if (!otp.trim()) { toast.error("Please enter the OTP"); return; }

    setOtpLoading(true);
    try {
      await axios.post("https://localhost:7240/api/Auth/verify-otp", {
        Email: pendingData.email,
        OtpCode: otp,
        Purpose: "Register"
      });

      await axios.post("https://localhost:7240/api/Auth/register", {
        Name: pendingData.fullName,
        Email: pendingData.email,
        Password: pendingData.password,
        Role: pendingData.role,
        PharmacyName: pendingData.pharmacyName || null,
        PhoneNumber: pendingData.phoneNumber || null,
        Address: pendingData.address || null,
        Latitude: pendingData.latitude ? parseFloat(pendingData.latitude) : null,
        Longitude: pendingData.longitude ? parseFloat(pendingData.longitude) : null,
        OpeningTime: pendingData.openingTime || null,
        ClosingTime: pendingData.closingTime || null,
      });

      if (pendingData.role === "Pharmacy") {
        setStep("pendingApproval");
      } else {
        toast.success("Registration successful! Please login.");
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "OTP verification failed. Please try again.");
    } finally {
      setOtpLoading(false);
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
          <PanelHeading>Join MediFind</PanelHeading>
          <PanelTagline>
            Create your account and start finding medicines and nearby pharmacies with ease.
          </PanelTagline>
        </WelcomeSection>
      </LeftPanel>

      <RightPanel>
        <FormCard>
          <FormHeader>
            <FormTitle>Create Account</FormTitle>
            <FormSubtitle>Join our healthcare community today</FormSubtitle>
          </FormHeader>

          {step === "form" ? (
            <Form onSubmit={register}>
              <InputGroup>
                <InputLabel>Full Name</InputLabel>
                <InputWrapper>
                  <InputIcon><FaUser /></InputIcon>
                  <Input type="text" placeholder="Enter your full name" value={fullName} onChange={(e) => setFullName(e.target.value)} $hasError={!!errors.fullName} />
                </InputWrapper>
                {errors.fullName && <ErrorMessage>{errors.fullName}</ErrorMessage>}
              </InputGroup>

              <InputGroup>
                <InputLabel>Email Address</InputLabel>
                <InputWrapper>
                  <InputIcon><FaEnvelope /></InputIcon>
                  <Input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} $hasError={!!errors.email} />
                </InputWrapper>
                {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
              </InputGroup>

              <InputGroup>
                <InputLabel>Password</InputLabel>
                <InputWrapper>
                  <InputIcon><FaLock /></InputIcon>
                  <Input type={showPassword ? "text" : "password"} placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} $hasError={!!errors.password} />
                  <TogglePassword type="button" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </TogglePassword>
                </InputWrapper>
                {password && (() => {
                  const reqs = getPasswordRequirements(password);
                  const strength = getPasswordStrength(reqs);
                  return (
                    <>
                      <StrengthBarContainer>
                        <StrengthBarBackground>
                          <StrengthBarFill $percent={strength.percent} $color={strength.color} />
                        </StrengthBarBackground>
                        <StrengthLabel $color={strength.color}>{strength.label}</StrengthLabel>
                      </StrengthBarContainer>
                      <PasswordRequirementsContainer>
                        <RequirementItem $met={reqs.length}>At least 8 characters</RequirementItem>
                        <RequirementItem $met={reqs.uppercase}>One uppercase letter (A-Z)</RequirementItem>
                        <RequirementItem $met={reqs.lowercase}>One lowercase letter (a-z)</RequirementItem>
                        <RequirementItem $met={reqs.number}>One number (0-9)</RequirementItem>
                        <RequirementItem $met={reqs.special}>One special character (!@#$%^&*)</RequirementItem>
                      </PasswordRequirementsContainer>
                    </>
                  );
                })()}
                {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
              </InputGroup>

              <InputGroup>
                <InputLabel>Confirm Password</InputLabel>
                <InputWrapper>
                  <InputIcon><FaLock /></InputIcon>
                  <Input type={showConfirmPassword ? "text" : "password"} placeholder="Confirm your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} $hasError={!!errors.confirmPassword} />
                  <TogglePassword type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </TogglePassword>
                </InputWrapper>
                {errors.confirmPassword && <ErrorMessage>{errors.confirmPassword}</ErrorMessage>}
              </InputGroup>

              <InputGroup>
                <InputLabel>Role</InputLabel>
                <Select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="Customer">Customer</option>
                  <option value="Pharmacy">Pharmacy</option>
                </Select>
              </InputGroup>

              {role === "Pharmacy" && (
                <>
                  <InputGroup>
                    <InputLabel>Pharmacy Name</InputLabel>
                    <InputWrapper>
                      <InputIcon><FaBuilding /></InputIcon>
                      <Input type="text" placeholder="Enter pharmacy name" value={pharmacyName} onChange={(e) => setPharmacyName(e.target.value)} $hasError={!!errors.pharmacyName} />
                    </InputWrapper>
                    {errors.pharmacyName && <ErrorMessage>{errors.pharmacyName}</ErrorMessage>}
                  </InputGroup>

                  <InputGroup>
                    <InputLabel>Phone Number</InputLabel>
                    <InputWrapper>
                      <InputIcon><FaPhone /></InputIcon>
                      <Input type="tel" placeholder="Enter 10-digit phone number" value={phoneNumber} onChange={handlePhoneChange} maxLength={10} $hasError={!!errors.phoneNumber} />
                    </InputWrapper>
                    {errors.phoneNumber && <ErrorMessage>{errors.phoneNumber}</ErrorMessage>}
                  </InputGroup>

                  <InputGroup>
                    <InputLabel>Address</InputLabel>
                    <InputWrapper>
                      <InputIcon><FaMapMarkerAlt /></InputIcon>
                      <Input type="text" placeholder="Enter full address" value={address} onChange={(e) => setAddress(e.target.value)} $hasError={!!errors.address} />
                    </InputWrapper>
                    {errors.address && <ErrorMessage>{errors.address}</ErrorMessage>}
                  </InputGroup>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <InputGroup>
                      <InputLabel>Latitude</InputLabel>
                      <Input type="number" step="any" placeholder="e.g. 17.3850" value={latitude} onChange={(e) => setLatitude(e.target.value)} $hasError={!!errors.latitude} style={{ paddingLeft: "14px" }} />
                      {errors.latitude && <ErrorMessage>{errors.latitude}</ErrorMessage>}
                    </InputGroup>
                    <InputGroup>
                      <InputLabel>Longitude</InputLabel>
                      <Input type="number" step="any" placeholder="e.g. 78.4867" value={longitude} onChange={(e) => setLongitude(e.target.value)} $hasError={!!errors.longitude} style={{ paddingLeft: "14px" }} />
                      {errors.longitude && <ErrorMessage>{errors.longitude}</ErrorMessage>}
                    </InputGroup>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <InputGroup>
                      <InputLabel>Opening Time</InputLabel>
                      <Input type="time" value={openingTime} onChange={(e) => setOpeningTime(e.target.value)} $hasError={!!errors.openingTime} style={{ paddingLeft: "14px" }} />
                      {errors.openingTime && <ErrorMessage>{errors.openingTime}</ErrorMessage>}
                    </InputGroup>
                    <InputGroup>
                      <InputLabel>Closing Time</InputLabel>
                      <Input type="time" value={closingTime} onChange={(e) => setClosingTime(e.target.value)} $hasError={!!errors.closingTime} style={{ paddingLeft: "14px" }} />
                      {errors.closingTime && <ErrorMessage>{errors.closingTime}</ErrorMessage>}
                    </InputGroup>
                  </div>

                  <RegisterButton type="button" onClick={detectLocation} style={{ background: "#10b981", marginTop: "0" }}>
                    <FaMapMarkerAlt /> Auto-Detect My Location
                  </RegisterButton>
                </>
              )}

              <RegisterButton type="submit" disabled={loading}>
                {loading ? "Sending OTP..." : (<><FaEnvelope /> Send OTP to Verify Email</>)}
              </RegisterButton>

              <BackLink type="button" onClick={() => navigate("/")}>
                <FaArrowLeft /> Back to Login
              </BackLink>
            </Form>
          ) : (
            <Form onSubmit={verifyAndRegister}>
              <div style={{ textAlign: "center", marginBottom: "8px" }}>
                <div style={{ fontSize: "48px", marginBottom: "8px" }}>📧</div>
                <p style={{ color: "#334155", fontWeight: "600", fontSize: "15px", marginBottom: "4px" }}>Verify your email</p>
                <p style={{ color: "#64748b", fontSize: "13px" }}>We sent a 6-digit OTP to <strong>{pendingData?.email}</strong>.<br />It expires in <strong>10 minutes</strong>.</p>
              </div>

              <InputGroup>
                <InputLabel>Enter OTP</InputLabel>
                <InputWrapper>
                  <InputIcon><FaShieldAlt /></InputIcon>
                  <Input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
                    maxLength={6}
                    style={{ letterSpacing: "8px", fontSize: "20px", textAlign: "center", paddingLeft: "40px", fontWeight: "600" }}
                  />
                </InputWrapper>
              </InputGroup>

              <RegisterButton type="submit" disabled={otpLoading}>
                {otpLoading ? "Verifying..." : (<><FaUserPlus /> Verify & Complete Registration</>)}
              </RegisterButton>

              <RegisterButton type="button" disabled={loading} onClick={(e) => register(e)} style={{ background: "#94a3b8", marginTop: "0" }}>
                {loading ? "Resending..." : "Resend OTP"}
              </RegisterButton>

              <BackLink type="button" onClick={() => setStep("form")}>
                <FaArrowLeft /> Back to Form
              </BackLink>
            </Form>
          )}

          {step === "pendingApproval" && (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <div style={{ fontSize: "48px", color: "#f59e0b", marginBottom: "20px" }}>
                <FaShieldAlt />
              </div>
              <h2 style={{ fontSize: "24px", color: "#0f172a", marginBottom: "16px", fontWeight: "700" }}>Registration Successful</h2>
              <p style={{ color: "#475569", fontSize: "15px", lineHeight: "1.6", marginBottom: "30px" }}>
                Your pharmacy registration request has been submitted successfully.<br/><br/>
                Your account is currently <strong>pending admin approval</strong>.<br/><br/>
                You will receive an email notification once your pharmacy is approved.
              </p>
              <RegisterButton type="button" onClick={() => navigate("/")} style={{ width: "auto", padding: "12px 30px" }}>
                Return to Login
              </RegisterButton>
            </div>
          )}
        </FormCard>
      </RightPanel>
    </PageWrapper>
  );
}

export default RegisterPage;
