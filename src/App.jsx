import React, { useState } from 'react'
import ParallaxBackground from './components/ParallaxBackground.jsx'
import Banner from './components/Banner.jsx'
import InfoBlocks from './components/InfoBlocks.jsx'
import TimelinePage from './components/TimelinePage.jsx'

export default function App() {
  const [leadSubmitted, setLeadSubmitted] = useState(false)
  const isTimelinePage = window.location.pathname.includes('passo-a-passo')

  if (isTimelinePage) {
    return <TimelinePage />
  }

  return (
    <ParallaxBackground>
      <Banner submitted={leadSubmitted} onSubmit={() => setLeadSubmitted(true)} />
      <InfoBlocks />
      <Banner submitted={leadSubmitted} onSubmit={() => setLeadSubmitted(true)} />
    </ParallaxBackground>
  )
}