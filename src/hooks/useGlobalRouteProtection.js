import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { isProtectedRoute } from '../utils/navigationUtils';

/**
 * Global route protection hook
 * Monitors route changes and enforces authentication requirements
 */
export const useGlobalRouteProtection = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Don't redirect while authentication is loading
    if (isLoading) return;

    const currentPath = location.pathname;
    
    // Check if current route requires authentication
    if (isProtectedRoute(currentPath) && !isAuthenticated) {
      console.log('🛡️ Unauthorized access attempt to:', currentPath);
      console.log('🔄 Redirecting to login...');
      
      // Redirect to login with return URL
      navigate('/login', { 
        state: { from: location },
        replace: true 
      });
    }
  }, [location.pathname, isAuthenticated, isLoading, navigate, location]);

  // Also handle browser back/forward button
  useEffect(() => {
    const handlePopState = () => {
      // Small delay to ensure location is updated
      setTimeout(() => {
        const currentPath = window.location.pathname;
        if (isProtectedRoute(currentPath) && !isAuthenticated) {
          console.log('🛡️ Browser navigation blocked to protected route:', currentPath);
          navigate('/login', { 
            state: { from: { pathname: currentPath } },
            replace: true 
          });
        }
      }, 10);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isAuthenticated, navigate]);
};

/**
 * Component wrapper for global route protection
 */
export const GlobalRouteProtection = ({ children }) => {
  useGlobalRouteProtection();
  return children;
};
