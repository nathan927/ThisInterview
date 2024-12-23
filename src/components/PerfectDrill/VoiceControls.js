import React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Slider,
  IconButton,
  Tooltip,
  Menu,
} from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import styled from 'styled-components';

// Create styled components for mobile-specific layout
const MobileControlsWrapper = styled(Box)`
  @media (max-width: 600px) {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: white;
    padding: 12px;
    box-shadow: 0 -2px 8px rgba(0,0,0,0.1);
    z-index: 1000;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
`;

const VoiceControls = ({
  t,
  selectedVoice,
  availableVoices,
  setSelectedVoice,
  readingSpeed,
  handleSpeedChange,
  handleLanguageClick,
  anchorEl,
  handleLanguageClose,
  handleLanguageSelect,
}) => {
  return (
    <MobileControlsWrapper>
      <Box sx={{ 
        display: 'flex', 
        gap: 2, 
        alignItems: 'center',
        flexWrap: 'wrap',
        width: '100%',
        justifyContent: 'center',
        '@media (max-width: 600px)': {
          flexDirection: 'column',
          gap: 1
        }
      }}>
        <FormControl sx={{ 
          width: { xs: '100%', sm: 200 },
          '@media (max-width: 600px)': {
            marginBottom: 1
          }
        }}>
          <InputLabel>{t.voice}</InputLabel>
          <Select
            value={selectedVoice}
            onChange={(e) => {
              const voice = availableVoices.find(v => v === e.target.value);
              if (voice) setSelectedVoice(voice);
            }}
            size="small"
          >
            {availableVoices.map((voice) => (
              <MenuItem key={voice} value={voice}>
                {`${voice.name} (${voice.lang})`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ 
          width: { xs: '100%', sm: 200 },
          '@media (max-width: 600px)': {
            marginBottom: 1
          }
        }}>
          <Typography gutterBottom>
            {t.speed}: {readingSpeed}x
          </Typography>
          <Slider
            value={readingSpeed}
            onChange={handleSpeedChange}
            min={0.5}
            max={2}
            step={0.1}
            marks
            valueLabelDisplay="auto"
            size="small"
          />
        </Box>

        <Box sx={{
          '@media (max-width: 600px)': {
            position: 'absolute',
            top: -40,
            right: 12
          }
        }}>
          <Tooltip title={t.changeLanguage}>
            <IconButton
              onClick={handleLanguageClick}
              size="small"
            >
              <LanguageIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleLanguageClose}
      >
        <MenuItem onClick={() => handleLanguageSelect('en')}>
          English
        </MenuItem>
        <MenuItem onClick={() => handleLanguageSelect('zh')}>
          中文
        </MenuItem>
      </Menu>
    </MobileControlsWrapper>
  );
};

export default VoiceControls;
