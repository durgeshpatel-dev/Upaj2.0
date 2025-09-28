// OAuth utility functions

/**
 * Handle OAuth callback from provider
 * This function should be called when user returns from OAuth provider
 */
export const handleOAuthCallback = async () => {
  try {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const error = urlParams.get('error');

    if (error) {
      throw new Error(`OAuth error: ${error}`);
    }

    if (!code) {
      throw new Error('No authorization code received');
    }

    // Send code to backend for token exchange
    const response = await fetch('/api/auth/oauth/callback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, state }),
    });

    if (!response.ok) {
      throw new Error('Failed to complete OAuth authentication');
    }

    const data = await response.json();
    
    if (data.success) {
      // Store token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      return { success: true, user: data.user, token: data.token };
    } else {
      throw new Error(data.error || 'OAuth authentication failed');
    }
  } catch (error) {
    console.error('OAuth callback error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Initiate OAuth login with specified provider
 */
export const initiateOAuth = (provider) => {
  const baseUrl = process.env.REACT_APP_API_URL || 'https://upaj-flask-backend-liart.vercel.app';
  const oauthUrl = `${baseUrl}/api/auth/${provider}`;
  
  // Store current location for redirect after auth
  sessionStorage.setItem('oauth_redirect', window.location.pathname);
  
  // Redirect to OAuth provider
  window.location.href = oauthUrl;
};

/**
 * Get redirect URL after successful OAuth
 */
export const getOAuthRedirect = () => {
  const redirect = sessionStorage.getItem('oauth_redirect');
  sessionStorage.removeItem('oauth_redirect');
  return redirect || '/dashboard';
};

/**
 * Check if current URL is an OAuth callback
 */
export const isOAuthCallback = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.has('code') || urlParams.has('error');
};
