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
  "Go Back": "वापस जाएं",
  "AgriVision": "एग्रीविजन",
  
  // Coming Soon page
  "Coming Soon": "जल्दी आ रहा है",
  "We're working on this feature and will be releasing it soon. Leave your email and we'll notify you when it's live.": "हम इस सुविधा पर काम कर रहे हैं और जल्द ही इसे जारी करेंगे। अपना ईमेल छोड़ें और जब यह तैयार हो जाएगी तो हम आपको सूचित करेंगे।",
  "Notify Me": "मुझे सूचित करें",
  "Thanks — we'll let you know when it's ready.": "धन्यवाद — जब यह तैयार हो जाएगी तो हम आपको बताएंगे।",

  // Authentication pages
  "Welcome Back": "वापस स्वागत है",
  "Sign in to your AgriVision account": "अपने AgriVision खाते में साइन इन करें",
  "Sign in with Google": "Google के साथ साइन इन करें",
  "or": "या",
  "Enter your email": "अपना ईमेल दर्ज करें",
  "Enter your password": "अपना पासवर्ड दर्ज करें",
  "Forgot password?": "पासवर्ड भूल गए?",
  "Signing in...": "साइन इन हो रहा है...",
  "Don't have an account?": "क्या आपका कोई खाता नहीं है?",
  "Sign up": "साइन अप करें",
  "Already have an account?": "क्या आपका पहले से खाता है?",
  "Sign in here": "यहाँ साइन इन करें",
  "Back to Home": "होम पर वापस जाएं",
  
  // Signup page
  "Create Your Account": "अपना खाता बनाएं",
  "Join thousands of farmers optimizing their yields with AI": "AI के साथ अपनी उपज को अनुकूलित करने वाले हजारों किसानों के साथ जुड़ें",
  "Personal Info": "व्यक्तिगत जानकारी",
  "Basic details": "बुनियादी विवरण",
  "Location & size": "स्थान और आकार",
  "Continue with Google": "Google के साथ जारी रखें",
  "or continue with email": "या ईमेल के साथ जारी रखें",
  "Let's start with your basic details": "आइए आपकी बुनियादी जानकारी से शुरुआत करते हैं",

  // Form fields and labels
  "Full Name": "पूरा नाम",
  "Enter your full name": "अपना पूरा नाम दर्ज करें",
  "Email Address": "ईमेल पता",
  "Enter your email address": "अपना ईमेल पता दर्ज करें",
  "Create a strong password": "एक मजबूत पासवर्ड बनाएं",
  "Confirm Password": "पासवर्ड की पुष्टि करें",
  "Confirm your password": "अपने पासवर्ड की पुष्टि करें",
  
  // Password requirements
  "Password Strength": "पासवर्ड की मजबूती",
  "At least 8 characters": "कम से कम 8 अक्षर",
  "Lowercase letter": "छोटा अक्षर",
  "Uppercase letter": "बड़ा अक्षर",
  "Number": "संख्या",
  "Special character": "विशेष अक्षर",
  "Strength:": "मजबूती:",
  
  // Buttons and actions
  "Continue to Farm Information →": "खेत की जानकारी के लिए आगे बढ़ें →",
  "Get Started Now": "अभी शुरू करें",
  "Get Started for Free": "नि:शुल्क शुरू करें",
  "Try Demo": "डेमो आज़माएँ",
  
  // Step 2 Farm Information
  "Farm Information": "खेत की जानकारी",
  "Tell us about your farming operation": "हमें अपने खेती के कार्य के बारे में बताएं",
  "Back to Personal Info": "व्यक्तिगत जानकारी पर वापस जाएं",
  "Farm Name": "खेत का नाम",
  "Enter your farm name": "अपने खेत का नाम दर्ज करें",
  "Total Area (acres)": "कुल क्षेत्रफल (एकड़)",
  "Enter total farm area in acres": "एकड़ में कुल खेत का क्षेत्रफल दर्ज करें",
  "District, State (e.g., Pune, Maharashtra)": "जिला, राज्य (जैसे, पुणे, महाराष्ट्र)",
  "Create My AgriVision Account": "मेरा AgriVision खाता बनाएं",
  "Creating your account...": "आपका खाता बनाया जा रहा है...",

  // Hero / Landing
  "Predict Your Crop Yields with": "अपनी फसल की उपज का अनुमान लगाएँ",
  "Precision": "सटीकता के साथ",
  "AgriVision uses advanced AI to provide accurate yield predictions, helping farmers optimize their resources and maximize profits.": "AgriVision उन्नत AI का उपयोग करके सटीक उपज पूर्वानुमान प्रदान करता है, जिससे किसान अपने संसाधनों का बेहतर उपयोग कर लाभ अधिकतम कर सकें।",

  // Metrics
  "Prediction Accuracy": "पूर्वानुमान सटीकता",
  "Happy Farmers": "संतुष्ट किसान",
  "Crop Types Supported": "फसल प्रकार समर्थित",
  "Real-time Monitoring": "वास्तविक समय निगरानी",

  // Key features
  "Key Features": "मुख्य विशेषताएँ",
  "AgriVision offers a range of features designed to help farmers make informed decisions and improve their crop yields.": "AgriVision किसानों को सूचित निर्णय लेने और अपनी फसल की पैदावार में सुधार करने में मदद करने के लिए विभिन्न सुविधाएं प्रदान करता है।",
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
  "Here's your farm's overview.": "यहाँ आपके खेत का विवरण है।",
  "Welcome to AgriVision Dashboard! This is a demo preview.": "AgriVision डैशबोर्ड में आपका स्वागत है! यह एक डेमो पूर्वावलोकन है।",
  "Demo Mode": "डेमो मोड",
  "You're viewing a demo version. Sign up to access full features!": "आप एक डेमो संस्करण देख रहे हैं। पूर्ण सुविधाओं तक पहुंचने के लिए साइन अप करें!",
  "Heads up! A frost is predicted for tonight. Consider taking preventive measures for sensitive crops.": "सावधान! आज रात पाला पड़ने की भविष्यवाणी है। संवेदनशील फसलों के लिए निवारक उपाय करने पर विचार करें।",
  "Recent Predictions": "हाल के पूर्वानुमान",
  "Weather Information": "मौसम की जानकारी",
  "Soil Health": "मिट्टी का स्वास्थ्य",
  "Wind": "हवा",
  "Moisture": "नमी",
  "Organic Matter": "जैविक पदार्थ",
  "Soil Temp": "मिट्टी का तापमान",
  "Last updated": "अंतिम बार अपडेट किया गया",
  "Farm Location": "खेत का स्थान",
  "Crop": "फसल",
  "Predicted": "पूर्वानुमान",
  "Download": "डाउनलोड",
  "View": "देखें",
  "No predictions available": "कोई पूर्वानुमान उपलब्ध नहीं",

  // Prediction/Predict Page
  "Clear Prediction": "पूर्वानुमान साफ़ करें",
  "How It Works": "यह कैसे काम करता है",
  "Enter Farm Details": "खेत की जानकारी दर्ज करें",
  "Provide crop type, location, and soil information": "फसल का प्रकार, स्थान और मिट्टी की जानकारी प्रदान करें",
  "AI Analysis": "AI विश्लेषण",
  "Our AI analyzes weather, soil, and historical data": "हमारा AI मौसम, मिट्टी और ऐतिहासिक डेटा का विश्लेषण करता है",
  "Get Predictions": "पूर्वानुमान प्राप्त करें",
  "Receive detailed yield forecasts and recommendations": "विस्तृत उपज पूर्वानुमान और सिफारिशें प्राप्त करें",
  "Analyzing Your Data...": "आपके डेटा का विश्लेषण हो रहा है...",
  "Our AI is processing weather patterns, soil conditions, and historical data to generate your prediction.": "हमारा AI आपके पूर्वानुमान को उत्पन्न करने के लिए मौसम पैटर्न, मिट्टी की स्थितियों और ऐतिहासिक डेटा को संसाधित कर रहा है।",
  "Crop Yield Prediction": "फसल उत्पादन पूर्वानुमान",
  "Weather and soil data can be automatically fetched by the system based on your location, or you can provide your own data for more accurate predictions.": "मौसम और मिट्टी का डेटा आपके स्थान के आधार पर सिस्टम द्वारा स्वचालित रूप से प्राप्त किया जा सकता है, या आप अधिक सटीक पूर्वानुमान के लिए अपना स्वयं का डेटा प्रदान कर सकते हैं।",
  "Select Crop": "फसल चुनें",
  "Rice": "चावल",
  "Wheat": "गेहूं",
  "Corn": "मक्का",
  "Soybean": "सोयाबीन",
  "Cotton": "कपास",
  "Sugarcane": "गन्ना",
  "Potato": "आलू",
  "Tomato": "टमाटर",
  "State": "राज्य",
  "District": "जिला",
  "Temperature (°C) (Optional - can be auto-fetched)": "तापमान (°C)",
  "Rainfall (mm) (Optional - can be auto-fetched)": "वर्षा (mm)",
  "Optional - leave empty for auto-fetch": "वैकल्पिक - स्वतः प्राप्ति के लिए खाली छोड़ें",
  "Land Area (Hectares) *": "भूमि क्षेत्र (हेक्टेयर) *",
  "Auto-fetch Weather and Soil Data": "मौसम और मिट्टी का डेटा स्वतः प्राप्त करें",
  "Soil Type (Optional - can be auto-detected)": "मिट्टी का प्रकार (वैकल्पिक)",
  "Select Soil Type": "मिट्टी का प्रकार चुनें",
  "Clay": "चिकनी मिट्टी",
  "Loam": "दोमट मिट्टी",
  "Sandy": "रेतीली मिट्टी",
  "Silt": "गाद मिट्टी",
  "Black": "काली मिट्टी",
  "Red": "लाल मिट्टी",
  "Alluvial": "जलोढ़ मिट्टी",
  "Please select a crop type": "कृपया फसल का प्रकार चुनें",
  "Please enter both state and district": "कृपया राज्य और जिला दोनों दर्ज करें",
  "Please select a date": "कृपया तारीख चुनें",
  "Please enter a valid land area in hectares": "कृपया हेक्टेयर में वैध भूमि क्षेत्र दर्ज करें",
  "Enter area in hectares": "हेक्टेयर में क्षेत्र दर्ज करें",
  "Analyzing...": "विश्लेषण हो रहा है...",
  "Prediction Output": "पूर्वानुमान परिणाम",
  "No Prediction Yet": "अभी तक कोई पूर्वानुमान नहीं",
  "Fill out the form to see results": "परिणाम देखने के लिए फॉर्म भरें",
  "Error loading prediction data": "पूर्वानुमान डेटा लोड करने में त्रुटि",
  "Please try again": "कृपया पुनः प्रयास करें",
  "Prediction Result": "पूर्वानुमान परिणाम",
  "Yield per Hectare": "प्रति हेक्टेयर उपज",
  "Total Estimated Yield": "कुल अनुमानित उपज",
  "Confidence Level": "विश्वास स्तर",
  "Score": "स्कोर",
  "Yield Optimization Recommendations": "उपज अनुकूलन सिफारिशें",
  "Pro Tip": "प्रो टिप",
  "Implementing these optimizations could potentially increase your yield by 15-30% compared to current practices.": "इन अनुकूलन को लागू करने से वर्तमान प्रथाओं की तुलना में आपकी उपज में संभावित रूप से 15-30% की वृद्धि हो सकती है।",
  "Impact": "प्रभाव",
  "Higher yield potential": "उच्च उपज क्षमता",
  "Yield Trend Analysis": "उपज रुझान विश्लेषण",
  "Loading yield data...": "उपज डेटा लोड हो रहा है...",
  "Historical Yield Data - hover points for details": "ऐतिहासिक उपज डेटा - विवरण के लिए बिंदुओं पर होवर करें",
  "trend": "रुझान",
  "Avg": "औसत",
  "Line": "रेखा",
  "Bar": "बार",
  "Year": "साल",
  "Rainfall (mm)": "वर्षा (mm)",
  "Avg Temp (°C)": "औसत तापमान (°C)",
  "Yield (t/ha)": "उपज (t/ha)",

  // Profile
  "Personal Information": "व्यक्तिगत जानकारी",
  "Farm Details": "खेत की जानकारी",
  "Name": "नाम",
  "Phone": "फोन",
  "Address": "पता",
  "Profile Settings": "प्रोफ़ाइल सेटिंग्स",
  "Farm Size": "खेत का आकार",
  "Manage your account, settings, and farm details.": "अपने खाते, सेटिंग्स और खेत की जानकारी का प्रबंधन करें।",
  "Farmer": "किसान",
  "Joined in": "में शामिल हुए",
  "Save Changes": "परिवर्तन सेव करें",
  "Saving...": "सेव हो रहा है...",
  "Profile updated successfully!": "प्रोफ़ाइल सफलतापूर्वक अपडेट हो गया!",
  "Farm details updated successfully!": "खेत की जानकारी सफलतापूर्वक अपडेट हो गई!",
  "An unexpected error occurred. Please try again.": "एक अप्रत्याशित त्रुटि हुई। कृपया पुनः प्रयास करें।",

  // Community Page (Future features)
  "All Posts": "सभी पोस्ट",
  "My Posts": "मेरी पोस्ट",
  "Following": "अनुसरण",
  "Notifications": "सूचनाएं",
  "Messages": "संदेश",
  "New Post": "नई पोस्ट",
  "Create Post": "पोस्ट बनाएं",
  "Write something...": "कुछ लिखें...",
  "Post": "पोस्ट",
  "Like": "पसंद",
  "Comment": "टिप्पणी",
  "Share": "साझा करें",
  "Reply": "उत्तर",
  
  // Community Topics
  "Crop Management": "फसल प्रबंधन",
  "Weather Updates": "मौसम अपडेट",
  "Market Trends": "बाजार के रुझान",
  "Pest Control": "कीट नियंत्रण",
  "Irrigation": "सिंचाई",
  "Fertilizers": "उर्वरक",
  "Seeds": "बीज",
  "Equipment": "उपकरण",
  "Success Stories": "सफलता की कहानियां"
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
