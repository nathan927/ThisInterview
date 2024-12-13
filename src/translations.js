import { useState, useEffect } from 'react';

export const translations = {
  en: {
    title: 'ThisInterview : Perfect Drill',
    startRecording: 'Start Recording',
    stopRecording: 'Stop Recording',
    next: 'Next',
    previous: 'Previous',
    language: 'Language',
    addQuestion: 'Add Question',
    modelAnswer: 'Model Answer',
    modelAnswerPlaceholder: 'Enter model answer here...',
    questionPlaceholder: 'Enter question here...',
    noQuestions: 'No questions added yet. Add your first question above.',
    saveSession: 'Save Session',
    loadSession: 'Load Session',
    sessionSaved: 'Session saved successfully!',
    sessionLoaded: 'Session loaded successfully!',
    errorSaving: 'Error saving session',
    errorLoading: 'Error loading session',
    clearQuestions: 'Clear All',
    confirmClear: 'Are you sure you want to clear all questions?',
    yes: 'Yes',
    no: 'No',
    cancel: 'Cancel',
    confirm: 'Confirm',
    recording: 'Recording...',
    errorRecording: 'Error accessing microphone',
    noMicrophoneAccess: 'Please allow microphone access to record',
    recordingComplete: 'Recording complete',
    playRecording: 'Play Recording',
    stopPlaying: 'Stop Playing',
    deleteRecording: 'Delete Recording',
    editAnswer: 'Edit Answer',
    showAnswer: 'Show Answer',
    hideAnswer: 'Hide Answer',
    speedSlow: 'Slow',
    speedNormal: 'Normal',
    speedFast: 'Fast',
    firstQuestion: 'First Question',
    finalQuestion: 'Final Question'
  },
  zh: {
    title: 'ThisInterview : 完美面試操練',
    startRecording: '開始錄音',
    stopRecording: '停止錄音',
    next: '下一題',
    previous: '上一題',
    language: '語言',
    addQuestion: '新增問題',
    modelAnswer: '參考答案',
    modelAnswerPlaceholder: '在此輸入標準答案...',
    questionPlaceholder: '在此輸入問題...',
    noQuestions: '尚未新增問題。在上方新增您的第一個問題。',
    saveSession: '儲存練習',
    loadSession: '載入練習',
    sessionSaved: '練習已成功儲存！',
    sessionLoaded: '練習已成功載入！',
    errorSaving: '儲存練習時發生錯誤',
    errorLoading: '載入練習時發生錯誤',
    clearQuestions: '清除全部',
    confirmClear: '確定要清除所有問題嗎？',
    yes: '是',
    no: '否',
    cancel: '取消',
    confirm: '確認',
    recording: '錄音中...',
    errorRecording: '存取麥克風時發生錯誤',
    noMicrophoneAccess: '請允許存取麥克風以進行錄音',
    recordingComplete: '錄音完成',
    playRecording: '播放錄音',
    stopPlaying: '停止播放',
    deleteRecording: '刪除錄音',
    editAnswer: '編輯答案',
    showAnswer: '顯示答案',
    hideAnswer: '隱藏答案',
    speedSlow: '慢',
    speedNormal: '正常',
    speedFast: '快',
    firstQuestion: '第一題',
    finalQuestion: '最後一題'
  }
};

export function useTranslation(language) {
  const [t, setT] = useState(translations[language] || translations.en);

  useEffect(() => {
    setT(translations[language] || translations.en);
  }, [language]);

  return { t };
}
