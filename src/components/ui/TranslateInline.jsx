import React, { useEffect, useState } from 'react';
import { useTranslation } from '../../context/TranslationContext';

const TranslateInline = ({ text, className = '', children, ...rest }) => {
  const { language, t } = useTranslation();
  const [translated, setTranslated] = useState(text);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!text) return;
      if (language === 'en') {
        setTranslated(text);
        return;
      }
      const tr = await t(text);
      if (mounted) setTranslated(tr || text);
    })();
    return () => { mounted = false; };
  }, [text, language, t]);

  // If children provided, prefer children as content but allow translation override
  const content = children || translated;

  return (
    <span className={className} {...rest}>{content}</span>
  );
};

export default TranslateInline;
