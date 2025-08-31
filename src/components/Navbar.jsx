import React from 'react';
import Button from './Button';

const Navbar = () => {
  return (
    <nav className="bg-gray-900 text-white px-6 py-4 border-b border-gray-800">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-green-500 rounded-sm"></div>
          <span className="text-xl font-bold">AgriVision</span>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          <a href="#dashboard" className="text-gray-300 hover:text-white transition-colors">
            Dashboard
          </a>
          <a href="#features" className="text-gray-300 hover:text-white transition-colors">
            Features
          </a>
          <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">
            Pricing
          </a>
          <a href="#support" className="text-gray-300 hover:text-white transition-colors">
            Support
          </a>
        </div>

        {/* Get Started Button */}
        <Button variant="primary" size="sm">
          Get Started
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
