import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import Modal from './Modal';
import { FormInput, FormTextArea } from './FormInput';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
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

function EditMedicineModal({ medicine, onClose, onSubmit }) {
  const [medicineName, setMedicineName] = useState('');
  const [category, setCategory] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [symptoms, setSymptoms] = useState('');

  useEffect(() => {
    if (medicine) {
      setMedicineName(medicine.medicineName);
      setCategory(medicine.category);
      setManufacturer(medicine.manufacturer);
      setSymptoms(medicine.symptoms);
    }
  }, [medicine]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      medicineId: medicine.medicineId,
      medicineName,
      category,
      manufacturer,
      symptoms,
    });
  };

  return (
    <Modal title="Edit Medicine" onClose={onClose}>
      <Form onSubmit={handleSubmit}>
        <FormInput
          label="Medicine Name"
          value={medicineName}
          onChange={(e) => setMedicineName(e.target.value)}
          placeholder="Enter medicine name"
          required
        />

        <FormInput
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Enter category"
          required
        />

        <FormInput
          label="Manufacturer"
          value={manufacturer}
          onChange={(e) => setManufacturer(e.target.value)}
          placeholder="Enter manufacturer"
          required
        />

        <FormTextArea
          label="Symptoms"
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          placeholder="Enter symptoms (comma separated)"
          required
        />

        <ButtonGroup>
          <CancelButton type="button" onClick={onClose}>
            Cancel
          </CancelButton>
          <SubmitButton type="submit">Update Medicine</SubmitButton>
        </ButtonGroup>
      </Form>
    </Modal>
  );
}

export default EditMedicineModal;
