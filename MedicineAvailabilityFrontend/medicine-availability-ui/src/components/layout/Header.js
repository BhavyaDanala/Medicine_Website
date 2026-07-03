import styled, { keyframes } from 'styled-components';
import { FaHeartbeat, FaSignOutAlt, FaUserCircle, FaBars, FaTimes, FaHome, FaSearch, FaPills, FaMapMarkerAlt, FaStethoscope, FaChevronDown } from 'react-icons/fa';
import { useState, useRef, useEffect } from 'react';
import { theme } from '../../styles/theme';
import AddressManagerModal from '../ui/AddressManagerModal';
import { jwtDecode } from "jwt-decode";

const slideDown = keyframes`
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0);   }
`;

const HeaderContainer = styled.header`
  background: #ffffff;
  border-bottom: 1px solid #e8ecf4;
  color: #0f172a;
  padding: 0 32px;
  height: 64px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 12px rgba(0,0,0,0.07);
  position: sticky;
  top: 0;
  z-index: ${theme.zIndex.sticky};

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: 0 16px;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: opacity 0.2s;
  text-decoration: none;

  &:hover { opacity: 0.85; }
`;

const LogoIconWrap = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, #1a56db 0%, #0891b2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LogoIcon = styled(FaHeartbeat)`
  font-size: 18px;
  color: #ffffff;
`;

const LogoText = styled.span`
  font-size: 20px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.5px;

  span {
    color: #1a56db;
  }
`;

/* ── CENTER NAV ── */
const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 4px;

  @media (max-width: ${theme.breakpoints.tablet}) {
    display: none;
    position: absolute;
    top: 64px;
    left: 0;
    right: 0;
    background: #ffffff;
    flex-direction: column;
    padding: 12px 16px 16px;
    gap: 4px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.10);
    border-top: 1px solid #e8ecf4;
    align-items: stretch;

    ${({ $isOpen }) => $isOpen && `display: flex;`}
  }
`;

