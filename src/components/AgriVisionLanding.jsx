import React from 'react'
import { BarChart3, Leaf, Clock } from 'lucide-react'
import { Tr } from './ui/SimpleTranslation';
import Bg from '/Hero.png'
const AgriVisionLanding = () => {
  return (
    <div className="min-h-screen bg-background text-text-primary font-['Inter',sans-serif]">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 to-emerald-100">
          {/* Hero Content Container with Background Image */}
          <div
          className="relative z-10 rounded-2xl p-8 sm:p-12 lg:p-16 mx-4 max-w-5xl text-center overflow-hidden shadow-2xl"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3)), url(${Bg})`,
            backgroundColor: '#059669',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            minHeight: '80vh'
          }}
        >
          <div className="relative z-10">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-8 leading-tight text-white">
                <Tr>Predict Your Crop Yields with</Tr><br className="hidden sm:block" />
                <span className="block"><Tr>Precision</Tr></span>
            </h1>
              <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-10 text-white/90 max-w-4xl mx-auto leading-relaxed font-medium">
                <Tr>AgriVision uses advanced AI to provide accurate yield predictions, helping farmers optimize their resources and maximize profits.</Tr>
              </p>
            <button className="bg-primary hover:bg-primary/80 text-primary-foreground font-bold px-10 py-5 rounded-lg text-xl transition-colors duration-200 shadow-lg">
              <Tr>Get Started Now</Tr>
            </button>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-text-primary">
                <Tr>Key Features</Tr>
            </h2>
              <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
                <Tr>AgriVision offers a range of features designed to help farmers make informed decisions and improve their crop yields.</Tr>
              </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Accurate Predictions */}
            <div className="bg-background-card p-8 rounded-xl border border-border hover:border-primary/30 transition-colors duration-200">
              <div className="w-12 h-12 bg-border rounded-lg mx-auto mb-6 flex items-center justify-center">
                <BarChart3 size={24} className="text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-text-primary text-center"><Tr>Accurate Predictions</Tr></h3>
                <p className="text-text-secondary text-center leading-relaxed">
                  <Tr>Our AI models provide highly accurate yield predictions based on historical data, weather patterns, and soil conditions.</Tr>
                </p>
            </div>

            {/* Crop-Specific Models */}
            <div className="bg-background-card p-8 rounded-xl border border-border hover:border-primary/30 transition-colors duration-200">
              <div className="w-12 h-12 bg-border rounded-lg mx-auto mb-6 flex items-center justify-center">
                <Leaf size={24} className="text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-text-primary text-center"><Tr>Crop-Specific Models</Tr></h3>
                <p className="text-text-secondary text-center leading-relaxed">
                  <Tr>We offer specialized models for a variety of crops, ensuring precise predictions tailored to your specific needs.</Tr>
                </p>
            </div>

            {/* Real-Time Insights */}
            <div className="bg-background-card p-8 rounded-xl border border-border hover:border-primary/30 transition-colors duration-200">
              <div className="w-12 h-12 bg-border rounded-lg mx-auto mb-6 flex items-center justify-center">
                <Clock size={24} className="text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-text-primary text-center"><Tr>Real-Time Insights</Tr></h3>
                <p className="text-text-secondary text-center leading-relaxed">
                  <Tr>Get up-to-date insights and alerts on potential risks, allowing you to take proactive measures to protect your crops.</Tr>
                </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-background-card rounded-2xl p-8 sm:p-12 text-center border border-border">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-text-primary">
                <Tr>Ready to Boost Your Crop Yields?</Tr>
            </h2>
              <p className="text-lg sm:text-xl text-text-secondary mb-8 leading-relaxed">
                <Tr>Join AgriVision today and start making smarter farming decisions.</Tr>
              </p>
            <button className="bg-primary hover:bg-primary/80 text-primary-foreground font-semibold px-8 py-4 rounded-lg text-lg transition-colors duration-200">
                <Tr>Get Started for Free</Tr>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-background-card">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8 mb-6">
            <a href="#privacy" className="text-text-secondary hover:text-primary transition-colors duration-200">
                <Tr>Privacy Policy</Tr>
            </a>
            <a href="#terms" className="text-text-secondary hover:text-primary transition-colors duration-200">
                <Tr>Terms of Service</Tr>
            </a>
            <a href="#contact" className="text-text-secondary hover:text-primary transition-colors duration-200">
                <Tr>Contact Us</Tr>
            </a>
            <a href="#about" className="text-text-secondary hover:text-primary transition-colors duration-200">
                <Tr>About Us</Tr>
            </a>
          </div>
          <div className="text-center">
            <p className="text-sm text-text-secondary">
                <Tr>© 2024 AgriVision. All rights reserved.</Tr>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AgriVisionLanding;
