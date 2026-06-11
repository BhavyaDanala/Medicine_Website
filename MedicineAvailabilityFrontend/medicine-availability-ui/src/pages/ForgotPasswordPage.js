import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import { FaHeartbeat, FaEnvelope, FaArrowLeft, FaPaperPlane } from "react-icons/fa";
import { toast } from "react-toastify";
import { theme } from "../styles/theme";

const ForgotPasswordContainer = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, ${theme.colors.medicalBlue} 0%, ${theme.colors.medicalBlueDark} 100%);
  padding: ${theme.spacing.md};
`;

const ForgotPasswordCard = styled.div`
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
  font-size: ${theme.fontSizes.md};
  color: ${theme.colors.darkGray};
  text-align: center;
  margin-bottom: ${theme.spacing.xl};
  font-weight: 500;

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

  ${({ isValid }) => !isValid && `
    border-color: ${theme.colors.error} !important;

    &:focus {
      border-color: ${theme.colors.error} !important;
      box-shadow: 0 0 0 3px rgba(244, 67, 54, 0.1) !important;
    }
  `}

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.sm} ${theme.spacing.sm} ${theme.spacing.sm} ${theme.spacing.lg};
    font-size: ${theme.fontSizes.sm};
  }
`;

const Label = styled.label`
  font-size: ${theme.fontSizes.sm};
  font-weight: 500;
  color: ${theme.colors.darkGray};
  margin-bottom: ${theme.spacing.xs};
  display: block;
`;

const ErrorMessage = styled.div`
  color: ${theme.colors.error};
  font-size: ${theme.fontSizes.sm};
  margin-top: ${theme.spacing.xs};
`;

const SuccessMessage = styled.div`
  background-color: ${theme.colors.mintGreen};
  color: ${theme.colors.white};
  padding: ${theme.spacing.md};
  border-radius: ${theme.spacing.sm};
  text-align: center;
  font-size: ${theme.fontSizes.sm};
  margin-top: ${theme.spacing.md};
`;

const SubmitButton = styled.button`
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

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.sm} ${theme.spacing.lg};
    font-size: ${theme.fontSizes.md};
  }
`;

const BackLink = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.medicalBlue};
  font-size: ${theme.fontSizes.md};
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  margin-top: ${theme.spacing.lg};
  transition: color 0.3s ease;

  &:hover {
    color: ${theme.colors.medicalBlueDark};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.fontSizes.sm};
  }
`;

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Invalid email format");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "https://localhost:7240/api/Auth/forgot-password",
        { Email: email }
      );

      setSuccess(true);
      toast.success("Password reset link sent to your email");

    } catch (error) {
      console.error(error);
      if (error.response && error.response.data) {
        setError(error.response.data.message || "Failed to send reset link. Please try again.");
      } else {
        setError("Failed to send reset link. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ForgotPasswordContainer>
      <ForgotPasswordCard>
        <LogoSection>
          <LogoIcon />
          <Title>MediFind</Title>
          <Subtitle>Reset your password</Subtitle>
        </LogoSection>

        {!success ? (
          <Form onSubmit={handleSubmit}>
            <InputGroup>
              <Label>Email</Label>
              <InputIcon>
                <FaEnvelope />
              </InputIcon>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                isValid={!error}
              />
              {error && <ErrorMessage>{error}</ErrorMessage>}
            </InputGroup>

            <SubmitButton type="submit" disabled={loading}>
              {loading ? "Sending..." : (
                <>
                  <FaPaperPlane />
                  Send Reset Request
                </>
              )}
            </SubmitButton>

            <BackLink type="button" onClick={() => navigate("/")}>
              <FaArrowLeft />
              Back to Login
            </BackLink>
          </Form>
        ) : (
          <>
            <SuccessMessage>
              Password reset link has been sent to your email. Please check your inbox.
            </SuccessMessage>
            <BackLink type="button" onClick={() => navigate("/")}>
              <FaArrowLeft />
              Back to Login
            </BackLink>
          </>
        )}
      </ForgotPasswordCard>
    </ForgotPasswordContainer>
  );
}

export default ForgotPasswordPage;
