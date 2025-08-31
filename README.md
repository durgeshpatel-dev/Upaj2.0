# 🌾 Upaj - Agricultural Yield Prediction Platform

Upaj is a modern web application that helps farmers predict crop yields using AI and machine learning. The platform provides weather insights, soil analysis, community features, and AI-powered chat support to enhance farming decisions.

## 🚀 Tech Stack

### Frontend Framework
- **React 19.1.1** - Modern UI library with latest features
- **Vite** - Fast build tool and development server
- **Tailwind CSS 3.4.10** - Utility-first CSS framework for styling

### Core Libraries
- **React Router DOM** - Client-side routing for single-page application
- **React Hook Form** - Performant forms with easy validation
- **Yup + @hookform/resolvers** - Schema validation for forms
- **Axios** - HTTP client for API requests
- **D3** - Data visualization and charting library
- **Date-fns** - Modern date utility library
- **Clsx** - Utility for conditionally joining CSS classes
- **Lucide React** - Beautiful icon library

### Development Tools
- **ESLint** - Code linting and formatting
- **PostCSS + Autoprefixer** - CSS processing
- **Vite Plugin React** - React integration for Vite

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   │   ├── Login.jsx
│   │   └── Signup.jsx
│   ├── chat/           # AI Chat support components
│   │   ├── ChatWindow.jsx
│   │   ├── MessageBubble.jsx
│   │   ├── ChatHistorySidebar.jsx
│   │   └── InputBox.jsx
│   ├── community/      # Community features
│   │   ├── CommunityFeed.jsx
│   │   ├── PostCard.jsx
│   │   └── NewPostButton.jsx
│   ├── dashboard/      # Dashboard widgets
│   │   ├── AlertBanner.jsx
│   │   ├── PredictionSummary.jsx
│   │   ├── WeatherCard.jsx
│   │   ├── SoilCard.jsx
│   │   ├── FarmMap.jsx
│   │   └── PastPredictionsTable.jsx
│   ├── landing/        # Landing page sections
│   │   ├── HeroSection.jsx
│   │   ├── FeaturesSection.jsx
│   │   ├── CallToAction.jsx
│   │   └── Footer.jsx
│   ├── prediction/     # Prediction functionality
│   │   ├── PredictionForm.jsx
│   │   ├── PredictionOutput.jsx
│   │   └── YieldTrendChart.jsx
│   ├── profile/        # User profile components
│   │   ├── ProfileCard.jsx
│   │   ├── PersonalInfoForm.jsx
│   │   ├── FarmDetailsForm.jsx
│   │   └── PastPredictionsList.jsx
│   ├── ui/            # Reusable UI elements
│   │   ├── Card.jsx
│   │   ├── Modal.jsx
│   │   ├── FormInput.jsx
│   │   └── NotificationBell.jsx
│   ├── Button.jsx     # Global button component
│   └── Navbar.jsx     # Main navigation
├── pages/             # Main application pages
│   ├── Landing.jsx    # Home/landing page
│   ├── Dashboard.jsx  # Main dashboard
│   ├── Prediction.jsx # Yield prediction page
│   ├── Community.jsx  # Community forum
│   ├── Profile.jsx    # User profile page
│   └── ChatSupport.jsx # AI chat support
├── context/           # React Context providers
│   ├── AuthContext.jsx # Authentication state
│   └── AppContext.jsx  # Global app state
├── hooks/             # Custom React hooks
│   ├── useApi.js      # API call hook
│   ├── useAuth.js     # Authentication hook
│   └── useLocalStorage.js # Local storage hook
├── utils/             # Utility functions
│   ├── api.js         # API configuration and helpers
│   ├── validation.js  # Form validation schemas
│   ├── dateUtils.js   # Date formatting utilities
│   └── classNames.js  # CSS class utilities
├── assets/            # Static assets
└── main.jsx          # Application entry point
```

## 🎯 Features Overview

### 🏠 Landing Page
- **Hero Section** - Eye-catching introduction with call-to-action
- **Features Section** - Highlight key platform capabilities
- **Call to Action** - Drive user engagement and signups
- **Footer** - Important links and information

### 📊 Dashboard
- **Alert Banner** - Important notifications and updates
- **Prediction Summary** - Latest yield predictions overview
- **Weather Card** - Real-time weather information
- **Soil Card** - Soil health insights (pH, moisture)
- **Farm Map** - Interactive field location mapping
- **Past Predictions Table** - Historical prediction accuracy

### 🔮 Prediction System
- **Prediction Form** - Input crop, location, soil type, planting date
- **Auto-fetch Toggle** - Automatic data retrieval option
- **Prediction Output** - Detailed yield results
- **Yield Trend Chart** - Visual data representation using D3

### 👥 Community Platform
- **Community Feed** - Social posts and discussions
- **Post Cards** - Individual post components with interactions
- **Sidebar Navigation** - Categories and topic filtering
- **New Post Creation** - User-generated content tools

### 👤 User Profile
- **Profile Card** - User information display
- **Personal Info Form** - Editable user details
- **Farm Details Form** - Farm-specific information
- **Past Predictions List** - User's prediction history

### 🤖 AI Chat Support
- **Chat Window** - Real-time conversation interface
- **Message Bubbles** - Distinct user and AI message styling
- **Chat History** - Previous conversation access
- **Input Box** - Message composition and sending

## 🛠️ Development Guidelines

### Component Structure
- Each component has a single responsibility
- Components are organized by feature/page
- Reusable UI components are in the `ui/` folder
- Complex features have their own component folders

### State Management
- **React Context** for global state (auth, app settings)
- **Custom Hooks** for reusable stateful logic
- **Local State** for component-specific data

### Styling Approach
- **Tailwind CSS** for utility-first styling
- **Responsive Design** with mobile-first approach
- **Component-based** styling patterns
- **Consistent Design System** throughout the app

### Form Handling
- **React Hook Form** for performance and ease of use
- **Yup Validation** for robust form validation
- **Error Handling** with user-friendly messages
- **Accessibility** considerations for form inputs

### API Integration
- **Axios** for HTTP requests
- **Custom Hooks** for API state management
- **Error Handling** and loading states
- **Response Caching** where appropriate

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation
```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd Upaj

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📝 Development Notes

### Future Enhancements
- **Leaflet Maps** - Interactive mapping (to be implemented)
- **Real-time Weather API** - Live weather data integration
- **Machine Learning Models** - Advanced prediction algorithms
- **Mobile App** - React Native implementation
- **Offline Support** - PWA capabilities

### Code Conventions
- Use **functional components** with hooks
- **Camel case** for variables and functions
- **Pascal case** for components
- **Descriptive naming** for clarity
- **JSDoc comments** for complex functions

### Performance Considerations
- **Code splitting** with React.lazy()
- **Image optimization** for faster loading
- **Bundle analysis** to monitor size
- **Memoization** for expensive calculations

## 🤝 Contributing

1. Create a feature branch
2. Follow the existing code structure
3. Add appropriate comments
4. Test your changes thoroughly
5. Submit a pull request

## 📞 Support

For questions or issues, please refer to the project documentation or contact the development team.

---

**Built with ❤️ for farmers worldwide**
