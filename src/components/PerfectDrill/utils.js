export const detectLanguage = (text) => {
  const chineseRegex = /[\u4e00-\u9fa5]/;
  const englishRegex = /^[A-Za-z0-9\s.,!?'"()-]+$/;

  if (chineseRegex.test(text)) return 'zh';
  if (englishRegex.test(text)) return 'en';
  return 'en'; // default to English
};

export const getVoiceForLanguage = (detectedLanguage, interfaceLanguage, availableVoices) => {
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
    return microsoftYating || availableVoices[0];
  }
  if (detectedLanguage === 'en' && interfaceLanguage === 'zh') {
    return microsoftZira || availableVoices[0];
  }

  return interfaceLanguage === 'zh' ? microsoftYating : microsoftZira;
};
