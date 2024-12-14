import React, { useState, useRef } from 'react';
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
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import StopIcon from '@mui/icons-material/Stop';
import MicIcon from '@mui/icons-material/Mic';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LanguageIcon from '@mui/icons-material/Language';
import { translations } from '../translations';

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
  const fileInputRef = useRef(null);
  const sessionInputRef = useRef(null);
  const [recordings, setRecordings] = useState({});
  const [modelAnswers, setModelAnswers] = useState({});
  const [showModelAnswer, setShowModelAnswer] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  const t = translations[language];

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
        setAudioURL(newRecordings[0] || '');

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
        setAudioURL(url);
        setRecordings(prev => ({
          ...prev,
          [currentQuestionIndex]: url
        }));
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
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      setIsRecording(false);
      setSnackbar({
        open: true,
        message: t.recordingStopped,
        severity: 'success',
      });
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setAudioURL(recordings[currentQuestionIndex - 1] || '');
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setAudioURL(recordings[currentQuestionIndex + 1] || '');
    }
  };

  const toggleModelAnswer = (index) => {
    setShowModelAnswer(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1">
            {t.title}
          </Typography>
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

        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            placeholder={t.questionPlaceholder}
            value={customQuestions}
            onChange={(e) => setCustomQuestions(e.target.value)}
          />
          <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
            <Button variant="contained" onClick={handleUploadQuestions}>
              {t.addQuestion}
            </Button>
            <Button variant="outlined" onClick={importQuestions}>
              Import
            </Button>
            <Button variant="outlined" onClick={exportQuestions}>
              Export
            </Button>
            <Button variant="outlined" onClick={saveSession}>
              {t.saveSession}
            </Button>
            <Button variant="outlined" onClick={loadSession}>
              {t.loadSession}
            </Button>
          </Box>
        </Box>

        {questions.length > 0 ? (
          <Box>
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>
                  {questions[currentQuestionIndex]}
                </Typography>
                {showModelAnswer[currentQuestionIndex] && (
                  <Paper sx={{ mt: 2, p: 2, bgcolor: 'grey.100' }}>
                    <Typography variant="body2">
                      {modelAnswers[currentQuestionIndex] || t.noModelAnswer}
                    </Typography>
                  </Paper>
                )}
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  color={isRecording ? "secondary" : "primary"}
                  startIcon={isRecording ? <StopIcon /> : <MicIcon />}
                  onClick={isRecording ? stopRecording : startRecording}
                >
                  {isRecording ? t.stopRecording : t.startRecording}
                </Button>
                <Button onClick={() => toggleModelAnswer(currentQuestionIndex)}>
                  {showModelAnswer[currentQuestionIndex] ? t.hideAnswer : t.showAnswer}
                </Button>
              </CardActions>
            </Card>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button
                variant="contained"
                startIcon={<ArrowBackIcon />}
                onClick={previousQuestion}
                disabled={currentQuestionIndex === 0}
              >
                {t.previous}
              </Button>
              <Button
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                onClick={nextQuestion}
                disabled={currentQuestionIndex === questions.length - 1}
              >
                {t.next}
              </Button>
            </Box>
          </Box>
        ) : (
          <Typography variant="body1" sx={{ textAlign: 'center', my: 4 }}>
            {t.noQuestions}
          </Typography>
        )}
      </Box>

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept=".txt"
        onChange={handleFileUpload}
      />
      <input
        type="file"
        ref={sessionInputRef}
        style={{ display: 'none' }}
        accept=".json"
        onChange={handleSessionUpload}
      />

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
