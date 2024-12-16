import React from 'react';
import {
  Box,
  IconButton,
  Tooltip,
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import DeleteIcon from '@mui/icons-material/Delete';

const RecordingControls = ({
  t,
  isRecording,
  startRecording,
  stopRecording,
  recordings,
  currentQuestionIndex,
  setShowDeleteRecordingDialog,
}) => {
  return (
    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', my: 2 }}>
      {!isRecording ? (
        <Tooltip title={t.startRecording}>
          <IconButton
            onClick={startRecording}
            sx={{
              animation: recordings[currentQuestionIndex] ? 'none' : 'pulse 2s infinite'
            }}
          >
            <MicIcon />
          </IconButton>
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
