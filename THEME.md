# Theme System Documentation

## Overview
This project uses a global color palette system that ensures consistency across all components and pages. The theme is implemented using both JavaScript exports and Tailwind CSS custom colors.

## Theme Structure

### Color Palette
```javascript
{
  colors: {
    primary: {
      DEFAULT: '#50FF9F',      // Bright green - main brand color
      foreground: '#111814',   // Dark text for primary backgrounds
    },
    background: {
      DEFAULT: '#111814',      // Main dark background
      card: '#1A221E',         // Slightly lighter for cards/modals
    },
    text: {
      primary: '#E0E0E0',      // Main text color (light gray)
      secondary: '#A0A0A0',    // Secondary text (dimmed)
    },
    border: '#333C37',         // Border color for inputs, cards
    status: {
      success: '#50FF9F',      // Success states (same as primary)
      error: '#FF5B5B',        // Error states (red)
      warning: '#FFB800',      // Warning states (orange)
    },
  },
}
```

## Usage

### In Tailwind CSS Classes
Use the custom Tailwind classes defined in `tailwind.config.js`:

```jsx
// Backgrounds
<div className="bg-background">           // Main background
<div className="bg-background-card">      // Card background

// Text colors
<p className="text-text-primary">         // Primary text
<p className="text-text-secondary">       // Secondary text

// Primary color
<button className="bg-primary text-primary-foreground">
<div className="border border-primary">

// Status colors
<div className="bg-status-success">       // Success
<div className="bg-status-error">         // Error
<div className="bg-status-warning">       // Warning

// Borders
<div className="border border-border">
```

### In JavaScript/D3.js/Chart Libraries
Import the theme colors for use in JavaScript:

```javascript
import { colors } from '../utils/theme.js';

// Use in D3.js
.attr("stroke", colors.primary)
.attr("fill", colors.textSecondary)

// Use in Chart.js
backgroundColor: colors.primary,
borderColor: colors.border,
```

## Components Updated

### Pages
- ✅ **Landing Page** (`src/pages/Landing.jsx`)
  - Updated AgriVisionLanding component with theme classes
  - Replaced hardcoded hex values with Tailwind classes

- ✅ **Prediction Page** (`src/pages/Prediction.jsx`)
  - Updated background to use theme
  - All child components updated

### Components
- ✅ **AgriVisionLanding** (`src/components/AgriVisionLanding.jsx`)
  - Navigation, hero, features, CTA, footer sections
  - Hover states and interactive elements

- ✅ **PredictionForm** (`src/components/prediction/PredictionForm.jsx`)
  - Form inputs, labels, toggles, submit button
  - Focus states and validation styling

- ✅ **PredictionOutput** (`src/components/prediction/PredictionOutput.jsx`)
  - Result display with theme colors

- ✅ **YieldTrendChart** (`src/components/prediction/YieldTrendChart.jsx`)
  - D3.js chart updated with theme colors
  - Axis labels and data points

- ✅ **Navbar** (`src/components/Navbar.jsx`)
  - Navigation links, logo, user avatar
  - Active states and hover effects

- ✅ **Button** (`src/components/Button.jsx`)
  - Multiple variants using theme colors
  - Added success, error, warning variants

- ✅ **Card** (`src/components/ui/Card.jsx`)
  - Created comprehensive card component
  - Multiple variants and sub-components

### Global Styles
- ✅ **Tailwind Config** (`tailwind.config.js`)
  - Extended theme with custom colors
  - Matches design system exactly

- ✅ **Global CSS** (`src/index.css`)
  - Body background and text colors
  - Scrollbar styling for dark theme
  - Form input enhancements

## File Structure
```
src/
├── theme.js                    // Main theme definition
├── utils/
│   └── theme.js               // Theme utilities and exports
├── components/
│   ├── AgriVisionLanding.jsx  // ✅ Updated
│   ├── Navbar.jsx             // ✅ Updated
│   ├── Button.jsx             // ✅ Updated
│   ├── prediction/
│   │   ├── PredictionForm.jsx // ✅ Updated
│   │   ├── PredictionOutput.jsx // ✅ Updated
│   │   └── YieldTrendChart.jsx // ✅ Updated
│   └── ui/
│       └── Card.jsx           // ✅ Created
└── pages/
    ├── Landing.jsx            // ✅ Updated
    └── Prediction.jsx         // ✅ Updated
```

## Development Guidelines

### Adding New Components
1. Use theme classes from Tailwind config
2. Import JavaScript colors for complex styling
3. Follow the established patterns for consistency

### Color Usage Guidelines
- **Primary**: Use for main actions, highlights, active states
- **Background**: Main page backgrounds
- **Background Card**: Elevated surfaces, modals, cards
- **Text Primary**: Headlines, important text
- **Text Secondary**: Supporting text, labels
- **Border**: Input borders, dividers, card outlines
- **Status Colors**: Feedback, alerts, notifications

### Accessibility
- Contrast ratios meet WCAG guidelines
- Color combinations tested for readability
- Focus states clearly visible

## Future Enhancements
- [ ] Dark/Light mode toggle
- [ ] Theme customization panel
- [ ] CSS custom properties for runtime theming
- [ ] Additional status color variants
- [ ] Component documentation with Storybook
