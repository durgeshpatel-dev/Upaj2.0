/**
 * Token utility functions for OAuth and authentication
 */

/**
 * Check if a JWT token is expired
 * @param {string} token - JWT token
 * @returns {boolean} - True if token is expired
 */
export const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    // JWT tokens have 3 parts separated by dots
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.warn('⚠️ Token format invalid');
      return true;
    }
    
    // Decode the payload (second part)
    const payload = JSON.parse(atob(parts[1]));
    
    // Check if token has expiration time
    if (!payload.exp) {
      console.warn('⚠️ Token has no expiration time');
      return false; // Assume valid if no expiration
    }
    
    // Compare expiration time with current time
    const currentTime = Math.floor(Date.now() / 1000);
    const isExpired = payload.exp < currentTime;
    
    if (isExpired) {
      console.log('⏰ Token is expired');
    } else {
      const timeUntilExpiry = payload.exp - currentTime;
      console.log(`⏰ Token expires in ${timeUntilExpiry} seconds`);
    }
    
    return isExpired;
  } catch (error) {
    console.error('❌ Error checking token expiration:', error);
    return true; // Assume expired if we can't parse it
  }
};

/**
 * Get token payload without verification
 * @param {string} token - JWT token
 * @returns {object|null} - Token payload or null if invalid
 */
export const getTokenPayload = (token) => {
  if (!token) return null;
  
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    return JSON.parse(atob(parts[1]));
  } catch (error) {
    console.error('❌ Error parsing token payload:', error);
    return null;
  }
};

/**
 * Validate token structure and basic requirements
 * @param {string} token - JWT token
 * @returns {boolean} - True if token structure is valid
 */
export const isValidTokenStructure = (token) => {
  if (!token || typeof token !== 'string') return false;
  
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  
  try {
    // Try to decode each part
    atob(parts[0]); // header
    atob(parts[1]); // payload
    // Don't decode signature as it might not be base64
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Get time until token expires in minutes
 * @param {string} token - JWT token
 * @returns {number|null} - Minutes until expiration or null if invalid
 */
export const getTimeUntilExpiry = (token) => {
  const payload = getTokenPayload(token);
  if (!payload || !payload.exp) return null;
  
  const currentTime = Math.floor(Date.now() / 1000);
  const timeUntilExpiry = payload.exp - currentTime;
  
  return Math.floor(timeUntilExpiry / 60); // Convert to minutes
};

/**
 * Extract user info from token payload
 * @param {string} token - JWT token
 * @returns {object|null} - User info or null if not available
 */
export const getUserFromToken = (token) => {
  const payload = getTokenPayload(token);
  if (!payload) return null;
  
  // Common JWT fields for user info
  return {
    id: payload.sub || payload.userId || payload.id,
    email: payload.email,
    name: payload.name || payload.username,
    roles: payload.roles || payload.role,
    permissions: payload.permissions,
  };
};
