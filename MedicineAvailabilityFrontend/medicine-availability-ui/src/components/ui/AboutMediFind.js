import React from 'react';
import styled from 'styled-components';
import { FaStethoscope, FaMapMarkerAlt, FaBalanceScale, FaSearchLocation, FaBolt, FaCheckCircle, FaPills, FaStore, FaUsers, FaSearch } from 'react-icons/fa';
import { theme } from '../../styles/theme';

const AboutContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xxxl};
  padding-bottom: ${theme.spacing.xxxl};
  animation: fadeIn 0.5s ease-in-out;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const HeroSection = styled.div`
  background: linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%);
  border-radius: ${theme.borderRadius.xxl};
  padding: 60px 40px;
  color: ${theme.colors.white};
  text-align: center;
  position: relative;
  overflow: hidden;
  box-shadow: ${theme.shadows.xl};

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%);
  }
`;

const HeroTitle = styled.h1`
  font-size: 48px;
  font-weight: 800;
  margin-bottom: 24px;
  letter-spacing: -1px;
  line-height: 1.2;
  position: relative;
  z-index: 1;

  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: 36px;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 18px;
  font-weight: 400;
  max-width: 800px;
  margin: 0 auto 40px auto;
  line-height: 1.6;
  opacity: 0.9;
  position: relative;
  z-index: 1;
`;

const CTAButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  position: relative;
  z-index: 1;
  flex-wrap: wrap;
`;

const CTAButton = styled.button`
  background: ${props => props.$primary ? '#fff' : 'rgba(255,255,255,0.2)'};
  color: ${props => props.$primary ? theme.colors.primary : '#fff'};
  border: ${props => props.$primary ? 'none' : '1px solid rgba(255,255,255,0.5)'};
  padding: 14px 28px;
  border-radius: 999px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: ${props => props.$primary ? '0 4px 15px rgba(0,0,0,0.1)' : 'none'};

  &:hover {
    transform: translateY(-2px);
    background: ${props => props.$primary ? '#f8fafc' : 'rgba(255,255,255,0.3)'};
    box-shadow: ${props => props.$primary ? '0 6px 20px rgba(0,0,0,0.15)' : 'none'};
  }
`;

const SectionTitle = styled.h2`
  font-size: 32px;
  font-weight: 800;
  color: ${theme.colors.darkerGray};
  text-align: center;
  margin-bottom: 40px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
`;

const FeatureCard = styled.div`
  background: #fff;
  border-radius: 20px;
  padding: 32px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  border: 1px solid #f1f5f9;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0,0,0,0.08);
    border-color: ${theme.colors.primaryLighter};
  }
`;

const FeatureIcon = styled.div`
  width: 64px;
  height: 64px;
  background: ${theme.colors.primaryLighter};
  color: ${theme.colors.primary};
  border-radius: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 28px;
  margin: 0 auto 20px auto;
`;

const FeatureTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: ${theme.colors.darkerGray};
  margin-bottom: 12px;
`;

const FeatureDesc = styled.p`
  font-size: 15px;
  color: ${theme.colors.darkGray};
  line-height: 1.6;
`;

const StepsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 32px;
  flex-wrap: wrap;
`;

const StepCard = styled.div`
  background: #fff;
  border-radius: 20px;
  padding: 32px;
  flex: 1;
  min-width: 250px;
  max-width: 350px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  border: 1px solid #f1f5f9;
  position: relative;
  text-align: left;
`;

const StepNumber = styled.div`
  position: absolute;
  top: -20px;
  left: 32px;
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%);
  color: #fff;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  font-weight: 800;
  box-shadow: 0 4px 15px rgba(26, 86, 219, 0.3);
`;

const StepTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: ${theme.colors.darkerGray};
  margin-top: 16px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
`;

const StatCard = styled.div`
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 20px;
  padding: 32px;
  text-align: center;
  border: 1px solid #e2e8f0;
`;

const StatValue = styled.div`
  font-size: 40px;
  font-weight: 800;
  color: ${theme.colors.primary};
  margin-bottom: 8px;
`;

const StatLabel = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: ${theme.colors.darkGray};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const FooterCTA = styled.div`
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  border-radius: 24px;
  padding: 60px 40px;
  text-align: center;
  color: #fff;
`;

