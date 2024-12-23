import React from 'react';
import {
  Box,
  IconButton,
  Tooltip,
  Button,
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import DeleteIcon from '@mui/icons-material/Delete';
import styled from 'styled-components';

const RecordingControls = ({
  t,
  isRecording,
  startRecording,
  stopRecording,
  recordings,
  currentQuestionIndex,
  setShowDeleteRecordingDialog,
}) => {
  const RecordingButton = styled(Button)`
    /* Mobile-specific touch targets */
    @media (max-width: 600px) {
      min-height: 48px;  // Larger touch target
      margin: 8px 0;     // More spacing between buttons
      
      /* Prevent text selection on touch */
      user-select: none;
      -webkit-tap-highlight-color: transparent;
    }
  `;

  return (
    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', my: 2 }}>
      {!isRecording ? (
        <Tooltip title={t.startRecording}>
          <RecordingButton
            onClick={startRecording}
            sx={{
              animation: recordings[currentQuestionIndex] ? 'none' : 'pulse 2s infinite'
            }}
          >
            <MicIcon />
          </RecordingButton>
        </Tooltip>
      ) : (
        <Tooltip title={t.stopRecording}>
          <IconButton
            onClick={stopRecording}
            color="error"
            sx={{ animation: 'pulseError 2s infinite' }}
          >
            <StopIcon />
          </IconButton>
        </Tooltip>
      )}
      
      {recordings[currentQuestionIndex] && (
        <Tooltip title={t.deleteRecording}>
          <IconButton
            onClick={() => setShowDeleteRecordingDialog(true)}
            color="error"
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};

export default RecordingControls;
