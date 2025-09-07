import React from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '../ui/Card'
import Button from '../Button'
import { Tr } from '../ui/SimpleTranslation'

const CallToAction = () => {
  return (
    <section className="mt-12 mb-8">
      <Card className="border-border bg-surface">
        <CardContent className="p-8 lg:p-12 text-center">
          <h3 className="text-2xl lg:text-3xl font-bold text-text-primary mb-4">
            <Tr>Ready to Boost Your Crop Yields?</Tr>
          </h3>
          <p className="text-lg text-text-secondary mb-6 max-w-2xl mx-auto">
            <Tr>Join AgriVision today and start making smarter farming decisions.</Tr>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/predict">
              <Button className="bg-primary text-black hover:bg-primary-hover text-lg px-8 py-3 font-semibold w-full sm:w-auto">
                <Tr>Get Started for Free</Tr>
              </Button>
            </Link>
            <Link to="/predict">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-black text-lg px-8 py-3 font-semibold w-full sm:w-auto">
                <Tr>Try Demo</Tr>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

export default CallToAction
