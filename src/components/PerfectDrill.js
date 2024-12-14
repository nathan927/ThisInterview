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
import CloseIcon from '@mui/icons-material/Close';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
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

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(25, 118, 210, 0.4);
  }
  70% {
    box-shadow: 0 0 0 15px rgba(25, 118, 210, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(25, 118, 210, 0);
  }
`;

const pulseError = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(211, 47, 47, 0.4);
  }
  70% {
    box-shadow: 0 0 0 15px rgba(211, 47, 47, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(211, 47, 47, 0);
  }
`;

const modelAnswerButtonGlow = keyframes`
  0% {
    box-shadow: 0 0 5px rgba(63, 81, 181, 0.3),
                0 0 10px rgba(63, 81, 181, 0.2),
                0 0 15px rgba(63, 81, 181, 0.1);
  }
  50% {
    box-shadow: 0 0 10px rgba(63, 81, 181, 0.4),
                0 0 20px rgba(63, 81, 181, 0.3),
                0 0 30px rgba(63, 81, 181, 0.2);
  }
  100% {
    box-shadow: 0 0 5px rgba(63, 81, 181, 0.3),
                0 0 10px rgba(63, 81, 181, 0.2),
                0 0 15px rgba(63, 81, 181, 0.1);
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

const StyledRecordButton = styled(Button)(({ theme, isrecording }) => ({
  minWidth: '200px',
  height: '40px',
  background: isrecording === 'true' 
    ? 'linear-gradient(45deg, #f44336 30%, #ff1744 90%)'
    : 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  color: 'white',
  fontWeight: 'bold',
  fontSize: '1rem',
  padding: '0 24px',
  boxShadow: isrecording === 'true'
    ? '0 3px 5px 2px rgba(244, 67, 54, .3)'
    : '0 3px 5px 2px rgba(33, 150, 243, .3)',
  '&:hover': {
    background: isrecording === 'true'
      ? 'linear-gradient(45deg, #d32f2f 30%, #d50000 90%)'
      : 'linear-gradient(45deg, #1976D2 30%, #1EA7D2 90%)',
  },
  animation: isrecording === 'true' ? `${pulseError} 2s infinite` : 'none',
  borderRadius: '4px',
  textTransform: 'none',
  '& .MuiButton-startIcon': {
    marginRight: '8px',
  },
}));

const StyledModelAnswerButton = styled(Button)(({ theme }) => ({
  minWidth: '160px',
  height: '40px',
  borderRadius: '6px',
  background: 'transparent',
  color: '#4caf50',
  textTransform: 'none',
  fontSize: '1rem',
  fontWeight: 600,
  letterSpacing: '0.5px',
  padding: '0 16px',
  border: '2px solid #4caf50',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: '#4caf50',
    color: 'white',
    borderColor: '#4caf50',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(76, 175, 80, 0.25)',
  },
  '&:active': {
    transform: 'translateY(1px)',
  },
  '& .MuiButton-endIcon': {
    marginLeft: '4px',
    '& svg': {
      fontSize: '1.1rem',
      transition: 'transform 0.3s ease',
    }
  },
  '&:hover .MuiButton-endIcon svg': {
    transform: 'rotate(180deg)',
  }
}));

const StyledVoiceButton = styled(IconButton)(({ theme }) => ({
  color: '#4caf50',
  backgroundColor: 'rgba(76, 175, 80, 0.1)',
  padding: '6px',
  '& svg': {
    fontSize: '1.2rem',
  },
  '&:hover': {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    transform: 'scale(1.1)',
  },
  transition: 'all 0.3s ease',
  marginLeft: '8px',
}));

const managementButtonStyle = {
  minWidth: '160px',
  height: '36px',
  fontWeight: 'bold',
  borderColor: (theme) => theme.palette.primary.main,
  color: (theme) => theme.palette.primary.main,
  '&:hover': {
    backgroundColor: (theme) => theme.palette.primary.main,
    color: 'white',
    borderColor: (theme) => theme.palette.primary.main,
  },
  '& .MuiButton-startIcon, & .MuiButton-endIcon': {
    '& > *:nth-of-type(1)': {
      fontSize: '20px'
    }
  }
};

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
  const [isEditingQuestion, setIsEditingQuestion] = useState(false);
  const fileInputRef = useRef(null);
  const sessionInputRef = useRef(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  });
  const [availableVoices, setAvailableVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [readingSpeed, setReadingSpeed] = useState(1.4);
  const [isReading, setIsReading] = useState(false);
  const [showDeleteAudioDialog, setShowDeleteAudioDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showClearAllDialog, setShowClearAllDialog] = useState(false);
  const [showDeleteRecordingDialog, setShowDeleteRecordingDialog] = useState(false);
  const speechUtterance = useRef(null);

  const t = translations[language];

  const detectLanguage = (text) => {
    const chineseRegex = /[\u4e00-\u9fa5]/;
    const englishRegex = /^[A-Za-z0-9\s.,!?'"()-]+$/;

    if (chineseRegex.test(text)) return 'zh';
    if (englishRegex.test(text)) return 'en';
    return language;
  };

  const getVoiceForLanguage = (detectedLanguage, interfaceLanguage) => {
    const microsoftYating = availableVoices.find(voice => 
      voice.name === 'Microsoft Yating - Chinese (Traditional, Taiwan)' ||
      voice.name === 'Microsoft Hanhan - Chinese (Traditional, Taiwan)' ||
      voice.name.includes('Microsoft') && voice.name.includes('Chinese')
    );

    const microsoftZira = availableVoices.find(voice => 
      voice.name === 'Microsoft Zira - English (United States)' ||
      voice.name === 'Microsoft David - English (United States)' ||
      voice.name.includes('Microsoft') && voice.name.includes('English')
    );

    if (detectedLanguage === 'zh' && interfaceLanguage === 'en') {
      return microsoftYating || selectedVoice;
    }
    if (detectedLanguage === 'en' && interfaceLanguage === 'zh') {
      return microsoftZira || selectedVoice;
    }

    return interfaceLanguage === 'zh' ? microsoftYating : microsoftZira;
  };

  const readText = async (text) => {
    if (isReading) {
      stopReading();
      return;
    }

    if (!text) return;

    const detectedLanguage = detectLanguage(text);
    const voice = getVoiceForLanguage(detectedLanguage, language);

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voice || availableVoices[0];
    utterance.rate = readingSpeed;
    utterance.onstart = () => setIsReading(true);
    utterance.onend = () => setIsReading(false);
    utterance.onerror = () => setIsReading(false);

    speechUtterance.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const stopReading = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    setIsReading(false);
  };

  const handleSpeedChange = (event, newValue) => {
    setReadingSpeed(newValue);
    if (isReading && speechUtterance.current) {
      const currentText = speechUtterance.current.text;
      stopReading();
      readText(currentText);
    }
  };

  const handleModelAnswerToggle = (index) => {
    setShowModelAnswer(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const microsoftVoices = voices.filter(voice => 
        voice.name.includes('Microsoft')
      );
      
      setAvailableVoices(microsoftVoices);

      const defaultEnVoice = microsoftVoices.find(v => v.name === 'Microsoft Zira - English (United States)');
      const defaultZhVoice = microsoftVoices.find(v => v.name === 'Microsoft Yating - Chinese (Traditional, Taiwan)');
      
      if (language === 'zh' && defaultZhVoice) {
        setSelectedVoice(defaultZhVoice);
      } else if (language === 'en' && defaultEnVoice) {
        setSelectedVoice(defaultEnVoice);
      } else {
        setSelectedVoice(microsoftVoices[0]);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
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

  const handleDeleteConfirm = () => {
    handleDeleteQuestion(currentQuestionIndex);
    setShowDeleteDialog(false);
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
    setShowClearAllDialog(true);
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

  const handleEditClick = (type) => {
    if (type === 'question') {
      setIsEditingQuestion(true);
    }
  };

  const renderVoiceControls = () => (
    <Box sx={{ 
      display: 'flex', 
      gap: 2, 
      alignItems: 'center',
      flexWrap: 'wrap',
      width: '100%',
      justifyContent: 'center'
    }}>
      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel>{t.voice}</InputLabel>
        <Select
          value={selectedVoice?.name || ''}
          onChange={(e) => {
            const voice = availableVoices.find(v => v.name === e.target.value);
            if (voice) {
              setSelectedVoice(voice);
            }
          }}
          size="small"
          label={t.voice}
        >
          {availableVoices
            .filter(voice => 
              language === 'zh' 
                ? voice.lang.includes('zh') || voice.lang.includes('CN')
                : voice.lang.includes('en') || voice.lang.includes('US')
            )
            .map((voice) => (
              <MenuItem key={voice.name} value={voice.name}>
                {voice.name}
              </MenuItem>
            ))}
        </Select>
      </FormControl>

      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2,
        flex: 1,
        maxWidth: 400
      }}>
        <Typography>{t.speed}</Typography>
        <Slider
          value={readingSpeed}
          onChange={handleSpeedChange}
          min={0.25}
          max={3}
          step={0.01}
          valueLabelDisplay="auto"
          valueLabelFormat={value => `${value.toFixed(2)}x`}
          size="small"
          marks={[
            { value: 0.25, label: '0.25x' },
            { value: 1, label: '1x' },
            { value: 2, label: '2x' },
            { value: 3, label: '3x' }
          ]}
        />
      </Box>
    </Box>
  );

  const renderQuestionControls = () => (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      mt: 4,
      mb: 3,
      gap: 2,
      flexWrap: { xs: 'wrap', sm: 'nowrap' }
    }}>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          variant="outlined"
          startIcon={<KeyboardDoubleArrowLeftIcon />}
          onClick={handleNavigateFirst}
          disabled={currentQuestionIndex === 0}
          sx={managementButtonStyle}
        >
          {t.firstQuestion}
        </Button>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          sx={managementButtonStyle}
        >
          {t.previous}
        </Button>
      </Box>

      <StyledRecordButton
        onClick={isRecording ? stopRecording : startRecording}
        startIcon={isRecording ? <StopIcon /> : <MicIcon />}
        isrecording={isRecording.toString()}
      >
        {isRecording ? t.stopRecording : t.startRecording}
      </StyledRecordButton>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          variant="outlined"
          endIcon={<ArrowForwardIcon />}
          onClick={handleNext}
          disabled={currentQuestionIndex === questions.length - 1}
          sx={managementButtonStyle}
        >
          {t.next}
        </Button>
        <Button
          variant="outlined"
          endIcon={<KeyboardDoubleArrowRightIcon />}
          onClick={handleNavigateLast}
          disabled={currentQuestionIndex === questions.length - 1}
          sx={managementButtonStyle}
        >
          {t.finalQuestion}
        </Button>
      </Box>
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ 
      py: { xs: 2, sm: 4 },
      px: { xs: 2, sm: 4, md: 6 },
      maxWidth: '1400px'
    }}>
      <StyledTitle component="h1">
        {t.title}
      </StyledTitle>

      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'flex-end', 
        alignItems: 'center', 
        mb: 2,
        gap: 2,
        flexWrap: 'wrap'
      }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
          <Typography sx={{ minWidth: 50 }}>{t.voice}</Typography>
          <FormControl sx={{ minWidth: 200 }}>
            <Select
              value={selectedVoice?.name || ''}
              onChange={(e) => {
                const voice = availableVoices.find(v => v.name === e.target.value);
                if (voice) {
                  setSelectedVoice(voice);
                }
              }}
              size="small"
              label={t.voice}
            >
              {availableVoices
                .filter(voice => 
                  language === 'zh' 
                    ? voice.lang.includes('zh') || voice.lang.includes('CN')
                    : voice.lang.includes('en') || voice.lang.includes('US')
                )
                .map((voice) => (
                  <MenuItem key={voice.name} value={voice.name}>
                    {voice.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          <Typography sx={{ minWidth: 50, ml: 2 }}>{t.speed}</Typography>
          <Box sx={{ width: 200 }}>
            <Slider
              value={readingSpeed}
              onChange={handleSpeedChange}
              min={0.25}
              max={3}
              step={0.01}
              valueLabelDisplay="auto"
              valueLabelFormat={value => `${value.toFixed(2)}x`}
              size="small"
              marks={[
                { value: 0.25, label: '0.25x' },
                { value: 1, label: '1x' },
                { value: 2, label: '2x' },
                { value: 3, label: '3x' }
              ]}
            />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Tooltip title={t.changeLanguage}>
            <IconButton onClick={handleLanguageClick}>
              <LanguageIcon />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleLanguageClose}
          >
            <MenuItem onClick={() => handleLanguageSelect('zh')}>中文</MenuItem>
            <MenuItem onClick={() => handleLanguageSelect('en')}>English</MenuItem>
          </Menu>
        </Box>

      </Box>

      <Box sx={{ 
        display: 'flex', 
        gap: 2,
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'center',
        width: '100%',
        maxWidth: '1200px',
        mx: 'auto',
        mb: { xs: 2, sm: 3 }
      }}>
        <Button
          variant="outlined"
          onClick={() => setShowUploadDialog(true)}
          sx={managementButtonStyle}
        >
          <b>{t.inputQuestions}</b>
        </Button>
        <Button
          variant="outlined"
          onClick={importQuestions}
          sx={managementButtonStyle}
        >
          <b>{t.importQuestions}</b>
        </Button>
        <Button
          variant="outlined"
          onClick={exportQuestions}
          sx={managementButtonStyle}
          disabled={questions.length === 0}
        >
          <b>{t.exportQuestions}</b>
        </Button>
        <Button
          variant="outlined"
          onClick={saveSession}
          sx={managementButtonStyle}
          disabled={questions.length === 0}
        >
          <b>{t.saveSession}</b>
        </Button>
        <Button
          variant="outlined"
          onClick={loadSession}
          sx={managementButtonStyle}
        >
          <b>{t.loadSession}</b>
        </Button>
        <Button
          variant="outlined"
          onClick={() => setShowClearAllDialog(true)}
          startIcon={<DeleteSweepIcon />}
          sx={{
            ...managementButtonStyle,
            borderColor: (theme) => theme.palette.error.main,
            color: (theme) => theme.palette.error.main,
            '&:hover': {
              backgroundColor: (theme) => theme.palette.error.main,
              color: 'white',
              borderColor: (theme) => theme.palette.error.main,
            }
          }}
        >
          <b>{t.clearAll}</b>
        </Button>
      </Box>

      {questions.length > 0 ? (
        <Box>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3,
              ml: 0,  
              mr: 0,  
              width: '100%',  
              position: 'relative',
              backgroundColor: 'white',
              borderRadius: 2
            }}
          >
            <Box sx={{ position: 'relative', width: '100%', mb: 2 }}>
              <Box sx={{ position: 'absolute', top: -8, right: 0, zIndex: 1 }}>
                <Tooltip title={t.delete}>
                  <IconButton
                    onClick={() => setShowDeleteDialog(true)}
                    color="error"
                    size="small"
                    sx={{
                      padding: '4px',
                      '&:hover': {
                        backgroundColor: 'rgba(211, 47, 47, 0.04)'
                      }
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                  gap: 1
                }}>
                  <Typography variant="h6" component="div">
                    {t.questionNumber(currentQuestionIndex + 1, questions.length)}
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        readText(questions[currentQuestionIndex]);
                      }}
                      sx={{ 
                        ml: 1,
                        color: isReading ? 'error.main' : 'default'
                      }}
                    >
                      <VolumeUpIcon />
                    </IconButton>
                  </Typography>
                </Box>

                <TextField
                  multiline
                  fullWidth
                  value={questions[currentQuestionIndex] || ''}
                  onChange={(e) => {
                    const newQuestions = [...questions];
                    newQuestions[currentQuestionIndex] = e.target.value;
                    setQuestions(newQuestions);
                  }}
                  placeholder={t.placeholder}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#f8f9fa',
                      minHeight: '180px',
                      display: 'flex',
                      alignItems: 'center',
                      '& textarea': {
                        textAlign: 'center',
                        fontSize: '2rem',
                        fontWeight: 'bold',
                        color: (theme) => theme.palette.primary.main,
                        lineHeight: 1.5,
                      },
                      '&:hover': {
                        backgroundColor: '#f5f5f5'
                      },
                      '&::-webkit-scrollbar': {
                        display: 'none'
                      },
                      '&:hover::-webkit-scrollbar': {
                        display: 'block',
                        width: '8px'
                      },
                      '&::-webkit-scrollbar-track': {
                        backgroundColor: 'transparent'
                      },
                      '&::-webkit-scrollbar-thumb': {
                        backgroundColor: '#bdbdbd',
                        borderRadius: '4px',
                        '&:hover': {
                          backgroundColor: '#9e9e9e'
                        }
                      }
                    }
                  }}
                />
              </Box>

              {renderQuestionControls()}

              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'flex-start' }}>
                  <StyledModelAnswerButton
                    onClick={() => setShowModelAnswer(prev => ({
                      ...prev,
                      [currentQuestionIndex]: !prev[currentQuestionIndex]
                    }))}
                    endIcon={showModelAnswer[currentQuestionIndex] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  >
                    {t.modelAnswer}
                  </StyledModelAnswerButton>
                  {modelAnswers[currentQuestionIndex] && (
                    <StyledVoiceButton
                      onClick={() => readText(modelAnswers[currentQuestionIndex])}
                      size="small"
                    >
                      {isReading ? <StopIcon /> : <VolumeUpIcon />}
                    </StyledVoiceButton>
                  )}
                  {recordings[currentQuestionIndex] && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <audio
                        controls
                        src={recordings[currentQuestionIndex]}
                        style={{ height: '32px' }}
                      />
                      <Tooltip title={t.delete}>
                        <IconButton
                          onClick={() => setShowDeleteRecordingDialog(true)}
                          size="small"
                          sx={{
                            color: 'error.main',
                            '&:hover': {
                              backgroundColor: 'rgba(211, 47, 47, 0.04)'
                            }
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  )}
                </Box>
                <Collapse in={showModelAnswer[currentQuestionIndex]}>
                  <TextField
                    fullWidth
                    multiline
                    value={modelAnswers[currentQuestionIndex] || ''}
                    onChange={(e) => setModelAnswers(prev => ({
                      ...prev,
                      [currentQuestionIndex]: e.target.value
                    }))}
                    placeholder={t.modelAnswerPlaceholder}
                    sx={{ 
                      mt: 2,
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'rgba(76, 175, 80, 0.05)',
                        border: '1px solid rgba(76, 175, 80, 0.2)',
                        '&:hover': {
                          backgroundColor: 'rgba(76, 175, 80, 0.08)',
                          borderColor: 'rgba(76, 175, 80, 0.3)'
                        },
                        '&.Mui-focused': {
                          backgroundColor: 'rgba(76, 175, 80, 0.08)',
                          '& fieldset': {
                            borderColor: '#4caf50'
                          }
                        }
                      },
                      '& .MuiOutlinedInput-input': {
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        padding: '12px'
                      },
                      '& .MuiInputBase-multiline': {
                        minHeight: 'unset',
                        height: 'auto'
                      }
                    }}
                    InputProps={{
                      sx: {
                        '& textarea': {
                          resize: 'vertical',
                          minHeight: '80px'
                        }
                      }
                    }}
                  />
                </Collapse>
              </Box>
            </Box>
          </Paper>

        </Box>
      ) : (
        <Paper 
          elevation={3} 
          sx={{ 
            p: { xs: 3, sm: 4 }, 
            textAlign: 'center',
            borderRadius: 2,
            backgroundColor: 'white'
          }}
        >
          <Typography 
            variant="h6" 
            color="textSecondary"
            sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
          >
            {t.noQuestions}
          </Typography>
        </Paper>
      )}

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
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{t.uploadQuestions}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
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
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setShowUploadDialog(false)}>
            {t.cancel}
          </Button>
          <Button onClick={handleUploadQuestions} variant="contained">
            {t.upload}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Question Confirmation Dialog */}
      <Dialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          {t.deleteConfirmTitle || 'Delete Question'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            {t.deleteConfirm || 'Are you sure you want to delete this question?'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)} color="primary">
            {t.cancel}
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            {t.delete}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Clear All Confirmation Dialog */}
      <Dialog
        open={showClearAllDialog}
        onClose={() => setShowClearAllDialog(false)}
        aria-labelledby="clear-all-dialog-title"
        aria-describedby="clear-all-dialog-description"
      >
        <DialogTitle id="clear-all-dialog-title">
          {t.clearAllConfirmTitle || 'Clear All Questions'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="clear-all-dialog-description">
            {t.clearAllConfirm}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowClearAllDialog(false)} color="primary">
            {t.cancel}
          </Button>
          <Button onClick={handleClearAllConfirm} color="error" variant="contained">
            {t.confirm || '確定'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Recording Confirmation Dialog */}
      <Dialog
        open={showDeleteRecordingDialog}
        onClose={() => setShowDeleteRecordingDialog(false)}
        aria-labelledby="delete-recording-dialog-title"
        aria-describedby="delete-recording-dialog-description"
      >
        <DialogTitle id="delete-recording-dialog-title">
          {t.confirmDelete}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-recording-dialog-description">
            {t.confirmDeleteRecording}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteRecordingDialog(false)} color="primary">
            {t.cancel}
          </Button>
          <Button 
            onClick={() => {
              handleDeleteRecording();
              setShowDeleteRecordingDialog(false);
            }} 
            color="error" 
            autoFocus
          >
            {t.confirm}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PerfectDrill;