const NavItem = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 13.5px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: all 0.18s;
  white-space: nowrap;

  svg { font-size: 13px; color: #6b7280; transition: color 0.18s; }

  &:hover {
    background: #eff6ff;
    color: #1a56db;
    svg { color: #1a56db; }
  }

  &.active {
    background: #eff6ff;
    color: #1a56db;
    svg { color: #1a56db; }
    font-weight: 600;
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: 12px 14px;
    border-radius: 10px;
    font-size: 14px;

    &:hover { background: #eff6ff; }
  }
`;

const NavDivider = styled.div`
  width: 1px;
  height: 20px;
  background: #e2e8f0;
  margin: 0 6px;

  @media (max-width: ${theme.breakpoints.tablet}) {
    display: none;
  }
`;

/* ── RIGHT SECTION ── */
const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const UserMenu = styled.div`
  position: relative;
`;

const UserButton = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 14px;
  border: 1.5px solid #e2e8f0;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.2s;
  background: #f8faff;
  font-size: 13px;
  font-weight: 600;
  color: #374151;

  &:hover {
    border-color: #1a56db;
    background: #eff6ff;
    color: #1a56db;
  }
`;

const UserAvatarIcon = styled(FaUserCircle)`
  font-size: 22px;
  color: #1a56db;
`;

const ChevronIcon = styled(FaChevronDown)`
  font-size: 10px;
  color: #6b7280;
  transition: transform 0.2s;
  transform: ${props => props.$open ? 'rotate(180deg)' : 'rotate(0)'};
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: #ffffff;
  border: 1px solid #e8ecf4;
  border-radius: 14px;
  box-shadow: 0 12px 40px rgba(0,0,0,0.12);
  padding: 8px;
  min-width: 200px;
  z-index: ${theme.zIndex.dropdown};
  animation: ${slideDown} 0.18s ease-out;
`;

const DropdownItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 13.5px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: all 0.15s;

  svg { font-size: 14px; color: #6b7280; }

  &:hover {
    background: #eff6ff;
    color: #1a56db;
    svg { color: #1a56db; }
  }

  &.danger {
    color: #dc2626;
    svg { color: #dc2626; }
    &:hover { background: #fef2f2; }
  }
`;

const DropdownDivider = styled.div`
  height: 1px;
  background: #f1f5f9;
  margin: 6px 0;
`;

const RolePill = styled.div`
  background: ${props => props.$role === 'Admin' ? '#fef3c7' : props.$role === 'Pharmacy' ? '#d1fae5' : '#dbeafe'};
  color: ${props => props.$role === 'Admin' ? '#92400e' : props.$role === 'Pharmacy' ? '#065f46' : '#1e40af'};
  border-radius: 999px;
  padding: 2px 10px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.3px;
  text-transform: uppercase;
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: #374151;
  font-size: 22px;
  cursor: pointer;
  padding: 6px;

  @media (max-width: ${theme.breakpoints.tablet}) {
    display: flex;
    align-items: center;
  }
`;

const customerNavItems = [
  { icon: <FaStethoscope />, label: "By Symptom", tab: "symptom-search" },
  { icon: <FaPills />, label: "Availability", tab: "availability-check" },
  { icon: <FaSearch />, label: "Find Near Me", tab: "find-near-me" },
];

function Header({ userRole, onLogout, activeTab, onTabChange, hasSidebar, onToggleMobileSidebar }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAddressManager, setShowAddressManager] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [userName, setUserName] = useState("User");
  const [userEmail, setUserEmail] = useState("");
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    try {
        const token = localStorage.getItem("token");
        if (token) {
            const decoded = jwtDecode(token);
            setUserName(decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || decoded.name || "User");
            setUserEmail(decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] || decoded.email || "");
        }
    } catch(e) {}

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavItemClick = (tab) => {
    if (onTabChange) onTabChange(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <HeaderContainer>
        <Logo>
          <LogoIconWrap><LogoIcon /></LogoIconWrap>
          <LogoText>Medi<span>Find</span></LogoText>
        </Logo>

        {/* CENTER NAV - Customer only */}
        {userRole === 'Customer' && (
          <Nav $isOpen={isMobileMenuOpen}>
            {customerNavItems.map((item, idx) => (
              <NavItem
                key={item.tab}
                className={activeTab === item.tab ? 'active' : ''}
                onClick={() => handleNavItemClick(item.tab)}
              >
                {item.icon}
                {item.label}
              </NavItem>
            ))}
          </Nav>
        )}

        {/* RIGHT */}
        <RightSection>
          {(userRole === 'Customer' || hasSidebar) && (
            <MobileMenuButton onClick={() => {
              if (hasSidebar && onToggleMobileSidebar) {
                onToggleMobileSidebar();
              } else {
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }
            }}>
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </MobileMenuButton>
          )}

          <UserMenu ref={menuRef}>
            <UserButton onClick={() => setUserMenuOpen(!userMenuOpen)}>
              <UserAvatarIcon />
              <RolePill $role={userRole}>{userRole}</RolePill>
              <ChevronIcon $open={userMenuOpen} />
            </UserButton>

            {userMenuOpen && (
              <DropdownMenu>
                <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FaUserCircle style={{ fontSize: '32px', color: '#1a56db' }} />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: '700', fontSize: '14px', color: '#0f172a' }}>{userName}</span>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>{userEmail}</span>
                  </div>
                </div>
                <div style={{ padding: '0 14px 10px' }}>
                  <RolePill $role={userRole} style={{ display: 'inline-block' }}>{userRole}</RolePill>
                </div>
                {userRole === 'Customer' && (
                  <>
                    <DropdownDivider />
                    <DropdownItem onClick={() => { setUserMenuOpen(false); setShowAddressManager(true); }}>
                      <FaHome /> My Addresses
                    </DropdownItem>
                  </>
                )}
                <DropdownDivider />
                {onLogout && (
                  <DropdownItem className="danger" onClick={onLogout}>
                    <FaSignOutAlt /> Sign Out
                  </DropdownItem>
                )}
              </DropdownMenu>
            )}
          </UserMenu>
        </RightSection>
      </HeaderContainer>

      {showAddressManager && <AddressManagerModal onClose={() => setShowAddressManager(false)} />}
    </>
  );
}

export default Header;
