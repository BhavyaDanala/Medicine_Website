import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import { FaHeartbeat, FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowLeft, FaUserPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import { theme } from "../styles/theme";

const RegisterContainer = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, ${theme.colors.medicalBlue} 0%, ${theme.colors.medicalBlueDark} 100%);
  padding: ${theme.spacing.md};
`;

const RegisterCard = styled.div`
  background: ${theme.colors.white};
  border-radius: ${theme.spacing.xl};
  padding: ${theme.spacing.xxl};
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 500px;
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

const Select = styled.select`
  width: 100%;
  padding: ${theme.spacing.md} ${theme.spacing.md} ${theme.spacing.md} ${theme.spacing.xxl};
  border: 2px solid ${theme.colors.mediumGray};
  border-radius: ${theme.spacing.md};
  font-size: ${theme.fontSizes.md};
  transition: all 0.3s ease;
  background-color: ${theme.colors.white};

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

const RegisterButton = styled.button`
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

function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("Customer");
  const [pharmacyName, setPharmacyName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

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
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (role === "Pharmacy") {
      if (!pharmacyName.trim()) {
        newErrors.pharmacyName = "Pharmacy name is required";
      }
      if (!phoneNumber) {
        newErrors.phoneNumber = "Phone number is required";
      } else if (!validatePhoneNumber(phoneNumber)) {
        newErrors.phoneNumber = "Phone number must contain exactly 10 digits";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const register = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "https://localhost:7240/api/Auth/register",
        {
          Name: fullName,
          Email: email,
          Password: password,
          Role: role,
        }
      );

      toast.success("Registration successful! Please login.");
      navigate("/");

    } catch (error) {
      console.error(error);
      if (error.response && error.response.data) {
        toast.error(error.response.data.message || "Registration failed. Please try again.");
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <RegisterContainer>
      <RegisterCard>
        <LogoSection>
          <LogoIcon />
          <Title>MediFind</Title>
          <Subtitle>Create your account</Subtitle>
        </LogoSection>

        <Form onSubmit={register}>
          <InputGroup>
            <Label>Full Name</Label>
            <InputIcon>
              <FaUser />
            </InputIcon>
            <Input
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              isValid={!errors.fullName}
            />
            {errors.fullName && <ErrorMessage>{errors.fullName}</ErrorMessage>}
          </InputGroup>

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
              isValid={!errors.email}
            />
            {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
          </InputGroup>

          <InputGroup>
            <Label>Password</Label>
            <InputIcon>
              <FaLock />
            </InputIcon>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isValid={!errors.password}
            />
            <TogglePassword
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </TogglePassword>
            {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
          </InputGroup>

          <InputGroup>
            <Label>Confirm Password</Label>
            <InputIcon>
              <FaLock />
            </InputIcon>
            <Input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              isValid={!errors.confirmPassword}
            />
            <TogglePassword
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </TogglePassword>
            {errors.confirmPassword && <ErrorMessage>{errors.confirmPassword}</ErrorMessage>}
          </InputGroup>

          <InputGroup>
            <Label>Role</Label>
            <Select
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="Customer">Customer</option>
              <option value="Pharmacy">Pharmacy</option>
            </Select>
          </InputGroup>

          {role === "Pharmacy" && (
            <>
              <InputGroup>
                <Label>Pharmacy Name</Label>
                <Input
                  type="text"
                  placeholder="Enter pharmacy name"
                  value={pharmacyName}
                  onChange={(e) => setPharmacyName(e.target.value)}
                  isValid={!errors.pharmacyName}
                />
                {errors.pharmacyName && <ErrorMessage>{errors.pharmacyName}</ErrorMessage>}
              </InputGroup>

              <InputGroup>
                <Label>Phone Number</Label>
                <Input
                  type="tel"
                  placeholder="Enter phone number"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  maxLength={10}
                  isValid={!errors.phoneNumber}
                />
                {errors.phoneNumber && <ErrorMessage>{errors.phoneNumber}</ErrorMessage>}
              </InputGroup>
            </>
          )}

          <RegisterButton type="submit" disabled={loading}>
            {loading ? "Registering..." : (
              <>
                <FaUserPlus />
                Register
              </>
            )}
          </RegisterButton>

          <BackLink type="button" onClick={() => navigate("/")}>
            <FaArrowLeft />
            Back to Login
          </BackLink>
        </Form>
      </RegisterCard>
    </RegisterContainer>
  );
}

export default RegisterPage;
