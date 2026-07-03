export const theme = {
  colors: {
    // Primary - Medical Blue palette
    primary: '#2563eb',
    primaryDark: '#1e40af',
    primaryLight: '#3b82f6',
    primaryLighter: '#dbeafe',
    
    // Secondary - Teal/Cyan palette
    secondary: '#0891b2',
    secondaryDark: '#0e7490',
    secondaryLight: '#22d3ee',
    secondaryLighter: '#cffafe',
    
    // Accent - Green palette
    accent: '#10b981',
    accentDark: '#059669',
    accentLight: '#34d399',
    accentLighter: '#d1fae5',
    
    // Medical specific colors
    medicalBlue: '#0ea5e9',
    medicalBlueDark: '#0369a1',
    medicalBlueLight: '#7dd3fc',
    mintGreen: '#22c55e',
    mintGreenDark: '#16a34a',
    mintGreenLight: '#86efac',
    
    // Neutral colors
    white: '#ffffff',
    offWhite: '#f8fafc',
    lightGray: '#f1f5f9',
    mediumGray: '#cbd5e1',
    darkGray: '#64748b',
    darkerGray: '#475569',
    black: '#0f172a',
    
    // Semantic colors
    error: '#ef4444',
    errorLight: '#fee2e2',
    warning: '#f59e0b',
    warningLight: '#fef3c7',
    success: '#22c55e',
    successLight: '#dcfce7',
    info: '#3b82f6',
    infoLight: '#dbeafe',
    
    // Gradient colors
    gradientStart: '#2563eb',
    gradientEnd: '#0891b2',
    
    // Shadow colors
    shadow: 'rgba(0, 0, 0, 0.1)',
    shadowLight: 'rgba(0, 0, 0, 0.05)',
    shadowDark: 'rgba(0, 0, 0, 0.15)',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    xxl: '32px',
    xxxl: '48px',
    xxxxl: '64px',
  },
  fonts: {
    primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    secondary: "'Poppins', 'Segoe UI', Roboto, Arial, sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', monospace",
  },
  fontSizes: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    md: '18px',
    lg: '20px',
    xl: '24px',
    xxl: '32px',
    xxxl: '40px',
    xxxxl: '48px',
  },
  fontWeights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    xxl: '24px',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    xxl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    glow: '0 0 20px rgba(37, 99, 235, 0.3)',
  },
  breakpoints: {
    mobile: '640px',
    tablet: '768px',
    laptop: '1024px',
    desktop: '1280px',
    wide: '1536px',
  },
  transitions: {
    fast: '150ms ease-in-out',
    normal: '300ms ease-in-out',
    slow: '500ms ease-in-out',
  },
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
};
