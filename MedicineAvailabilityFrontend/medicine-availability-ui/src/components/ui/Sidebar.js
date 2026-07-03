import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const SidebarContainer = styled.div`
  width: ${props => props.$collapsed ? '80px' : '260px'};
  background: ${theme.colors.white};
  border-right: 1px solid ${theme.colors.lightGray};
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 10;
  box-shadow: 2px 0 10px rgba(0,0,0,0.02);
  min-height: calc(100vh - 64px); /* assuming header is 64px */

  @media (max-width: ${theme.breakpoints.tablet}) {
    position: fixed;
    top: 64px;
    bottom: 0;
    left: 0;
    transform: ${props => props.$mobileOpen ? 'translateX(0)' : 'translateX(-100%)'};
    width: 260px;
    box-shadow: 4px 0 20px rgba(0,0,0,0.1);
  }
`;

const SidebarNav = styled.nav`
  flex: 1;
  padding: ${theme.spacing.lg} ${theme.spacing.md};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
  overflow-y: auto;
  overflow-x: hidden;
`;

const NavItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  padding: 12px 16px;
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  color: ${props => props.$active ? theme.colors.primary : theme.colors.textSecondary};
  background: ${props => props.$active ? theme.colors.primaryLighter : 'transparent'};
  font-weight: ${props => props.$active ? theme.fontWeights.bold : theme.fontWeights.medium};
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: ${props => props.$active ? theme.colors.primaryLighter : theme.colors.lightGray};
    color: ${props => props.$active ? theme.colors.primary : theme.colors.text};
  }

  svg {
    font-size: 20px;
    flex-shrink: 0;
    color: ${props => props.$active ? theme.colors.primary : theme.colors.textSecondary};
  }
`;

const NavLabel = styled.span`
  opacity: ${props => props.$collapsed ? 0 : 1};
  transform: ${props => props.$collapsed ? 'translateX(-10px)' : 'translateX(0)'};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 14px;
`;

const CollapseButton = styled.button`
  position: absolute;
  top: 20px;
  right: -14px;
  width: 28px;
  height: 28px;
  background: ${theme.colors.white};
  border: 1px solid ${theme.colors.lightGray};
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: ${theme.colors.textSecondary};
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  transition: all 0.2s;
  z-index: 20;

  &:hover {
    color: ${theme.colors.primary};
    border-color: ${theme.colors.primary};
    transform: scale(1.1);
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    display: none;
  }
`;

function Sidebar({ items, activeTab, onTabChange, isMobileOpen, onCloseMobile }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <SidebarContainer $collapsed={collapsed} $mobileOpen={isMobileOpen}>
      <CollapseButton onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? <FaChevronRight size={12} /> : <FaChevronLeft size={12} />}
      </CollapseButton>
      <SidebarNav>
        {items.map(item => (
          <NavItem 
            key={item.id} 
            $active={activeTab === item.id}
            onClick={() => {
              onTabChange(item.id);
              if (onCloseMobile) onCloseMobile();
            }}
            title={collapsed ? item.label : ''}
          >
            {item.icon}
            <NavLabel $collapsed={collapsed}>{item.label}</NavLabel>
          </NavItem>
        ))}
      </SidebarNav>
    </SidebarContainer>
  );
}

export default Sidebar;
