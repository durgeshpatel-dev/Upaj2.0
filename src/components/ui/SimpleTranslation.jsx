import React from 'react';
import { useUnifiedTranslation } from '../../hooks/useUnifiedTranslation';

// Simple translation component
export const Tr = ({ children, className, ...props }) => {
  const { t } = useUnifiedTranslation();

  // Translate only string/number children; preserve React elements (br, spans, etc.)
  const translated = React.Children.map(children, (child) => {
    if (typeof child === 'string' || typeof child === 'number') {
      return t(String(child));
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

  return (
    <select
      value={language}
      onChange={(e) => changeLanguage(e.target.value)}
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
