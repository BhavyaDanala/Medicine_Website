import styled from 'styled-components';
import { theme } from '../../styles/theme';
import Header from './Header';
import Footer from './Footer';

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
  padding: ${theme.spacing.xl};
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  animation: fadeIn 0.5s ease-in;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.md};
  }

  @media (min-width: ${theme.breakpoints.tablet}) and (max-width: ${theme.breakpoints.desktop}) {
    padding: ${theme.spacing.lg};
  }
`;

function Layout({ children, userRole, onLogout, showHeader = true, showFooter = true }) {
  return (
    <LayoutContainer>
      {showHeader && <Header userRole={userRole} onLogout={onLogout} />}
      <MainContent>
        {children}
      </MainContent>
      {showFooter && <Footer />}
    </LayoutContainer>
  );
}

export default Layout;
