import React from 'react'
import { Card, CardContent } from '../ui/Card'
import { Tr } from '../ui/SimpleTranslation'
import { Camera, TrendingUp, BarChart3, Shield, AlertTriangle, DollarSign, Zap, CheckCircle } from 'lucide-react'

const DetailedFeatures = () => {
  const detailedFeatures = [
    {
      icon: <Camera className="w-8 h-8 text-primary" />,
      category: "Disease Detection",
      title: "AI-Powered Crop Disease Analysis",
      description: "Advanced computer vision technology that analyzes crop images to detect diseases early, helping prevent crop loss and reduce treatment costs.",
      features: [
        "Instant disease identification from photos",
        "95%+ accuracy across 50+ common crop diseases",
        "Detailed treatment recommendations",
        "Prevention strategies and best practices",
        "Confidence scoring for reliable results"
      ],
      stats: {
        label: "Disease Detection Accuracy",
        value: "95%+",
        subtext: "Across 50+ diseases"
      }
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-primary" />,
      category: "Market Intelligence",
      title: "Real-Time Market Data & Analytics",
      description: "Comprehensive market intelligence platform providing live prices, trends, and analytics to help farmers make profitable selling decisions.",
      features: [
        "Live prices from 1000+ markets nationwide",
        "Historical price trends and seasonal patterns",
        "Demand forecasting and market opportunities",
        "Regional price comparisons",
        "Optimal selling time recommendations"
      ],
      stats: {
        label: "Markets Covered",
        value: "1000+",
        subtext: "Across India"
      }
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-primary" />,
      category: "Yield Prediction",
      title: "Precision Crop Yield Forecasting",
      description: "Machine learning models trained on weather, soil, and historical data to provide accurate yield predictions for better planning and resource allocation.",
      features: [
        "Weather-integrated yield models",
        "Soil condition analysis",
        "Historical data correlation",
        "Resource optimization suggestions",
        "Harvest timing recommendations"
      ],
      stats: {
        label: "Prediction Accuracy",
        value: "92%",
        subtext: "Average accuracy"
      }
    }
  ]

  return (
    <section className="mt-16 mb-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-text-primary mb-4">
          <Tr>Powerful Features for Modern Farming</Tr>
        </h2>
        <p className="text-lg text-text-secondary max-w-3xl mx-auto">
          <Tr>AgriVision combines cutting-edge AI technology with comprehensive market intelligence to empower farmers with actionable insights and data-driven decisions.</Tr>
        </p>
      </div>
      
      <div className="space-y-8">
        {detailedFeatures.map((feature, index) => (
          <Card key={index} className="border-border bg-surface overflow-hidden">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                {/* Main Content */}
                <div className="lg:col-span-2 p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="flex-shrink-0 p-3 bg-primary/10 rounded-lg">
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-primary mb-1">
                        <Tr>{feature.category}</Tr>
                      </div>
                      <h3 className="text-xl font-bold text-text-primary mb-3">
                        <Tr>{feature.title}</Tr>
                      </h3>
                      <p className="text-text-secondary leading-relaxed">
                        <Tr>{feature.description}</Tr>
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {feature.features.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-sm text-text-secondary">
                          <Tr>{item}</Tr>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Stats Panel */}
                <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-8 flex flex-col justify-center items-center text-center border-l border-border">
                  <div className="mb-4">
                    <div className="text-3xl font-bold text-primary mb-1">
                      {feature.stats.value}
                    </div>
                    <div className="text-sm font-medium text-text-primary mb-2">
                      <Tr>{feature.stats.label}</Tr>
                    </div>
                    <div className="text-xs text-text-secondary">
                      <Tr>{feature.stats.subtext}</Tr>
                    </div>
                  </div>
                  
                  <div className="w-full max-w-32 h-2 bg-border rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-1000"
                      style={{ width: index === 0 ? '95%' : index === 1 ? '85%' : '92%' }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Additional Benefits Section */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border bg-surface text-center">
          <CardContent className="p-6">
            <Shield className="w-8 h-8 text-primary mx-auto mb-4" />
            <h4 className="font-semibold text-text-primary mb-2">
              <Tr>Early Disease Prevention</Tr>
            </h4>
            <p className="text-sm text-text-secondary">
              <Tr>Detect diseases before they spread, saving up to 40% in crop losses and treatment costs.</Tr>
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-border bg-surface text-center">
          <CardContent className="p-6">
            <DollarSign className="w-8 h-8 text-primary mx-auto mb-4" />
            <h4 className="font-semibold text-text-primary mb-2">
              <Tr>Maximize Profits</Tr>
            </h4>
            <p className="text-sm text-text-secondary">
              <Tr>Time your sales perfectly with market intelligence and increase revenue by up to 25%.</Tr>
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-border bg-surface text-center">
          <CardContent className="p-6">
            <Zap className="w-8 h-8 text-primary mx-auto mb-4" />
            <h4 className="font-semibold text-text-primary mb-2">
              <Tr>Instant Results</Tr>
            </h4>
            <p className="text-sm text-text-secondary">
              <Tr>Get disease diagnosis in seconds and market updates in real-time for quick decision making.</Tr>
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

export default DetailedFeatures
