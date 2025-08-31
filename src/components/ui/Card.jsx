import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  variant = 'default',
  ...props 
}) => {
  const baseClasses = 'rounded-lg border transition-colors duration-200';
  
  const variants = {
    default: 'bg-background-card border-border',
    primary: 'bg-background-card border-primary/30',
    secondary: 'bg-background border-border',
    success: 'bg-background-card border-status-success/30',
    error: 'bg-background-card border-status-error/30',
    warning: 'bg-background-card border-status-warning/30'
  };

  const classes = `${baseClasses} ${variants[variant]} ${className}`;

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = '' }) => (
  <div className={`p-6 pb-4 ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children, className = '' }) => (
  <div className={`p-6 pt-0 ${className}`}>
    {children}
  </div>
);

const CardFooter = ({ children, className = '' }) => (
  <div className={`p-6 pt-4 border-t border-border ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-xl font-bold text-text-primary ${className}`}>
    {children}
  </h3>
);

const CardDescription = ({ children, className = '' }) => (
  <p className={`text-text-secondary ${className}`}>
    {children}
  </p>
);

Card.Header = CardHeader;
Card.Content = CardContent;
Card.Footer = CardFooter;
Card.Title = CardTitle;
Card.Description = CardDescription;

export default Card;
