import React from 'react';
import { AlertCircle } from 'lucide-react';

const FormInput = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder,
  required = false,
  error,
  className = '',
  ...props 
}) => {
  const baseClasses = "w-full bg-background border text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background transition-all duration-300";
  const sizeClasses = "h-14 px-4 text-base rounded-xl";
  const borderClasses = error
    ? "border-status-error/70 focus:ring-status-error/50"
    : "border-border focus:border-primary focus:ring-primary/50";

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-text-primary">
          {label}
          {required && <span className="text-status-error ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`${baseClasses} ${sizeClasses} ${borderClasses} ${className} ${error ? 'pr-10' : ''}`}
          {...props}
        />
        {error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <AlertCircle className="h-5 w-5 text-status-error" />
          </div>
        )}
      </div>
      {error && <p className="text-sm text-status-error mt-2 animate-in fade-in slide-in-from-top-1 duration-300">{error}</p>}
    </div>
  );
};

export default FormInput;
