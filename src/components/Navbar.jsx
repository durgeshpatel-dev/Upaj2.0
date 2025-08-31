import React from 'react';
import { Bell, User, Leaf } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;

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
          <a 
            href="/" 
            className={`transition-colors ${
              isActive('/') ? 'text-primary font-medium' : 'text-text-secondary hover:text-primary'
            }`}
          >
            Home
          </a>
          <a 
            href="/predict" 
            className={`transition-colors ${
              isActive('/predict') ? 'text-primary font-medium' : 'text-text-secondary hover:text-primary'
            }`}
          >
            Predict
          </a>
          <a 
            href="/dashboard" 
            className={`transition-colors ${
              isActive('/dashboard') ? 'text-primary font-medium' : 'text-text-secondary hover:text-primary'
            }`}
          >
            Dashboard
          </a>
          <a 
            href="/community" 
            className={`transition-colors ${
              isActive('/community') ? 'text-primary font-medium' : 'text-text-secondary hover:text-primary'
            }`}
          >
            Community
          </a>
        </div>

        {/* Right side icons */}
        <div className="flex items-center space-x-4">
          {/* Get Started Button (show only on home page) */}
          {isActive('/') && (
            <button className="hidden md:block bg-primary hover:bg-primary/80 text-primary-foreground font-semibold px-6 py-2 rounded-lg transition-colors duration-200">
              Get Started
            </button>
          )}
          
          {/* Notification Bell (show only on other pages) */}
          {!isActive('/') && (
            <button className="relative p-2 text-text-secondary hover:text-primary transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-status-error rounded-full"></span>
            </button>
          )}
          
          {/* User Avatar (show only on other pages) */}
          {!isActive('/') && (
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <User size={16} className="text-primary-foreground" />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
