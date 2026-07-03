import styled from 'styled-components';
import { FaTrophy, FaStore, FaRupeeSign, FaRoad, FaBoxOpen, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { theme } from '../../styles/theme';

const ResultsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

const ResultsHeader = styled.div`
  text-align: center;
  margin-bottom: ${theme.spacing.lg};
`;

const ResultsTitle = styled.h3`
  font-size: ${theme.fontSizes.xl};
  font-weight: ${theme.fontWeights.bold};
  color: ${theme.colors.text};
  margin: 0 0 ${theme.spacing.sm} 0;
`;

const ResultsSubtitle = styled.p`
  font-size: ${theme.fontSizes.md};
  color: ${theme.colors.textSecondary};
  margin: 0;
`;

// Best Deal Card (Cheapest)
const BestDealCard = styled.div`
  background: linear-gradient(135deg, #f5af19 0%, #f12711 100%);
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing.xl};
  color: white;
  box-shadow: 0 8px 32px rgba(241, 39, 17, 0.3);
  position: relative;
  overflow: hidden;
  margin-bottom: ${theme.spacing.lg};

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%);
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.lg};
  }
`;

const BestDealBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  padding: ${theme.spacing.xs} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.xl};
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.bold};
  margin-bottom: ${theme.spacing.md};
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const BestDealContent = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.mobile}) {
    flex-direction: column;
    text-align: center;
    gap: ${theme.spacing.md};
  }
`;

const BestDealLeft = styled.div`
  flex: 1;
`;

const BestDealPharmacy = styled.h4`
  font-size: ${theme.fontSizes.xl};
  font-weight: ${theme.fontWeights.bold};
  margin: 0 0 ${theme.spacing.xs} 0;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};

  @media (max-width: ${theme.breakpoints.mobile}) {
    justify-content: center;
    font-size: ${theme.fontSizes.lg};
  }
`;

const BestDealSavings = styled.div`
  font-size: ${theme.fontSizes.md};
  background: rgba(255, 255, 255, 0.2);
  padding: ${theme.spacing.xs} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  display: inline-block;
  margin-top: ${theme.spacing.sm};
`;

const BestDealPrice = styled.div`
  font-size: 3rem;
  font-weight: ${theme.fontWeights.bold};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 2.5rem;
  }
`;

// Regular Comparison Cards
const ComparisonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const ComparisonCard = styled.div`
  background: ${theme.colors.white};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.lg};
  border: 2px solid ${theme.colors.lightGray};
  transition: all ${theme.transitions.normal};
  position: relative;

  &:hover {
    border-color: ${theme.colors.primary};
    box-shadow: ${theme.shadows.md};
    transform: translateY(-2px);
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.md};
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${theme.spacing.md};
  padding-bottom: ${theme.spacing.md};
  border-bottom: 1px solid ${theme.colors.lightGray};
`;

const PharmacyName = styled.div`
  font-size: ${theme.fontSizes.lg};
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.text};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const PriceBadge = styled.div`
  background: ${props => props.$isCheapest 
    ? 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' 
    : theme.colors.lightGray};
  color: ${props => props.$isCheapest ? 'white' : theme.colors.text};
  padding: ${theme.spacing.xs} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSizes.lg};
  font-weight: ${theme.fontWeights.bold};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
`;

const CardDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${theme.spacing.sm};
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.textSecondary};
`;

const DetailIcon = styled.div`
  color: ${theme.colors.primary};
  display: flex;
  align-items: center;
  font-size: ${theme.fontSizes.sm};
`;

const StatusBadge = styled.div`
  position: absolute;
  top: ${theme.spacing.md};
  right: ${theme.spacing.md};
  background: ${props => props.$isOpen ? theme.colors.success : theme.colors.error};
  color: white;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.bold};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
`;

// Helper function to check if pharmacy is currently open
const isPharmacyOpen = (openingTime, closingTime) => {
  if (!openingTime || !closingTime) return true;

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const parseTimeToMinutes = (timeString) => {
    if (!timeString) return null;
    const [time, period] = timeString.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    return hours * 60 + minutes;
  };

  const openMinutes = parseTimeToMinutes(openingTime);
  const closeMinutes = parseTimeToMinutes(closingTime);

  if (openMinutes === null || closeMinutes === null) return true;

  if (closeMinutes < openMinutes) {
    return currentMinutes >= openMinutes || currentMinutes < closeMinutes;
  }

  return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
};

function PriceComparisonResults({ results, medicineName }) {
  if (!results || results.length === 0) return null;

  // Get cheapest and most expensive for savings calculation
  const cheapest = results[0];
  const mostExpensive = results[results.length - 1];
  const savings = mostExpensive.price - cheapest.price;

  // Split results - first one is cheapest (already sorted by backend)
  const bestDeal = results[0];
  const otherDeals = results.slice(1);

  return (
    <ResultsContainer>
      <ResultsHeader>
        <ResultsTitle>💰 Price Comparison for {medicineName}</ResultsTitle>
        <ResultsSubtitle>Compare prices across {results.length} pharmacies</ResultsSubtitle>
      </ResultsHeader>

      {/* Best Deal Card */}
      <BestDealCard>
        <BestDealBadge>
          <FaTrophy />
          Best Deal
        </BestDealBadge>
        <BestDealContent>
          <BestDealLeft>
            <BestDealPharmacy>
              <FaStore />
              {bestDeal.pharmacyName}
            </BestDealPharmacy>
            {savings > 0 && (
              <BestDealSavings>
                Save ₹{savings} compared to {mostExpensive.pharmacyName}
              </BestDealSavings>
            )}
          </BestDealLeft>
          <BestDealPrice>
            <FaRupeeSign style={{ fontSize: '2rem' }} />
            {bestDeal.price}
          </BestDealPrice>
        </BestDealContent>
      </BestDealCard>

      {/* Other Pharmacies Grid */}
      {otherDeals.length > 0 && (
        <ComparisonGrid>
          {otherDeals.map((pharmacy, index) => {
            const isOpen = isPharmacyOpen(pharmacy.openingTime, pharmacy.closingTime);
            const priceDiff = pharmacy.price - cheapest.price;

            return (
              <ComparisonCard key={index}>
                <StatusBadge $isOpen={isOpen}>
                  {isOpen ? <FaCheckCircle /> : <FaTimesCircle />}
                  {isOpen ? 'Open' : 'Closed'}
                </StatusBadge>

                <CardHeader>
                  <PharmacyName>
                    <FaStore />
                    {pharmacy.pharmacyName}
                  </PharmacyName>
                </CardHeader>

                <PriceBadge $isCheapest={false}>
                  <FaRupeeSign />
                  {pharmacy.price}
                </PriceBadge>

                {priceDiff > 0 && (
                  <div style={{ 
                    fontSize: '0.85rem', 
                    color: theme.colors.error,
                    marginTop: theme.spacing.sm,
                    fontWeight: 500
                  }}>
                    +₹{priceDiff} more expensive
                  </div>
                )}

                <CardDetails style={{ marginTop: theme.spacing.md }}>
                  {pharmacy.distanceKm && (
                    <DetailItem>
                      <DetailIcon><FaRoad /></DetailIcon>
                      {pharmacy.distanceKm.toFixed(2)} km
                    </DetailItem>
                  )}
                  <DetailItem>
                    <DetailIcon><FaBoxOpen /></DetailIcon>
                    {pharmacy.quantity} in stock
                  </DetailItem>
                </CardDetails>
              </ComparisonCard>
            );
          })}
        </ComparisonGrid>
      )}
    </ResultsContainer>
  );
}

export default PriceComparisonResults;
