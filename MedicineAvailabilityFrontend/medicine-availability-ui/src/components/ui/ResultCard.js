import styled from 'styled-components';
import { theme } from '../../styles/theme';

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.md};
  }

  @media (min-width: ${theme.breakpoints.tablet}) and (max-width: ${theme.breakpoints.desktop}) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
`;

const Card = styled.div`
  background: ${theme.colors.white};
  border-radius: ${theme.spacing.lg};
  padding: ${theme.spacing.xl};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border-left: 4px solid ${theme.colors.medicalBlue};

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.lg};
  }
`;

const CardTitle = styled.h4`
  font-size: ${theme.fontSizes.lg};
  color: ${theme.colors.medicalBlue};
  margin-bottom: ${theme.spacing.md};
  font-weight: 600;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.fontSizes.md};
  }
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

const CardItem = styled.p`
  font-size: ${theme.fontSizes.md};
  color: ${theme.colors.darkGray};
  margin: 0;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.fontSizes.sm};
  }
`;

const CardLabel = styled.span`
  font-weight: 600;
  color: ${theme.colors.medicalBlueDark};
`;

const CardValue = styled.span`
  color: ${theme.colors.darkGray};
`;

const ActionButtonContainer = styled.div`
  margin-top: ${theme.spacing.md};
`;

const HighlightCard = styled(Card)`
  border-left-color: ${theme.colors.mintGreen};
  background: linear-gradient(135deg, ${theme.colors.white} 0%, rgba(76, 175, 80, 0.05) 100%);
`;

const WarningCard = styled(Card)`
  border-left-color: ${theme.colors.warning};
  background: linear-gradient(135deg, ${theme.colors.white} 0%, rgba(255, 152, 0, 0.05) 100%);
`;

function ResultCard({ title, data, type = 'default', actionButton }) {
  const CardComponent = type === 'highlight' ? HighlightCard : type === 'warning' ? WarningCard : Card;

  return (
    <CardComponent>
      <CardTitle>{title}</CardTitle>
      <CardContent>
        {data.map((item, index) => (
          <CardItem key={index}>
            {typeof item === 'object' ? (
              <>
                <CardLabel>{item.label}:</CardLabel>{' '}
                <CardValue>{item.value}</CardValue>
              </>
            ) : (
              item
            )}
          </CardItem>
        ))}
      </CardContent>
      {actionButton && <ActionButtonContainer>{actionButton}</ActionButtonContainer>}
    </CardComponent>
  );
}

function ResultCardGrid({ children }) {
  return <CardGrid>{children}</CardGrid>;
}

export default ResultCard;
export { ResultCardGrid };
