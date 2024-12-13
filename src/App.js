import React from 'react';
import { Layout } from 'antd';
import styled from 'styled-components';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import PerfectDrill from './components/PerfectDrill';

const { Content, Footer } = Layout;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
`;

const StyledContent = styled(Content)`
  padding: 24px 50px;
  @media (max-width: 600px) {
    padding: 16px 16px;
  }
`;

const StyledFooter = styled(Footer)`
  text-align: center;
`;

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
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
          All Rights Reserved. ThisAI &copy; 2024
        </StyledFooter>
      </StyledLayout>
    </ThemeProvider>
  );
}

export default App;
