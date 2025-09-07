import React from 'react'
import Navbar from '../components/Navbar'
import HeroSection from '../components/landing/HeroSection'
import StatsSection from '../components/landing/StatsSection'
import KeyFeatures from '../components/landing/KeyFeatures'
import CallToAction from '../components/landing/CallToAction'
import Footer from '../components/ui/Footer'

const Landing = () => {
  return (
    <div className="min-h-screen bg-background text-text-secondary">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 lg:px-6 py-6">
        <HeroSection />
        <StatsSection />
        <KeyFeatures />
        <CallToAction />
      </main>
      <Footer />
    </div>
  )
}

export default Landing
