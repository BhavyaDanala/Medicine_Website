import styled from 'styled-components';
import { theme } from '../../styles/theme';

const TableContainer = styled.div`
  overflow-x: auto;
  border-radius: ${theme.spacing.lg};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: ${theme.spacing.xl};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: ${theme.colors.white};
`;

const TableHead = styled.thead`
  background: linear-gradient(135deg, ${theme.colors.medicalBlue} 0%, ${theme.colors.medicalBlueDark} 100%);
  color: ${theme.colors.white};
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: ${theme.colors.lightGray};
  }

  &:hover {
    background-color: rgba(0, 119, 182, 0.05);
  }
`;

const TableCell = styled.td`
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  font-size: ${theme.fontSizes.md};
  color: ${theme.colors.darkGray};
  border-bottom: 1px solid ${theme.colors.mediumGray};

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    font-size: ${theme.fontSizes.sm};
  }
`;

const TableHeaderCell = styled.th`
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  font-size: ${theme.fontSizes.md};
  font-weight: 600;
  text-align: left;
  border-bottom: 1px solid ${theme.colors.mediumGray};

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    font-size: ${theme.fontSizes.sm};
  }
`;

const EmptyRow = styled.tr`
  text-align: center;
`;

const EmptyCell = styled.td`
  padding: ${theme.spacing.xxl};
  font-size: ${theme.fontSizes.md};
  color: ${theme.colors.darkGray};
  text-align: center;
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
            <EmptyRow>
              <EmptyCell colSpan={columns.length}>{emptyMessage}</EmptyCell>
            </EmptyRow>
          )}
        </tbody>
      </Table>
    </TableContainer>
  );
}

export default DataTable;
