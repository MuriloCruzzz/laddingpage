import React from 'react'
import ParallaxBackground from './components/ParallaxBackground.jsx'
import Banner from './components/Banner.jsx'
import Steps from './components/Steps.jsx'
import Benefits from './components/Benefits.jsx'

export default function App() {
  return (
    <ParallaxBackground>
      <Banner />
      <Steps />
      <Benefits />
      <Banner />
    </ParallaxBackground>
  )
}