import styled from 'styled-components';
import { theme } from '../../styles/theme';

const TabContainer = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.xl};
  border-bottom: 2px solid ${theme.colors.lightGray};
  padding-bottom: ${theme.spacing.xs};
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-track {
    background: ${theme.colors.offWhite};
    border-radius: ${theme.borderRadius.sm};
  }

  &::-webkit-scrollbar-thumb {
    background: ${theme.colors.mediumGray};
    border-radius: ${theme.borderRadius.sm};

    &:hover {
      background: ${theme.colors.darkGray};
    }
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    gap: ${theme.spacing.sm};
    margin-bottom: ${theme.spacing.lg};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    gap: ${theme.spacing.xs};
    margin-bottom: ${theme.spacing.md};
  }
`;

const TabButton = styled.button`
  padding: ${theme.spacing.md} ${theme.spacing.xl};
  border: none;
  background: none;
  font-size: ${theme.fontSizes.md};
  font-weight: ${theme.fontWeights.medium};
  font-family: ${theme.fonts.primary};
  color: ${theme.colors.darkGray};
  cursor: pointer;
  transition: all ${theme.transitions.normal};
  border-bottom: 3px solid transparent;
  white-space: nowrap;
  position: relative;

  &:hover {
    color: ${theme.colors.primary};
    background-color: ${theme.colors.offWhite};
    border-radius: ${theme.borderRadius.md} ${theme.borderRadius.md} 0 0;
  }

  &.active {
    color: ${theme.colors.primary};
    border-bottom-color: ${theme.colors.primary};
    font-weight: ${theme.fontWeights.semibold};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${theme.colors.primaryLighter};
    border-radius: ${theme.borderRadius.md};
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing.sm} ${theme.spacing.lg};
    font-size: ${theme.fontSizes.sm};
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
          aria-label={`Switch to ${tab.label} tab`}
        >
          {tab.label}
        </TabButton>
      ))}
    </TabContainer>
  );
}

export default TabNavigation;
