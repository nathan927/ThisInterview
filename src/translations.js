import { useState, useEffect } from 'react';

export const translations = {
  en: {
    title: 'ThisInterview: Perfect Drill',
    inputQuestions: 'Input Questions',
    importQuestions: 'Import Questions',
    exportQuestions: 'Export Questions',
    saveSession: 'Save Progress',
    loadSession: 'Load Progress',
    modelAnswer: 'Model Answer',
    enterQuestions: 'Enter your questions, one per line:',
    enterModelAnswer: 'Enter model answer:',
    question: 'Question',
    questionNumber: (current, total) => `Question ${current} / ${total}`,
    startRecording: 'Start Answering',
    stopRecording: 'Stop Recording',
    previous: 'Previous',
    next: 'Next',
    cancel: 'Cancel',
    save: 'Save',
    upload: 'Upload',
    noQuestions: 'No questions to export',
    pleaseEnterQuestions: 'Please enter questions',
    uploadSuccess: 'Questions added successfully!',
    exportSuccess: 'Questions exported successfully!',
    importSuccess: 'Questions imported successfully!',
    saveSuccess: 'Session saved successfully!',
    loadSuccess: 'Session loaded successfully!',
    recordingStarted: 'Recording started',
    recordingStopped: 'Recording stopped. You can now play it back.',
    micError: 'Error accessing microphone. Please check permissions.',
    placeholder: 'Enter your questions here...',
    modelAnswerPlaceholder: 'Enter model answer here...',
    noRecordings: 'No recordings to save',
    clearAll: 'Clear All',
    clearAllConfirm: 'Are you sure you want to clear all questions? This action cannot be undone.',
    clearAllSuccess: 'All questions have been cleared successfully!',
    deleteAudio: 'Delete Audio',
    deleteAudioConfirm: 'Are you sure you want to delete this audio recording?',
    deleteAudioSuccess: 'Audio recording deleted successfully!',
    uploadQuestions: 'Upload Questions',
    saveProgress: 'Save Progress',
    loadProgress: 'Load Progress',
    editQuestion: 'Edit Question',
    editModelAnswer: 'Edit Model Answer',
    editSuccess: 'Successfully updated!',
    voice: 'Voice',
    speed: 'Speed',
    readingSpeed: 'Reading Speed',
    speedSlow: 'Slow',
    speedNormal: 'Normal',
    speedFast: 'Fast',
    firstQuestion: 'First Question',
    finalQuestion: 'Final Question'
  },
  zh: {
    title: 'ThisInterview : 完美面試操練',
    inputQuestions: '輸入題目',
    importQuestions: '匯入題目',
    exportQuestions: '匯出題目',
    saveSession: '儲存進度',
    loadSession: '載入進度',
    modelAnswer: '最佳答案',
    enterQuestions: '請輸入題目，每行一題：',
    enterModelAnswer: '輸入最佳答案：',
    question: '題目',
    questionNumber: (current, total) => `第 ${current} 題 / 共 ${total} 題`,
    startRecording: '開始回答',
    stopRecording: '停止錄音',
    previous: '上一題',
    next: '下一題',
    cancel: '取消',
    save: '儲存',
    upload: '上傳',
    noQuestions: '沒有可匯出的題目',
    pleaseEnterQuestions: '請輸入題目',
    uploadSuccess: '題目新增成功！',
    exportSuccess: '題目匯出成功！',
    importSuccess: '題目匯入成功！',
    saveSuccess: '進度儲存成功！',
    loadSuccess: '進度載入成功！',
    recordingStarted: '開始錄音',
    recordingStopped: '錄音已停止，可以播放錄音。',
    micError: '無法存取麥克風，請檢查權限設定。',
    placeholder: '在此輸入題目...',
    modelAnswerPlaceholder: '在此輸入標準答案...',
    noRecordings: '沒有可儲存的錄音',
    clearAll: '清除全部',
    clearAllConfirm: '確定要清除所有題目嗎？此操作無法復原。',
    clearAllSuccess: '所有題目已成功清除！',
    deleteAudio: '刪除錄音',
    deleteAudioConfirm: '確定要刪除這個錄音嗎？',
    deleteAudioSuccess: '錄音已成功刪除！',
    uploadQuestions: '上傳題目',
    saveProgress: '儲存進度',
    loadProgress: '載入進度',
    editQuestion: '編輯題目',
    editModelAnswer: '編輯最佳答案',
    editSuccess: '更新成功！',
    voice: '語音',
    speed: '速度',
    readingSpeed: '閱讀速度',
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
