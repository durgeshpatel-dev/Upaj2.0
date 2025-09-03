import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  // Load translation using http (default: public/locales)
  .use(Backend)
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    lng: 'en', // Default language
    fallbackLng: 'en', // Use English if translation is missing
    debug: process.env.NODE_ENV === 'development',

    interpolation: {
      escapeValue: false, // React already does escaping
    },

    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
      caches: ['localStorage'],
      lookupLocalStorage: 'app_lang',
    },

    // Namespace and resource management
    ns: ['common'],
    defaultNS: 'common',

    // React specific options
    react: {
      useSuspense: false, // We'll handle loading states manually
    },

    // Define supported languages
    supportedLngs: ['en', 'hi'],
    
    // Load resources
    resources: {
      en: {
        common: {} // Will be loaded from backend
      },
      hi: {
        common: {} // Will be loaded from backend
      }
    }
  });

export default i18n;
