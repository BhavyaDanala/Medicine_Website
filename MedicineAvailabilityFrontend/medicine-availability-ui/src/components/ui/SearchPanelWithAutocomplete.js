import styled from 'styled-components';
import { FaSearch } from 'react-icons/fa';
import { theme } from '../../styles/theme';
import Autocomplete from './Autocomplete';

const SearchContainer = styled.form`
  display: flex;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.xl};
  flex-wrap: wrap;
  position: relative;

  @media (max-width: ${theme.breakpoints.tablet}) {
    flex-direction: column;
    gap: ${theme.spacing.sm};
  }
`;

const SearchButton = styled.button`
  background: #3b82f6;
  color: #ffffff;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  font-family: inherit;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  white-space: nowrap;
  box-shadow: 0 2px 10px rgba(59, 130, 246, 0.2);
  cursor: pointer;

  &:hover {
    background: #2563eb;
    box-shadow: 0 4px 14px rgba(37, 99, 235, 0.3);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 10px 20px;
    font-size: 14px;
    width: 100%;
    justify-content: center;
  }
`;

const SearchIcon = styled(FaSearch)`
  font-size: ${theme.fontSizes.md};
`;

function SearchPanelWithAutocomplete({
  placeholder = 'Search...',
  value,
  onChange,
  onSearch,
  onSelect,
  buttonText = 'Search',
  disabled = false,
  apiUrl = 'https://localhost:7194/api/Medicines/suggest',
  debounceMs = 300,
  minChars = 1
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  const handleSelect = (suggestion) => {
    if (onSelect) {
      onSelect(suggestion);
    } else {
      onChange(suggestion);
      onSearch();
    }
  };

  return (
    <SearchContainer onSubmit={handleSubmit}>
      <Autocomplete
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onSelect={handleSelect}
        onSearch={onSearch}
        apiUrl={apiUrl}
        debounceMs={debounceMs}
        disabled={disabled}
        minChars={minChars}
      />
      <SearchButton type="submit" disabled={disabled}>
        <SearchIcon />
        {buttonText}
      </SearchButton>
    </SearchContainer>
  );
}

export default SearchPanelWithAutocomplete;
