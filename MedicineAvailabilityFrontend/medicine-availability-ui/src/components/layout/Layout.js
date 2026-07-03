import styled from 'styled-components';
import Header from './Header';
import Footer from './Footer';
import Sidebar from '../ui/Sidebar';
import { useState } from 'react';

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f8faff;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex: 1;
  position: relative;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 28px 32px;
  max-width: ${props => props.$hasSidebar ? 'calc(100vw - 80px)' : '1440px'};
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
  animation: fadeIn 0.4s ease-out;
  overflow-x: hidden;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0);   }
  }

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

function Layout({ children, userRole, onLogout, activeTab, onTabChange, showHeader = true, showFooter = true, sidebarItems = null }) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <LayoutContainer>
      {showHeader && (
        <Header
          userRole={userRole}
          onLogout={onLogout}
          activeTab={activeTab}
          onTabChange={onTabChange}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          hasSidebar={!!sidebarItems}
        />
      )}
      <ContentWrapper>
        {sidebarItems && (
          <Sidebar 
            items={sidebarItems} 
            activeTab={activeTab} 
            onTabChange={onTabChange}
            isMobileOpen={isMobileSidebarOpen}
            onCloseMobile={() => setIsMobileSidebarOpen(false)}
          />
        )}
        <MainContent $hasSidebar={!!sidebarItems}>{children}</MainContent>
      </ContentWrapper>
      {showFooter && <Footer />}
    </LayoutContainer>
  );
}

export default Layout;
