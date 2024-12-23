import React from 'react';
import { Layout } from 'antd';
import styled from 'styled-components';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import PerfectDrill from './components/PerfectDrill';

const { Content, Footer } = Layout;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
  background: #f5f5f5;
`;

const StyledContent = styled(Content)`
  padding: 24px 50px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  
  @media (max-width: 1200px) {
    padding: 20px 40px;
  }
  
  @media (max-width: 900px) {
    padding: 16px 24px;
  }
  
  @media (max-width: 600px) {
    padding: 12px 16px;
  }
`;

const StyledFooter = styled(Footer)`
  text-align: center;
  background: transparent;
  margin-top: auto;
`;

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e',
      light: '#ff4081',
      dark: '#c51162',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
      '@media (max-width:600px)': {
        fontSize: '1.75rem',
      },
    },
    h6: {
      fontWeight: 500,
      '@media (max-width:600px)': {
        fontSize: '1.1rem',
      },
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          '@media (max-width: 600px)': {
            fontSize: '14px',
            padding: '10px 16px',
          }
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <StyledLayout>
        <StyledContent>
          <PerfectDrill />
        </StyledContent>
        <StyledFooter>
          ThisInterview Perfect Drill 2024
        </StyledFooter>
      </StyledLayout>
    </ThemeProvider>
  );
}

export default App;
