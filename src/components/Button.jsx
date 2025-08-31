import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  onClick, 
  className = '',
  ...props 
}) => {
  const baseClasses = 'font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-primary hover:bg-primary/80 text-primary-foreground focus:ring-primary',
    secondary: 'bg-background-card hover:bg-border text-text-primary focus:ring-border',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground focus:ring-primary',
    success: 'bg-status-success hover:bg-status-success/80 text-primary-foreground focus:ring-status-success',
    error: 'bg-status-error hover:bg-status-error/80 text-white focus:ring-status-error',
    warning: 'bg-status-warning hover:bg-status-warning/80 text-primary-foreground focus:ring-status-warning'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <button 
      className={classes} 
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
