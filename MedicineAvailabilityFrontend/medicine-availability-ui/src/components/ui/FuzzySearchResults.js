import styled from 'styled-components';
import { FaSearch, FaPercentage } from 'react-icons/fa';
import { theme } from '../../styles/theme';

const FuzzyResultsContainer = styled.div`
  margin-top: ${theme.spacing.xl};
`;

const FuzzyResultsTitle = styled.h3`
  font-size: ${theme.fontSizes.lg};
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.text};
  margin: 0 0 ${theme.spacing.md} 0;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.fontSizes.md};
  }
`;

const FuzzyResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.sm};
  }
`;

const FuzzyResultCard = styled.div`
  background: ${theme.colors.white};
  border: 2px solid ${theme.colors.lightGray};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.md};
  cursor: pointer;
  transition: all ${theme.transitions.normal};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};

  &:hover {
    border-color: ${theme.colors.primary};
    box-shadow: 0 4px 16px rgba(102, 126, 234, 0.15);
    transform: translateY(-2px);
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.sm};
  }
`;

const FuzzyResultHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing.sm};
`;

const FuzzyResultName = styled.h4`
  font-size: ${theme.fontSizes.md};
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.text};
  margin: 0;
  flex: 1;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.fontSizes.sm};
  }
`;

const SimilarityBadge = styled.div`
  background: linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%);
  color: ${theme.colors.white};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.bold};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  flex-shrink: 0;
`;

const FuzzyResultDetails = styled.div`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.textSecondary};

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.fontSizes.xs};
  }
`;

const NoExactMatchesMessage = styled.p`
  color: ${theme.colors.textSecondary};
  font-size: ${theme.fontSizes.md};
  margin: ${theme.spacing.md} 0;
  font-style: italic;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.fontSizes.sm};
  }
`;

function FuzzySearchResults({ fuzzyMatches, onResultClick, searchTerm }) {
  if (!fuzzyMatches || fuzzyMatches.length === 0) return null;

  return (
    <FuzzyResultsContainer>
      <NoExactMatchesMessage>
        No exact matches found for "{searchTerm}". Showing similar results:
      </NoExactMatchesMessage>
      <FuzzyResultsTitle>
        <FaSearch />
        Similar Medicines
      </FuzzyResultsTitle>
      <FuzzyResultsGrid>
        {fuzzyMatches.map((match, index) => (
          <FuzzyResultCard key={index} onClick={() => onResultClick(match.medicineName)}>
            <FuzzyResultHeader>
              <FuzzyResultName>{match.medicineName}</FuzzyResultName>
              <SimilarityBadge>
                <FaPercentage />
                {Math.round(match.similarityScore * 100)}% match
              </SimilarityBadge>
            </FuzzyResultHeader>
            {match.category && (
              <FuzzyResultDetails>
                Category: {match.category}
              </FuzzyResultDetails>
            )}
            {match.manufacturer && (
              <FuzzyResultDetails>
                Manufacturer: {match.manufacturer}
              </FuzzyResultDetails>
            )}
          </FuzzyResultCard>
        ))}
      </FuzzyResultsGrid>
    </FuzzyResultsContainer>
  );
}

export default FuzzySearchResults;
