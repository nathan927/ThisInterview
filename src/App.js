import React from 'react';
import { Layout } from 'antd';
import styled from 'styled-components';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
    mode: 'light',
  },
});

function App() {
  return (
    <Router basename="/ThisInterview">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <StyledLayout>
          <StyledContent>
            <Routes>
              <Route path="/" element={<PerfectDrill />} />
            </Routes>
          </StyledContent>
          <StyledFooter>ThisInterview &copy;2023</StyledFooter>
        </StyledLayout>
      </ThemeProvider>
    </Router>
  );
}

export default App;
