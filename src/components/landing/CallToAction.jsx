import React from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '../ui/Card'
import Button from '../Button'
import { Tr } from '../ui/SimpleTranslation'

const CallToAction = () => {
  return (
    <section className="mt-12 mb-8">
      <Card className="border-border bg-gradient-to-r from-primary/5 to-primary/10">
        <CardContent className="p-8 lg:p-12 text-center">
          <h3 className="text-2xl lg:text-3xl font-bold text-text-primary mb-4">
            <Tr>Transform Your Farming with AI Technology</Tr>
          </h3>
          <p className="text-lg text-text-secondary mb-6 max-w-2xl mx-auto">
            <Tr>Join thousands of farmers using AgriVision to detect diseases early, predict yields accurately, and access real-time market data for better profits.</Tr>
          </p>
          
          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-2 text-sm">
              <span className="w-2 h-2 bg-primary rounded-full"></span>
              <span className="text-text-secondary"><Tr>Free disease detection</Tr></span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm">
              <span className="w-2 h-2 bg-primary rounded-full"></span>
              <span className="text-text-secondary"><Tr>Live market prices</Tr></span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm">
              <span className="w-2 h-2 bg-primary rounded-full"></span>
              <span className="text-text-secondary"><Tr>No subscription required</Tr></span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/disease-prediction">
              <Button className="bg-primary text-black hover:bg-primary-hover text-lg px-8 py-3 font-semibold w-full sm:w-auto">
                <Tr>Detect Disease Now</Tr>
              </Button>
            </Link>
            <Link to="/market">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-black text-lg px-8 py-3 font-semibold w-full sm:w-auto">
                <Tr>View Market Prices</Tr>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

export default CallToAction
