import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Container,
  Menu,
  MenuItem,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  useMediaQuery,
} from '@mui/material';
import styled from 'styled-components';

import VoiceControls from './VoiceControls';
import QuestionNavigation from './QuestionNavigation';
import QuestionEditor from './QuestionEditor';
import RecordingControls from './RecordingControls';
import ImportExportControls from './ImportExportControls';
import { StyledTitle } from './styles';
import { readFileAsText, processQuestions, downloadFile } from './utils';

const PerfectDrill = ({ t }) => {
  // State management
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [showVoiceControls, setShowVoiceControls] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [voiceSpeed, setVoiceSpeed] = useState(1);
  const [voices, setVoices] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordings, setRecordings] = useState({});
  const [modelAnswers, setModelAnswers] = useState({});
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showClearAllDialog, setShowClearAllDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Refs
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingIntervalRef = useRef(null);
  const audioRef = useRef(new Audio());

  // Effects
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0) {
        setSelectedVoice(availableVoices[0].name);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
    };
  }, [isRecording]);

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    return () => {
      // Stop any ongoing recording
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
      
      // Clear recording interval
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      
      // Stop any ongoing playback
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      
      // Clean up audio URLs
      Object.values(recordings).forEach(url => {
        URL.revokeObjectURL(url);
      });
      
      // Cancel any ongoing speech synthesis
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isRecording, recordings]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime || 0);
    };

    const handleDurationChange = () => {
      setDuration(audio.duration || 0);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);

    // Initialize audio source if there's a recording
    if (recordings[currentQuestionIndex]) {
      audio.src = recordings[currentQuestionIndex];
    }

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentQuestionIndex, recordings]);

  // Voice synthesis
  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      const voice = voices.find(v => v.name === selectedVoice);
      if (voice) {
        utterance.voice = voice;
      }
      utterance.rate = voiceSpeed;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Handlers
  const handleQuestionChange = (event) => {
    const newQuestions = [...questions];
    newQuestions[currentQuestionIndex] = event.target.value;
    setQuestions(newQuestions);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleNavigateNext();
    }
  };

  const handleNavigateFirst = () => setCurrentQuestionIndex(0);
  const handleNavigatePrev = () => setCurrentQuestionIndex(prev => Math.max(0, prev - 1));
  const handleNavigateNext = () => {
    if (currentQuestionIndex === questions.length - 1) {
      setQuestions([...questions, '']);
    }
    setCurrentQuestionIndex(prev => prev + 1);
    setIsEditing(true);
  };
  const handleNavigateLast = () => setCurrentQuestionIndex(questions.length - 1);

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        try {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          const audioUrl = URL.createObjectURL(audioBlob);
          
          // Set up audio element with the new recording
          const audio = audioRef.current;
          if (audio) {
            // Clean up old URLs to prevent memory leaks
            if (recordings[currentQuestionIndex]) {
              URL.revokeObjectURL(recordings[currentQuestionIndex]);
            }
            
            // Update recordings state
            setRecordings(prev => ({
              ...prev,
              [currentQuestionIndex]: audioUrl
            }));

            // Load the new recording
            audio.src = audioUrl;
            audio.load(); // Force load to get duration
          }

          stream.getTracks().forEach(track => track.stop());
        } catch (error) {
          console.error('Error processing recording:', error);
          setSnackbar({
            open: true,
            message: t.recordingError || 'Error processing recording',
            severity: 'error'
          });
        }
      };

      mediaRecorder.onerror = (error) => {
        console.error('MediaRecorder error:', error);
        setSnackbar({
          open: true,
          message: t.recordingError || 'Error during recording',
          severity: 'error'
        });
        handleStopRecording();
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setSnackbar({
        open: true,
        message: t.microphoneError || 'Error accessing microphone',
        severity: 'error'
      });
    }
  };

  const handleStopRecording = () => {
    try {
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
        if (recordingIntervalRef.current) {
          clearInterval(recordingIntervalRef.current);
        }
      }
    } catch (error) {
      console.error('Error stopping recording:', error);
      setSnackbar({
        open: true,
        message: t.stopRecordingError || 'Error stopping recording',
        severity: 'error'
      });
    }
  };

  const handlePlayRecording = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      if (recordings[currentQuestionIndex]) {
        audio.src = recordings[currentQuestionIndex];
        audio.play().catch(error => {
          console.error('Error playing audio:', error);
          setIsPlaying(false);
        });
        setIsPlaying(true);
      }
    }
  };

  const handleDeleteRecording = () => {
    if (recordings[currentQuestionIndex]) {
      URL.revokeObjectURL(recordings[currentQuestionIndex]);
    }
    const newRecordings = { ...recordings };
    delete newRecordings[currentQuestionIndex];
    setRecordings(newRecordings);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    
    const audio = audioRef.current;
    if (audio) {
      audio.src = '';
    }
    
    setSnackbar({
      open: true,
      message: t.deleteSuccess,
      severity: 'success'
    });
  };

  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const text = await readFileAsText(file);
        const newQuestions = processQuestions(text);
        setQuestions(prevQuestions => [...prevQuestions, ...newQuestions]);
        setSnackbar({
          open: true,
          message: t.importSuccess,
          severity: 'success'
        });
      } catch (error) {
        console.error('Error reading file:', error);
        setSnackbar({
          open: true,
          message: error.message,
          severity: 'error'
        });
      }
    }
    event.target.value = null;
  };

  const handleExport = () => {
    const content = questions.join('\n');
    downloadFile(content, 'questions.txt');
  };

  const handleEditQuestion = (index) => {
    if (isEditing) {
      // Save the current question
      setIsEditing(false);
    } else {
      // Enter edit mode
      setIsEditing(true);
    }
  };

  const handleDeleteClick = (index) => {
    setCurrentQuestionIndex(index);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    const newQuestions = questions.filter((_, index) => index !== currentQuestionIndex);
    setQuestions(newQuestions);
    setShowDeleteDialog(false);
    if (currentQuestionIndex >= newQuestions.length) {
      setCurrentQuestionIndex(Math.max(0, newQuestions.length - 1));
    }
    setSnackbar({
      open: true,
      message: t.deleteSuccess,
      severity: 'success'
    });
  };

  const handleClearAllClick = () => {
    setShowClearAllDialog(true);
  };

  const handleClearAllConfirm = () => {
    setQuestions([]);
    setRecordings({});
    setModelAnswers({});
    setCurrentQuestionIndex(0);
    setShowClearAllDialog(false);
    setSnackbar({
      open: true,
      message: t.clearAllSuccess,
      severity: 'success'
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleLanguageClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLanguageClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageSelect = (lang) => {
    localStorage.setItem('language', lang);
    window.location.reload();
  };

  // Current question
  const currentQuestion = questions[currentQuestionIndex] || '';
  const hasRecording = recordings.hasOwnProperty(currentQuestionIndex);

  // Add this hook to detect mobile screens
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const ControlsContainer = styled(Box)`
    display: flex;
    gap: 16px;

    /* Stack controls vertically on mobile */
    @media (max-width: 600px) {
      flex-direction: column;
      gap: 8px;
      
      /* Full width buttons on mobile */
      & > button {
        width: 100%;
      }
    }
  `;

  const handleTouchStart = (e) => {
    if (isMobile) {
      // Mobile-specific touch handling
    }
  };

  return (
    <Container maxWidth="lg" sx={{ 
      py: { xs: 2, sm: 4 },
      px: { xs: 2, sm: 4, md: 6 },
      maxWidth: '1400px',
      pb: { xs: '120px', sm: 4 },
    }}>
      <StyledTitle component="h1">
        {t.title}
      </StyledTitle>

      <VoiceControls
        t={t}
        showVoiceControls={showVoiceControls}
        setShowVoiceControls={setShowVoiceControls}
        selectedVoice={selectedVoice}
        setSelectedVoice={setSelectedVoice}
        voiceSpeed={voiceSpeed}
        setVoiceSpeed={setVoiceSpeed}
        voices={voices}
        handleLanguageClick={handleLanguageClick}
        anchorEl={anchorEl}
        handleLanguageClose={handleLanguageClose}
        handleLanguageSelect={handleLanguageSelect}
      />

      <QuestionEditor
        t={t}
        currentQuestion={currentQuestion}
        currentQuestionIndex={currentQuestionIndex}
        isEditing={isEditing}
        handleQuestionChange={handleQuestionChange}
        handleEditQuestion={handleEditQuestion}
        handleDeleteClick={handleDeleteClick}
        handleKeyDown={handleKeyDown}
      />

      <RecordingControls
        t={t}
        isRecording={isRecording}
        hasRecording={hasRecording}
        recordingTime={recordingTime}
        isPlaying={isPlaying}
        handleStartRecording={handleStartRecording}
        handleStopRecording={handleStopRecording}
        handlePlayRecording={handlePlayRecording}
        handleDeleteRecording={handleDeleteRecording}
        currentTime={currentTime}
        duration={duration}
      />

      <QuestionNavigation
        t={t}
        currentQuestionIndex={currentQuestionIndex}
        questions={questions}
        handleNavigateFirst={handleNavigateFirst}
        handleNavigatePrev={handleNavigatePrev}
        handleNavigateNext={handleNavigateNext}
        handleNavigateLast={handleNavigateLast}
      />

      <ImportExportControls
        t={t}
        handleImport={handleImport}
        handleExport={handleExport}
        handleClearAllClick={handleClearAllClick}
      />

      <Dialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
      >
        <DialogTitle>{t.confirmDelete}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t.deleteConfirmation}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)}>
            {t.cancel}
          </Button>
          <Button onClick={handleDeleteConfirm} autoFocus>
            {t.confirm}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showClearAllDialog}
        onClose={() => setShowClearAllDialog(false)}
      >
        <DialogTitle>{t.confirmClearAll}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t.clearAllConfirmation}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowClearAllDialog(false)}>
            {t.cancel}
          </Button>
          <Button onClick={handleClearAllConfirm} autoFocus>
            {t.confirm}
          </Button>
        </DialogActions>
      </Dialog>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleLanguageClose}
      >
        <MenuItem onClick={() => handleLanguageSelect('zh')}>中文</MenuItem>
        <MenuItem onClick={() => handleLanguageSelect('en')}>English</MenuItem>
      </Menu>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={1000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Box
        onTouchStart={handleTouchStart}
        sx={{
          // Disable hover effects on mobile
          '@media (max-width: 600px)': {
            '&:hover': {
              backgroundColor: 'transparent'
            }
          }
        }}
      >
        {isMobile ? (
          <MobileComponent />
        ) : (
          <DesktopComponent />
        )}
      </Box>
    </Container>
  );
};

export default PerfectDrill;
