# OAuth 2.0 Implementation Guide

This guide explains how to complete the OAuth 2.0 integration for your AgriVision application.

## Frontend Implementation ✅

The frontend has been updated with:

1. **OAuth buttons** in Login and Signup components for:
   - Google OAuth
   - Facebook OAuth  
   - GitHub OAuth

2. **OAuth utility functions** (`src/utils/oauth.js`) for:
   - Initiating OAuth flow
   - Handling OAuth callbacks
   - Managing redirects

3. **OAuth callback component** (`src/components/auth/OAuthCallback.jsx`) for:
   - Processing authentication results
   - Showing loading/success/error states
   - Redirecting users after authentication

4. **Route configuration** updated to include `/auth/callback` endpoint

## Backend Implementation Required ⚠️

You need to implement the following endpoints in your backend:

### 1. OAuth Initiation Endpoints

```javascript
// Google OAuth
app.get('/api/auth/google', (req, res) => {
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${process.env.GOOGLE_CLIENT_ID}&` +
    `redirect_uri=${process.env.GOOGLE_REDIRECT_URI}&` +
    `response_type=code&` +
    `scope=email profile&` +
    `state=${generateRandomState()}`;
  
  res.redirect(googleAuthUrl);
});

// Facebook OAuth
app.get('/api/auth/facebook', (req, res) => {
  const facebookAuthUrl = `https://www.facebook.com/v18.0/dialog/oauth?` +
    `client_id=${process.env.FACEBOOK_APP_ID}&` +
    `redirect_uri=${process.env.FACEBOOK_REDIRECT_URI}&` +
    `response_type=code&` +
    `scope=email&` +
    `state=${generateRandomState()}`;
  
  res.redirect(facebookAuthUrl);
});

// GitHub OAuth
app.get('/api/auth/github', (req, res) => {
  const githubAuthUrl = `https://github.com/login/oauth/authorize?` +
    `client_id=${process.env.GITHUB_CLIENT_ID}&` +
    `redirect_uri=${process.env.GITHUB_REDIRECT_URI}&` +
    `response_type=code&` +
    `scope=user:email&` +
    `state=${generateRandomState()}`;
  
  res.redirect(githubAuthUrl);
});
```

### 2. OAuth Callback Endpoint

```javascript
app.post('/api/auth/oauth/callback', async (req, res) => {
  try {
    const { code, state } = req.body;
    
    // Verify state parameter for security
    if (!verifyState(state)) {
      return res.status(400).json({ success: false, error: 'Invalid state parameter' });
    }
    
    // Determine provider based on state or add provider in request
    const provider = getProviderFromState(state); // You'll need to implement this
    
    let userInfo;
    
    switch (provider) {
      case 'google':
        userInfo = await handleGoogleCallback(code);
        break;
      case 'facebook':
        userInfo = await handleFacebookCallback(code);
        break;
      case 'github':
        userInfo = await handleGithubCallback(code);
        break;
      default:
        return res.status(400).json({ success: false, error: 'Unknown provider' });
    }
    
    // Create or find user in your database
    const user = await findOrCreateUser(userInfo);
    
    // Generate JWT token
    const token = generateJWTToken(user);
    
    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      },
      token
    });
    
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.status(500).json({ success: false, error: 'Authentication failed' });
  }
});
```

### 3. Helper Functions

```javascript
// Google OAuth token exchange
async function handleGoogleCallback(code) {
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: process.env.GOOGLE_REDIRECT_URI
    })
  });
  
  const tokenData = await tokenResponse.json();
  
  const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` }
  });
  
  return await userResponse.json();
}

// Facebook OAuth token exchange
async function handleFacebookCallback(code) {
  const tokenResponse = await fetch('https://graph.facebook.com/v18.0/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.FACEBOOK_APP_ID,
      client_secret: process.env.FACEBOOK_APP_SECRET,
      code,
      redirect_uri: process.env.FACEBOOK_REDIRECT_URI
    })
  });
  
  const tokenData = await tokenResponse.json();
  
  const userResponse = await fetch(`https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${tokenData.access_token}`);
  
  return await userResponse.json();
}

// GitHub OAuth token exchange
async function handleGithubCallback(code) {
  const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code
    })
  });
  
  const tokenData = await tokenResponse.json();
  
  const userResponse = await fetch('https://api.github.com/user', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` }
  });
  
  const userData = await userResponse.json();
  
  // Get email separately as it might be private
  const emailResponse = await fetch('https://api.github.com/user/emails', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` }
  });
  
  const emails = await emailResponse.json();
  const primaryEmail = emails.find(email => email.primary)?.email;
  
  return {
    ...userData,
    email: primaryEmail || userData.email
  };
}
```

## Environment Variables Required

Add these to your `.env` file:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/callback

# Facebook OAuth
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
FACEBOOK_REDIRECT_URI=http://localhost:3000/auth/callback

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_REDIRECT_URI=http://localhost:3000/auth/callback

# JWT Secret
JWT_SECRET=your_jwt_secret_key
```

## OAuth Provider Setup

### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/auth/callback`

### Facebook OAuth Setup
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add Facebook Login product
4. Configure Valid OAuth Redirect URIs: `http://localhost:3000/auth/callback`

### GitHub OAuth Setup
1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create a new OAuth App
3. Set Authorization callback URL: `http://localhost:3000/auth/callback`

## Frontend Configuration

Update `src/utils/oauth.js` if you need to change the API base URL:

```javascript
const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
```

## Testing the Implementation

1. Start your backend server with OAuth endpoints
2. Start your frontend React app
3. Navigate to login/signup page
4. Click on any OAuth provider button
5. Complete authentication flow
6. Verify user is logged in and redirected properly

## Security Considerations

1. **State Parameter**: Use a random state parameter to prevent CSRF attacks
2. **HTTPS**: Use HTTPS in production
3. **Token Storage**: Store JWT tokens securely
4. **Scope Limitation**: Request only necessary OAuth scopes
5. **Token Expiration**: Implement token refresh mechanism

## Error Handling

The frontend implementation handles these error scenarios:
- OAuth provider errors
- Network failures
- Invalid callback responses
- Missing authorization codes

Make sure your backend returns appropriate error responses for these cases.