const FooterCTATitle = styled.h2`
  font-size: 32px;
  font-weight: 800;
  margin-bottom: 16px;
`;

const FooterCTADesc = styled.p`
  font-size: 18px;
  color: #94a3b8;
  margin-bottom: 32px;
`;

function AboutMediFind({ onNavigate }) {
  return (
    <AboutContainer>
      <HeroSection>
        <HeroTitle>Find Medicines Faster. Smarter. Closer.</HeroTitle>
        <HeroSubtitle>
          MediFind helps you instantly discover medicine availability, compare nearby pharmacies, and locate the best options near you in real time.
        </HeroSubtitle>
      </HeroSection>

      <div>
        <SectionTitle>Why MediFind</SectionTitle>
        <Grid>
          <FeatureCard>
            <FeatureIcon><FaBolt /></FeatureIcon>
            <FeatureTitle>Real-Time Availability</FeatureTitle>
            <FeatureDesc>Stop calling multiple stores. See exactly which pharmacies have your required medicine in stock right now.</FeatureDesc>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon><FaMapMarkerAlt /></FeatureIcon>
            <FeatureTitle>Find Nearby Pharmacies</FeatureTitle>
            <FeatureDesc>Locate open pharmacies around you effortlessly using your current location or a saved address.</FeatureDesc>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon><FaBalanceScale /></FeatureIcon>
            <FeatureTitle>Compare Prices Instantly</FeatureTitle>
            <FeatureDesc>Compare prices across different stores to ensure you get the best deal available.</FeatureDesc>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon><FaSearchLocation /></FeatureIcon>
            <FeatureTitle>Locate on Map</FeatureTitle>
            <FeatureDesc>Get interactive maps and exact distances to the pharmacy that has what you need.</FeatureDesc>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon><FaStethoscope /></FeatureIcon>
            <FeatureTitle>Smart Symptom Search</FeatureTitle>
            <FeatureDesc>Not sure what you need? Search by symptom to discover commonly recommended over-the-counter options.</FeatureDesc>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon><FaCheckCircle /></FeatureIcon>
            <FeatureTitle>Quick & Reliable Results</FeatureTitle>
            <FeatureDesc>A fast, seamless, and intuitive experience designed to get you the right medication with zero hassle.</FeatureDesc>
          </FeatureCard>
        </Grid>
      </div>

      <div>
        <SectionTitle>How It Works</SectionTitle>
        <StepsContainer>
          <StepCard>
            <StepNumber>1</StepNumber>
            <StepTitle>Search by Symptom or Medicine</StepTitle>
            <FeatureDesc style={{ marginTop: '12px' }}>Enter the specific name of the medicine you need or simply type in your symptoms to explore recommendations.</FeatureDesc>
          </StepCard>
          <StepCard>
            <StepNumber>2</StepNumber>
            <StepTitle>Check Availability Across Pharmacies</StepTitle>
            <FeatureDesc style={{ marginTop: '12px' }}>We instantly scan nearby pharmacies and show you who has stock, sorted by distance, price, or open status.</FeatureDesc>
          </StepCard>
          <StepCard>
            <StepNumber>3</StepNumber>
            <StepTitle>Visit the Nearest Pharmacy</StepTitle>
            <FeatureDesc style={{ marginTop: '12px' }}>Use our interactive map view to get directions and head straight to the pharmacy with confidence.</FeatureDesc>
          </StepCard>
        </StepsContainer>
      </div>

      <div>
        <SectionTitle>MediFind Platform</SectionTitle>
        <StatsGrid>
          <StatCard>
            <StatValue>10k+</StatValue>
            <StatLabel>Medicines Available</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>500+</StatValue>
            <StatLabel>Registered Pharmacies</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>50k+</StatValue>
            <StatLabel>Active Users</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>1M+</StatValue>
            <StatLabel>Successful Searches</StatLabel>
          </StatCard>
        </StatsGrid>
      </div>

      <FooterCTA>
        <FooterCTATitle>Your medicine should never be difficult to find.</FooterCTATitle>
        <FooterCTADesc>Start searching smarter with MediFind.</FooterCTADesc>
      </FooterCTA>

    </AboutContainer>
  );
}

export default AboutMediFind;
