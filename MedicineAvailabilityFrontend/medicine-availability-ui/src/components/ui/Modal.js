import styled from 'styled-components';
import { FaTimes } from 'react-icons/fa';
import { theme } from '../../styles/theme';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease-in;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ModalContent = styled.div`
  background-color: ${theme.colors.white};
  border-radius: ${theme.spacing.lg};
  padding: ${theme.spacing.xl};
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from {
      transform: translateY(-20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.lg};
    max-width: 95%;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.lg};
`;

const ModalTitle = styled.h3`
  font-size: ${theme.fontSizes.xl};
  color: ${theme.colors.medicalBlue};
  font-weight: 600;
  margin: 0;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.fontSizes.lg};
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.darkGray};
  cursor: pointer;
  padding: ${theme.spacing.xs};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s ease;

  &:hover {
    color: ${theme.colors.error};
  }
`;

const CloseIcon = styled(FaTimes)`
  font-size: ${theme.fontSizes.lg};
`;

function Modal({ title, onClose, children }) {
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          <CloseButton onClick={onClose}>
            <CloseIcon />
          </CloseButton>
        </ModalHeader>
        {children}
      </ModalContent>
    </ModalOverlay>
  );
}

export default Modal;
