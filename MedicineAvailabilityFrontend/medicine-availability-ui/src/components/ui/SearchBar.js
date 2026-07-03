import styled from 'styled-components';
import { FaSearch } from 'react-icons/fa';
import { theme } from '../../styles/theme';

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.tablet}) {
    margin-bottom: ${theme.spacing.lg};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    margin-bottom: ${theme.spacing.md};
  }
`;

const SearchInputWrapper = styled.div`
  position: relative;
  flex: 1;
`;

const SearchIcon = styled.div`
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

function SearchBar({ placeholder, value, onChange }) {
  return (
    <SearchContainer>
      <SearchInputWrapper>
        <SearchIcon>
          <FaSearch />
        </SearchIcon>
        <SearchInput
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          aria-label="Search"
        />
      </SearchInputWrapper>
    </SearchContainer>
  );
}

export default SearchBar;
