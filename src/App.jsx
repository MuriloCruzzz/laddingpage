import React, { useState, useEffect } from 'react'
import ParallaxBackground from './components/ParallaxBackground.jsx'
import Banner from './components/Banner.jsx'
import InfoBlocks from './components/InfoBlocks.jsx'
import TimelinePage from './components/TimelinePage.jsx'
import LPTeste2 from './components/LPTeste2.jsx'

const CAMPANHA_HOME_URL = 'https://educacao.cemaden.gov.br/campanhacidades/'

export default function App() {
  const [leadSubmitted, setLeadSubmitted] = useState(false)
  const [redirecting, setRedirecting] = useState(false)

  useEffect(() => {
    try {
      if (localStorage.getItem('passou_lp') === 'sim') {
        setRedirecting(true)
        window.location.href = CAMPANHA_HOME_URL
      }
    } catch (_) {}
  }, [])
  
  // Remove o base path para verificar rotas corretamente
  const basePath = import.meta.env.BASE_URL || '/'
  const pathname = window.location.pathname.replace(basePath, '/') || '/'
  
  const isTimelinePage = pathname.includes('passo-a-passo')
  const isOldPage = pathname.includes('lpteste2') || pathname.includes('home')

  // Rota raiz (/) agora mostra LPTeste2
  const isRoot = pathname === '/' || pathname === ''

  if (redirecting) return null

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
