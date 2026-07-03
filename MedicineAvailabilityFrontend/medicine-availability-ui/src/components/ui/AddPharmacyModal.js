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
  background: linear-gradient(135deg, ${theme.colors.success} 0%, ${theme.colors.successDark} 100%);
  color: ${theme.colors.white};
  box-shadow: ${theme.shadows.sm};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.md};
    background: linear-gradient(135deg, ${theme.colors.successDark} 0%, ${theme.colors.success} 100%);
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

const ErrorMessage = styled.div`
  color: ${theme.colors.error};
  font-size: ${theme.fontSizes.xs};
  margin-top: ${theme.spacing.xs};
  font-weight: ${theme.fontWeights.medium};
`;

function AddPharmacyModal({ onClose, onSubmit }) {
  const [pharmacyName, setPharmacyName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [openingTime, setOpeningTime] = useState('');
  const [closingTime, setClosingTime] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [timeError, setTimeError] = useState('');

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

  const isTimeValid = (open, close) => {
    if (open && close) {
      if (close <= open) {
        return false;
      }
    }
    return true;
  };

  const validateTime = (open, close) => {
    if (!isTimeValid(open, close)) {
      setTimeError('Closing Time must be later than Opening Time');
      return false;
    }
    setTimeError('');
    return true;
  };

  const isFormValid = () => {
    return pharmacyName && email && address && phoneNumber && latitude && longitude && openingTime && closingTime && !phoneError && validatePhoneNumber(phoneNumber) && isTimeValid(openingTime, closingTime);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      return;
    }
    onSubmit({
      pharmacyName,
      email,
      address,
      phoneNumber,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      openingTime,
      closingTime
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

        <FormInput
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter pharmacy email"
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

        <FormInput
          label="Opening Time"
          type="time"
          value={openingTime}
          onChange={(e) => {
            setOpeningTime(e.target.value);
            validateTime(e.target.value, closingTime);
          }}
          required
        />

        <div>
          <FormInput
            label="Closing Time"
            type="time"
            value={closingTime}
            onChange={(e) => {
              setClosingTime(e.target.value);
              validateTime(openingTime, e.target.value);
            }}
            required
            isValid={!timeError}
          />
          {timeError && <ErrorMessage>{timeError}</ErrorMessage>}
        </div>

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
