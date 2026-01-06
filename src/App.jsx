import React, { useState } from 'react'
import ParallaxBackground from './components/ParallaxBackground.jsx'
import Banner from './components/Banner.jsx'
import InfoBlocks from './components/InfoBlocks.jsx'
import TimelinePage from './components/TimelinePage.jsx'
import LPTeste2 from './components/LPTeste2.jsx'

export default function App() {
  const [leadSubmitted, setLeadSubmitted] = useState(false)
  const isTimelinePage = window.location.pathname.includes('passo-a-passo')
  const isLPTeste2 = window.location.pathname.includes('lpteste2')

  if (isTimelinePage) {
    return <TimelinePage />
  }

  if (isLPTeste2) {
    return <LPTeste2 />
  }

  return (
    <ParallaxBackground>
      <Banner submitted={leadSubmitted} onSubmit={() => setLeadSubmitted(true)} />
      <InfoBlocks />
      <Banner submitted={leadSubmitted} onSubmit={() => setLeadSubmitted(true)} />
      <footer className="site-footer">
        Cemaden Educação — Desenvolvido por Murilo Cruz • #AprenderParaPrevenir
      </footer>
    </ParallaxBackground>
  )
}
