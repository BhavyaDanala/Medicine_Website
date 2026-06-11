import styled from 'styled-components';
import { FaSearch } from 'react-icons/fa';
import { theme } from '../../styles/theme';

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.lg};
`;

const SearchInputWrapper = styled.div`
  position: relative;
  flex: 1;
`;

const SearchIcon = styled.div`
  position: absolute;
  left: ${theme.spacing.md};
  top: 50%;
  transform: translateY(-50%);
  color: ${theme.colors.mediumGray};
  font-size: ${theme.fontSizes.md};
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${theme.spacing.md} ${theme.spacing.md} ${theme.spacing.md} ${theme.spacing.xxl};
  border: 2px solid ${theme.colors.mediumGray};
  border-radius: ${theme.spacing.md};
  font-size: ${theme.fontSizes.md};
  font-family: ${theme.fonts.primary};
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${theme.colors.medicalBlue};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.sm} ${theme.spacing.sm} ${theme.spacing.sm} ${theme.spacing.lg};
    font-size: ${theme.fontSizes.sm};
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
        />
      </SearchInputWrapper>
    </SearchContainer>
  );
}

export default SearchBar;
