import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaMapMarkerAlt, FaHome, FaPlus, FaChevronRight } from 'react-icons/fa';
import Modal from './Modal';
import { theme } from '../../styles/theme';
import axios from 'axios';

const OptionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

const OptionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${theme.spacing.lg};
  background: ${theme.colors.white};
  border: 2px solid ${theme.colors.mediumGray};
  border-radius: ${theme.borderRadius.lg};
  cursor: pointer;
  transition: all ${theme.transitions.normal};

  &:hover {
    border-color: ${theme.colors.primary};
    background: rgba(102, 126, 234, 0.05);
  }
`;

const OptionContent = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
`;

const OptionIcon = styled.div`
  font-size: 24px;
  color: ${theme.colors.primary};
`;

const OptionText = styled.div`
  text-align: left;
`;

const OptionTitle = styled.div`
  font-size: ${theme.fontSizes.md};
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.darkerGray};
`;

const OptionSubtitle = styled.div`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.darkGray};
  margin-top: 4px;
`;

function AddressSelectionModal({ onClose, onSelectCurrentLocation, onSelectSavedAddress, onAddNewAddress }) {
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("https://localhost:7240/api/Addresses", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSavedAddresses(response.data);
      } catch (error) {
        console.error("Failed to load addresses", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAddresses();
  }, []);

  return (
    <Modal title="Choose Location" onClose={onClose}>
      <OptionList>
        <OptionButton onClick={onSelectCurrentLocation}>
          <OptionContent>
            <OptionIcon><FaMapMarkerAlt /></OptionIcon>
            <OptionText>
              <OptionTitle>Use Current Location</OptionTitle>
              <OptionSubtitle>Find pharmacies near where you are right now</OptionSubtitle>
            </OptionText>
          </OptionContent>
          <FaChevronRight color={theme.colors.darkGray} />
        </OptionButton>

        {!loading && savedAddresses.map(addr => (
          <OptionButton key={addr.addressId} onClick={() => onSelectSavedAddress(addr)}>
            <OptionContent>
              <OptionIcon><FaHome /></OptionIcon>
              <OptionText>
                <OptionTitle>{addr.addressLabel} {addr.isDefault && "(Default)"}</OptionTitle>
                <OptionSubtitle>{addr.streetAddress}, {addr.city}</OptionSubtitle>
              </OptionText>
            </OptionContent>
            <FaChevronRight color={theme.colors.darkGray} />
          </OptionButton>
        ))}

        <OptionButton onClick={onAddNewAddress}>
          <OptionContent>
            <OptionIcon><FaPlus /></OptionIcon>
            <OptionText>
              <OptionTitle>Add New Address</OptionTitle>
              <OptionSubtitle>Save a new location for future searches</OptionSubtitle>
            </OptionText>
          </OptionContent>
          <FaChevronRight color={theme.colors.darkGray} />
        </OptionButton>
      </OptionList>
    </Modal>
  );
}

export default AddressSelectionModal;
