import styled from 'styled-components';
import { theme } from '../../styles/theme';
import Modal from './Modal';

const Message = styled.p`
  font-size: ${theme.fontSizes.md};
  color: ${theme.colors.darkerGray};
  margin-bottom: ${theme.spacing.xl};
  line-height: 1.6;
  font-family: ${theme.fonts.primary};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: ${theme.spacing.lg} ${theme.spacing.xl};
  border: none;
  border-radius: ${theme.borderRadius.lg};
  font-size: ${theme.fontSizes.md};
  font-weight: ${theme.fontWeights.semibold};
  font-family: ${theme.fonts.primary};
  cursor: pointer;
  transition: all ${theme.transitions.normal};

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing.md} ${theme.spacing.lg};
    font-size: ${theme.fontSizes.sm};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    font-size: ${theme.fontSizes.sm};
  }
`;

const ConfirmButton = styled(Button)`
  background: linear-gradient(135deg, ${theme.colors.error} 0%, #c62828 100%);
  color: ${theme.colors.white};
  box-shadow: ${theme.shadows.sm};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.md};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const CancelButton = styled(Button)`
  background-color: ${theme.colors.mediumGray};
  color: ${theme.colors.darkerGray};

  &:hover {
    background-color: ${theme.colors.darkGray};
    color: ${theme.colors.white};
  }
`;

function ConfirmationDialog({ title, message, onConfirm, onClose }) {
  return (
    <Modal title={title} onClose={onClose}>
      <Message>{message}</Message>
      <ButtonGroup>
        <CancelButton onClick={onClose}>Cancel</CancelButton>
        <ConfirmButton onClick={onConfirm}>Delete</ConfirmButton>
      </ButtonGroup>
    </Modal>
  );
}

export default ConfirmationDialog;
