import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import { FaHeartbeat, FaEnvelope, FaArrowLeft, FaPaperPlane, FaKey, FaCheckCircle, FaShieldAlt, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { theme } from "../styles/theme";

const ForgotPasswordContainer = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, ${theme.colors.secondary} 0%, ${theme.colors.primaryDark} 100%);
  padding: ${theme.spacing.lg};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
    animation: float 20s ease-in-out infinite;
  }

  @keyframes float {
    0%, 100% { transform: translate(0, 0) rotate(0deg); }
    50% { transform: translate(50px, 50px) rotate(180deg); }
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing.md};
  }
`;

const ForgotPasswordCard = styled.div`
  background: ${theme.colors.white};
  border-radius: ${theme.borderRadius.xxl};
  box-shadow: ${theme.shadows.xxl};
  width: 100%;
  max-width: 900px;
  display: flex;
  overflow: hidden;
  position: relative;
  z-index: 1;
  animation: slideUp 0.6s ease-out;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    flex-direction: column;
    max-width: 500px;
  }
`;

const IllustrationSide = styled.div`
  flex: 1;
  background: linear-gradient(135deg, ${theme.colors.info} 0%, ${theme.colors.primary} 100%);
  padding: ${theme.spacing.xxxl};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: ${theme.colors.white};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    display: none;
  }
`;

const IllustrationIcon = styled.div`
  font-size: 120px;
  margin-bottom: ${theme.spacing.xl};
  color: ${theme.colors.white};
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
  animation: pulse 3s ease-in-out infinite;

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
`;

const IllustrationTitle = styled.h2`
  font-size: ${theme.fontSizes.xxxl};
  font-weight: ${theme.fontWeights.extrabold};
  margin-bottom: ${theme.spacing.md};
  text-align: center;
`;

const IllustrationText = styled.p`
  font-size: ${theme.fontSizes.lg};
  text-align: center;
  opacity: 0.9;
  line-height: 1.6;
  max-width: 300px;
`;

const FormSide = styled.div`
  flex: 1;
  padding: ${theme.spacing.xxxl};
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing.xl};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.lg};
  }
`;

const LogoSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: ${theme.spacing.xl};
`;

const LogoIcon = styled(FaHeartbeat)`
  font-size: 56px;
  color: ${theme.colors.info};
  margin-bottom: ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 48px;
  }
`;

const Title = styled.h1`
  font-size: ${theme.fontSizes.xxxl};
  color: ${theme.colors.darkerGray};
  text-align: center;
  margin-bottom: ${theme.spacing.xs};
  font-weight: ${theme.fontWeights.extrabold};

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.fontSizes.xxl};
  }
`;

const Subtitle = styled.h2`
  font-size: ${theme.fontSizes.md};
  color: ${theme.colors.darkGray};
  text-align: center;
  margin-bottom: ${theme.spacing.xl};
  font-weight: ${theme.fontWeights.normal};

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.fontSizes.sm};
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

const InputLabel = styled.label`
  display: block;
  margin-bottom: ${theme.spacing.sm};
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.darkerGray};
`;

const InputIcon = styled.div`
  position: absolute;
  left: ${theme.spacing.lg};
  top: 50%;
  transform: translateY(-50%);
  color: ${theme.colors.darkGray};
  font-size: ${theme.fontSizes.md};
`;

const Input = styled.input`
  width: 100%;
  padding: ${theme.spacing.lg} ${theme.spacing.xl} ${theme.spacing.lg} ${theme.spacing.xxxl};
  border: 2px solid ${theme.colors.mediumGray};
  border-radius: ${theme.borderRadius.lg};
  font-size: ${theme.fontSizes.md};
  font-family: ${theme.fonts.primary};
  transition: all ${theme.transitions.normal};
  background: ${theme.colors.white};
  color: ${theme.colors.darkerGray};

  &::placeholder {
    color: ${theme.colors.darkGray};
  }

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 4px ${theme.colors.primaryLighter};
  }

  &:hover {
    border-color: ${theme.colors.darkGray};
  }

  ${({ hasError }) => hasError && `
    border-color: ${theme.colors.error} !important;

    &:focus {
      border-color: ${theme.colors.error} !important;
      box-shadow: 0 0 0 4px ${theme.colors.errorLight} !important;
    }
  `}

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.md} ${theme.spacing.lg} ${theme.spacing.md} ${theme.spacing.xxl};
    font-size: ${theme.fontSizes.sm};
  }
`;

const ErrorMessage = styled.div`
  color: ${theme.colors.error};
  font-size: ${theme.fontSizes.xs};
  margin-top: ${theme.spacing.xs};
  font-weight: ${theme.fontWeights.medium};
`;

const SuccessMessage = styled.div`
  background-color: ${theme.colors.successLight};
  color: ${theme.colors.success};
  padding: ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.lg};
  text-align: center;
  font-size: ${theme.fontSizes.md};
  margin-top: ${theme.spacing.md};
  border: 1px solid ${theme.colors.success};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  font-weight: ${theme.fontWeights.medium};
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, ${theme.colors.info} 0%, ${theme.colors.primary} 100%);
  color: ${theme.colors.white};
  border: none;
  padding: ${theme.spacing.lg} ${theme.spacing.xxl};
  border-radius: ${theme.borderRadius.lg};
  font-size: ${theme.fontSizes.lg};
  font-weight: ${theme.fontWeights.semibold};
  font-family: ${theme.fonts.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  transition: all ${theme.transitions.normal};
  cursor: pointer;
  margin-top: ${theme.spacing.md};
  box-shadow: ${theme.shadows.sm};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.md};
    background: linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.info} 100%);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.md} ${theme.spacing.xl};
    font-size: ${theme.fontSizes.md};
  }
