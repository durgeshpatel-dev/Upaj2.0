import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Enhanced route protection component
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render
 * @param {boolean} props.requireAuth - Whether authentication is required (default: true)
 * @param {boolean} props.redirectIfAuthenticated - Whether to redirect if user is already authenticated (default: false)
 * @param {string} props.redirectTo - Where to redirect if conditions are not met
 */
const RouteGuard = ({ 
  children, 
  requireAuth = true, 
  redirectIfAuthenticated = false,
  redirectTo = null 
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-secondary">Checking authentication...</p>
        </div>
      </div>
    );
  }

  const userIsAuthenticated = isAuthenticated;

  // Handle different protection scenarios
  if (requireAuth && !userIsAuthenticated) {
    // User needs to be authenticated but isn't
    const destination = redirectTo || '/login';
    return <Navigate to={destination} state={{ from: location }} replace />;
  }

  if (redirectIfAuthenticated && userIsAuthenticated) {
    // User is authenticated but shouldn't access this route (like login page)
    const destination = redirectTo || '/dashboard';
    return <Navigate to={destination} replace />;
  }

  // All checks passed, render children
  return children;
};

/**
 * Protected Route Component - requires authentication
 */
export const ProtectedRoute = ({ children, redirectTo = '/login' }) => (
  <RouteGuard requireAuth={true} redirectTo={redirectTo}>
    {children}
  </RouteGuard>
);

/**
 * Public Route Component - redirects authenticated users away
 * Useful for login, signup pages
 */
export const PublicRoute = ({ children, redirectTo = '/dashboard' }) => (
  <RouteGuard requireAuth={false} redirectIfAuthenticated={true} redirectTo={redirectTo}>
    {children}
  </RouteGuard>
);

/**
 * Guest Route Component - accessible to everyone
 */
export const GuestRoute = ({ children }) => (
  <RouteGuard requireAuth={false} redirectIfAuthenticated={false}>
    {children}
  </RouteGuard>
);

/**
 * Admin Route Component - requires authentication and admin role
 */
export const AdminRoute = ({ children, redirectTo = '/dashboard' }) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Check if user has admin role
  const isAdmin = user?.role === 'admin' || user?.roles?.includes('admin') || user?.isAdmin;
  
  if (!isAdmin) {
    return <Navigate to={redirectTo} replace />;
  }
  
  return children;
};

export default RouteGuard;
