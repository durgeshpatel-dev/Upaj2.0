import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translateTexts } from '../utils/translate';

const TranslationContext = createContext(null);

export const TranslationProvider = ({ children }) => {
  const getInitialLang = () => {
    try {
      const stored = localStorage.getItem('app_lang');
      if (stored) return stored;
    } catch (e) {
      // ignore
    }
    const nav = (navigator.language || navigator.userLanguage || 'en').split('-')[0];
    return nav || 'en';
  };

  const [language, setLanguage] = useState(getInitialLang);

  useEffect(() => {
    try {
      localStorage.setItem('app_lang', language);
    } catch (e) {
      // ignore
    }
  }, [language]);

  // translate single text (returns Promise<string>)
  const t = useCallback(async (text) => {
    if (!text) return text;
    if (language === 'en') return text;
    try {
      const [translated] = await translateTexts([text], language);
      return translated || text;
    } catch (err) {
      console.error('Translation error:', err);
      return text;
    }
  }, [language]);

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const ctx = useContext(TranslationContext);
  if (!ctx) {
    throw new Error('useTranslation must be used within TranslationProvider');
  }
  return ctx;
};

export default TranslationContext;
