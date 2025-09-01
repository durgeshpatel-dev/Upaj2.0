import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="mt-16 border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 lg:px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-primary">🌱 AgriVision</span>
          </div>
          <nav className="flex flex-wrap gap-6 text-sm">
            <Link to="/privacy" className="text-text-secondary hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-text-secondary hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <Link to="/contact" className="text-text-secondary hover:text-primary transition-colors">
              Contact Us
            </Link>
            <Link to="/about" className="text-text-secondary hover:text-primary transition-colors">
              About Us
            </Link>
          </nav>
        </div>
        <div className="mt-6 pt-6 border-t border-border text-center">
          <p className="text-sm text-text-secondary">
            © 2024 AgriVision. All rights reserved. Empowering farmers with AI-driven insights.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer