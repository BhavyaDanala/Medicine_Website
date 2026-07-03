import styled from 'styled-components';
import { FaInbox } from 'react-icons/fa';
import { theme } from '../../styles/theme';

const TableContainer = styled.div`
  overflow-x: auto;
  border-radius: ${theme.borderRadius.xl};
  box-shadow: ${theme.shadows.md};
  margin-bottom: ${theme.spacing.xxl};
  border: 1px solid ${theme.colors.lightGray};
  background: ${theme.colors.white};

  @media (max-width: ${theme.breakpoints.tablet}) {
    border-radius: ${theme.borderRadius.lg};
    margin-bottom: ${theme.spacing.xl};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    border-radius: ${theme.borderRadius.md};
    margin-bottom: ${theme.spacing.lg};
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: ${theme.colors.white};
  min-width: 600px;
`;

const TableHead = styled.thead`
  background: linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%);
  color: ${theme.colors.white};
  position: sticky;
  top: 0;
  z-index: 10;
`;

const TableRow = styled.tr`
  transition: all ${theme.transitions.normal};
  border-bottom: 1px solid ${theme.colors.lightGray};

  &:nth-child(even) {
    background-color: ${theme.colors.offWhite};
  }

  &:hover {
    background-color: ${theme.colors.primaryLighter};
    transform: scale(1.005);
  }

  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.td`
  padding: ${theme.spacing.lg} ${theme.spacing.xl};
  font-size: ${theme.fontSizes.md};
  color: ${theme.colors.darkerGray};
  font-family: ${theme.fonts.primary};
  font-weight: ${theme.fontWeights.normal};
  line-height: 1.5;

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing.md} ${theme.spacing.lg};
    font-size: ${theme.fontSizes.sm};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    font-size: ${theme.fontSizes.sm};
  }
`;

const TableHeaderCell = styled.th`
  padding: ${theme.spacing.lg} ${theme.spacing.xl};
  font-size: ${theme.fontSizes.md};
  font-weight: ${theme.fontWeights.semibold};
  text-align: left;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-family: ${theme.fonts.primary};
  white-space: nowrap;

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing.md} ${theme.spacing.lg};
    font-size: ${theme.fontSizes.sm};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    font-size: ${theme.fontSizes.xs};
  }
`;

const EmptyState = styled.div`
  padding: ${theme.spacing.xxxl};
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing.lg};
`;

const EmptyIcon = styled.div`
  font-size: 64px;
  color: ${theme.colors.darkGray};
  opacity: 0.3;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 48px;
  }
`;

const EmptyTitle = styled.h3`
  font-size: ${theme.fontSizes.lg};
  color: ${theme.colors.darkerGray};
  margin: 0;
  font-weight: ${theme.fontWeights.semibold};

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.fontSizes.md};
  }
`;

const EmptyText = styled.p`
  font-size: ${theme.fontSizes.md};
  color: ${theme.colors.darkGray};
  margin: 0;
  max-width: 400px;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.fontSizes.sm};
  }
`;

function DataTable({ columns, data, emptyMessage = "No data available" }) {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column, index) => (
              <TableHeaderCell key={index}>{column.header}</TableHeaderCell>
            ))}
          </TableRow>
        </TableHead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((column, colIndex) => (
                  <TableCell key={colIndex}>
                    {column.render ? column.render(row) : row[column.accessor]}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length}>
                <EmptyState>
                  <EmptyIcon>
                    <FaInbox />
                  </EmptyIcon>
                  <EmptyTitle>No Data Found</EmptyTitle>
                  <EmptyText>{emptyMessage}</EmptyText>
                </EmptyState>
              </TableCell>
            </TableRow>
          )}
        </tbody>
      </Table>
    </TableContainer>
  );
}

export default DataTable;
