import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation as useI18nextTranslation } from 'react-i18next';
import i18n from '../utils/i18n';

const EnhancedTranslationContext = createContext(null);

export const EnhancedTranslationProvider = ({ children }) => {
  const { t, i18n: i18nInstance } = useI18nextTranslation();
  const [isLoading, setIsLoading] = useState(false);

  // Get current language
  const getCurrentLanguage = () => i18nInstance.language || 'en';

  // Change language function
  const changeLanguage = async (lng) => {
    setIsLoading(true);
    try {
      await i18nInstance.changeLanguage(lng);
      localStorage.setItem('app_lang', lng);
    } catch (error) {
      console.error('Failed to change language:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize language from localStorage or browser
  useEffect(() => {
    const initializeLanguage = async () => {
      const savedLanguage = localStorage.getItem('app_lang');
      if (savedLanguage && savedLanguage !== getCurrentLanguage()) {
        await changeLanguage(savedLanguage);
      }
    };
    initializeLanguage();
  }, []);

  // Translation function with fallback
  const translate = (key, options = {}) => {
    try {
      const translation = t(key, options);
      // If translation key is returned as-is, it means translation is missing
      if (translation === key && getCurrentLanguage() !== 'en') {
        // Fallback to English
        return t(key, { ...options, lng: 'en' });
      }
      return translation;
    } catch (error) {
      console.warn(`Translation error for key "${key}":`, error);
      return key;
    }
  };

  // Get available languages
  const getAvailableLanguages = () => [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' }
  ];

  // Check if current language is RTL
  const isRTL = () => {
    const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
    return rtlLanguages.includes(getCurrentLanguage());
  };

  const value = {
    t: translate,
    language: getCurrentLanguage(),
    changeLanguage,
    isLoading,
    availableLanguages: getAvailableLanguages(),
    isRTL: isRTL(),
    ready: i18nInstance.isInitialized
  };

  return (
    <EnhancedTranslationContext.Provider value={value}>
      {children}
    </EnhancedTranslationContext.Provider>
  );
};

export const useEnhancedTranslation = () => {
  const context = useContext(EnhancedTranslationContext);
  if (!context) {
    throw new Error('useEnhancedTranslation must be used within EnhancedTranslationProvider');
  }
  return context;
};

export default EnhancedTranslationContext;
