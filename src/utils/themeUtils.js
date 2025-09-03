/**
 * Theme utility functions for consistent color usage
 */

export const getThemeColors = () => ({
  primary: {
    DEFAULT: 'rgb(var(--primary))',
    foreground: 'rgb(var(--primary-foreground))',
    bg: 'var(--primary)',
    opacity10: 'var(--primary) / 0.1',
    opacity20: 'var(--primary) / 0.2',
    opacity30: 'var(--primary) / 0.3'
  },
  background: {
    DEFAULT: 'var(--background)',
    card: 'var(--background-card)'
  },
  text: {
    primary: 'var(--text-primary)',
    secondary: 'var(--text-secondary)'
  },
  status: {
    success: 'var(--status-success)',
    error: 'var(--status-error)',
    warning: 'var(--status-warning)'
  }
});

/**
 * Get theme-appropriate background colors for cards and components
 */
export const getCardColors = (variant = 'default') => {
  const variants = {
    default: 'bg-background-card',
    primary: 'bg-primary/10 border border-primary/20',
    success: 'bg-status-success/10 border border-status-success/20',
    warning: 'bg-status-warning/10 border border-status-warning/20',
    error: 'bg-status-error/10 border border-status-error/20',
    subtle: 'bg-background-card border border-border'
  };
  
  return variants[variant] || variants.default;
};

/**
 * Get theme-appropriate text colors
 */
export const getTextColors = (variant = 'primary') => {
  const variants = {
    primary: 'text-text-primary',
    secondary: 'text-text-secondary',
    success: 'text-status-success',
    warning: 'text-status-warning',
    error: 'text-status-error',
    primaryTheme: 'text-primary'
  };
  
  return variants[variant] || variants.primary;
};

/**
 * Get theme-appropriate badge/tag colors
 */
export const getBadgeColors = (variant = 'default') => {
  const variants = {
    default: 'bg-background-card text-text-secondary',
    primary: 'bg-primary text-primary-foreground',
    success: 'bg-status-success/20 text-status-success',
    warning: 'bg-status-warning/20 text-status-warning',
    error: 'bg-status-error/20 text-status-error',
    info: 'bg-primary/20 text-primary'
  };
  
  return variants[variant] || variants.default;
};

/**
 * Get theme-appropriate hover colors
 */
export const getHoverColors = (variant = 'default') => {
  const variants = {
    default: 'hover:bg-background-card',
    primary: 'hover:bg-primary/20',
    success: 'hover:bg-status-success/20',
    warning: 'hover:bg-status-warning/20',
    error: 'hover:bg-status-error/20'
  };
  
  return variants[variant] || variants.default;
};

/**
 * Get fertility level colors based on value
 */
export const getFertilityColors = (fertility) => {
  switch (fertility?.toLowerCase()) {
    case 'high':
      return getBadgeColors('success');
    case 'medium':
      return getBadgeColors('warning');
    case 'low':
      return getBadgeColors('error');
    default:
      return getBadgeColors('default');
  }
};

/**
 * Get data accuracy colors based on value
 */
export const getAccuracyColors = (accuracy) => {
  switch (accuracy?.toLowerCase()) {
    case 'high':
      return getBadgeColors('success');
    case 'medium':
      return getBadgeColors('warning');
    case 'low':
      return getBadgeColors('error');
    default:
      return getBadgeColors('info');
  }
};

export default {
  getThemeColors,
  getCardColors,
  getTextColors,
  getBadgeColors,
  getHoverColors,
  getFertilityColors,
  getAccuracyColors
};