`;

const BackLink = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.primary};
  font-size: ${theme.fontSizes.md};
  font-weight: ${theme.fontWeights.medium};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  margin-top: ${theme.spacing.lg};
  transition: color ${theme.transitions.normal};

  &:hover {
    color: ${theme.colors.primaryDark};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.fontSizes.sm};
  }
`;

function ForgotPasswordPage() {
  const [step, setStep] = useState("email"); // "email" | "otp" | "newpass"
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) { setError("Email is required"); return; }
    if (!validateEmail(email)) { setError("Invalid email format"); return; }

    setLoading(true);
    try {
      await axios.post("https://localhost:7240/api/Auth/forgot-password", { Email: email });
      setStep("otp");
      toast.success(`OTP sent to ${email}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    if (!otp.trim()) { setError("Please enter the OTP"); return; }

    setLoading(true);
    try {
      await axios.post("https://localhost:7240/api/Auth/verify-otp", {
        Email: email,
        OtpCode: otp,
        Purpose: "ForgotPassword"
      });
      setStep("newpass");
      toast.success("OTP verified! Set your new password.");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    if (!newPassword || newPassword.length < 6) { setError("Password must be at least 6 characters"); return; }
    if (newPassword !== confirmPassword) { setError("Passwords do not match"); return; }

    setLoading(true);
    try {
      await axios.post("https://localhost:7240/api/Auth/reset-password", {
        Email: email,
        NewPassword: newPassword,
        OtpCode: otp
      });
      toast.success("Password reset successfully! Please login.");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ForgotPasswordContainer>
      <ForgotPasswordCard>
        <IllustrationSide>
          <IllustrationIcon>
            <FaKey />
          </IllustrationIcon>
          <IllustrationTitle>
            {step === "email" ? "Forgot Password?" : step === "otp" ? "Verify OTP" : "New Password"}
          </IllustrationTitle>
          <IllustrationText>
            {step === "email"
              ? "Enter your registered email and we'll send you a 6-digit OTP to reset your password."
              : step === "otp"
              ? "Check your inbox for the 6-digit OTP we just sent you. It expires in 10 minutes."
              : "You're almost there! Set a strong new password for your account."}
          </IllustrationText>
        </IllustrationSide>

        <FormSide>
          <LogoSection>
            <LogoIcon />
            <Title>Reset Password</Title>
            <Subtitle>
              {step === "email" ? "Step 1 of 3 — Enter Email" : step === "otp" ? "Step 2 of 3 — Verify OTP" : "Step 3 of 3 — New Password"}
            </Subtitle>
          </LogoSection>

          {step === "email" && (
            <Form onSubmit={handleSendOtp}>
              <InputGroup>
                <InputLabel>Email Address</InputLabel>
                <InputIcon><FaEnvelope /></InputIcon>
                <Input type="email" placeholder="Enter your registered email" value={email} onChange={(e) => setEmail(e.target.value)} hasError={!!error} />
                {error && <ErrorMessage>{error}</ErrorMessage>}
              </InputGroup>

              <SubmitButton type="submit" disabled={loading}>
                {loading ? "Sending OTP..." : (<><FaPaperPlane /> Send OTP</>)}
              </SubmitButton>

              <BackLink type="button" onClick={() => navigate("/")}>
                <FaArrowLeft /> Back to Login
              </BackLink>
            </Form>
          )}

          {step === "otp" && (
            <Form onSubmit={handleVerifyOtp}>
              <div style={{ textAlign: "center", marginBottom: "8px" }}>
                <p style={{ color: "#666", fontSize: "13px" }}>OTP sent to <strong>{email}</strong></p>
              </div>
              <InputGroup>
                <InputLabel>Enter OTP</InputLabel>
                <InputIcon><FaShieldAlt /></InputIcon>
                <Input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
                  maxLength={6}
                  style={{ letterSpacing: "10px", fontSize: "24px", textAlign: "center" }}
                />
                {error && <ErrorMessage>{error}</ErrorMessage>}
              </InputGroup>

              <SubmitButton type="submit" disabled={loading}>
                {loading ? "Verifying..." : (<><FaShieldAlt /> Verify OTP</>)}
              </SubmitButton>

              <SubmitButton type="button" disabled={loading} onClick={handleSendOtp} style={{ background: "linear-gradient(135deg, #888, #555)", marginTop: "0" }}>
                {loading ? "Resending..." : "Resend OTP"}
              </SubmitButton>

              <BackLink type="button" onClick={() => setStep("email")}>
                <FaArrowLeft /> Back
              </BackLink>
            </Form>
          )}

          {step === "newpass" && (
            <Form onSubmit={handleResetPassword}>
              <SuccessMessage style={{ marginBottom: "16px" }}>
                <FaCheckCircle /> OTP verified successfully!
              </SuccessMessage>

              <InputGroup>
                <InputLabel>New Password</InputLabel>
                <InputIcon><FaLock /></InputIcon>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password (min 6 chars)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  hasError={!!error}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#888" }}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </InputGroup>

              <InputGroup>
                <InputLabel>Confirm New Password</InputLabel>
                <InputIcon><FaLock /></InputIcon>
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  hasError={!!error}
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#888" }}>
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                {error && <ErrorMessage>{error}</ErrorMessage>}
              </InputGroup>

              <SubmitButton type="submit" disabled={loading}>
                {loading ? "Resetting..." : (<><FaKey /> Reset Password</>)}
              </SubmitButton>

              <BackLink type="button" onClick={() => navigate("/")}>
                <FaArrowLeft /> Back to Login
              </BackLink>
            </Form>
          )}
        </FormSide>
      </ForgotPasswordCard>
    </ForgotPasswordContainer>
  );
}

export default ForgotPasswordPage;
