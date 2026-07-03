import { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { FaSpinner, FaSearch } from 'react-icons/fa';
import { theme } from '../../styles/theme';

const AutocompleteContainer = styled.div`
  position: relative;
  flex: 1;
  min-width: 280px;

  @media (max-width: ${theme.breakpoints.tablet}) {
    min-width: 100%;
  }
`;

const SearchInputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const SearchInputIcon = styled.div`
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  font-size: 14px;
  pointer-events: none;
  z-index: 1;
`;

const LoadingIcon = styled.div`
  position: absolute;
  right: ${theme.spacing.lg};
  top: 50%;
  transform: translateY(-50%);
  color: ${theme.colors.primary};
  font-size: ${theme.fontSizes.md};
  z-index: 1;
  animation: spin 1s linear infinite;

  @keyframes spin {
    from {
      transform: translateY(-50%) rotate(0deg);
    }
    to {
      transform: translateY(-50%) rotate(360deg);
    }
  }
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

const SuggestionsDropdown = styled.ul`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: ${theme.colors.white};
  border: 1px solid ${theme.colors.mediumGray};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  list-style: none;
  margin: 0;
  padding: ${theme.spacing.xs} 0;
  max-height: 280px;
  overflow-y: auto;
  z-index: 1000;
  display: ${props => (props.$isOpen ? 'block' : 'none')};

  @media (max-width: ${theme.breakpoints.tablet}) {
    max-height: 200px;
  }
`;

const SuggestionItem = styled.li`
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  font-size: ${theme.fontSizes.md};
  color: ${theme.colors.darkerGray};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  background: ${props => props.$isHighlighted ? theme.colors.primaryLighter : 'transparent'};

  &:hover {
    background: ${theme.colors.primaryLighter};
  }

  &:not(:last-child) {
    border-bottom: 1px solid ${theme.colors.lightGray};
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    font-size: ${theme.fontSizes.sm};
  }
`;

const SuggestionIcon = styled(FaSearch)`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.darkGray};
  flex-shrink: 0;
`;

const HighlightText = styled.span`
  font-weight: ${theme.fontWeights.bold};
  color: ${theme.colors.primary};
`;

const NormalText = styled.span`
  font-weight: ${theme.fontWeights.normal};
`;

const NoResults = styled.li`
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  color: ${theme.colors.darkGray};
  font-size: ${theme.fontSizes.sm};
  text-align: center;
  cursor: default;

  &:hover {
    background: transparent;
  }
`;

// Debounce hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

function Autocomplete({
  placeholder = 'Search...',
  value,
  onChange,
  onSelect,
  onSearch,
  apiUrl = 'https://localhost:7194/api/Medicines/suggest',
  debounceMs = 300,
  disabled = false,
  minChars = 1
}) {
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef(null);
  const debouncedQuery = useDebounce(value, debounceMs);

  // Fetch suggestions when debounced query changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedQuery || debouncedQuery.length < minChars) {
        setSuggestions([]);
        setIsOpen(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await axios.get(`${apiUrl}?q=${encodeURIComponent(debouncedQuery)}`);
        setSuggestions(response.data);
        setIsOpen(response.data.length > 0);
        setHighlightedIndex(-1);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
        setIsOpen(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery, apiUrl, minChars]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Highlight matching text
  const highlightMatch = useCallback((text, query) => {
    if (!query) return <NormalText>{text}</NormalText>;

    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const index = lowerText.indexOf(lowerQuery);

    if (index === -1) return <NormalText>{text}</NormalText>;

    const before = text.substring(0, index);
    const match = text.substring(index, index + query.length);
    const after = text.substring(index + query.length);

    return (
      <>
        <NormalText>{before}</NormalText>
        <HighlightText>{match}</HighlightText>
        <NormalText>{after}</NormalText>
      </>
    );
  }, []);

  // Handle input change
  const handleInputChange = (e) => {
    onChange(e.target.value);
    if (!e.target.value) {
      setIsOpen(false);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    onSelect(suggestion);
    setIsOpen(false);
    setSuggestions([]);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (disabled) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        }
        setHighlightedIndex(prev =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;

      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => (prev > 0 ? prev - 1 : -1));
        break;

      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
          handleSuggestionClick(suggestions[highlightedIndex]);
        } else {
          onSearch();
          setIsOpen(false);
        }
        break;

      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;

      default:
        break;
    }
  };

  return (
    <AutocompleteContainer ref={containerRef}>
      <SearchInputWrapper>
        <SearchInputIcon>
          <FaSearch />
        </SearchInputIcon>
        {isLoading && (
          <LoadingIcon>
            <FaSpinner />
          </LoadingIcon>
        )}
        <SearchInput
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) {
              setIsOpen(true);
            }
          }}
          disabled={disabled}
          autoComplete="off"
        />
      </SearchInputWrapper>

      <SuggestionsDropdown $isOpen={isOpen}>
        {suggestions.length > 0 ? (
          suggestions.map((suggestion, index) => (
            <SuggestionItem
              key={index}
              $isHighlighted={index === highlightedIndex}
              onClick={() => handleSuggestionClick(suggestion)}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              <SuggestionIcon />
              {highlightMatch(suggestion, value)}
            </SuggestionItem>
          ))
        ) : value.length >= minChars && !isLoading ? (
          <NoResults>No suggestions found</NoResults>
        ) : null}
      </SuggestionsDropdown>
    </AutocompleteContainer>
  );
}

export default Autocomplete;
