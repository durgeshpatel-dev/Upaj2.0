import React from 'react';
import { useEnhancedTranslation } from '../../context/EnhancedTranslationContext';

/**
 * Translation component for text translation
 * Usage: <T k="navbar.dashboard" />
 * Usage: <T k="common.loading" defaultValue="Loading..." />
 */
export const T = ({ k, defaultValue, values, className, ...props }) => {
  const { t } = useEnhancedTranslation();
  
  const translatedText = t(k, { defaultValue, ...values });
  
  return (
    <span className={className} {...props}>
      {translatedText}
    </span>
  );
};

/**
 * Higher-order component for components that need translation
 */
export const withTranslation = (Component) => {
  return function TranslatedComponent(props) {
    const translationProps = useEnhancedTranslation();
    return <Component {...props} {...translationProps} />;
  };
};

/**
 * Language selector component
 */
export const LanguageSelector = ({ className = '', showLabel = true }) => {
  const { language, changeLanguage, availableLanguages, isLoading } = useEnhancedTranslation();

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showLabel && (
        <span className="text-sm text-gray-400">
          भाषा / Language:
        </span>
      )}
      <select
        value={language}
        onChange={(e) => changeLanguage(e.target.value)}
        disabled={isLoading}
        className="text-sm bg-background border border-border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
        aria-label="Language"
      >
        {availableLanguages.map(lang => (
          <option key={lang.code} value={lang.code}>
            {lang.nativeName}
          </option>
        ))}
      </select>
      {isLoading && (
        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      )}
    </div>
  );
};

/**
 * Translation loading component
 */
export const TranslationLoader = ({ children }) => {
  const { ready } = useEnhancedTranslation();
  
  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-secondary">Loading translations...</p>
        </div>
      </div>
    );
  }
  
  return children;
};

export default T;
