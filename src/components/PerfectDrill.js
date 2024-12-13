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
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
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
  background: '#f6f7f8',
  backgroundImage: 'linear-gradient(to right, #f6f7f8 0%, #edeef1 20%, #f6f7f8 40%, #f6f7f8 100%)',
  backgroundSize: '2000px 100%',
  animation: `${shimmer} 2s linear infinite`,
  borderRadius: '4px'
});

const PerfectDrill = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordings, setRecordings] = useState({});
  const [language, setLanguage] = useState('en');
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioRef = useRef(new Audio());
  
  const { t } = useTranslation(language);

  const handleAddQuestion = (question) => {
    setQuestions([...questions, { text: question, modelAnswer: '' }]);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1 && (!isRecording || !isPlaying)) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0 && (!isRecording || !isPlaying)) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' });
        setRecordings(prev => ({ ...prev, [currentQuestionIndex]: URL.createObjectURL(blob) }));
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch (error) {
      console.error(error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t.title}
        </Typography>
        
        {/* Question navigation */}
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
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
            endIcon={<ArrowForwardIcon />}
            onClick={handleNextQuestion}
            disabled={currentQuestionIndex === questions.length - 1}
          >
            {t.next}
          </Button>
        </Box>

        {/* Current question */}
        {questions.length > 0 ? (
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" component="div">
                {questions[currentQuestionIndex].text}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                color={isRecording ? "secondary" : "primary"}
                startIcon={isRecording ? <StopIcon /> : <PlayArrowIcon />}
                onClick={isRecording ? stopRecording : startRecording}
              >
                {isRecording ? t.stopRecording : t.startRecording}
              </Button>
            </CardActions>
          </Card>
        ) : (
          <Typography variant="body1" sx={{ mb: 2 }}>
            {t.noQuestions}
          </Typography>
        )}

        {/* Add new question */}
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label={t.questionPlaceholder}
            variant="outlined"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddQuestion(e.target.value);
                e.target.value = '';
              }
            }}
          />
        </Box>
      </Box>
    </Container>
  );
};

export default PerfectDrill;
