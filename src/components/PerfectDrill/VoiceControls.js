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
    <Box sx={{ 
      display: 'flex', 
      gap: 2, 
      alignItems: 'center',
      flexWrap: 'wrap',
      width: '100%',
      justifyContent: 'center',
      position: { xs: 'fixed', sm: 'static' },
      bottom: { xs: 0, sm: 'auto' },
      left: { xs: 0, sm: 'auto' },
      right: { xs: 0, sm: 'auto' },
      bgcolor: 'background.paper',
      p: 2,
      zIndex: { xs: 1000, sm: 1 },
      flexDirection: { xs: 'column', sm: 'row' },
      boxShadow: { 
        xs: '0px -2px 4px rgba(0, 0, 0, 0.1)', 
        sm: 'none' 
      },
      mb: { xs: 0, sm: 2 }
    }}>
      <FormControl sx={{ width: { xs: '100%', sm: 200 } }}>
        <InputLabel>{t.voice}</InputLabel>
        <Select
          value={selectedVoice?.name || ''}
          onChange={(e) => {
            const voice = availableVoices.find(v => v.name === e.target.value);
            if (voice) setSelectedVoice(voice);
          }}
        >
          {availableVoices.map((voice) => (
            <MenuItem key={voice.name} value={voice.name}>
              {voice.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box sx={{ width: { xs: '100%', sm: 200 } }}>
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
        />
      </Box>

      <Box sx={{
        position: { xs: 'absolute', sm: 'static' },
        top: { xs: 2, sm: 'auto' },
        right: { xs: 2, sm: 'auto' }
      }}>
        <Tooltip title={t.changeLanguage}>
          <IconButton
            onClick={handleLanguageClick}
            size="small"
            sx={{ ml: 1 }}
          >
            <LanguageIcon />
          </IconButton>
        </Tooltip>
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
      </Box>
    </Box>
  );
};

export default VoiceControls;
