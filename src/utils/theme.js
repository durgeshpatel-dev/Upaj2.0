// Theme utilities for accessing theme values in JavaScript
import { theme } from './theme.js';

// Export individual color values for use in JavaScript (e.g., Chart.js, D3.js)
export const colors = {
  primary: theme.colors.primary.DEFAULT,
  primaryForeground: theme.colors.primary.foreground,
  background: theme.colors.background.DEFAULT,
  backgroundCard: theme.colors.background.card,
  textPrimary: theme.colors.text.primary,
  textSecondary: theme.colors.text.secondary,
  border: theme.colors.border,
  success: theme.colors.status.success,
  error: theme.colors.status.error,
  warning: theme.colors.status.warning,
};

// CSS custom properties generator (for dynamic theming if needed)
export const generateCSSCustomProperties = () => {
  return {
    '--color-primary': theme.colors.primary.DEFAULT,
    '--color-primary-foreground': theme.colors.primary.foreground,
    '--color-background': theme.colors.background.DEFAULT,
    '--color-background-card': theme.colors.background.card,
    '--color-text-primary': theme.colors.text.primary,
    '--color-text-secondary': theme.colors.text.secondary,
    '--color-border': theme.colors.border,
    '--color-success': theme.colors.status.success,
    '--color-error': theme.colors.status.error,
    '--color-warning': theme.colors.status.warning,
  };
};

export { theme };
