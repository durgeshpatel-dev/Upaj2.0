import React from 'react'
import { Card, CardContent } from '../ui/Card'

const KeyFeatures = () => {
  const features = [
    {
      icon: '📊',
      title: 'Accurate Predictions',
      description: 'Our AI models provide highly accurate yield predictions using advanced algorithms, soil characteristics, and weather conditions.'
    },
    {
      icon: '🌾',
      title: 'Crop-Specific Models',
      description: 'We offer specialized models for a variety of crops, allowing for more predictions tailored to specific agricultural needs.'
    },
    {
      icon: '⏱️',
      title: 'Real-Time Insights',
      description: 'Get up-to-date insights and alerts on potential risks, allowing you to take preventive measures to protect your crops.'
    }
  ]

  return (
    <section className="mt-12 mb-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-text-primary mb-3">
          Key Features
        </h2>
        <p className="text-text-secondary max-w-2xl mx-auto text-sm">
          AgriVision offers a range of features designed to help farmers make informed decisions and improve their crop yields.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="border-border bg-surface hover:bg-surface-hover transition-colors duration-200">
            <CardContent className="p-6 text-center">
              <div className="mb-4">
                <span className="text-4xl" role="img" aria-label={feature.title}>
                  {feature.icon}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-3">
                {feature.title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

export default KeyFeatures