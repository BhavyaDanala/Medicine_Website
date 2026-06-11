import styled from 'styled-components';
import { FaHeartbeat, FaSignOutAlt } from 'react-icons/fa';
import { theme } from '../../styles/theme';

const HeaderContainer = styled.header`
  background: linear-gradient(135deg, ${theme.colors.medicalBlue} 0%, ${theme.colors.medicalBlueDark} 100%);
  color: ${theme.colors.white};
  padding: ${theme.spacing.md} ${theme.spacing.xl};
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    flex-direction: column;
    gap: ${theme.spacing.sm};
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  font-size: ${theme.fontSizes.xl};
  font-weight: bold;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.fontSizes.lg};
  }
`;

const LogoIcon = styled(FaHeartbeat)`
  font-size: ${theme.fontSizes.xxl};
  color: ${theme.colors.mintGreen};

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.fontSizes.xl};
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.mobile}) {
    gap: ${theme.spacing.md};
  }
`;

const NavItem = styled.a`
  color: ${theme.colors.white};
  font-weight: 500;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.spacing.sm};
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.fontSizes.sm};
    padding: ${theme.spacing.xs} ${theme.spacing.sm};
  }
`;

const LogoutButton = styled.button`
  background-color: ${theme.colors.mintGreen};
  color: ${theme.colors.white};
  border: none;
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  border-radius: ${theme.spacing.sm};
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  transition: all 0.3s ease;

  &:hover {
    background-color: ${theme.colors.mintGreenDark};
    transform: translateY(-2px);
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.xs} ${theme.spacing.md};
    font-size: ${theme.fontSizes.sm};
  }
`;

const LogoutIcon = styled(FaSignOutAlt)`
  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.fontSizes.sm};
  }
`;

function Header({ userRole, onLogout }) {
  return (
    <HeaderContainer>
      <Logo>
        <LogoIcon />
        <span>MediFind</span>
      </Logo>
      <Nav>
        {userRole && (
          <NavItem>
            {userRole} Dashboard
          </NavItem>
        )}
        {onLogout && (
          <LogoutButton onClick={onLogout}>
            <LogoutIcon />
            Logout
          </LogoutButton>
        )}
      </Nav>
    </HeaderContainer>
  );
}

export default Header;
