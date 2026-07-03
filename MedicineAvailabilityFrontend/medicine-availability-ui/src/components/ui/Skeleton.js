import styled, { keyframes } from 'styled-components';
import { theme } from '../../styles/theme';

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const SkeletonBase = styled.div`
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: ${props => props.radius || theme.borderRadius.md};
`;

const SkeletonText = styled(SkeletonBase)`
  height: ${props => props.height || '16px'};
  width: ${props => props.width || '100%'};
  margin-bottom: ${props => props.$marginBottom || '0'};
`;

const SkeletonCircle = styled(SkeletonBase)`
  width: ${props => props.size || '40px'};
  height: ${props => props.size || '40px'};
  border-radius: 50%;
`;

const SkeletonCard = styled.div`
  background: ${theme.colors.white};
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing.xl};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #e0e0e0;
`;

const SkeletonCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.lg};
`;

const SkeletonCardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

const SkeletonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: ${theme.spacing.xl};
  margin-bottom: ${theme.spacing.xxl};

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: ${theme.spacing.lg};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.md};
  }
`;

function Skeleton({ type = 'text', ...props }) {
  switch (type) {
    case 'text':
      return <SkeletonText {...props} />;
    case 'circle':
      return <SkeletonCircle {...props} />;
    case 'card':
      return (
        <SkeletonCard>
          <SkeletonCardHeader>
            <SkeletonCircle size="48px" />
            <div style={{ flex: 1 }}>
              <SkeletonText width="60%" height="20px" $marginBottom="8px" />
              <SkeletonText width="40%" height="14px" />
            </div>
          </SkeletonCardHeader>
          <SkeletonCardContent>
            <SkeletonText width="100%" height="16px" />
            <SkeletonText width="80%" height="16px" />
            <SkeletonText width="60%" height="16px" />
          </SkeletonCardContent>
        </SkeletonCard>
      );
    case 'dashboard':
      return (
        <SkeletonCard>
          <SkeletonCardHeader>
            <SkeletonCircle size="40px" />
            <div style={{ flex: 1 }}>
              <SkeletonText width="50%" height="18px" $marginBottom="8px" />
              <SkeletonText width="30%" height="24px" />
            </div>
          </SkeletonCardHeader>
        </SkeletonCard>
      );
    default:
      return <SkeletonText {...props} />;
  }
}

function SkeletonGridItem({ count = 3 }) {
  return (
    <SkeletonGrid>
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton key={index} type="card" />
      ))}
    </SkeletonGrid>
  );
}

export default Skeleton;
export { SkeletonGridItem };
