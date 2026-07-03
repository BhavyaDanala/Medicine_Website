import React, { useState } from 'react';
import styled from 'styled-components';
import Modal from './Modal';
import { theme } from '../../styles/theme';
import { FormInput } from './FormInput';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.md};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  margin-top: ${theme.spacing.md};
`;

const Button = styled.button`
  flex: 1;
  padding: ${theme.spacing.lg};
  border: none;
  border-radius: ${theme.borderRadius.lg};
  font-size: ${theme.fontSizes.md};
  font-weight: ${theme.fontWeights.semibold};
  cursor: pointer;
  transition: all ${theme.transitions.normal};
`;

const SubmitButton = styled(Button)`
  background: linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%);
  color: ${theme.colors.white};
  &:hover { transform: translateY(-2px); box-shadow: ${theme.shadows.md}; }
`;

const CancelButton = styled(Button)`
  background-color: ${theme.colors.mediumGray};
  color: ${theme.colors.darkerGray};
  &:hover { background-color: ${theme.colors.darkGray}; color: ${theme.colors.white}; }
`;

const GeocodeButton = styled.button`
  background: ${theme.colors.lightGray};
  color: ${theme.colors.primary};
  border: 1px solid ${theme.colors.primary};
  padding: 8px 16px;
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  font-size: ${theme.fontSizes.sm};
  margin-bottom: ${theme.spacing.sm};
  width: 100%;
  &:hover { background: rgba(102, 126, 234, 0.1); }
`;

function AddressFormModal({ onClose, onSubmit, initialData = null }) {
  const [addressLabel, setAddressLabel] = useState(initialData?.addressLabel || '');
  const [streetAddress, setStreetAddress] = useState(initialData?.streetAddress || '');
  const [city, setCity] = useState(initialData?.city || '');
  const [state, setState] = useState(initialData?.state || '');
  const [postalCode, setPostalCode] = useState(initialData?.postalCode || '');
  const [country, setCountry] = useState(initialData?.country || 'India');
  const [latitude, setLatitude] = useState(initialData?.latitude || '');
  const [longitude, setLongitude] = useState(initialData?.longitude || '');
  const [geocoding, setGeocoding] = useState(false);

  const handleGeocode = async () => {
    if (!streetAddress || !city) {
        alert("Please enter at least Street Address and City");
        return;
    }
    setGeocoding(true);
    try {
        const query = `${streetAddress}, ${city}, ${state}, ${country}`;
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
        const data = await response.json();
        if (data && data.length > 0) {
            setLatitude(data[0].lat);
            setLongitude(data[0].lon);
        } else {
            alert("Could not find coordinates for this address. Please try refining it or enter manually.");
        }
    } catch (error) {
        alert("Error fetching coordinates");
    } finally {
        setGeocoding(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      addressLabel,
      streetAddress,
      city,
      state,
      postalCode,
      country,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude)
    });
  };

  return (
    <Modal title={initialData ? "Edit Address" : "Add New Address"} onClose={onClose}>
      <Form onSubmit={handleSubmit}>
        <FormInput label="Address Label (e.g. Home, Office)" value={addressLabel} onChange={e => setAddressLabel(e.target.value)} required />
        <FormInput label="Street Address" value={streetAddress} onChange={e => setStreetAddress(e.target.value)} required />
        <FormRow>
          <FormInput label="City" value={city} onChange={e => setCity(e.target.value)} required />
          <FormInput label="State" value={state} onChange={e => setState(e.target.value)} required />
        </FormRow>
        <FormRow>
          <FormInput label="Postal Code" value={postalCode} onChange={e => setPostalCode(e.target.value)} required />
          <FormInput label="Country" value={country} onChange={e => setCountry(e.target.value)} required />
        </FormRow>
        
        <GeocodeButton type="button" onClick={handleGeocode} disabled={geocoding}>
            {geocoding ? "Detecting..." : "Auto-Detect Coordinates from Address"}
        </GeocodeButton>

        <FormRow>
          <FormInput label="Latitude" type="number" step="any" value={latitude} onChange={e => setLatitude(e.target.value)} required />
          <FormInput label="Longitude" type="number" step="any" value={longitude} onChange={e => setLongitude(e.target.value)} required />
        </FormRow>
        <ButtonGroup>
          <CancelButton type="button" onClick={onClose}>Cancel</CancelButton>
          <SubmitButton type="submit">Save Address</SubmitButton>
        </ButtonGroup>
      </Form>
    </Modal>
  );
}

export default AddressFormModal;
