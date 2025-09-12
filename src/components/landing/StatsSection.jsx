import React from 'react'
import { Tr } from '../ui/SimpleTranslation'

const StatsSection = () => {
  const stats = [
    {
      number: '95%',
      label: 'Disease Detection Accuracy',
      icon: '🔬',
      description: 'AI-powered disease identification'
    },
    {
      number: '1000+',
      label: 'Markets Covered',
      icon: '�',
      description: 'Real-time price data'
    },
    {
      number: '50+',
      label: 'Crop Diseases Detected',
      icon: '🛡️',
      description: 'Comprehensive disease database'
    },
    {
      number: '92%',
      label: 'Yield Prediction Accuracy',
      icon: '📊',
      description: 'Weather-integrated forecasting'
    },
    {
      number: '25%',
      label: 'Average Profit Increase',
      icon: '📈',
      description: 'With market intelligence'
    },
    {
      number: '2 sec',
      label: 'Disease Detection Speed',
      icon: '⚡',
      description: 'Instant image analysis'
    }
  ]

  return (
    <section className="mt-12 mb-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl lg:text-3xl font-bold text-text-primary mb-3">
          <Tr>Trusted by Farmers Nationwide</Tr>
        </h2>
        <p className="text-text-secondary max-w-2xl mx-auto">
          <Tr>Our AI-powered platform delivers measurable results for modern agriculture</Tr>
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="text-center p-6 rounded-lg border border-border bg-surface hover:bg-surface-hover transition-all duration-200 hover:scale-105">
            <div className="text-4xl mb-3" role="img" aria-label={stat.label}>
              {stat.icon}
            </div>
            <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">
              {stat.number}
            </div>
            <div className="text-sm font-semibold text-text-primary mb-1">
              <Tr>{stat.label}</Tr>
            </div>
            <div className="text-xs text-text-secondary">
              <Tr>{stat.description}</Tr>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default StatsSection