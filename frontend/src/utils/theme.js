import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2c5282', // A deeper, more elegant blue
      light: '#4299e1',
      dark: '#1a365d',
    },
    secondary: {
      main: '#805ad5', // A softer purple
      light: '#9f7aea',
      dark: '#553c9a',
    },
    background: {
      default: '#f7fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#2d3748',
      secondary: '#4a5568',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontFamily: '"Playfair Display", serif',
      fontSize: '3rem',
      fontWeight: 700,
      marginBottom: '1.5rem',
      color: '#2d3748',
    },
    h2: {
      fontFamily: '"Playfair Display", serif',
      fontSize: '2.5rem',
      fontWeight: 700,
      marginBottom: '1.25rem',
    },
    h3: {
      fontFamily: '"Playfair Display", serif',
      fontSize: '2rem',
      fontWeight: 700,
      marginBottom: '1rem',
    },
    h4: {
      fontFamily: '"Playfair Display", serif',
      fontSize: '1.75rem',
      fontWeight: 600,
      marginBottom: '0.875rem',
    },
    h5: {
      fontFamily: '"Playfair Display", serif',
      fontSize: '1.5rem',
      fontWeight: 600,
      marginBottom: '0.75rem',
    },
    h6: {
      fontFamily: '"Playfair Display", serif',
      fontSize: '1.25rem',
      fontWeight: 600,
      marginBottom: '0.625rem',
    },
    body1: {
      fontFamily: '"Merriweather", serif',
      fontSize: '1.125rem',
      lineHeight: 1.8,
      color: '#2d3748',
    },
    body2: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: '#4a5568',
    },
    subtitle1: {
      fontSize: '1.125rem',
      fontStyle: 'italic',
      color: '#4a5568',
      marginBottom: '1rem',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Merriweather:wght@300;400;700&display=swap');
      `,
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '8px 24px',
          fontSize: '1rem',
          fontWeight: 500,
        },
        contained: {
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.12)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
        },
        elevation1: {
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
        },
        elevation2: {
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
        },
        elevation3: {
          boxShadow: '0 6px 8px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '&:hover fieldset': {
              borderColor: '#4299e1',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#2c5282',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          fontSize: '0.875rem',
          height: 28,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          margin: '24px 0',
          backgroundColor: 'rgba(0, 0, 0, 0.08)',
        },
      },
    },
  },
});

export default theme;
