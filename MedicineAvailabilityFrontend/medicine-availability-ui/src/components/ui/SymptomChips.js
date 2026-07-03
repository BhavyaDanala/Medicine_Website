import styled from 'styled-components';
import { FaTag } from 'react-icons/fa';
import { theme } from '../../styles/theme';

const Container = styled.div`
  margin: ${theme.spacing.md} 0;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

const Label = styled.div`
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.textSecondary};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
`;

const ChipsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing.sm};
`;

const Chip = styled.div`
  background: linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%);
  color: ${theme.colors.white};
  padding: ${theme.spacing.xs} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.xl};
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  text-transform: capitalize;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.fontSizes.xs};
    padding: ${theme.spacing.xs} ${theme.spacing.sm};
  }
`;

const TagIcon = styled(FaTag)`
  font-size: ${theme.fontSizes.xs};
`;

function SymptomChips({ symptoms, showLabel = true }) {
  if (!symptoms || symptoms.length === 0) return null;

  return (
    <Container>
      {showLabel && (
        <Label>
          <TagIcon />
          Detected Symptoms:
        </Label>
      )}
      <ChipsContainer>
        {symptoms.map((symptom, index) => (
          <Chip key={index}>
            {symptom}
          </Chip>
        ))}
      </ChipsContainer>
    </Container>
  );
}

export default SymptomChips;
