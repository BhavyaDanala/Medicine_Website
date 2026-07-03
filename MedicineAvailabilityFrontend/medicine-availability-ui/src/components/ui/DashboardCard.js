import styled from 'styled-components';
import { theme } from '../../styles/theme';

const CardContainer = styled.div`
  background: ${theme.colors.white};
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing.xxl};
  box-shadow: ${theme.shadows.md};
  transition: all ${theme.transitions.normal};
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  min-height: 180px;
  justify-content: center;
  border: 1px solid ${theme.colors.lightGray};

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${theme.shadows.lg};
    border-color: ${theme.colors.primaryLighter};
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing.xl};
    min-height: 160px;
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.lg};
    min-height: 140px;
  }
`;

const IconContainer = styled.div`
  font-size: ${theme.fontSizes.xxxl};
  color: ${({ color }) => color || theme.colors.primary};
  margin-bottom: ${theme.spacing.md};
  transition: transform ${theme.transitions.normal};

  ${CardContainer}:hover & {
    transform: scale(1.1);
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: ${theme.fontSizes.xxl};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.fontSizes.xl};
    margin-bottom: ${theme.spacing.sm};
  }
`;

const Title = styled.h3`
  font-size: ${theme.fontSizes.md};
  color: ${theme.colors.darkGray};
  margin-bottom: ${theme.spacing.sm};
  font-weight: ${theme.fontWeights.semibold};
  font-family: ${theme.fonts.primary};

  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: ${theme.fontSizes.sm};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.fontSizes.xs};
  }
`;

const Value = styled.p`
  font-size: ${theme.fontSizes.xxxl};
  font-weight: ${theme.fontWeights.extrabold};
  color: ${({ color }) => color || theme.colors.primary};
  font-family: ${theme.fonts.primary};
  line-height: 1.2;

  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: ${theme.fontSizes.xxl};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.fontSizes.xl};
  }
`;

function DashboardCard({ title, value, icon: Icon, color }) {
  return (
    <CardContainer>
      {Icon && (
        <IconContainer color={color}>
          <Icon />
        </IconContainer>
      )}
      <Title>{title}</Title>
      <Value color={color}>{value}</Value>
    </CardContainer>
  );
}

export default DashboardCard;
