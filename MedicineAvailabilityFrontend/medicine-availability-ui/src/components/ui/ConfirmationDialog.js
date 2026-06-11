import styled from 'styled-components';
import { theme } from '../../styles/theme';
import Modal from './Modal';

const Message = styled.p`
  font-size: ${theme.fontSizes.md};
  color: ${theme.colors.darkGray};
  margin-bottom: ${theme.spacing.xl};
  line-height: 1.5;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: ${theme.spacing.md} ${theme.spacing.xl};
  border: none;
  border-radius: ${theme.spacing.md};
  font-size: ${theme.fontSizes.md};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    font-size: ${theme.fontSizes.sm};
  }
`;

const ConfirmButton = styled(Button)`
  background: linear-gradient(135deg, ${theme.colors.error} 0%, #c62828 100%);
  color: ${theme.colors.white};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(244, 67, 54, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const CancelButton = styled(Button)`
  background-color: ${theme.colors.mediumGray};
  color: ${theme.colors.darkGray};

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
