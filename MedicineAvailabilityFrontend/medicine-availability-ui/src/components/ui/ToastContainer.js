import { ToastContainer as ToastifyContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';
import { theme } from '../../styles/theme';

const StyledToastContainer = styled(ToastifyContainer)`
  .Toastify__toast {
    background: ${theme.colors.white};
    border-radius: ${theme.spacing.md};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    font-family: ${theme.fonts.primary};
  }

  .Toastify__toast--success {
    background: linear-gradient(135deg, ${theme.colors.mintGreen} 0%, ${theme.colors.mintGreenDark} 100%);
    color: ${theme.colors.white};
  }

  .Toastify__toast--error {
    background: linear-gradient(135deg, ${theme.colors.error} 0%, #c62828 100%);
    color: ${theme.colors.white};
  }

  .Toastify__toast--warning {
    background: linear-gradient(135deg, ${theme.colors.warning} 0%, #f57c00 100%);
    color: ${theme.colors.white};
  }

  .Toastify__toast--info {
    background: linear-gradient(135deg, ${theme.colors.medicalBlue} 0%, ${theme.colors.medicalBlueDark} 100%);
    color: ${theme.colors.white};
  }

  .Toastify__progress-bar {
    background: ${theme.colors.white};
  }
`;

function ToastContainer() {
  return (
    <StyledToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  );
}

export default ToastContainer;
