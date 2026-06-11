import styled from 'styled-components';
import { theme } from '../../styles/theme';

const CardContainer = styled.div`
  background: ${theme.colors.white};
  border-radius: ${theme.spacing.lg};
  padding: ${theme.spacing.xl};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  min-height: 150px;
  justify-content: center;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.lg};
    min-height: 120px;
  }
`;

const IconContainer = styled.div`
  font-size: ${theme.fontSizes.xxl};
  color: ${({ color }) => color || theme.colors.medicalBlue};
  margin-bottom: ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.fontSizes.xl};
  }
`;

const Title = styled.h3`
  font-size: ${theme.fontSizes.md};
  color: ${theme.colors.darkGray};
  margin-bottom: ${theme.spacing.sm};
  font-weight: 600;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.fontSizes.sm};
  }
`;

const Value = styled.p`
  font-size: ${theme.fontSizes.xxl};
  font-weight: bold;
  color: ${({ color }) => color || theme.colors.medicalBlue};

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
