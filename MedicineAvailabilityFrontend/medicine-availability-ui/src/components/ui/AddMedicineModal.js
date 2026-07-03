import { useState } from 'react';
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

function AddMedicineModal({ onClose, onSubmit }) {
  const [medicineName, setMedicineName] = useState('');
  const [category, setCategory] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [symptoms, setSymptoms] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      medicineName,
      category,
      manufacturer,
      symptoms,
    });
  };

  return (
    <Modal title="Add Medicine" onClose={onClose}>
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
          <SubmitButton type="submit">Add Medicine</SubmitButton>
        </ButtonGroup>
      </Form>
    </Modal>
  );
}

export default AddMedicineModal;
