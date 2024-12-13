import React, { useState, useEffect, useRef } from 'react';
import { styled } from '@mui/system';
import {
  Button,
  Box,
  Typography,
  TextField,
  IconButton,
  Paper,
  Container,
  Grid,
  MenuItem,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import { useTranslation } from '../translations';

const shimmer = styled.keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const LoadingBox = styled(Box)({
  animation: `${shimmer} 2s infinite linear`,
  background: 'linear-gradient(to right, #f6f7f8 8%, #edeef1 38%, #f6f7f8 54%)',
  backgroundSize: '1000px 100%',
  width: '100%',
  height: '100px',
  marginBottom: '16px',
  borderRadius: '4px'
});

const shimmerTitle = styled.keyframes`
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

const StyledContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1),
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

const ButtonGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  marginTop: theme.spacing(2),
  flexWrap: 'wrap',
  [theme.breakpoints.down('sm')]: {
    gap: theme.spacing(1),
    '& > button': {
      flex: '1 1 auto',
      minWidth: '40%',
    },
  },
}));

const QuestionText = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  marginBottom: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.2rem',
    marginBottom: theme.spacing(1),
  },
}));

const PerfectDrill = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [customQuestions, setCustomQuestions] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [language, setLanguage] = useState('zh');
  const [anchorEl, setAnchorEl] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  });
  const [isReading, setIsReading] = useState(false);
  const speechSynthesis = window.speechSynthesis;
  const speechUtterance = useRef(null);
  const [availableVoices, setAvailableVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [readingSpeed, setReadingSpeed] = useState(1.4);

  const { t } = useTranslation(language);

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

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' });
        setAudioURL(URL.createObjectURL(blob));
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      setSnackbar({
        open: true,
        message: t.microphoneError,
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
    setQuestions(newQuestions);
    setCurrentQuestionIndex(0);
    setShowUploadDialog(false);
    setCustomQuestions('');
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1 && (!isRecording || !isReading)) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0 && (!isRecording || !isReading)) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const detectLanguage = (text) => {
    // Simple language detection based on character ranges
    const chineseRegex = /[\u4e00-\u9fa5]/;
    const englishRegex = /^[A-Za-z0-9\s.,!?'"()-]+$/;

    if (chineseRegex.test(text)) return 'zh';
    if (englishRegex.test(text)) return 'en';
    return language; // fallback to interface language
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

    // If text language differs from interface language, use specific voices
    if (detectedLanguage === 'zh' && interfaceLanguage === 'en') {
      return microsoftYating || selectedVoice;
    }
    if (detectedLanguage === 'en' && interfaceLanguage === 'zh') {
      return microsoftZira || selectedVoice;
    }

    // If languages match, use interface language voice
    return interfaceLanguage === 'zh' ? microsoftYating : microsoftZira;
  };

  const readText = async (text) => {
    // If already reading, stop the current speech and return
    if (isReading) {
      stopReading();
      return;
    }

    if (!text) return;

    const detectedLanguage = detectLanguage(text);
    const selectedVoice = getVoiceForLanguage(detectedLanguage, language);

    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = selectedVoice || availableVoices[0];
    utterance.rate = readingSpeed;
    utterance.onstart = () => setIsReading(true);
    utterance.onend = () => setIsReading(false);
    utterance.onerror = () => setIsReading(false);

    speechUtterance.current = utterance;
    speechSynthesis.speak(utterance);
  };

  const stopReading = () => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    setIsReading(false);
  };

  const handleSpeedChange = (event, newValue) => {
    setReadingSpeed(newValue);
    // If currently reading, restart with new speed
    if (isReading && speechUtterance.current) {
      const currentText = speechUtterance.current.text;
      stopReading();
      readText(currentText);
    }
  };

  const getAvailableVoicesForLanguage = (language) => {
    const voices = availableVoices.filter(voice => 
      voice.lang.startsWith(language.slice(0, 2))
    );
    
    // Sort to put Microsoft Yating first for Chinese
    if (language === 'zh-CN') {
      return voices.sort((a, b) => {
        if (a.name === 'Microsoft Yating - Chinese (Traditional, Taiwan)') return -1;
        if (b.name === 'Microsoft Yating - Chinese (Traditional, Taiwan)') return 1;
        return 0;
      });
    }
    
    return voices;
  };

  const handleVoiceChange = (language, voice) => {
    setSelectedVoice(prev => ({
      ...prev,
      [language]: voice
    }));
  };

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const microsoftVoices = voices.filter(voice => 
        voice.name.includes('Microsoft')
      );
      
      setAvailableVoices(microsoftVoices);

      // Set default voice based on language
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
  }, [language]); // Only depend on language changes

  const managementButtonStyle = {
    maxWidth: { sm: 'none' }, 
    flex: 1,
    fontWeight: 'bold',
    '&:hover': {
      opacity: 0.85,
      backgroundColor: (theme) => theme.palette.primary.main,
      color: 'white'
    }
  };

  return (
    <StyledContainer maxWidth="md">
      <StyledPaper elevation={3}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 1,
          mb: 2 
        }}>
          <Typography variant="h4" component="h1" sx={{ 
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
            flex: 1
          }}>
            {t.title}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title={t.changeLanguage}>
              <IconButton onClick={handleLanguageClick} size="small">
                <LanguageIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {questions.length > 0 ? (
          <>
            <QuestionText>
              {questions[currentQuestionIndex]}
            </QuestionText>
            
            <ButtonGroup>
              <Button
                variant="contained"
                startIcon={<KeyboardDoubleArrowLeftIcon />}
                onClick={() => setCurrentQuestionIndex(0)}
                disabled={currentQuestionIndex === 0}
                sx={{ display: { xs: 'none', sm: 'flex' } }}
              >
                {t.first}
              </Button>
              <Button
                variant="contained"
                startIcon={<ArrowBackIcon />}
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
              >
                {t.previous}
              </Button>
              <Button
                variant="contained"
                color={isRecording ? "error" : "primary"}
                startIcon={isRecording ? <StopIcon /> : <MicIcon />}
                onClick={isRecording ? stopRecording : startRecording}
              >
                {isRecording ? t.stop : t.record}
              </Button>
              <Button
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                onClick={handleNextQuestion}
                disabled={currentQuestionIndex === questions.length - 1}
              >
                {t.next}
              </Button>
              <Button
                variant="contained"
                endIcon={<KeyboardDoubleArrowRightIcon />}
                onClick={() => setCurrentQuestionIndex(questions.length - 1)}
                disabled={currentQuestionIndex === questions.length - 1}
                sx={{ display: { xs: 'none', sm: 'flex' } }}
              >
                {t.last}
              </Button>
            </ButtonGroup>

            {audioURL && (
              <Box sx={{ mt: 2 }}>
                <audio controls src={audioURL} style={{ width: '100%' }} />
              </Box>
            )}
          </>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {t.noQuestions}
            </Typography>
            <Button
              variant="contained"
              onClick={() => setShowUploadDialog(true)}
            >
              {t.uploadQuestions}
            </Button>
          </Box>
        )}
      </StyledPaper>

      <Dialog
        open={showUploadDialog}
        onClose={() => setShowUploadDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{t.uploadQuestions}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t.enterQuestions}
          </DialogContentText>
          <TextField
            autoFocus
            multiline
            rows={10}
            fullWidth
            variant="outlined"
            value={customQuestions}
            onChange={(e) => setCustomQuestions(e.target.value)}
            placeholder={t.placeholder}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowUploadDialog(false)}>
            {t.cancel}
          </Button>
          <Button onClick={handleUploadQuestions} variant="contained">
            {t.upload}
          </Button>
        </DialogActions>
      </Dialog>

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

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </StyledContainer>
  );
};

export default PerfectDrill;
