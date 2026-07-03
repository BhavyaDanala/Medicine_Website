import styled from 'styled-components';
import { FaPills, FaMapMarkerAlt, FaRupeeSign, FaBox, FaClock, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { theme } from '../../styles/theme';

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: ${theme.spacing.xl};
  margin-bottom: ${theme.spacing.xxl};

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: ${theme.spacing.lg};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.md};
  }
`;

const Card = styled.div`
  background: ${theme.colors.white};
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing.xl};
  box-shadow: ${theme.shadows.md};
  transition: all ${theme.transitions.normal};
  border: 1px solid ${theme.colors.lightGray};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%);
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${theme.shadows.xl};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.lg};
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.lg};
`;

const CardIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${theme.fontSizes.xl};
  flex-shrink: 0;
  background: ${theme.colors.primaryLighter};
  color: ${theme.colors.primary};

  @media (max-width: ${theme.breakpoints.mobile}) {
    width: 40px;
    height: 40px;
    font-size: ${theme.fontSizes.lg};
  }
`;

const CardTitleSection = styled.div`
  flex: 1;
`;

const CardTitle = styled.h4`
  font-size: ${theme.fontSizes.lg};
  color: ${theme.colors.darkerGray};
  margin: 0 0 ${theme.spacing.xs} 0;
  font-weight: ${theme.fontWeights.semibold};
  line-height: 1.3;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.fontSizes.md};
  }
`;

const CardSubtitle = styled.p`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.darkGray};
  margin: 0;
  font-weight: ${theme.fontWeights.normal};
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

const CardItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.darkGray};
  padding: ${theme.spacing.sm} 0;
  border-bottom: 1px solid ${theme.colors.lightGray};

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.fontSizes.xs};
  }
`;

const CardLabel = styled.span`
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.darkerGray};
  min-width: 80px;
`;

const CardValue = styled.span`
  color: ${theme.colors.darkGray};
  flex: 1;
  font-weight: ${theme.fontWeights.normal};
`;

const CardBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.semibold};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ActionButtonContainer = styled.div`
  margin-top: ${theme.spacing.lg};
  padding-top: ${theme.spacing.lg};
  border-top: 1px solid ${theme.colors.lightGray};
`;

const HighlightCard = styled(Card)`
  border-color: ${theme.colors.accentLight};
  background: linear-gradient(135deg, ${theme.colors.white} 0%, ${theme.colors.accentLighter} 100%);

  &::before {
    background: linear-gradient(90deg, ${theme.colors.accent} 0%, ${theme.colors.accentDark} 100%);
  }

  ${CardIcon} {
    background: ${theme.colors.accent};
    color: ${theme.colors.white};
  }
`;

const WarningCard = styled(Card)`
  border-color: ${theme.colors.warningLight};
  background: linear-gradient(135deg, ${theme.colors.white} 0%, ${theme.colors.warningLight} 100%);

  &::before {
    background: linear-gradient(90deg, ${theme.colors.warning} 0%, ${theme.colors.warning} 100%);
  }

  ${CardIcon} {
    background: ${theme.colors.warning};
    color: ${theme.colors.white};
  }
`;

const ErrorCard = styled(Card)`
  border-color: ${theme.colors.errorLight};
  background: linear-gradient(135deg, ${theme.colors.white} 0%, ${theme.colors.errorLight} 100%);

  &::before {
    background: linear-gradient(90deg, ${theme.colors.error} 0%, ${theme.colors.error} 100%);
  }

  ${CardIcon} {
    background: ${theme.colors.error};
    color: ${theme.colors.white};
  }
`;

const InfoCard = styled(Card)`
  border-color: ${theme.colors.infoLight};
  background: linear-gradient(135deg, ${theme.colors.white} 0%, ${theme.colors.infoLight} 100%);

  &::before {
    background: linear-gradient(90deg, ${theme.colors.info} 0%, ${theme.colors.primary} 100%);
  }

  ${CardIcon} {
    background: ${theme.colors.info};
    color: ${theme.colors.white};
  }
`;

function ResultCard({ title, data, type = 'default', actionButton, subtitle, icon }) {
  const CardComponent = type === 'highlight' ? HighlightCard : type === 'warning' ? WarningCard : type === 'error' ? ErrorCard : type === 'info' ? InfoCard : Card;

  const getIcon = () => {
    if (icon) return icon;
    switch (type) {
      case 'highlight':
        return <FaCheckCircle />;
      case 'warning':
        return <FaExclamationCircle />;
      case 'error':
        return <FaExclamationCircle />;
      case 'info':
        return <FaClock />;
      default:
        return <FaPills />;
    }
  };

  return (
    <CardComponent>
      <CardHeader>
        <CardIcon>
          {getIcon()}
        </CardIcon>
        <CardTitleSection>
          <CardTitle>{title}</CardTitle>
          {subtitle && <CardSubtitle>{subtitle}</CardSubtitle>}
        </CardTitleSection>
      </CardHeader>
      <CardContent>
        {data.map((item, index) => (
          <CardItem key={index}>
            {typeof item === 'object' ? (
              <>
                <CardLabel>{item.label}:</CardLabel>
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
