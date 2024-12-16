import React from 'react';
import {
  Box,
  IconButton,
  Tooltip,
} from '@mui/material';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const QuestionControls = ({
  t,
  currentQuestionIndex,
  questions,
  handlePrevQuestion,
  handleNextQuestion,
  handleFirstQuestion,
  handleLastQuestion,
}) => {
  return (
    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', my: 2 }}>
      <Tooltip title={t.firstQuestion}>
        <span>
          <IconButton
            onClick={handleFirstQuestion}
            disabled={currentQuestionIndex === 0}
          >
            <KeyboardDoubleArrowLeftIcon />
          </IconButton>
        </span>
      </Tooltip>
      
      <Tooltip title={t.previousQuestion}>
        <span>
          <IconButton
            onClick={handlePrevQuestion}
            disabled={currentQuestionIndex === 0}
          >
            <ArrowBackIcon />
          </IconButton>
        </span>
      </Tooltip>
      
      <Tooltip title={t.nextQuestion}>
        <span>
          <IconButton
            onClick={handleNextQuestion}
            disabled={currentQuestionIndex === questions.length - 1}
          >
            <ArrowForwardIcon />
          </IconButton>
        </span>
      </Tooltip>
      
      <Tooltip title={t.lastQuestion}>
        <span>
          <IconButton
            onClick={handleLastQuestion}
            disabled={currentQuestionIndex === questions.length - 1}
          >
            <KeyboardDoubleArrowRightIcon />
          </IconButton>
        </span>
      </Tooltip>
    </Box>
  );
};

export default QuestionControls;
