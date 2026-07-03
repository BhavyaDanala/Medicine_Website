import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaHome, FaPlus, FaTrash, FaEdit, FaStar, FaRegStar } from 'react-icons/fa';
import Modal from './Modal';
import { theme } from '../../styles/theme';
import axios from 'axios';
import { toast } from 'react-toastify';
import AddressFormModal from './AddressFormModal';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

const AddressCard = styled.div`
  border: 2px solid ${props => props.$isDefault ? theme.colors.primary : theme.colors.mediumGray};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.lg};
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background: ${props => props.$isDefault ? 'rgba(102, 126, 234, 0.05)' : theme.colors.white};
`;

const AddressInfo = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
`;

const AddressIcon = styled.div`
  color: ${theme.colors.primary};
  font-size: 24px;
  margin-top: 4px;
`;

const AddressDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Label = styled.div`
  font-weight: ${theme.fontWeights.bold};
  color: ${theme.colors.darkerGray};
  font-size: ${theme.fontSizes.md};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const DefaultBadge = styled.span`
  background: ${theme.colors.primary};
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 10px;
  text-transform: uppercase;
  font-weight: bold;
`;

const Text = styled.div`
  color: ${theme.colors.darkGray};
  font-size: ${theme.fontSizes.sm};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.$color || theme.colors.darkGray};
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.2s;

  &:hover {
    background: rgba(0,0,0,0.05);
    color: ${props => props.$hoverColor || theme.colors.primary};
  }
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.md};
  border: 2px dashed ${theme.colors.primary};
  border-radius: ${theme.borderRadius.lg};
  background: transparent;
  color: ${theme.colors.primary};
  font-weight: ${theme.fontWeights.semibold};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(102, 126, 234, 0.05);
  }
`;

function AddressManagerModal({ onClose }) {
  const [addresses, setAddresses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("https://localhost:7240/api/Addresses", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAddresses(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load addresses");
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://localhost:7240/api/Addresses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Address deleted");
      fetchAddresses();
    } catch (error) {
      toast.error("Failed to delete address");
    }
  };

  const handleSetDefault = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`https://localhost:7240/api/Addresses/${id}/default`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAddresses();
      toast.success("Default address updated");
    } catch (error) {
      toast.error("Failed to set default address");
    }
  };

  const handleSaveAddress = async (data) => {
    try {
      const token = localStorage.getItem("token");
      if (editingAddress) {
        await axios.put(`https://localhost:7240/api/Addresses/${editingAddress.addressId}`, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Address updated");
      } else {
        await axios.post("https://localhost:7240/api/Addresses", data, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Address added");
      }
      setShowAddForm(false);
      setEditingAddress(null);
      fetchAddresses();
    } catch (error) {
      const msg = error.response?.data || "Failed to save address";
      toast.error(typeof msg === 'string' ? msg : "Failed to save address");
    }
  };

  if (showAddForm) {
    return <AddressFormModal 
              initialData={editingAddress}
              onClose={() => { setShowAddForm(false); setEditingAddress(null); }} 
              onSubmit={handleSaveAddress} />;
  }

  return (
    <Modal title="My Addresses" onClose={onClose}>
      <Container>
        <AddButton onClick={() => setShowAddForm(true)}>
          <FaPlus /> Add New Address
        </AddButton>
        {addresses.map(addr => (
          <AddressCard key={addr.addressId} $isDefault={addr.isDefault}>
            <AddressInfo>
              <AddressIcon><FaHome /></AddressIcon>
              <AddressDetails>
                <Label>
                  {addr.addressLabel} 
                  {addr.isDefault && <DefaultBadge>Default</DefaultBadge>}
                </Label>
                <Text>{addr.streetAddress}</Text>
                <Text>{addr.city}, {addr.state} {addr.postalCode}</Text>
                <Text>{addr.country}</Text>
              </AddressDetails>
            </AddressInfo>
            <ActionButtons>
              <IconButton 
                title="Set as Default" 
                onClick={() => handleSetDefault(addr.addressId)}
                $color={addr.isDefault ? theme.colors.warning : theme.colors.darkGray}
                $hoverColor={theme.colors.warning}>
                {addr.isDefault ? <FaStar /> : <FaRegStar />}
              </IconButton>
              <IconButton title="Edit" onClick={() => { setEditingAddress(addr); setShowAddForm(true); }}>
                <FaEdit />
              </IconButton>
              <IconButton title="Delete" onClick={() => handleDelete(addr.addressId)} $hoverColor={theme.colors.error}>
                <FaTrash />
              </IconButton>
            </ActionButtons>
          </AddressCard>
        ))}
      </Container>
    </Modal>
  );
}

export default AddressManagerModal;
