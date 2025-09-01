import React from 'react';
import { classNames } from '../../utils/classNames';

const AlertBanner = ({ children, className, variant = 'warning' }) => {
  const variants = {
    warning: 'bg-status-warning/10 border-status-warning/20 text-status-warning',
    success: 'bg-status-success/10 border-status-success/20 text-status-success',
    error: 'bg-status-error/10 border-status-error/20 text-status-error',
    info: 'bg-primary/10 border-primary/20 text-primary'
  };

  return (
    <div className={classNames(
      'rounded-lg border px-4 py-3 text-sm',
      variants[variant],
      className
    )}>
      <div className="flex items-start gap-3">
        <span className="mt-1 inline-block h-2 w-2 rounded-full bg-current opacity-80" aria-hidden />
        <div className="text-text-primary">{children}</div>
      </div>
    </div>
  );
};

export default AlertBanner;
