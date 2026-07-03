import styled from 'styled-components';
import { FaTimes } from 'react-icons/fa';
import { theme } from '../../styles/theme';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: ${theme.zIndex.modal};
  animation: fadeIn 0.2s ease-in;
  padding: ${theme.spacing.md};

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing.sm};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.xs};
  }
`;

const ModalContent = styled.div`
  background-color: ${theme.colors.white};
  border-radius: ${theme.borderRadius.xxl};
  padding: ${theme.spacing.xxxl};
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: ${theme.shadows.xxl};
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

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing.xxl};
    max-width: 95%;
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.xl};
    max-width: 100%;
    border-radius: ${theme.borderRadius.xl};
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.xl};
  padding-bottom: ${theme.spacing.md};
  border-bottom: 1px solid ${theme.colors.lightGray};

  @media (max-width: ${theme.breakpoints.mobile}) {
    margin-bottom: ${theme.spacing.lg};
  }
`;

const ModalTitle = styled.h3`
  font-size: ${theme.fontSizes.xxl};
  color: ${theme.colors.darkerGray};
  font-weight: ${theme.fontWeights.extrabold};
  margin: 0;
  font-family: ${theme.fonts.primary};

  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: ${theme.fontSizes.xl};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.fontSizes.lg};
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.darkGray};
  cursor: pointer;
  padding: ${theme.spacing.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all ${theme.transitions.normal};
  border-radius: ${theme.borderRadius.md};

  &:hover {
    color: ${theme.colors.error};
    background-color: ${theme.colors.offWhite};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${theme.colors.primaryLighter};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.xs};
  }
`;

const CloseIcon = styled(FaTimes)`
  font-size: ${theme.fontSizes.xl};

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.fontSizes.lg};
  }
`;

function Modal({ title, onClose, children }) {
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          <CloseButton onClick={onClose} aria-label="Close modal">
            <CloseIcon />
          </CloseButton>
        </ModalHeader>
        {children}
      </ModalContent>
    </ModalOverlay>
  );
}

export default Modal;
