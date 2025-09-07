import React from 'react'
import { Link } from 'react-router-dom'
import Button from '../Button'
import { Tr } from '../ui/SimpleTranslation'
import Bg from '../../assets/Hero.png'
const HeroSection = () => {
  return (
    <section className="rounded-xl border border-border bg-surface overflow-hidden">
      <div className="relative min-h-[400px] lg:h-[500px] w-full">
        <img 
          src={Bg}
          alt="Wheat field" 
          className="h-full w-full object-cover opacity-50" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="max-w-4xl px-6 lg:px-8 text-center">
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-text-primary text-balance leading-tight">
              <Tr>Predict Your Crop Yields with</Tr>
              <span className="block text-primary"><Tr>Precision</Tr></span>
            </h1>
            <p className="mt-6 text-lg lg:text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
              <Tr>AgriVision uses advanced AI to provide accurate yield predictions, helping farmers optimize their resources and maximize profits.</Tr>
            </p>
            <div className="mt-8">
              <Link to="/predict">
                <Button className="bg-primary text-black hover:bg-primary-hover text-lg px-8 py-3 font-semibold">
                  <Tr>Get Started Now</Tr>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
