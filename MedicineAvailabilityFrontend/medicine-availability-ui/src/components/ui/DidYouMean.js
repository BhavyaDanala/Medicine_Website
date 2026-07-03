import styled from 'styled-components';
import { FaMagic, FaSearch } from 'react-icons/fa';
import { theme } from '../../styles/theme';

const DidYouMeanContainer = styled.div`
  margin: ${theme.spacing.md} 0 ${theme.spacing.lg} 0;
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: ${theme.borderRadius.lg};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  flex-wrap: wrap;

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    gap: ${theme.spacing.sm};
  }
`;

const MagicIcon = styled(FaMagic)`
  color: ${theme.colors.primary};
  font-size: ${theme.fontSizes.md};
  flex-shrink: 0;
`;

const SuggestionText = styled.span`
  color: ${theme.colors.textSecondary};
  font-size: ${theme.fontSizes.md};
  font-weight: ${theme.fontWeights.medium};

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.fontSizes.sm};
  }
`;

const SuggestionButton = styled.button`
  background: ${theme.colors.white};
  color: ${theme.colors.primary};
  border: 2px solid ${theme.colors.primary};
  padding: ${theme.spacing.xs} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSizes.md};
  font-weight: ${theme.fontWeights.semibold};
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};

  &:hover {
    background: ${theme.colors.primary};
    color: ${theme.colors.white};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.fontSizes.sm};
    padding: ${theme.spacing.xs} ${theme.spacing.sm};
  }
`;

function DidYouMean({ suggestion, onSuggestionClick }) {
  if (!suggestion) return null;

  return (
    <DidYouMeanContainer>
      <MagicIcon />
      <SuggestionText>Did you mean:</SuggestionText>
      <SuggestionButton onClick={() => onSuggestionClick(suggestion)}>
        <FaSearch />
        {suggestion}
      </SuggestionButton>
    </DidYouMeanContainer>
  );
}

export default DidYouMean;
