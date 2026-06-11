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
  background: linear-gradient(135deg, ${theme.colors.mintGreen} 0%, ${theme.colors.mintGreenDark} 100%);
  color: ${theme.colors.white};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
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

const ErrorMessage = styled.div`
  color: ${theme.colors.error};
  font-size: ${theme.fontSizes.sm};
  margin-top: ${theme.spacing.xs};
`;

function AddPharmacyModal({ onClose, onSubmit }) {
  const [pharmacyName, setPharmacyName] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const validatePhoneNumber = (value) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(value);
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setPhoneNumber(value);

    if (value.length > 0 && !validatePhoneNumber(value)) {
      setPhoneError('Phone number must contain exactly 10 digits');
    } else {
      setPhoneError('');
    }
  };

  const isFormValid = () => {
    return pharmacyName && address && phoneNumber && latitude && longitude && !phoneError && validatePhoneNumber(phoneNumber);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      return;
    }
    onSubmit({
      pharmacyName,
      address,
      phoneNumber,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    });
  };

  return (
    <Modal title="Add Pharmacy" onClose={onClose}>
      <Form onSubmit={handleSubmit}>
        <FormInput
          label="Pharmacy Name"
          value={pharmacyName}
          onChange={(e) => setPharmacyName(e.target.value)}
          placeholder="Enter pharmacy name"
          required
        />

        <FormTextArea
          label="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter address"
          required
        />

        <div>
          <FormInput
            label="Phone Number"
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneChange}
            placeholder="Enter phone number"
            required
            maxLength={10}
            isValid={!phoneError}
          />
          {phoneError && <ErrorMessage>{phoneError}</ErrorMessage>}
        </div>

        <FormInput
          label="Latitude"
          type="number"
          step="any"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
          placeholder="Enter latitude"
          required
          min="-90"
          max="90"
        />

        <FormInput
          label="Longitude"
          type="number"
          step="any"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
          placeholder="Enter longitude"
          required
          min="-180"
          max="180"
        />

        <ButtonGroup>
          <CancelButton type="button" onClick={onClose}>
            Cancel
          </CancelButton>
          <SubmitButton type="submit" disabled={!isFormValid()}>Add Pharmacy</SubmitButton>
        </ButtonGroup>
      </Form>
    </Modal>
  );
}

export default AddPharmacyModal;
