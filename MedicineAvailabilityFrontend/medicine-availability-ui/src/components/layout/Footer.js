import styled from 'styled-components';
import { FaHeartbeat } from 'react-icons/fa';

const FooterContainer = styled.footer`
  background-color: #0f172a;
  color: #f8fafc;
  padding: 16px 40px;
  margin-top: auto;
  border-top: 1px solid #1e293b;

  @media (max-width: 768px) {
    padding: 16px 20px;
  }
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    justify-content: center;
  }
`;

const FooterLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
`;

const FooterIcon = styled(FaHeartbeat)`
  color: #3b82f6;
  font-size: 20px;
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 24px;
  align-items: center;

  @media (max-width: 768px) {
    flex-wrap: wrap;
    justify-content: center;
    gap: 16px;
  }
`;

const FooterLink = styled.a`
  color: #94a3b8;
  font-size: 13px;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: #3b82f6;
  }
`;

const Copyright = styled.div`
  font-size: 13px;
  color: #64748b;
  font-weight: 500;
`;

function Footer() {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterLogo>
          <FooterIcon />
          <span>MediFind</span>
        </FooterLogo>
        
        <FooterLinks>
          <FooterLink href="#">About</FooterLink>
          <FooterLink href="#">Contact</FooterLink>
          <FooterLink href="#">Privacy Policy</FooterLink>
          <FooterLink href="#">Terms of Service</FooterLink>
        </FooterLinks>

        <Copyright>
          © 2026 MediFind. All rights reserved.
        </Copyright>
      </FooterContent>
    </FooterContainer>
  );
}

export default Footer;
