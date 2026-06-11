import { createGlobalStyle } from 'styled-components';
import { theme } from './theme';

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: ${theme.fonts.primary};
    background-color: ${theme.colors.lightGray};
    color: ${theme.colors.darkGray};
    line-height: 1.6;
  }

  a {
    text-decoration: none;
    color: ${theme.colors.medicalBlue};
    transition: color 0.3s ease;

    &:hover {
      color: ${theme.colors.medicalBlueDark};
    }
  }

  button {
    cursor: pointer;
    font-family: ${theme.fonts.primary};
    transition: all 0.3s ease;
  }

  input {
    font-family: ${theme.fonts.primary};
  }

  /* Responsive keyframes */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideIn {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(0);
    }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  /* Responsive breakpoints */
  @media (max-width: ${theme.breakpoints.mobile}) {
    body {
      font-size: ${theme.fontSizes.sm};
    }
  }

  @media (min-width: ${theme.breakpoints.tablet}) and (max-width: ${theme.breakpoints.desktop}) {
    body {
      font-size: ${theme.fontSizes.md};
    }
  }

  @media (min-width: ${theme.breakpoints.desktop}) {
    body {
      font-size: ${theme.fontSizes.md};
    }
  }
`;

export default GlobalStyles;
