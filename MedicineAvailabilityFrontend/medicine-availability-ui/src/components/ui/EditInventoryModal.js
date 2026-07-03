import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import Modal from './Modal';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

const Label = styled.label`
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.darkerGray};
  font-family: ${theme.fonts.primary};
`;

const Input = styled.input`
  padding: ${theme.spacing.lg} ${theme.spacing.xl};
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

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing.md} ${theme.spacing.lg};
    font-size: ${theme.fontSizes.sm};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    font-size: ${theme.fontSizes.sm};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  margin-top: ${theme.spacing.md};
`;

const Button = styled.button`
  flex: 1;
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

const SubmitButton = styled(Button)`
  background: linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%);
  color: ${theme.colors.white};
  box-shadow: ${theme.shadows.sm};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.md};
    background: linear-gradient(135deg, ${theme.colors.primaryDark} 0%, ${theme.colors.primary} 100%);
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

function EditInventoryModal({ inventoryItem, onClose, onSubmit }) {
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    if (inventoryItem) {
      setQuantity(inventoryItem.quantity);
      setPrice(inventoryItem.price);
    }
  }, [inventoryItem]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      inventoryId: inventoryItem.id,
      quantity: parseInt(quantity),
      price: parseFloat(price),
    });
  };

  return (
    <Modal title="Edit Inventory" onClose={onClose}>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Quantity</Label>
          <Input
            type="number"
            min="0"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
            placeholder="Enter quantity"
          />
        </FormGroup>

        <FormGroup>
          <Label>Price (Rs.)</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            placeholder="Enter price"
          />
        </FormGroup>

        <ButtonGroup>
          <CancelButton type="button" onClick={onClose}>
            Cancel
          </CancelButton>
          <SubmitButton type="submit">Update Inventory</SubmitButton>
        </ButtonGroup>
      </Form>
    </Modal>
  );
}

export default EditInventoryModal;
