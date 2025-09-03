const axios = require('axios');

// Try to load Prediction model if exists
let Prediction = null;
try { 
  Prediction = require('../models/prediction.model'); 
} catch (_) {
  console.log('No prediction model found, continuing without prediction context');
}

async function fetchLatestPrediction(userId) {
  if (!Prediction) return null;
  try {
    return await Prediction.findOne({ userId }).sort({ createdAt: -1 }).lean();
  } catch (error) {
    console.log('Error fetching prediction:', error.message);
    return null;
  }
}

function buildPrompt({ user, latestPrediction, question, lang = 'en' }) {
  const farm = user?.farmDetails || {};
  const profile = `
किसान प्रोफाइल / Farmer Profile:
नाम / Name: ${user?.name || 'किसान / Farmer'}
क्षेत्र / Region: ${farm.region || farm.location || 'अज्ञात / Unknown'}
फसलें / Crops: ${(farm.crops || farm.cropList || []).join(', ') || 'N/A'}
मिट्टी / Soil: ${farm.soilType || 'N/A'}
सिंचाई / Irrigation: ${farm.irrigation || 'N/A'}
`;

  const predText = latestPrediction
    ? `नवीनतम भविष्यवाणी / Latest Prediction:
प्रकार / Type: ${latestPrediction.type || latestPrediction.label || 'N/A'}
परिणाम / Result: ${latestPrediction.result || latestPrediction.prediction || 'N/A'}
विश्वसनीयता / Confidence: ${latestPrediction.confidence || latestPrediction.probability || 'N/A'}%
फसल / Crop: ${latestPrediction.crop || farm.primaryCrop || 'N/A'}
दिनांक / Date: ${latestPrediction.createdAt ? new Date(latestPrediction.createdAt).toLocaleDateString('hi-IN') : 'N/A'}
`
    : 'कोई हालिया भविष्यवाणी उपलब्ध नहीं / No recent prediction available.\n';

  const languageInstruction = lang === 'hi'
    ? `कृपया सिर्फ हिंदी में जवाब दें। सरल, किसान-अनुकूल शब्दों का उपयोग करें। 
    तकनीकी शब्दों के साथ उनका अर्थ भी बताएं।
    हमेशा व्यावहारिक सुझाव दें।`
    : 'Answer in clear English. Use simple, farmer-friendly language. Provide practical advice.';

  return `
आप एक कुशल कृषि सलाहकार हैं / You are a skilled agricultural advisor.
${languageInstruction}

यदि आपको कुछ निश्चित रूप से पता नहीं है, तो कहें। व्यावहारिक कदम प्रदान करें।
If unsure about something, say so clearly. Always provide actionable steps.

${profile}
${predText}

किसान का प्रश्न / Farmer's Question:
${question}

कृपया इस प्रारूप में उत्तर दें / Please answer in this format:
${lang === 'hi' 
  ? `1. मुख्य उत्तर (Main Answer)
2. करने योग्य कार्य (Action Steps) - बुलेट पॉइंट्स में
3. सावधानियां (Precautions/Risks)  
4. अगला प्रश्न (Follow-up Question)`
  : `1. Main Answer
2. Action Steps (bullet points)
3. Precautions/Risks
4. Follow-up Question`
}
`;
}

async function callGemini(prompt, temperature = 0.4) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY not configured');
  }

  const base = 'https://generativelanguage.googleapis.com/v1';
  const model = 'gemini-1.5-flash';
  const url = `${base}/models/${model}:generateContent?key=${apiKey}`;

  try {
    const { data } = await axios.post(
      url,
      {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: parseFloat(temperature) || 0.4,
          maxOutputTokens: 800,
          topP: 0.8,
          topK: 40
        }
      },
      { 
        timeout: 25000,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const answer = data?.candidates?.[0]?.content?.parts
      ?.map(p => p.text)
      .join('\n')
      ?.trim();

    return answer || 'माफ करें, मैं इस समय जवाब नहीं दे पा रहा। / Sorry, I cannot generate an answer right now.';
  } catch (error) {
    console.error('Gemini API error:', error.response?.data || error.message);
    throw new Error(`AI service error: ${error.message}`);
  }
}

async function simpleChatAsk(req, res) {
  try {
    const { question, lang = 'hi', temperature } = req.body;
    
    if (!question || question.trim() === '') {
      return res.status(400).json({ 
        message: 'प्रश्न आवश्यक है / Question is required',
        error: 'MISSING_QUESTION'
      });
    }

    console.log(`🤖 Chat request from ${req.user.email}: "${question.substring(0, 50)}..."`);

    // Fetch user's latest prediction for context
    const latestPrediction = await fetchLatestPrediction(req.user._id);
    
    // Build personalized prompt
    const prompt = buildPrompt({
      user: req.user,
      latestPrediction,
      question: question.trim(),
      lang
    });

    console.log(`🧠 Calling Gemini API (lang: ${lang})`);
    
    // Call Gemini API
    const answer = await callGemini(prompt, temperature);

    console.log(`✅ Gemini response generated (${answer.length} chars)`);

    res.json({
      success: true,
      answer: answer,
      metadata: {
        langUsed: lang,
        questionLength: question.length,
        answerLength: answer.length,
        usedPrediction: latestPrediction ? {
          id: latestPrediction._id,
          type: latestPrediction.type || latestPrediction.label,
          crop: latestPrediction.crop,
          date: latestPrediction.createdAt
        } : null,
        userProfile: {
          hasProfile: !!(req.user.farmDetails && Object.keys(req.user.farmDetails).length > 0),
          region: req.user.farmDetails?.region || req.user.farmDetails?.location,
          cropsCount: (req.user.farmDetails?.crops || []).length
        }
      }
    });

  } catch (error) {
    console.error('❌ SimpleChat error:', error.message);
    
    // Return appropriate error message
    let errorMessage = 'चैट सेवा में समस्या हुई / Chat service error occurred';
    let errorCode = 'CHAT_ERROR';

    if (error.message.includes('GEMINI_API_KEY')) {
      errorMessage = 'AI सेवा कॉन्फ़िगरेशन में समस्या / AI service configuration issue';
      errorCode = 'CONFIG_ERROR';
    } else if (error.message.includes('timeout') || error.message.includes('network')) {
      errorMessage = 'नेटवर्क कनेक्शन में समस्या / Network connection issue';
      errorCode = 'NETWORK_ERROR';
    }

    res.status(500).json({ 
      success: false,
      message: errorMessage,
      error: errorCode,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

module.exports = { simpleChatAsk };
