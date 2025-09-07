import React, { useState, useEffect, useRef } from 'react';
import { Bell, User, Leaf, MessageCircle, Menu, X, LogOut } from 'lucide-react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Tr, SimpleLanguageSelector } from '../components/ui/SimpleTranslation';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);
  
  const isActive = (path) => location.pathname === path;

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowUserMenu(false);
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignup = () => {
    navigate('/signup');
  };

  // Handle navigation with authentication check
  const handleNavigation = (path) => {
    // List of protected routes
    const protectedRoutes = ['/predict', '/prediction', '/dashboard', '/profile', '/community', '/chat'];
    
    if (protectedRoutes.includes(path) && !isAuthenticated) {
      // Redirect to login if trying to access protected route without authentication
      navigate('/login', { state: { from: { pathname: path } } });
    } else {
      navigate(path);
    }
  };

  return (
    <nav className="bg-background text-text-primary px-6 py-4 border-b border-border">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-primary rounded-sm flex items-center justify-center">
            <Leaf size={16} className="text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-text-primary">AgriVision</span>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          <Link 
            to="/" 
            className={`transition-colors ${
              isActive('/') ? 'text-primary font-medium' : 'text-text-secondary hover:text-primary'
            }`}
          >
           <Tr>Home</Tr> 
          </Link>
          
          {/* Show protected links only if authenticated */}
          {isAuthenticated ? (
            <>
              <Link 
                to="/predict" 
                className={`transition-colors ${
                  isActive('/predict') ? 'text-primary font-medium' : 'text-text-secondary hover:text-primary'
                }`}
              >
                <Tr>Predict</Tr>
              </Link>
              <Link 
                to="/dashboard" 
                className={`transition-colors ${
                  isActive('/dashboard') ? 'text-primary font-medium' : 'text-text-secondary hover:text-primary'
                }`}
              >
                <Tr>Dashboard</Tr>
              </Link>
              <Link 
                to="/community" 
                className={`transition-colors ${
                  isActive('/community') ? 'text-primary font-medium' : 'text-text-secondary hover:text-primary'
                }`}
              >
                <Tr>Community</Tr>
              </Link>
              <Link 
                to="/chat" 
                className={`transition-colors ${
                  isActive('/chat') ? 'text-primary font-medium' : 'text-text-secondary hover:text-primary'
                }`}
              >
                <Tr>Chat Support</Tr>
              </Link>
            </>
          ) : (
            <>
              {/* Show login prompts for protected features when not authenticated */}
              <button 
                onClick={() => handleNavigation('/predict')}
                className="text-text-secondary hover:text-primary transition-colors"
              >
                <Tr>Predict</Tr>
              </button>
              <button 
                onClick={() => handleNavigation('/dashboard')}
                className="text-text-secondary hover:text-primary transition-colors"
              >
                <Tr>Dashboard</Tr>
              </button>
              <button 
                onClick={() => handleNavigation('/community')}
                className="text-text-secondary hover:text-primary transition-colors"
              >
                <Tr>Community</Tr>
              </button>
              <button 
                onClick={() => handleNavigation('/chat')}
                className="text-text-secondary hover:text-primary transition-colors"
              >
                <Tr>Chat Support</Tr>
              </button>
            </>
          )}
        </div>

        {/* Right side icons */}
        <div className="flex items-center space-x-4">
          {/* Language selector - only show on home page */}
          {isActive('/') && (
            <div className="relative">
              <SimpleLanguageSelector />
            </div>
          )}

          {/* Authentication buttons for home page */}
          {isActive('/') && !isAuthenticated && (
            <div className="hidden md:flex items-center space-x-3">
              <button 
                onClick={handleLogin}
                className="text-text-secondary hover:text-primary font-medium px-4 py-2 transition-colors"
              >
                <Tr>Sign In</Tr>
              </button>
              <button 
                onClick={handleSignup}
                className="bg-primary hover:bg-primary/80 text-primary-foreground font-semibold px-6 py-2 rounded-lg transition-colors duration-200"
              >
                <Tr>Get Started</Tr>
              </button>
            </div>
          )}

          {/* Get Started Button for authenticated users on home page */}
          {isActive('/') && isAuthenticated && (
            <button 
              onClick={() => navigate('/dashboard')}
              className="hidden md:block bg-primary hover:bg-primary/80 text-primary-foreground font-semibold px-6 py-2 rounded-lg transition-colors duration-200"
            >
              <Tr>Go to Dashboard</Tr>
            </button>
          )}
          
          {/* Authenticated user options */}
          {!isActive('/') && isAuthenticated && (
            <>
              {/* Notification Bell */}
              <button className="relative p-2 text-text-secondary hover:text-primary transition-colors">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-status-error rounded-full"></span>
              </button>
              
              {/* Chat Support Icon */}
              {/* <a 
                href="/chat"
                className={`p-2 transition-colors ${
                  isActive('/chat') 
                    ? 'text-primary bg-primary/10 rounded-lg' 
                    : 'text-text-secondary hover:text-primary hover:bg-primary/5 rounded-lg'
                }`}
                title="Chat Support"
              >
                <MessageCircle size={20} />
              </a> */}

              {/* User Avatar with Dropdown */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className={`w-8 h-8 bg-primary rounded-full flex items-center justify-center hover:bg-primary/80 transition-colors ${
                    isActive('/profile') ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''
                  }`}
                  title={user?.name || 'User Profile'}
                >
                  <User size={16} className="text-primary-foreground" />
                </button>

                {/* User Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-background-card border border-border rounded-lg shadow-lg py-1 z-50">
                    <div className="px-4 py-2 border-b border-border">
                      <p className="text-sm font-medium text-text-primary">{user?.name || 'User'}</p>
                      <p className="text-xs text-text-secondary">{user?.email || 'user@example.com'}</p>
                    </div>
                    <a
                      href="/profile"
                      className="block px-4 py-2 text-sm text-text-secondary hover:text-primary hover:bg-primary/5 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                     <Tr>Profile Settings</Tr>
                    </a>
                    <a
                      href="/dashboard"
                      className="block px-4 py-2 text-sm text-text-secondary hover:text-primary hover:bg-primary/5 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                     <Tr>Dashboard</Tr>
                    </a>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-status-error hover:bg-status-error/10 transition-colors"
                    >
                      <LogOut size={14} className="inline mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-text-secondary hover:text-primary transition-colors"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="px-6 py-4 space-y-4">
            {isAuthenticated ? (
              <>
                {/* User info in mobile menu */}
                <div className="pb-4 border-b border-border">
                  <p className="text-sm font-medium text-text-primary">{user?.name}</p>
                  <p className="text-xs text-text-secondary">{user?.email}</p>
                </div>
                
                <a 
                  href="/" 
                  className={`block transition-colors ${
                    isActive('/') ? 'text-primary font-medium' : 'text-text-secondary hover:text-primary'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </a>
                <a 
                  href="/predict" 
                  className={`block transition-colors ${
                    isActive('/predict') ? 'text-primary font-medium' : 'text-text-secondary hover:text-primary'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Tr>Predict</Tr>
                </a>
                <a 
                  href="/dashboard" 
                  className={`block transition-colors ${
                    isActive('/dashboard') ? 'text-primary font-medium' : 'text-text-secondary hover:text-primary'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Tr>Dashboard</Tr>
                </a>
                <a 
                  href="/community" 
                  className={`block transition-colors ${
                    isActive('/community') ? 'text-primary font-medium' : 'text-text-secondary hover:text-primary'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Tr>Community</Tr>
                </a>
                <a 
                  href="/chat" 
                  className={`block transition-colors ${
                    isActive('/chat') ? 'text-primary font-medium' : 'text-text-secondary hover:text-primary'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Tr>Chat Support</Tr>
                </a>
                <a 
                  href="/profile" 
                  className={`block transition-colors ${
                    isActive('/profile') ? 'text-primary font-medium' : 'text-text-secondary hover:text-primary'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Tr>Profile</Tr>
                </a>
                
                {/* Logout button in mobile menu */}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left text-status-error hover:text-status-error/80 transition-colors pt-4 border-t border-border"
                >
                  <LogOut size={14} className="inline mr-2" />
                  <Tr>Logout</Tr>
                </button>
              </>
            ) : (
              <>
                <a 
                  href="/" 
                  className={`block transition-colors ${
                    isActive('/') ? 'text-primary font-medium' : 'text-text-secondary hover:text-primary'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </a>
                
                {/* Auth buttons in mobile menu */}
                <div className="space-y-3 pt-4 border-t border-border">
                  <button 
                    onClick={() => {
                      handleLogin();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-center bg-transparent border border-primary text-primary hover:bg-primary hover:text-primary-foreground font-medium px-4 py-2 rounded-lg transition-colors"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={() => {
                      handleSignup();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-center bg-primary hover:bg-primary/80 text-primary-foreground font-semibold px-4 py-2 rounded-lg transition-colors"
                  >
                    Get Started
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
