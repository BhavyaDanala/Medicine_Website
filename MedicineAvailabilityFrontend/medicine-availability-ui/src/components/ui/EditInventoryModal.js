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
  gap: ${theme.spacing.xs};
`;

const Label = styled.label`
  font-size: ${theme.fontSizes.sm};
  font-weight: 500;
  color: ${theme.colors.darkGray};
`;

const Input = styled.input`
  padding: ${theme.spacing.md};
  border: 2px solid ${theme.colors.mediumGray};
  border-radius: ${theme.spacing.md};
  font-size: ${theme.fontSizes.md};
  font-family: ${theme.fonts.primary};
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${theme.colors.medicalBlue};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.sm};
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
  padding: ${theme.spacing.md} ${theme.spacing.lg};
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

const SubmitButton = styled(Button)`
  background: linear-gradient(135deg, ${theme.colors.medicalBlue} 0%, ${theme.colors.medicalBlueDark} 100%);
  color: ${theme.colors.white};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 119, 182, 0.4);
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
