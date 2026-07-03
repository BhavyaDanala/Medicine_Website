import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FaLock, FaCheckCircle } from 'react-icons/fa';
import Layout from '../components/layout/Layout';

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 200px);
  padding: ${theme.spacing.xl} 0;
`;

const FormContainer = styled.div`
  background-color: ${theme.colors.white};
  border-radius: ${theme.borderRadius.xl};
  box-shadow: ${theme.shadows.lg};
  width: 100%;
  max-width: 450px;
  overflow: hidden;
`;

const FormHeader = styled.div`
  background: linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%);
  padding: ${theme.spacing.xl};
  text-align: center;
  color: ${theme.colors.white};
`;

const FormTitle = styled.h2`
  margin: 0 0 ${theme.spacing.sm} 0;
  font-size: ${theme.fontSizes.xxl};
  font-weight: ${theme.fontWeights.bold};
`;

const FormSubtitle = styled.p`
  margin: 0;
  font-size: ${theme.fontSizes.md};
  opacity: 0.9;
`;

const FormBody = styled.div`
  padding: ${theme.spacing.xl};
`;

const FormGroup = styled.div`
  margin-bottom: ${theme.spacing.lg};
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${theme.spacing.sm};
  color: ${theme.colors.darkGray};
  font-weight: ${theme.fontWeights.semibold};
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const InputIcon = styled.div`
  position: absolute;
  left: ${theme.spacing.md};
  color: ${theme.colors.mediumGray};
  display: flex;
`;

const Input = styled.input`
  width: 100%;
  padding: ${theme.spacing.md} ${theme.spacing.md} ${theme.spacing.md} 40px;
  border: 1px solid ${theme.colors.lightGray};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSizes.md};
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: ${theme.spacing.md};
  background: linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%);
  color: ${theme.colors.white};
  border: none;
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSizes.md};
  font-weight: ${theme.fontWeights.bold};
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: ${theme.spacing.lg};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
  }

  &:disabled {
    background: ${theme.colors.mediumGray};
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const PasswordRequirements = styled.div`
  margin-top: ${theme.spacing.md};
  padding: ${theme.spacing.md};
  background-color: ${theme.colors.background};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSizes.sm};
`;

const Requirement = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  color: ${props => props.met ? theme.colors.success : theme.colors.mediumGray};
  margin-bottom: ${theme.spacing.xs};
  transition: color 0.3s ease;

  svg {
    opacity: ${props => props.met ? 1 : 0.5};
  }
`;

function CreatePasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');

  const requirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password)
  };

  const isPasswordValid = Object.values(requirements).every(Boolean);
  const doPasswordsMatch = password && confirmPassword && password === confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error('Activation token is missing. Please use the link from your email.');
      return;
    }

    if (!isPasswordValid) {
      toast.error('Please meet all password requirements.');
      return;
    }

    if (!doPasswordsMatch) {
      toast.error('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      await axios.post('https://localhost:7240/api/Auth/activate-pharmacy', {
        token,
        password
      });

      toast.success('Account Activated Successfully');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data || 'Failed to activate account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <PageContainer>
        <FormContainer>
          <FormHeader>
            <FormTitle>Complete Setup</FormTitle>
            <FormSubtitle>Create your password to activate your pharmacy account</FormSubtitle>
          </FormHeader>

          <FormBody>
            <form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>New Password</Label>
                <InputWrapper>
                  <InputIcon><FaLock /></InputIcon>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                  />
                </InputWrapper>
              </FormGroup>

              <FormGroup>
                <Label>Confirm Password</Label>
                <InputWrapper>
                  <InputIcon><FaLock /></InputIcon>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                  />
                </InputWrapper>
              </FormGroup>

              <PasswordRequirements>
                <Requirement met={requirements.length}><FaCheckCircle /> Minimum 8 characters</Requirement>
                <Requirement met={requirements.uppercase}><FaCheckCircle /> One uppercase letter</Requirement>
                <Requirement met={requirements.lowercase}><FaCheckCircle /> One lowercase letter</Requirement>
                <Requirement met={requirements.number}><FaCheckCircle /> One number</Requirement>
                <Requirement met={requirements.special}><FaCheckCircle /> One special character</Requirement>
              </PasswordRequirements>

              <SubmitButton type="submit" disabled={loading || !isPasswordValid || !doPasswordsMatch}>
                {loading ? 'Activating...' : 'Activate Account'}
              </SubmitButton>
            </form>
          </FormBody>
        </FormContainer>
      </PageContainer>
    </Layout>
  );
}

export default CreatePasswordPage;
