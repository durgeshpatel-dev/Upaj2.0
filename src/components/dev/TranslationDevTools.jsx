import React, { useState } from 'react';
import { useEnhancedTranslation } from '../../context/EnhancedTranslationContext';

/**
 * Development helper component to test translations
 * Only shows in development mode
 */
const TranslationDevTools = () => {
  const { t, language, changeLanguage, availableLanguages } = useEnhancedTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [testKey, setTestKey] = useState('navbar.dashboard');

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const commonKeys = [
    'navbar.dashboard',
    'navbar.community', 
    'navbar.chatSupport',
    'common.loading',
    'common.save',
    'auth.login',
    'prediction.title',
    'chat.placeholder'
  ];

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${isOpen ? 'w-80' : 'w-auto'}`}>
      <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-lg">
        <div 
          className="flex items-center justify-between p-3 cursor-pointer bg-gray-800 rounded-t-lg"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="text-white text-sm font-medium">i18n DevTools</span>
          <span className="text-gray-400 text-xs">{language.toUpperCase()}</span>
        </div>
        
        {isOpen && (
          <div className="p-4 space-y-3">
            {/* Language Switcher */}
            <div>
              <label className="block text-gray-300 text-xs mb-1">Language</label>
              <select
                value={language}
                onChange={(e) => changeLanguage(e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-sm"
              >
                {availableLanguages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.nativeName}
                  </option>
                ))}
              </select>
            </div>

            {/* Test Translation */}
            <div>
              <label className="block text-gray-300 text-xs mb-1">Test Key</label>
              <input
                type="text"
                value={testKey}
                onChange={(e) => setTestKey(e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                placeholder="e.g., navbar.dashboard"
              />
              <div className="mt-1 p-2 bg-gray-800 rounded text-xs text-green-300">
                {t(testKey)}
              </div>
            </div>

            {/* Common Keys */}
            <div>
              <label className="block text-gray-300 text-xs mb-1">Common Keys</label>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {commonKeys.map(key => (
                  <div
                    key={key}
                    className="cursor-pointer p-1 rounded hover:bg-gray-700 text-xs"
                    onClick={() => setTestKey(key)}
                  >
                    <div className="text-blue-300">{key}</div>
                    <div className="text-gray-400">{t(key)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TranslationDevTools;
