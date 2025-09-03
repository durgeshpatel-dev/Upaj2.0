import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Custom hook for secure navigation
 * Automatically redirects to login if user tries to access protected routes
 */
export const useSecureNavigate = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const secureNavigate = (path, options = {}) => {
    // List of protected routes
    const protectedRoutes = [
      '/predict', 
      '/prediction', 
      '/dashboard', 
      '/profile', 
      '/community', 
      '/chat',
      '/chat/enhanced',
      '/chat/advanced'
    ];

    // Check if the path is protected
    const isProtectedRoute = protectedRoutes.some(route => 
      path === route || path.startsWith(route + '/')
    );

    if (isProtectedRoute && !isAuthenticated) {
      // Redirect to login with return URL
      navigate('/login', { 
        state: { from: { pathname: path } },
        replace: true 
      });
    } else {
      // Safe to navigate
      navigate(path, options);
    }
  };

  return secureNavigate;
};

/**
 * Utility function to check if a route is protected
 */
export const isProtectedRoute = (path) => {
  const protectedRoutes = [
    '/predict', 
    '/prediction', 
    '/dashboard', 
    '/profile', 
    '/community', 
    '/chat'
  ];

  return protectedRoutes.some(route => 
    path === route || path.startsWith(route + '/')
  );
};

/**
 * Utility function to get the appropriate redirect path for unauthenticated users
 */
export const getRedirectPath = (intendedPath) => {
  if (isProtectedRoute(intendedPath)) {
    return '/login';
  }
  return intendedPath;
};
