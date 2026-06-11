import styled, { keyframes } from 'styled-components';
import { theme } from '../../styles/theme';

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${theme.spacing.xxl};
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid ${theme.colors.mediumGray};
  border-top: 4px solid ${theme.colors.medicalBlue};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;

  @media (max-width: ${theme.breakpoints.mobile}) {
    width: 40px;
    height: 40px;
    border-width: 3px;
  }
`;

const LoadingText = styled.p`
  margin-left: ${theme.spacing.lg};
  font-size: ${theme.fontSizes.md};
  color: ${theme.colors.darkGray};
  font-weight: 500;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.fontSizes.sm};
  }
`;

function LoadingSpinner({ text = 'Loading...' }) {
  return (
    <SpinnerContainer>
      <Spinner />
      <LoadingText>{text}</LoadingText>
    </SpinnerContainer>
  );
}

export default LoadingSpinner;
