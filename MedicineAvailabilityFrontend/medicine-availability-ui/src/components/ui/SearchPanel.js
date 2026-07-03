import styled from 'styled-components';
import { FaSearch } from 'react-icons/fa';
import { theme } from '../../styles/theme';

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

const SearchInputWrapper = styled.div`
  flex: 1;
  position: relative;
  min-width: 280px;

  @media (max-width: ${theme.breakpoints.tablet}) {
    min-width: 100%;
  }
`;

const SearchInputIcon = styled.div`
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  font-size: 14px;
  pointer-events: none;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 14px 12px 40px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  transition: all 0.2s;
  background: #ffffff;
  color: #0f172a;
  outline: none;
  box-sizing: border-box;

  &::placeholder {
    color: #94a3b8;
  }

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &:hover {
    border-color: #94a3b8;
  }

  @media (max-width: 768px) {
    padding: 10px 14px 10px 36px;
    font-size: 14px;
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

function SearchPanel({ placeholder, value, onChange, onSearch, buttonText = 'Search', disabled = false }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSearch();
    }
  };

  return (
    <SearchContainer onSubmit={handleSubmit}>
      <SearchInputWrapper>
        <SearchInputIcon>
          <SearchIcon />
        </SearchInputIcon>
        <SearchInput
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
        />
      </SearchInputWrapper>
      <SearchButton type="button" onClick={onSearch} disabled={disabled}>
        <SearchIcon />
        {buttonText}
      </SearchButton>
    </SearchContainer>
  );
}

export default SearchPanel;
