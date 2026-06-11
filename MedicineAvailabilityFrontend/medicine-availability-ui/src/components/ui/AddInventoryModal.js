import { useState } from 'react';
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

const Select = styled.select`
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

function AddInventoryModal({ pharmacies, medicines, onClose, onSubmit }) {
  const [pharmacyId, setPharmacyId] = useState('');
  const [medicineId, setMedicineId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      pharmacyId: parseInt(pharmacyId),
      medicineId: parseInt(medicineId),
      quantity: parseInt(quantity),
      price: parseFloat(price),
    });
  };

  return (
    <Modal title="Add Inventory" onClose={onClose}>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Pharmacy</Label>
          <Select
            value={pharmacyId}
            onChange={(e) => setPharmacyId(e.target.value)}
            required
          >
            <option value="">Select Pharmacy</option>
            {pharmacies.map((pharmacy) => (
              <option key={pharmacy.pharmacyId} value={pharmacy.pharmacyId}>
                {pharmacy.pharmacyName}
              </option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Medicine</Label>
          <Select
            value={medicineId}
            onChange={(e) => setMedicineId(e.target.value)}
            required
          >
            <option value="">Select Medicine</option>
            {medicines.map((medicine) => (
              <option key={medicine.medicineId} value={medicine.medicineId}>
                {medicine.medicineName}
              </option>
            ))}
          </Select>
        </FormGroup>

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
          <SubmitButton type="submit">Add Inventory</SubmitButton>
        </ButtonGroup>
      </Form>
    </Modal>
  );
}

export default AddInventoryModal;
