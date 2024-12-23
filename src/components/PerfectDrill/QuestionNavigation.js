const NavigationControls = styled(Box)`
  /* Desktop layout */
  display: flex;
  justify-content: space-between;

  /* Mobile layout */
  @media (max-width: 600px) {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 8px;
    background: white;
    box-shadow: 0 -2px 8px rgba(0,0,0,0.1);
    z-index: 1000;
  }
`; 