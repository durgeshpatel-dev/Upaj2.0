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
              <Tr>Smart Farming with AI-Powered</Tr>
              <span className="block text-primary"><Tr>Crop Intelligence</Tr></span>
            </h1>
            <p className="mt-6 text-lg lg:text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
              <Tr>Detect crop diseases instantly, predict yields accurately, and access real-time market data to maximize your farming success with AgriVision's advanced AI platform.</Tr>
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm lg:text-base">
              <div className="flex items-center gap-2 bg-background/80 px-4 py-2 rounded-full">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                <span className="text-text-secondary"><Tr>AI Disease Detection</Tr></span>
              </div>
              <div className="flex items-center gap-2 bg-background/80 px-4 py-2 rounded-full">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                <span className="text-text-secondary"><Tr>Live Market Prices</Tr></span>
              </div>
              <div className="flex items-center gap-2 bg-background/80 px-4 py-2 rounded-full">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                <span className="text-text-secondary"><Tr>Yield Predictions</Tr></span>
              </div>
            </div>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/predict">
                <Button className="bg-primary text-black hover:bg-primary-hover text-lg px-8 py-3 font-semibold">
                  <Tr>Start Free Prediction</Tr>
                </Button>
              </Link>
              <Link to="/disease-prediction">
                <Button variant="outline" className="text-lg px-8 py-3 font-semibold">
                  <Tr>Detect Disease</Tr>
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
