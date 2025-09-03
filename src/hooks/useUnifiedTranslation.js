import { useTranslation as useOriginalTranslation } from '../context/TranslationContext';

// Hindi translations for immediate use
const hindiTranslations = {
  // Navigation

  "Home": "मुख्य पृष्ठ",
  "Predict": "पूर्वानुमान",
  "Dashboard": "डैशबोर्ड",
  "Community": "समुदाय", 
  "Chat Support": "चैट सहायता",
  "Prediction": "पूर्वानुमान",
  "Profile": "प्रोफाइल",
  "Sign In": "साइन इन",
  "Get Started": "शुरू करें",
  "Login": "लॉगिन",
  "Logout": "लॉगआउट",
  "Go to Dashboard": "डैशबोर्ड पर  जाएं",
  "AgriVision": "एग्रीविजन",
  "Get Started Now": "अभी शुरू करें",
  "Get Started for Free": "नि:शुल्क शुरू करें",
  "Try Demo": "डेमो आज़माएँ",

  // Hero / Landing
  "Predict Your Crop Yields with Precision": "सटीकता के साथ अपनी फसल की उपज का अनुमान लगाएँ",
  "AgriVision uses advanced AI to provide accurate yield predictions, helping farmers optimize their resources and maximize profits.": "AgriVision उन्नत AI का उपयोग करके सटीक उपज पूर्वानुमान प्रदान करता है, जिससे किसान अपने संसाधनों का बेहतर उपयोग कर लाभ अधिकतम कर सकें।",

  // Metrics
  "95% Prediction Accuracy": "95% पूर्वानुमान सटीकता",
  "1000+ Happy Farmers": "1000+ संतुष्ट किसान",
  "25+ Crop Types Supported": "25+ फसल प्रकार समर्थित",
  "24/7 Real-time Monitoring": "24/7 वास्तविक समय निगरानी",

  // Key features
  "Key Features": "मुख्य विशेषताएँ",
  "AgriVision offers a range of features designed to help farmers make informed decisions and improve their crop yields.": "AgriVision किसानों को सूचित निर्णय लेने और अपनी फसल की पैदावार में सुधार करने में मदद करने के लिए विभिन्न सुविधाएं प्रदान करता है।",
  "Precision": "सटीकता",
  "Accurate Predictions": "सटीक पूर्वानुमान",
  "Our AI models provide highly accurate yield predictions based on historical data, weather patterns, and soil conditions.": "हमारे AI मॉडल ऐतिहासिक डेटा, मौसम पैटर्न और मिट्टी की स्थितियों के आधार पर अत्यधिक सटीक उपज पूर्वानुमान प्रदान करते हैं।",
  "Crop-Specific Models": "फसल-विशिष्ट मॉडल",
  "We offer specialized models for a variety of crops, ensuring precise predictions tailored to your specific needs.": "हम विभिन्न फसलों के लिए विशेषीकृत मॉडल प्रदान करते हैं, जो आपकी विशिष्ट आवश्यकताओं के अनुरूप सटीक पूर्वानुमान सुनिश्चित करते हैं।",
  "Real-Time Insights": "वास्तविक समय की जानकारी",
  "Get up-to-date insights and alerts on potential risks, allowing you to take proactive measures to protect your crops.": "संभावित जोखिमों पर अद्यतन जानकारी और अलर्ट प्राप्त करें, जिससे आप अपनी फसलों की सुरक्षा के लिए सक्रिय उपाय कर सकें।",

  // Section CTA
  "Ready to Boost Your Crop Yields?": "क्या आप अपनी फसल की उपज बढ़ाने के लिए तैयार हैं?",
  "Join AgriVision today and start making smarter farming decisions.": "AgriVision में आज ही शामिल हों और स्मार्ट खेती के निर्णय लेना शुरू करें।",

  // Footer / legal
  "Privacy Policy": "गोपनीयता नीति",
  "Terms of Service": "सेवा की शर्तें",
  "Contact Us": "संपर्क करें",
  "About Us": "हमारे बारे में",
  "© 2024 AgriVision. All rights reserved.": "© 2024 AgriVision। सर्वाधिकार सुरक्षित।",
  "© 2024 AgriVision. All rights reserved. Empowering farmers with AI-driven insights.": "© 2024 AgriVision। सर्वाधिकार सुरक्षित। AI-प्रेरित अंतर्दृष्टि के साथ किसानों को सशक्त बनाना।",
  





  // Common words
  "Loading...": "लोड हो रहा है...",
  "Error": "त्रुटि",
  "Success": "सफलता", 
  "Save": "सेव करें",
  "Cancel": "रद्द करें",
  "Submit": "जमा करें",
  "Delete": "हटाएं",
  "Edit": "संपादित करें",
  "Back": "वापस",
  "Next": "अगला",
  "Search": "खोजें",
  "Filter": "फ़िल्टर",
  "<tr> <tr>": "<tr> <tr>",
  
  // Prediction form
  "Crop Type": "फसल का प्रकार",
  "Soil Type": "मिट्टी का प्रकार", 
  "Date": "तारीख",
  "Location": "स्थान",
  "Temperature": "तापमान",
  "Humidity": "आर्द्रता",
  "Rainfall": "वर्षा",
  "Predict Yield": "उत्पादन का अनुमान लगाएं",
  
  // Crops
  "wheat": "गेहूं",
  "rice": "चावल", 
  "maize": "मक्का",
  "barley": "जौ",
  "soybean": "सोयाबीन",
  "cotton": "कपास",
  "sugarcane": "गन्ना",
  "potato": "आलू",
  "tomato": "टमाटर",
  
  // Soil types
  "clay": "चिकनी मिट्टी",
  "loam": "दोमट",
  "sandy": "रेतीली", 
  "silt": "गाद",
  "black": "काली मिट्टी",
  "red": "लाल मिट्टी",
  "alluvial": "जलोढ़",
  
  // Auth
  "Email": "ईमेल",
  "Password": "पासवर्ड",
  "Forgot Password": "पासवर्ड भूल गए",
  "Sign Up": "साइन अप",
  "Create Account": "खाता बनाएं",
  
  // Chat
  "Ask me anything about farming...": "खेती के बारे में कुछ भी पूछें...",
  "Send": "भेजें",
  "New Chat": "नई चैट",
  "Chat History": "चैट इतिहास",
  "AI Assistant": "AI सहायक",
  "Online": "ऑनलाइन",
  "Ready": "तैयार",
  "Thinking...": "सोच रहा है...",
  
  // Dashboard
  "Welcome back": "वापस स्वागत है",
  "Recent Predictions": "हाल के पूर्वानुमान",
  "Weather Information": "मौसम की जानकारी", 
  "Soil Health": "मिट्टी का स्वास्थ्य",
  "Alerts": "चेतावनी",
  
  // Profile
  "Personal Information": "व्यक्तिगत जानकारी",
  "Farm Details": "खेत की जानकारी",
  "Name": "नाम",
  "Phone": "फोन",
  "Address": "पता",
  "Profile Settings": "प्रोफ़ाइल सेटिंग्स",
  "Farm Size": "खेत का आकार"
};

export const useUnifiedTranslation = () => {
  const { language, setLanguage } = useOriginalTranslation();
  
  const t = (text) => {
    if (!text) return text;
    if (language === 'en') return text;
    if (language === 'hi') {
      const translated = hindiTranslations[text] || text;
      return translated;
    }
    return text;
  };
  
  const changeLanguage = (newLang) => {
    console.log(`useUnifiedTranslation: Changing language from ${language} to ${newLang}`);
    setLanguage(newLang);
  };
  
  return {
    language,
    changeLanguage,
    t,
    availableLanguages: [
      { code: 'en', name: 'English', nativeName: 'English' },
      { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' }
    ]
  };
};

export default useUnifiedTranslation;
