import styled from 'styled-components';
import { FaHeartbeat, FaLinkedin, FaGithub } from 'react-icons/fa';
import { theme } from '../../styles/theme';

const FooterContainer = styled.footer`
  background-color: ${theme.colors.medicalBlueDark};
  color: ${theme.colors.white};
  padding: ${theme.spacing.xl} ${theme.spacing.xl};
  margin-top: auto;

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.lg} ${theme.spacing.md};
  }
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.mobile}) {
    flex-direction: column;
    text-align: center;
  }
`;

const FooterLogo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  font-size: ${theme.fontSizes.lg};
  font-weight: bold;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.fontSizes.md};
  }
`;

const FooterIcon = styled(FaHeartbeat)`
  color: ${theme.colors.mintGreen};
`;

const FooterLinks = styled.div`
  display: flex;
  gap: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.mobile}) {
    flex-direction: column;
    gap: ${theme.spacing.sm};
  }
`;

const FooterLink = styled.a`
  color: ${theme.colors.white};
  transition: color 0.3s ease;

  &:hover {
    color: ${theme.colors.mintGreen};
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.mobile}) {
    gap: ${theme.spacing.lg};
  }
`;

const SocialIcon = styled.a`
  color: ${theme.colors.white};
  font-size: ${theme.fontSizes.lg};
  transition: all 0.3s ease;

  &:hover {
    color: ${theme.colors.mintGreen};
    transform: translateY(-2px);
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.fontSizes.xl};
  }
`;

const Copyright = styled.div`
  text-align: center;
  margin-top: ${theme.spacing.lg};
  padding-top: ${theme.spacing.md};
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.medicalBlueLight};

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.fontSizes.xs};
  }
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
        <SocialLinks>
          <SocialIcon href="#">
            <FaLinkedin />
          </SocialIcon>
          <SocialIcon href="#">
            <FaGithub />
          </SocialIcon>
        </SocialLinks>
      </FooterContent>
      <Copyright>
        © 2026 MediFind. All rights reserved.
      </Copyright>
    </FooterContainer>
  );
}

export default Footer;
