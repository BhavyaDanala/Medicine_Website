import React from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';

const StaticContainer = styled.div`
  margin-top: ${theme.spacing.xxl};
  animation: fadeIn 0.5s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const IntroSection = styled.div`
  text-align: center;
  max-width: 800px;
  margin: 0 auto ${theme.spacing.xxl};
`;

const IntroTitle = styled.h2`
  font-size: ${theme.fontSizes.xxl};
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.md};
  font-weight: ${theme.fontWeights.bold};
`;

const IntroDescription = styled.p`
  font-size: ${theme.fontSizes.md};
  color: ${theme.colors.textSecondary};
  line-height: 1.6;
`;

const FeatureCardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${theme.spacing.xl};
  margin-bottom: ${theme.spacing.xxxl};
`;

const FeatureCard = styled.div`
  background: ${theme.colors.white};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.xl};
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 25px rgba(0, 0, 0, 0.1);
    border-color: rgba(102, 126, 234, 0.3);
  }
`;

const CardIcon = styled.div`
  font-size: 40px;
  margin-bottom: ${theme.spacing.lg};
  color: ${theme.colors.primary};
`;

const CardTitle = styled.h3`
  font-size: ${theme.fontSizes.lg};
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.sm};
  font-weight: ${theme.fontWeights.semibold};
`;

const CardDescription = styled.p`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.textSecondary};
  line-height: 1.5;
`;

const HowItWorksSection = styled.div`
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing.xxl};
`;

const HowItWorksTitle = styled.h3`
  text-align: center;
  font-size: ${theme.fontSizes.xl};
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.xxl};
  font-weight: ${theme.fontWeights.bold};
`;

const StepsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: ${theme.spacing.lg};
`;

const StepItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  flex: 1;
  min-width: 150px;
  position: relative;

  &:not(:last-child)::after {
    content: '';
    position: absolute;
    top: 25px;
    right: -50%;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, rgba(102, 126, 234, 0.5) 0%, transparent 100%);
    z-index: 0;

    @media (max-width: ${theme.breakpoints.tablet}) {
      display: none;
    }
  }
`;

const StepNumber = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${theme.fontSizes.lg};
  font-weight: bold;
  margin-bottom: ${theme.spacing.md};
  z-index: 1;
  box-shadow: 0 4px 10px rgba(102, 126, 234, 0.3);
`;

const StepTitle = styled.h4`
  font-size: ${theme.fontSizes.md};
  color: ${theme.colors.text};
  font-weight: ${theme.fontWeights.medium};
`;

const StaticStateDisplay = ({ title, description, cards, steps }) => {
  return (
    <StaticContainer>
      <IntroSection>
        <IntroTitle>{title}</IntroTitle>
        <IntroDescription>{description}</IntroDescription>
      </IntroSection>

      <FeatureCardsGrid>
        {cards.map((card, index) => (
          <FeatureCard key={index}>
            <CardIcon>{card.icon}</CardIcon>
            <CardTitle>{card.title}</CardTitle>
            <CardDescription>{card.description}</CardDescription>
          </FeatureCard>
        ))}
      </FeatureCardsGrid>

      <HowItWorksSection>
        <HowItWorksTitle>How It Works</HowItWorksTitle>
        <StepsContainer>
          {steps.map((step, index) => (
            <StepItem key={index}>
              <StepNumber>{index + 1}</StepNumber>
              <StepTitle>{step}</StepTitle>
            </StepItem>
          ))}
        </StepsContainer>
      </HowItWorksSection>
    </StaticContainer>
  );
};

export default StaticStateDisplay;
