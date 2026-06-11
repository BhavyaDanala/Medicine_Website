import styled from 'styled-components';
import { theme } from '../../styles/theme';

const TabContainer = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.xl};
  border-bottom: 2px solid ${theme.colors.lightGray};
  padding-bottom: ${theme.spacing.xs};
  overflow-x: auto;

  @media (max-width: ${theme.breakpoints.mobile}) {
    gap: ${theme.spacing.xs};
    margin-bottom: ${theme.spacing.lg};
  }
`;

const TabButton = styled.button`
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border: none;
  background: none;
  font-size: ${theme.fontSizes.md};
  font-weight: 500;
  color: ${theme.colors.darkGray};
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 3px solid transparent;
  white-space: nowrap;

  &:hover {
    color: ${theme.colors.medicalBlue};
  }

  &.active {
    color: ${theme.colors.medicalBlue};
    border-bottom-color: ${theme.colors.medicalBlue};
    font-weight: 600;
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    font-size: ${theme.fontSizes.sm};
  }
`;

function TabNavigation({ tabs, activeTab, onTabChange }) {
  return (
    <TabContainer>
      {tabs.map((tab) => (
        <TabButton
          key={tab.id}
          className={activeTab === tab.id ? 'active' : ''}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </TabButton>
      ))}
    </TabContainer>
  );
}

export default TabNavigation;
