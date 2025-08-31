import React from 'react'
import { BarChart3, Leaf, Clock } from 'lucide-react'

const AgriVisionLanding = () => {

  return (
    <div className="min-h-screen bg-background text-text-primary font-['Inter',sans-serif]">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">        
        {/* Hero Content Container with Background Image */}
        <div 
          className="relative z-10 rounded-2xl p-8 sm:p-12 lg:p-16 mx-4 max-w-5xl text-center overflow-hidden"
          style={{
            backgroundImage: `linear-gradient(rgba(17, 24, 20, 0.75), rgba(17, 24, 20, 0.75)), url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 800'%3E%3Cdefs%3E%3ClinearGradient id='sunset' x1='0%25' y1='0%25' x2='0%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23FFB366'/%3E%3Cstop offset='50%25' stop-color='%23FF8C42'/%3E%3Cstop offset='100%25' stop-color='%23D4A574'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1200' height='800' fill='url(%23sunset)'/%3E%3Cg opacity='0.8'%3E%3Cpath d='M0 600 Q 50 550 100 600 Q 150 570 200 600 Q 250 580 300 600 Q 350 570 400 600 Q 450 580 500 600 Q 550 570 600 600 Q 650 580 700 600 Q 750 570 800 600 Q 850 580 900 600 Q 950 570 1000 600 Q 1050 580 1100 600 Q 1150 570 1200 600 L 1200 800 L 0 800 Z' fill='%23D4A574'/%3E%3Cpath d='M0 650 Q 30 630 60 650 Q 90 640 120 650 Q 150 635 180 650 Q 210 640 240 650 Q 270 635 300 650 Q 330 640 360 650 Q 390 635 420 650 Q 450 640 480 650 Q 510 635 540 650 Q 570 640 600 650 Q 630 635 660 650 Q 690 640 720 650 Q 750 635 780 650 Q 810 640 840 650 Q 870 635 900 650 Q 930 640 960 650 Q 990 635 1020 650 Q 1050 640 1080 650 Q 1110 635 1140 650 Q 1170 640 1200 650 L 1200 800 L 0 800 Z' fill='%23B8860B'/%3E%3C/g%3E%3Cg fill='%23DAA520' opacity='0.6'%3E%3Cpath d='M100 500 Q 105 450 110 500 Q 115 470 120 500 Q 125 480 130 500 Q 135 470 140 500' stroke='%23DAA520' stroke-width='2' fill='none'/%3E%3Cpath d='M200 510 Q 205 460 210 510 Q 215 480 220 510 Q 225 490 230 510 Q 235 480 240 510' stroke='%23DAA520' stroke-width='2' fill='none'/%3E%3Cpath d='M300 520 Q 305 470 310 520 Q 315 490 320 520 Q 325 500 330 520 Q 335 490 340 520' stroke='%23DAA520' stroke-width='2' fill='none'/%3E%3Cpath d='M400 505 Q 405 455 410 505 Q 415 475 420 505 Q 425 485 430 505 Q 435 475 440 505' stroke='%23DAA520' stroke-width='2' fill='none'/%3E%3Cpath d='M500 515 Q 505 465 510 515 Q 515 485 520 515 Q 525 495 530 515 Q 535 485 540 515' stroke='%23DAA520' stroke-width='2' fill='none'/%3E%3Cpath d='M600 500 Q 605 450 610 500 Q 615 470 620 500 Q 625 480 630 500 Q 635 470 640 500' stroke='%23DAA520' stroke-width='2' fill='none'/%3E%3Cpath d='M700 510 Q 705 460 710 510 Q 715 480 720 510 Q 725 490 730 510 Q 735 480 740 510' stroke='%23DAA520' stroke-width='2' fill='none'/%3E%3Cpath d='M800 520 Q 805 470 810 520 Q 815 490 820 520 Q 825 500 830 520 Q 835 490 840 520' stroke='%23DAA520' stroke-width='2' fill='none'/%3E%3Cpath d='M900 505 Q 905 455 910 505 Q 915 475 920 505 Q 925 485 930 505 Q 935 475 940 505' stroke='%23DAA520' stroke-width='2' fill='none'/%3E%3Cpath d='M1000 515 Q 1005 465 1010 515 Q 1015 485 1020 515 Q 1025 495 1030 515 Q 1035 485 1040 515' stroke='%23DAA520' stroke-width='2' fill='none'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="relative z-10">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-8 leading-tight text-white">
              Predict Your Crop Yields with<br className="hidden sm:block" />
              <span className="block">Precision</span>
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-10 text-white/90 max-w-4xl mx-auto leading-relaxed font-medium">
              AgriVision uses advanced AI to provide accurate yield predictions, helping farmers 
              optimize their resources and maximize profits.
            </p>
            <button className="bg-primary hover:bg-primary/80 text-primary-foreground font-bold px-10 py-5 rounded-lg text-xl transition-colors duration-200 shadow-lg">
              Get Started Now
            </button>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-text-primary">
              Key Features
            </h2>
            <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
              AgriVision offers a range of features designed to help farmers make informed 
              decisions and improve their crop yields.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Accurate Predictions */}
            <div className="bg-background-card p-8 rounded-xl border border-border hover:border-primary/30 transition-colors duration-200">
              <div className="w-12 h-12 bg-border rounded-lg mx-auto mb-6 flex items-center justify-center">
                <BarChart3 size={24} className="text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-text-primary text-center">Accurate Predictions</h3>
              <p className="text-text-secondary text-center leading-relaxed">
                Our AI models provide highly accurate yield predictions based on historical data, 
                weather patterns, and soil conditions.
              </p>
            </div>

            {/* Crop-Specific Models */}
            <div className="bg-background-card p-8 rounded-xl border border-border hover:border-primary/30 transition-colors duration-200">
              <div className="w-12 h-12 bg-border rounded-lg mx-auto mb-6 flex items-center justify-center">
                <Leaf size={24} className="text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-text-primary text-center">Crop-Specific Models</h3>
              <p className="text-text-secondary text-center leading-relaxed">
                We offer specialized models for a variety of crops, ensuring precise predictions 
                tailored to your specific needs.
              </p>
            </div>

            {/* Real-Time Insights */}
            <div className="bg-background-card p-8 rounded-xl border border-border hover:border-primary/30 transition-colors duration-200">
              <div className="w-12 h-12 bg-border rounded-lg mx-auto mb-6 flex items-center justify-center">
                <Clock size={24} className="text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-text-primary text-center">Real-Time Insights</h3>
              <p className="text-text-secondary text-center leading-relaxed">
                Get up-to-date insights and alerts on potential risks, allowing you to take 
                proactive measures to protect your crops.
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
              Ready to Boost Your Crop Yields?
            </h2>
            <p className="text-lg sm:text-xl text-text-secondary mb-8 leading-relaxed">
              Join AgriVision today and start making smarter farming decisions.
            </p>
            <button className="bg-primary hover:bg-primary/80 text-primary-foreground font-semibold px-8 py-4 rounded-lg text-lg transition-colors duration-200">
              Get Started for Free
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-background-card">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8 mb-6">
            <a href="#privacy" className="text-text-secondary hover:text-primary transition-colors duration-200">
              Privacy Policy
            </a>
            <a href="#terms" className="text-text-secondary hover:text-primary transition-colors duration-200">
              Terms of Service
            </a>
            <a href="#contact" className="text-text-secondary hover:text-primary transition-colors duration-200">
              Contact Us
            </a>
            <a href="#about" className="text-text-secondary hover:text-primary transition-colors duration-200">
              About Us
            </a>
          </div>
          <div className="text-center">
            <p className="text-sm text-text-secondary">
              © 2024 AgriVision. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AgriVisionLanding;
