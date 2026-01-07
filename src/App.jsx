import React, { useState } from 'react'
import ParallaxBackground from './components/ParallaxBackground.jsx'
import Banner from './components/Banner.jsx'
import InfoBlocks from './components/InfoBlocks.jsx'
import TimelinePage from './components/TimelinePage.jsx'
import LPTeste2 from './components/LPTeste2.jsx'

export default function App() {
  const [leadSubmitted, setLeadSubmitted] = useState(false)
  
  // Remove o base path para verificar rotas corretamente
  const basePath = import.meta.env.BASE_URL || '/'
  const pathname = window.location.pathname.replace(basePath, '/') || '/'
  
  const isTimelinePage = pathname.includes('passo-a-passo')
  const isOldPage = pathname.includes('lpteste2') || pathname.includes('home')

  // Rota raiz (/) agora mostra LPTeste2
  const isRoot = pathname === '/' || pathname === ''

  if (isTimelinePage) {
    return <TimelinePage />
  }

  // Se for a rota raiz, mostra LPTeste2
  if (isRoot) {
    return <LPTeste2 />
  }

  // Se for a rota antiga /lpteste2, também mostra LPTeste2 (redirecionamento)
  if (isOldPage) {
    return <LPTeste2 />
  }

  // Páginas antigas (outras rotas)
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
