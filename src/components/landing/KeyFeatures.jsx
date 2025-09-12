import React from 'react'
import { Card, CardContent } from '../ui/Card'
import { Tr } from '../ui/SimpleTranslation'

const KeyFeatures = () => {
  const features = [
    {
      icon: '📊',
      title: 'Accurate Yield Predictions',
      description: 'Our AI models provide highly accurate yield predictions based on historical data, weather patterns, and soil conditions to help you plan harvest and optimize resources.'
    },
    {
      icon: '🔬',
      title: 'AI Disease Detection',
      description: 'Upload crop images to instantly detect diseases using advanced computer vision. Get detailed diagnosis, treatment recommendations, and prevention strategies with confidence scores.'
    },
    {
      icon: '💰',
      title: 'Real-Time Market Prices',
      description: 'Access live market prices across 1000+ markets, track price trends, monitor crop demand, and make informed selling decisions to maximize your profits.'
    },
    {
      icon: '🌾',
      title: 'Crop-Specific Models',
      description: 'We offer specialized models for a variety of crops, ensuring precise predictions tailored to your specific needs and local growing conditions.'
    },
    {
      icon: '📈',
      title: 'Market Analytics',
      description: 'Analyze market trends, compare prices across regions, track seasonal patterns, and identify the best times to sell your produce for optimal returns.'
    },
    {
      icon: '⚡',
      title: 'Instant Insights',
      description: 'Get real-time weather alerts, disease outbreak warnings, and market opportunities delivered instantly to help you make quick, informed decisions.'
    }
  ]

  return (
    <section className="mt-12 mb-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-text-primary mb-3">
          <Tr>Key Features</Tr>
        </h2>
        <p className="text-text-secondary max-w-2xl mx-auto text-sm">
          <Tr>AgriVision offers a range of features designed to help farmers make informed decisions and improve their crop yields.</Tr>
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="border-border bg-surface hover:bg-surface-hover transition-colors duration-200">
            <CardContent className="p-6 text-center">
              <div className="mb-4">
                <span className="text-4xl" role="img" aria-label={feature.title}>
                  {feature.icon}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-3">
                <Tr>{feature.title}</Tr>
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                <Tr>{feature.description}</Tr>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

export default KeyFeatures