import styled from 'styled-components';
import { FaStore, FaRoad, FaBoxOpen, FaRupeeSign, FaRegClock, FaCheckCircle, FaTimesCircle, FaLocationArrow } from 'react-icons/fa';
import { theme } from '../../styles/theme';

const ResultsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

const ResultsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${theme.spacing.sm};
  }
`;

const ResultsTitle = styled.h3`
  font-size: ${theme.fontSizes.lg};
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const ResultsCount = styled.span`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.textSecondary};
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.md};
  }
`;

const MedicineCard = styled.div`
  background: ${theme.colors.white};
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing.lg};
  box-shadow: ${theme.shadows.md};
  border: 1px solid ${theme.colors.lightGray};
  transition: all ${theme.transitions.normal};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${theme.shadows.xl};
    border-color: ${theme.colors.primary};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.md};
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing.sm};
`;

const PharmacyInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  flex: 1;
`;

const PharmacyIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%);
  border-radius: ${theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.white};
  font-size: ${theme.fontSizes.md};
  flex-shrink: 0;
`;

const PharmacyName = styled.h4`
  font-size: ${theme.fontSizes.md};
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.text};
  margin: 0;
  flex: 1;
`;

const AvailabilityBadge = styled.div`
  background: ${props => props.$isOpen ? theme.colors.success : theme.colors.error};
  color: ${theme.colors.white};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.bold};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  white-space: nowrap;
`;

const CardDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${theme.spacing.md};
  padding-top: ${theme.spacing.md};
  border-top: 1px solid ${theme.colors.lightGray};

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.sm};
  }
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const DetailIcon = styled.div`
  color: ${theme.colors.primary};
  font-size: ${theme.fontSizes.md};
  display: flex;
  align-items: center;
`;

const DetailLabel = styled.span`
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.textSecondary};
  font-weight: ${theme.fontWeights.medium};
`;

const DetailValue = styled.span`
  font-size: ${theme.fontSizes.md};
  color: ${theme.colors.text};
  font-weight: ${theme.fontWeights.semibold};
`;

const DetailGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

const TimingInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.textSecondary};
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

function NearbyMedicineResults({ results, medicineName, onViewLocation }) {
  if (!results || results.length === 0) return null;

  return (
    <ResultsContainer>
      <ResultsHeader>
        <ResultsTitle>
          <FaLocationArrow />
          Pharmacies with {medicineName} near you
        </ResultsTitle>
        <ResultsCount>{results.length} results found</ResultsCount>
      </ResultsHeader>

      <CardsGrid>
        {results.map((pharmacy, index) => {
          const isOpen = isPharmacyOpen(pharmacy.openingTime, pharmacy.closingTime);

          return (
            <MedicineCard key={index}>
              <CardHeader>
                <PharmacyInfo>
                  <PharmacyIcon>
                    <FaStore />
                  </PharmacyIcon>
                  <PharmacyName>{pharmacy.pharmacyName}</PharmacyName>
                </PharmacyInfo>
                <AvailabilityBadge $isOpen={isOpen}>
                  {isOpen ? <FaCheckCircle /> : <FaTimesCircle />}
                  {isOpen ? 'Open Now' : 'Closed'}
                </AvailabilityBadge>
              </CardHeader>

              <CardDetails>
                <DetailItem>
                  <DetailIcon>
                    <FaRoad />
                  </DetailIcon>
                  <DetailGroup>
                    <DetailLabel>Distance</DetailLabel>
                    <DetailValue>{pharmacy.distanceKm.toFixed(2)} km</DetailValue>
                  </DetailGroup>
                </DetailItem>

                <DetailItem>
                  <DetailIcon>
                    <FaBoxOpen />
                  </DetailIcon>
                  <DetailGroup>
                    <DetailLabel>Available Stock</DetailLabel>
                    <DetailValue>{pharmacy.quantity} units</DetailValue>
                  </DetailGroup>
                </DetailItem>

                <DetailItem>
                  <DetailIcon>
                    <FaRupeeSign />
                  </DetailIcon>
                  <DetailGroup>
                    <DetailLabel>Price</DetailLabel>
                    <DetailValue>₹{pharmacy.price}</DetailValue>
                  </DetailGroup>
                </DetailItem>

                <DetailItem>
                  <DetailIcon>
                    <FaRegClock />
                  </DetailIcon>
                  <DetailGroup>
                    <DetailLabel>Timings</DetailLabel>
                    <TimingInfo>
                      {pharmacy.openingTime} - {pharmacy.closingTime}
                    </TimingInfo>
                  </DetailGroup>
                </DetailItem>
              </CardDetails>

              <div style={{ marginTop: '16px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                <button 
                  onClick={() => onViewLocation && onViewLocation(pharmacy)}
                  style={{ width: '100%', background: '#eff6ff', color: '#1a56db', border: '1px solid #bfdbfe', padding: '10px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s' }}
                >
                  <FaLocationArrow /> View Location
                </button>
              </div>
            </MedicineCard>
          );
        })}
      </CardsGrid>
    </ResultsContainer>
  );
}

export default NearbyMedicineResults;
