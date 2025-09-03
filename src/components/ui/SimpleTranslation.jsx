import React from 'react';
import { useUnifiedTranslation } from '../../hooks/useUnifiedTranslation';

// Simple translation component
export const Tr = ({ children, className, ...props }) => {
  const { t, language } = useUnifiedTranslation();

  // Translate only string/number children; preserve React elements (br, spans, etc.)
  const translated = React.Children.map(children, (child) => {
    if (typeof child === 'string' || typeof child === 'number') {
      const result = t(String(child));
      // Debug logging
      if (process.env.NODE_ENV === 'development') {
        console.log(`Translation: "${child}" -> "${result}" (lang: ${language})`);
      }
      return result;
    }
    return child;
  });

  return (
    <span className={className} {...props}>
      {translated}
    </span>
  );
};

// Language selector component
export const SimpleLanguageSelector = ({ className = '' }) => {
  const { language, changeLanguage, availableLanguages } = useUnifiedTranslation();

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    console.log(`Language changing from ${language} to ${newLang}`);
    changeLanguage(newLang);
  };

  return (
    <select
      value={language}
      onChange={handleLanguageChange}
      className={`text-sm bg-background border border-border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary ${className}`}
      aria-label="Language"
    >
      {availableLanguages.map(lang => (
        <option key={lang.code} value={lang.code}>
          {lang.code.toUpperCase()}
        </option>
      ))}
    </select>
  );
};

export default Tr;
