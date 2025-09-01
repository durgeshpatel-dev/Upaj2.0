import React from 'react'

const StatsSection = () => {
  const stats = [
    {
      number: '95%',
      label: 'Prediction Accuracy',
      icon: '🎯'
    },
    {
      number: '1000+',
      label: 'Happy Farmers',
      icon: '👨‍🌾'
    },
    {
      number: '25+',
      label: 'Crop Types Supported',
      icon: '🌾'
    },
    {
      number: '24/7',
      label: 'Real-time Monitoring',
      icon: '📡'
    }
  ]

  return (
    <section className="mt-12 mb-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="text-center p-6 rounded-lg border border-border bg-surface hover:bg-surface-hover transition-colors duration-200">
            <div className="text-3xl mb-2" role="img" aria-label={stat.label}>
              {stat.icon}
            </div>
            <div className="text-2xl lg:text-3xl font-bold text-primary mb-1">
              {stat.number}
            </div>
            <div className="text-sm text-text-secondary">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default StatsSection