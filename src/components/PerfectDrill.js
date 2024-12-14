import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Snackbar,
  Alert,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Select,
  FormControl,
  InputLabel,
  Slider,
  styled,
  Collapse,
} from '@mui/material';
import { keyframes } from '@mui/system';
import StopIcon from '@mui/icons-material/Stop';
import MicIcon from '@mui/icons-material/Mic';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import LanguageIcon from '@mui/icons-material/Language';
import DeleteIcon from '@mui/icons-material/Delete';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { translations } from '../translations';

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const shimmerTitle = keyframes`
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
`;

const StyledTitle = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(5),
  fontSize: '3rem',
  fontWeight: 700,
  background: 'linear-gradient(90deg, #007FFF, #0059B2 16.66%, #00838F 33.33%, #7B1FA2 50%, #C2185B 66.66%, #FF8F00 83.33%, #007FFF)',
  backgroundSize: '200% auto',
  color: 'transparent',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  animation: `${shimmerTitle} 8s linear infinite`,
  textShadow: '0 0 30px rgba(0,127,255,0.2)',
  [theme.breakpoints.down('sm')]: {
    fontSize: '2.2rem',
  },
}));

const PerfectDrill = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [customQuestions, setCustomQuestions] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [language, setLanguage] = useState('zh');
  const [anchorEl, setAnchorEl] = useState(null);
  const [recordings, setRecordings] = useState({});
  const [showModelAnswer, setShowModelAnswer] = useState({});
  const [modelAnswers, setModelAnswers] = useState({});
  const fileInputRef = useRef(null);
  const sessionInputRef = useRef(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  });
  const [isReading, setIsReading] = useState(false);
  const speechUtterance = useRef(null);
  const [availableVoices, setAvailableVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [readingSpeed, setReadingSpeed] = useState(1.4);

  const t = translations[language];

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
      if (voices.length > 0) {
        const preferredVoice = voices.find(voice => 
          language === 'zh' ? voice.lang.includes('zh') : voice.lang.includes('en')
        ) || voices[0];
        setSelectedVoice(preferredVoice);
      }
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, [language]);

  const handleLanguageClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLanguageClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageSelect = (lang) => {
    setLanguage(lang);
    handleLanguageClose();
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleUploadQuestions = () => {
    if (!customQuestions.trim()) {
      setSnackbar({
        open: true,
        message: t.pleaseEnterQuestions,
        severity: 'warning',
      });
      return;
    }

    const newQuestions = customQuestions.split('\n').filter(q => q.trim());
    setQuestions(prevQuestions => [...prevQuestions, ...newQuestions]);
    setCustomQuestions('');
    setShowUploadDialog(false);
    setSnackbar({
      open: true,
      message: t.uploadSuccess,
      severity: 'success',
    });
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const text = await file.text();
        const newQuestions = text.split('\n').filter(q => q.trim());
        setQuestions(prevQuestions => [...prevQuestions, ...newQuestions]);
        setSnackbar({
          open: true,
          message: t.importSuccess,
          severity: 'success',
        });
      } catch (error) {
        console.error('Error reading file:', error);
        setSnackbar({
          open: true,
          message: error.message,
          severity: 'error',
        });
      }
    }
    event.target.value = null;
  };

  const handleEditQuestion = (index) => {
    setQuestions(prevQuestions => {
      const newQuestions = [...prevQuestions];
      newQuestions[index] = '';
      return newQuestions;
    });
    setSnackbar({
      open: true,
      message: t.editSuccess,
      severity: 'success',
    });
  };

  const handleDeleteQuestion = (index) => {
    setQuestions(prevQuestions => {
      const newQuestions = [...prevQuestions];
      newQuestions.splice(index, 1);
      return newQuestions;
    });
    setRecordings(prev => {
      const newRecordings = { ...prev };
      delete newRecordings[index];
      return newRecordings;
    });
    setModelAnswers(prev => {
      const newAnswers = { ...prev };
      delete newAnswers[index];
      return newAnswers;
    });
    if (currentQuestionIndex >= questions.length - 1) {
      setCurrentQuestionIndex(Math.max(0, questions.length - 2));
    }
    setSnackbar({
      open: true,
      message: t.deleteSuccess,
      severity: 'success',
    });
  };

  const handleClearAll = () => {
    setQuestions([]);
    setRecordings({});
    setModelAnswers({});
    setCurrentQuestionIndex(0);
    setSnackbar({
      open: true,
      message: t.clearAllSuccess,
      severity: 'success',
    });
  };

  const handleNavigateFirst = () => {
    setCurrentQuestionIndex(0);
  };

  const handleNavigateLast = () => {
    setCurrentQuestionIndex(questions.length - 1);
  };

  const handlePrevious = () => {
    setCurrentQuestionIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1));
  };

  const exportQuestions = () => {
    if (questions.length === 0) {
      setSnackbar({
        open: true,
        message: t.noQuestions,
        severity: 'warning',
      });
      return;
    }

    const content = questions.join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'perfect_questions.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setSnackbar({
      open: true,
      message: t.exportSuccess,
      severity: 'success',
    });
  };

  const importQuestions = () => {
    fileInputRef.current?.click();
  };

  const saveSession = async () => {
    if (questions.length === 0) {
      setSnackbar({
        open: true,
        message: t.noQuestions,
        severity: 'warning',
      });
      return;
    }

    const session = {
      questions: questions,
      recordings: {},
      modelAnswers: modelAnswers,
      timestamp: new Date().toISOString(),
    };

    for (const [index, url] of Object.entries(recordings)) {
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        const base64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });
        session.recordings[index] = base64;
      } catch (error) {
        console.error('Error converting recording:', error);
      }
    }

    const blob = new Blob([JSON.stringify(session)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `perfect_practice_${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setSnackbar({
      open: true,
      message: t.saveSuccess,
      severity: 'success',
    });
  };

  const loadSession = () => {
    sessionInputRef.current?.click();
  };

  const handleSessionUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const text = await file.text();
        const session = JSON.parse(text);
        
        setQuestions(session.questions);
        setCurrentQuestionIndex(0);
        setModelAnswers(session.modelAnswers || {});

        const newRecordings = {};
        for (const [index, base64] of Object.entries(session.recordings)) {
          const response = await fetch(base64);
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          newRecordings[index] = url;
        }
        setRecordings(newRecordings);
        setSnackbar({
          open: true,
          message: t.loadSuccess,
          severity: 'success',
        });
      } catch (error) {
        console.error('Error loading session:', error);
        setSnackbar({
          open: true,
          message: error.message,
          severity: 'error',
        });
      }
    }
    event.target.value = null;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setRecordings(prev => ({
          ...prev,
          [currentQuestionIndex]: url
        }));
        setSnackbar({
          open: true,
          message: t.recordingStopped,
          severity: 'success',
        });
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setSnackbar({
        open: true,
        message: t.recordingStarted,
        severity: 'info',
      });
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setSnackbar({
        open: true,
        message: t.micError,
        severity: 'error',
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const handleDeleteRecording = () => {
    const url = recordings[currentQuestionIndex];
    if (url) {
      URL.revokeObjectURL(url);
      setRecordings(prev => {
        const newRecordings = { ...prev };
        delete newRecordings[currentQuestionIndex];
        return newRecordings;
      });
      setSnackbar({
        open: true,
        message: t.deleteAudioSuccess,
        severity: 'success',
      });
    }
  };

  const readQuestion = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsReading(false);
      return;
    }

    const question = questions[currentQuestionIndex];
    if (!question) return;

    speechUtterance.current = new SpeechSynthesisUtterance(question);
    speechUtterance.current.voice = selectedVoice;
    speechUtterance.current.rate = readingSpeed;
    speechUtterance.current.onend = () => setIsReading(false);
    speechUtterance.current.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsReading(false);
    };

    setIsReading(true);
    window.speechSynthesis.speak(speechUtterance.current);
  };

  const handleSpeedChange = (event, newValue) => {
    setReadingSpeed(newValue);
  };

  const handleVoiceChange = (event) => {
    const voice = availableVoices.find(v => v.name === event.target.value);
    setSelectedVoice(voice);
  };

  const toggleModelAnswer = (index) => {
    setShowModelAnswer(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const renderVoiceControls = () => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel>{t.voice}</InputLabel>
        <Select
          value={selectedVoice?.name || ''}
          onChange={handleVoiceChange}
          label={t.voice}
        >
          {availableVoices.map((voice) => (
            <MenuItem key={voice.name} value={voice.name}>
              {`${voice.name} (${voice.lang})`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box sx={{ width: 200 }}>
        <Typography gutterBottom>
          {t.readingSpeed}: {readingSpeed}x
        </Typography>
        <Slider
          value={readingSpeed}
          onChange={handleSpeedChange}
          min={0.5}
          max={2}
          step={0.1}
          marks={[
            { value: 0.5, label: t.speedSlow },
            { value: 1, label: t.speedNormal },
            { value: 2, label: t.speedFast },
          ]}
        />
      </Box>
    </Box>
  );

  const renderQuestionControls = () => (
    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
      <Tooltip title={isReading ? t.stopReading : t.startReading}>
        <IconButton onClick={readQuestion} color={isReading ? 'secondary' : 'primary'}>
          <VolumeUpIcon />
        </IconButton>
      </Tooltip>
      {isRecording ? (
        <Tooltip title={t.stopRecording}>
          <IconButton onClick={stopRecording} color="secondary">
            <StopIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title={t.startRecording}>
          <IconButton onClick={startRecording} color="primary">
            <MicIcon />
          </IconButton>
        </Tooltip>
      )}
      {recordings[currentQuestionIndex] && (
        <Tooltip title={t.deleteRecording}>
          <IconButton onClick={handleDeleteRecording}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <StyledTitle variant="h4" component="h1">
            {t.title}
          </StyledTitle>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton onClick={handleLanguageClick}>
              <LanguageIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleLanguageClose}
            >
              <MenuItem onClick={() => handleLanguageSelect('en')}>English</MenuItem>
              <MenuItem onClick={() => handleLanguageSelect('zh')}>中文</MenuItem>
            </Menu>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          <Button
            variant="contained"
            onClick={() => setShowUploadDialog(true)}
          >
            {t.inputQuestions}
          </Button>
          <Button
            variant="contained"
            onClick={importQuestions}
          >
            {t.importQuestions}
          </Button>
          <Button
            variant="contained"
            onClick={exportQuestions}
          >
            {t.exportQuestions}
          </Button>
          <Button
            variant="contained"
            onClick={saveSession}
          >
            {t.saveSession}
          </Button>
          <Button
            variant="contained"
            onClick={loadSession}
          >
            {t.loadSession}
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleClearAll}
          >
            {t.clearAll}
          </Button>
        </Box>

        {questions.length > 0 ? (
          <Box>
            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                {t.questionNumber(currentQuestionIndex + 1, questions.length)}
              </Typography>
              <Typography variant="body1" paragraph>
                {questions[currentQuestionIndex]}
              </Typography>

              {renderQuestionControls()}

              {recordings[currentQuestionIndex] && (
                <Box sx={{ mt: 2 }}>
                  <audio src={recordings[currentQuestionIndex]} controls />
                </Box>
              )}

              <Box sx={{ mt: 2 }}>
                <Button
                  onClick={() => toggleModelAnswer(currentQuestionIndex)}
                  startIcon={showModelAnswer[currentQuestionIndex] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                >
                  {t.modelAnswer}
                </Button>
                <Collapse in={showModelAnswer[currentQuestionIndex]}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    value={modelAnswers[currentQuestionIndex] || ''}
                    onChange={(e) => setModelAnswers(prev => ({
                      ...prev,
                      [currentQuestionIndex]: e.target.value
                    }))}
                    placeholder={t.modelAnswerPlaceholder}
                    sx={{ mt: 2 }}
                  />
                </Collapse>
              </Box>
            </Paper>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<KeyboardDoubleArrowLeftIcon />}
                onClick={handleNavigateFirst}
                disabled={currentQuestionIndex === 0}
              >
                {t.firstQuestion}
              </Button>
              <Button
                variant="contained"
                startIcon={<ArrowBackIcon />}
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
              >
                {t.previous}
              </Button>
              <Button
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                onClick={handleNext}
                disabled={currentQuestionIndex === questions.length - 1}
              >
                {t.next}
              </Button>
              <Button
                variant="contained"
                endIcon={<KeyboardDoubleArrowRightIcon />}
                onClick={handleNavigateLast}
                disabled={currentQuestionIndex === questions.length - 1}
              >
                {t.finalQuestion}
              </Button>
            </Box>
          </Box>
        ) : (
          <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="textSecondary">
              {t.noQuestions}
            </Typography>
          </Paper>
        )}

        {renderVoiceControls()}
      </Box>

      {/* Hidden file inputs */}
      <input
        type="file"
        accept=".txt"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleFileUpload}
      />
      <input
        type="file"
        accept=".json"
        style={{ display: 'none' }}
        ref={sessionInputRef}
        onChange={handleSessionUpload}
      />

      {/* Dialogs */}
      <Dialog
        open={showUploadDialog}
        onClose={() => setShowUploadDialog(false)}
      >
        <DialogTitle>{t.uploadQuestions}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t.enterQuestions}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            fullWidth
            multiline
            rows={4}
            value={customQuestions}
            onChange={(e) => setCustomQuestions(e.target.value)}
            placeholder={t.placeholder}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowUploadDialog(false)}>
            {t.cancel}
          </Button>
          <Button onClick={handleUploadQuestions}>
            {t.upload}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PerfectDrill;
