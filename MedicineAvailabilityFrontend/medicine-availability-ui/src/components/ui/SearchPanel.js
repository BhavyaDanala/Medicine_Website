import styled from 'styled-components';
import { FaSearch } from 'react-icons/fa';
import { theme } from '../../styles/theme';

const SearchContainer = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.xl};
  flex-wrap: wrap;

  @media (max-width: ${theme.breakpoints.mobile}) {
    flex-direction: column;
    gap: ${theme.spacing.sm};
  }
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 200px;
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border: 2px solid ${theme.colors.mediumGray};
  border-radius: ${theme.spacing.md};
  font-size: ${theme.fontSizes.md};
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${theme.colors.medicalBlue};
    box-shadow: 0 0 0 3px rgba(0, 119, 182, 0.1);
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    font-size: ${theme.fontSizes.sm};
  }
`;

const SearchButton = styled.button`
  background: linear-gradient(135deg, ${theme.colors.medicalBlue} 0%, ${theme.colors.medicalBlueDark} 100%);
  color: ${theme.colors.white};
  border: none;
  padding: ${theme.spacing.md} ${theme.spacing.xl};
  border-radius: ${theme.spacing.md};
  font-size: ${theme.fontSizes.md};
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  transition: all 0.3s ease;
  white-space: nowrap;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 119, 182, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.sm} ${theme.spacing.lg};
    font-size: ${theme.fontSizes.sm};
  }
`;

const SearchIcon = styled(FaSearch)``;

function SearchPanel({ placeholder, value, onChange, onSearch, buttonText = 'Search' }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <SearchContainer onSubmit={handleSubmit}>
      <SearchInput
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      <SearchButton onClick={onSearch}>
        <SearchIcon />
        {buttonText}
      </SearchButton>
    </SearchContainer>
  );
}

export default SearchPanel;
