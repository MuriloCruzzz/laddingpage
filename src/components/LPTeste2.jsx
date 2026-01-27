import React, { useState, useEffect, useRef } from 'react'
import '../styles/fonts.css'
import '../styles/colors.css'
import '../styles/LPTeste2.css'
import {
  initMetaPixel,
  trackPageView,
  trackViewContent,
  trackLeadStart,
  trackButtonClick,
  trackCompleteRegistration,
  trackScrollComplete,
  trackSectionView,
} from '../utils/metaPixel'

// Helper para caminhos de imagens que funcionam tanto no Vercel quanto via WordPress
// Usa import.meta.env.BASE_URL do Vite para garantir compatibilidade
const getImagePath = (path) => {
  const baseUrl = import.meta.env.BASE_URL || '/'
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  return `${baseUrl}${cleanPath}`
}

// Lista de estados brasileiros
const estadosBrasileiros = [
  { value: '', label: 'Selecione o Estado' },
  { value: 'AC', label: 'Acre' },
  { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapá' },
  { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' },
  { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' },
  { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' },
  { value: 'MA', label: 'Maranhão' },
  { value: 'MT', label: 'Mato Grosso' },
  { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' },
  { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', label: 'Rondônia' },
  { value: 'RR', label: 'Roraima' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' },
  { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' },
]

export default function LPTeste2() {
  const [form, setForm] = useState({
    nomeResponsavel: '',
    email: '',
    municipio: '',
    cidadeEstado: '',
  })
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [showSidebar, setShowSidebar] = useState(false)
  const statsSectionRef = useRef(null)
  const videoContainerRef = useRef(null)
  const recognitionSectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const statItems = entry.target.querySelectorAll('.lp2-stat-item')
            statItems.forEach((item, index) => {
              // Remove a classe primeiro para resetar a animação
              item.classList.remove('lp2-stat-visible')
              // Adiciona um pequeno delay para garantir que a remoção foi processada
              setTimeout(() => {
                setTimeout(() => {
                  item.classList.add('lp2-stat-visible')
                }, index * 200)
              }, 10)
            })
          } else {
            // Remove a classe quando sai da viewport para permitir reanimação
            const statItems = entry.target.querySelectorAll('.lp2-stat-item')
            statItems.forEach((item) => {
              item.classList.remove('lp2-stat-visible')
            })
          }
        })
      },
      { threshold: 0.2 }
    )

    if (statsSectionRef.current) {
      observer.observe(statsSectionRef.current)
    }

    return () => {
      if (statsSectionRef.current) {
        observer.unobserve(statsSectionRef.current)
      }
    }
  }, [])

  // Animação de scroll para a seção de reconhecimento
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const recognitionItems = entry.target.querySelectorAll('.lp2-recognition-item')
            recognitionItems.forEach((item, index) => {
              // Remove a classe primeiro para resetar a animação
              item.classList.remove('lp2-recognition-visible')
              // Adiciona um pequeno delay para garantir que a remoção foi processada
              setTimeout(() => {
                setTimeout(() => {
                  item.classList.add('lp2-recognition-visible')
                }, index * 200)
              }, 10)
            })
          } else {
            // Remove a classe quando sai da viewport para permitir reanimação
            const recognitionItems = entry.target.querySelectorAll('.lp2-recognition-item')
            recognitionItems.forEach((item) => {
              item.classList.remove('lp2-recognition-visible')
            })
          }
        })
      },
      { threshold: 0.2 }
    )

    if (recognitionSectionRef.current) {
      observer.observe(recognitionSectionRef.current)
    }

    return () => {
      if (recognitionSectionRef.current) {
        observer.unobserve(recognitionSectionRef.current)
      }
    }
  }, [])

  // Previne scroll automático quando o vídeo recebe foco
  useEffect(() => {
    const container = videoContainerRef.current
    if (!container) return

    const iframe = container.querySelector('iframe')
    if (!iframe) return

    let savedScrollPosition = window.scrollY || window.pageYOffset || document.documentElement.scrollTop
    let scrollLocked = false
    let lockTimeout = null

    // Salva a posição do scroll
    const saveScrollPosition = () => {
      savedScrollPosition = window.scrollY || window.pageYOffset || document.documentElement.scrollTop
    }

    // Bloqueia scroll por um período curto
    const lockScroll = (duration = 500) => {
      scrollLocked = true
      saveScrollPosition()
      
      if (lockTimeout) clearTimeout(lockTimeout)
      lockTimeout = setTimeout(() => {
        scrollLocked = false
      }, duration)
    }

    // Previne scroll quando o iframe recebe foco
    const handleFocus = (e) => {
      e.preventDefault()
      e.stopPropagation()
      lockScroll(1000)
      
      // Força a restauração múltiplas vezes para garantir
      const restoreScroll = () => {
        const currentPos = window.scrollY || window.pageYOffset || document.documentElement.scrollTop
        if (Math.abs(currentPos - savedScrollPosition) > 1) {
          window.scrollTo({
            top: savedScrollPosition,
            left: 0,
            behavior: 'auto'
          })
        }
      }
      
      restoreScroll()
      requestAnimationFrame(restoreScroll)
      setTimeout(restoreScroll, 0)
      setTimeout(restoreScroll, 10)
      setTimeout(restoreScroll, 50)
      setTimeout(restoreScroll, 100)
      setTimeout(restoreScroll, 200)
    }

    // Previne scroll quando o iframe é clicado
    const handleClick = (e) => {
      saveScrollPosition()
      lockScroll(1000)
      
      const restoreScroll = () => {
        const currentPos = window.scrollY || window.pageYOffset || document.documentElement.scrollTop
        if (Math.abs(currentPos - savedScrollPosition) > 1) {
          window.scrollTo({
            top: savedScrollPosition,
            left: 0,
            behavior: 'auto'
          })
        }
      }
      
      restoreScroll()
      requestAnimationFrame(restoreScroll)
      setTimeout(restoreScroll, 0)
      setTimeout(restoreScroll, 10)
      setTimeout(restoreScroll, 50)
      setTimeout(restoreScroll, 100)
      setTimeout(restoreScroll, 200)
    }

    // Previne scroll no mousedown (antes do click)
    const handleMouseDown = (e) => {
      saveScrollPosition()
      lockScroll(1000)
    }

    // Monitora e previne scroll durante o período de bloqueio
    const handleScroll = (e) => {
      if (scrollLocked) {
        e.preventDefault()
        e.stopImmediatePropagation()
        window.scrollTo({
          top: savedScrollPosition,
          left: 0,
          behavior: 'auto'
        })
        return false
      }
    }

    // Previne scroll quando o mouse entra no container
    const handleMouseEnter = () => {
      saveScrollPosition()
    }

    // Adiciona listeners com capture phase para interceptar antes
    container.addEventListener('focusin', handleFocus, { capture: true, passive: false })
    container.addEventListener('click', handleClick, { capture: true, passive: false })
    container.addEventListener('mouseenter', handleMouseEnter, { capture: true })
    iframe.addEventListener('focus', handleFocus, { capture: true, passive: false })
    iframe.addEventListener('click', handleClick, { capture: true, passive: false })
    window.addEventListener('scroll', handleScroll, { capture: true, passive: false })

    return () => {
      if (lockTimeout) clearTimeout(lockTimeout)
      container.removeEventListener('mousedown', handleMouseDown, { capture: true })
      container.removeEventListener('focusin', handleFocus, { capture: true })
      container.removeEventListener('click', handleClick, { capture: true })
      container.removeEventListener('mouseenter', handleMouseEnter, { capture: true })
      iframe.removeEventListener('mousedown', handleMouseDown, { capture: true })
      iframe.removeEventListener('focus', handleFocus, { capture: true })
      iframe.removeEventListener('click', handleClick, { capture: true })
      window.removeEventListener('scroll', handleScroll, { capture: true })
    }
  }, [])

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    
    // Rastreia clique no botão
    trackButtonClick()
    
    // Validação dos campos obrigatórios
    if (!form.nomeResponsavel || !form.email || !form.municipio || !form.cidadeEstado) {
      setAlertMessage('Por favor, preencha todos os campos obrigatórios.')
      setShowAlert(true)
      return
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email)) {
      setAlertMessage('Por favor, insira um e-mail válido.')
      setShowAlert(true)
      return
    }

    // Rastreia registro completo antes de abrir o sidebar
    trackCompleteRegistration(form)
    setShowSidebar(true)
  }

  function handleWhatsAppClick() {
    window.open('https://educacao.cemaden.gov.br/login-na-rede/', '_blank')
  }

  function handleSairClick() {
    window.location.href = 'https://educacao.cemaden.gov.br/campanhacidades/'
  }

  function closeAlert() {
    setShowAlert(false)
    setAlertMessage('')
  }

  return (
    <div className="lp2-page">
      {/* PRIMEIRO QUADRANTE: imagem + logo à esquerda / formulário à direita */}
      <section className="lp2-hero">
        {/* Lado esquerdo: foto grande + logo e foto de apoio embaixo */}
        <div className="lp2-hero-bg-container">
          <img src={getImagePath('/img/teste-2.png')} alt="Cidades sem risco" className="lp2-hero-bg" />
          <div className="lp2-logo-container">
            <img src={getImagePath('/img/logo.png')} alt="Cidades sem Risco" className="lp2-hero-logo" />
          </div>
            <div className="lp2-footer-images-row">
              <img
                src={getImagePath('/img/rodape_2.png')}
                alt="Parcerias e apoiadores da campanha"
                className="lp2-hero-footer-img2"
              />
              <img
                src={getImagePath('/img/rodape_1.png')}
                alt="Parcerias e apoiadores da campanha"
                className="lp2-hero-footer-img"
              />
          </div>
        </div>

        {/* Lado direito: bloco amarelo com formulário */}
        <div className="lp2-hero-right">
          <div className="lp2-form-card">
            <h2 className="lp2-form-title">Organize uma Campanha com a sua comunidade</h2>
            <form className="lp2-form" onSubmit={handleSubmit}>
              <div className="lp2-input">
                <input
                  name="nomeResponsavel"
                  value={form.nomeResponsavel}
                  onChange={handleChange}
                  placeholder="Nome*"
                  required
                />
              </div>
              <div className="lp2-input">
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="E-mail*"
                  required
                />
              </div>
              <div className="lp2-input">
                <input
                  name="municipio"
                  value={form.municipio}
                  onChange={handleChange}
                  placeholder="Cidade*"
                  required
                />
              </div>
              <div className="lp2-input">
                <select
                  name="cidadeEstado"
                  value={form.cidadeEstado}
                  onChange={handleChange}
                  className="lp2-select"
                  required
                >
                  {estadosBrasileiros.map((estado) => (
                    <option key={estado.value} value={estado.value}>
                      {estado.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="lp2-buttons-container">
                <button className="lp2-button lp2-button-sidebar" type="submit">
                  EU QUERO!
                </button>
              </div>
            </form>
          </div>

        </div>
      </section>

      {/* NOVA SEÇÃO: O que é a campanha */}
      <section className="lp2-what-is-campaign">
        <div className="lp2-what-is-content">
          {/* Banner amarelo com estilo recortado */}
          <div className="lp2-what-is-banner-wrapper">
            <div className="lp2-what-is-yellow-banner">
              <h2 className="lp2-what-is-banner-text">
              O que é a Campanha #AprenderParaPrevenir
              </h2>
            </div>
          </div>

          <div className="lp2-what-is-main">
            {/* Lado esquerdo: Texto */}
            <div className="lp2-what-is-text">
              <p className="lp2-what-is-intro">
                A 9ª Campanha Nacional <strong style={{ color: 'red' }}>#AprenderParaPrevenir</strong>: Cidades Sem Risco promove campanhas locais em todo o Brasil.
              </p>
              <h3 className="lp2-what-is-subtitle" style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>
                É uma Campanha de Campanhas que:
              </h3>
              <ul className="lp2-what-is-intro-list" style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                <li>Dialoga com ciência, Justiça climática, educomunicação</li>
                <li>Fortalece educação, Prevenção de riscos e adaptação climática</li>
                <li>Apoia e reconhece Comunidades para ação transformadora</li>
              </ul>

              {/* Nova seção: vamos juntos transformar conhecimento em ação */}
              <div className="lp2-transform-section" style={{ marginTop: '-20px' }}>
                <h2 className="lp2-transform-title font-mighty-souly" style={{ 
                  fontSize: '2.8rem', 
                  fontWeight: 'normal', 
                  color: '#435ba5',
                  textAlign: 'center',
                  marginBottom: '2rem',
                  lineHeight: '1.1',
                  letterSpacing: '-0.02em',
                  textTransform: 'none'
                }}>
                  vamos juntos transformar<br />conhecimento em ação
                </h2>

                {/* Lista de grupos-alvo com destaque amarelo */}
                <div className="lp2-target-groups font-chinese-rocks" style={{ marginBottom: '3rem', textAlign: 'center' }}>
                  <div style={{ 
                    display: 'inline-block', 
                    backgroundColor: '#fdd40a', 
                    padding: '0.8rem 1rem 0rem 1rem',
                    margin: '0.5rem 0.3rem',
                    fontWeight: 'bold',
                    fontSize: '1.6rem',
                    color: '#000',
                    textTransform: 'uppercase',
                    lineHeight: '1.3',
                    position: 'relative',
                    paddingBottom: '-3px',
                    overflow: 'visible'
                  }}>
                    <span style={{ position: 'relative', top: '3px' }}>
                      LIDERANÇAS COMUNITÁRIAS
                    </span>
                  </div>
                  <br />
                  <div style={{ 
                    display: 'flex', 
                    gap: '1rem',
                    margin: '0.5rem 0',
                    flexWrap: 'wrap',
                    justifyContent: 'center'
                  }}>
                    <div style={{ 
                      display: 'inline-block',
                      backgroundColor: '#fdd40a', 
                      padding: '0.8rem 1rem 0rem 1rem',
                      fontWeight: 'bold',
                      fontSize: '1.6rem',
                      color: '#000',
                      textTransform: 'uppercase',
                      lineHeight: '1.3',
                      position: 'relative',
                      margin: '0 0.3rem',
                      overflow: 'visible'
                    }}>
                      <span style={{ position: 'relative', top: '3px' }}>
                        MOBILIZADORES SOCIAIS
                      </span>
                    </div>
                    <div style={{ 
                      display: 'inline-block',
                      backgroundColor: '#fdd40a', 
                      padding: '0.8rem 1rem 0rem 1rem',
                      fontWeight: 'bold',
                      fontSize: '1.6rem',
                      color: '#000',
                      textTransform: 'uppercase',
                      lineHeight: '1.3',
                      position: 'relative',
                      margin: '0 0.3rem',
                      overflow: 'visible'
                    }}>
                      <span style={{ position: 'relative', top: '3px' }}>
                        EDUCADORES
                      </span>
                    </div>
                  </div>
                  <div style={{ 
                    display: 'inline-block', 
                    backgroundColor: '#fdd40a', 
                    padding: '0.8rem 1rem 0rem 1rem',
                    margin: '0.5rem 0.3rem',
                    fontWeight: 'bold',
                    fontSize: '1.6rem',
                    color: '#000',
                    textTransform: 'uppercase',
                    lineHeight: '1.3',
                    position: 'relative',
                    overflow: 'visible'
                  }}>
                    <span style={{ position: 'relative', top: '3px' }}>
                      GESTORES E FUNCIONÁRIOS PÚBLICOS
                    </span>
                  </div>
                </div>

                {/* Seção: você já reparou? */}
                <div className="lp2-climate-question" style={{ marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div>
                      <div className="font-mighty-souly" style={{ 
                        fontSize: '3rem', 
                        fontWeight: 'normal', 
                        color: '#c02125',
                        lineHeight: '1'
                      }}>
                        você já
                      </div>
                      <div className="font-mighty-souly" style={{ 
                        fontSize: '2rem', 
                        fontWeight: 'normal', 
                        color: '#c02125',
                        lineHeight: '1'
                      }}>
                        reparou?
                      </div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ 
                        fontSize: '1.5rem', 
                        color: '#000',
                        margin: '0 0 1rem 0',
                        textAlign: 'center'
                      }}>
                        O clima está mudando e traz mais
                      </p>

                      {/* Ícones de impactos climáticos */}
                      <div className="lp2-climate-impacts" style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(4, 1fr)', 
                        gap: '1rem',
                        marginTop: '1rem'
                      }}>
                        <div style={{ textAlign: 'center' }}>
                          <img 
                            src={getImagePath('/img/inundacao.png')} 
                            alt="Inundações" 
                            style={{ width: '80px', height: '80px', objectFit: 'contain' }}
                          />
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <img 
                            src={getImagePath('/img/deslizamento.png')} 
                            alt="Deslizamentos" 
                            style={{ width: '110px', height: '80px', objectFit: 'contain' }}
                          />
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <img 
                            src={getImagePath('/img/onda calor.png')} 
                            alt="Ondas de Calor" 
                            style={{ width: '110px', height: '80px', objectFit: 'contain' }}
                          />
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <img 
                            src={getImagePath('/img/secas.png')} 
                            alt="Secas" 
                            style={{ width: '65px', height: '80px', objectFit: 'contain' }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Call to Action: Participe! */}
                <div className="lp2-participate-cta" style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  gap: '1rem',
                  marginTop: 'calc(2rem + 10px)'
                }}>
                  <img 
                    src={getImagePath('/img/megafone.png')} 
                    alt="Megafone" 
                    style={{ width: '50px', height: '50px' }}
                  />
                  <div className="font-mighty-souly" style={{ 
                    fontSize: '3rem', 
                    fontWeight: 'normal', 
                    color: '#4ab848'
                  }}>
                    Participe!
                  </div>
                </div>
              </div>
            </div>

            {/* Lado direito: Imagem (vídeo comentado para uso futuro) */}
            <div className="lp2-what-is-image" ref={videoContainerRef}>
              {/* <iframe
                className="lp2-what-is-video"
                src="https://www.youtube.com/embed/8mCpsohesNQ"
                title="Campanha Aprender para Prevenir - Prevenção de desastres"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
              ></iframe> */}
              <img
                src={getImagePath('/img/cidade-15.png')}
                alt="Campanha Aprender para Prevenir - Prevenção de desastres"
                className="lp2-what-is-img"
          />
        </div>
          </div>
        </div>
      </section>

      {/* TERCEIRO BLOCO: estatísticas em 3 colunas */}
      {/* <section className="lp2-stats-new" ref={statsSectionRef}>
        <div className="lp2-stat-item lp2-stat-item-1">
          <img 
            src={getImagePath('/img/globo_alerta.png')} 
            alt="Globo de alerta" 
            className="lp2-stat-icon-img" 
          />
          <h3 className="lp2-stat-number">3,3 BILHÕES</h3>
          <p className="lp2-stat-desc">
            de <strong>pessoas</strong> vivem a crise climática
          </p>
          <small className="lp2-stat-source">fonte: IPCC AR6</small>
        </div>
        <div className="lp2-stat-item lp2-stat-item-2">
          <img 
            src={getImagePath('/img/casa.png')} 
            alt="Casa" 
            className="lp2-stat-icon-img" 
          />
          <h3 className="lp2-stat-number">+2,4 MIL</h3>
          <p className="lp2-stat-desc">
            <strong>escolas</strong> estão em áreas de risco no Brasil
          </p>
          <small className="lp2-stat-source">fonte: Cemaden</small>
        </div>
        <div className="lp2-stat-item lp2-stat-item-3">
          <img 
            src={getImagePath('/img/mochila.png')} 
            alt="Mochila" 
            className="lp2-stat-icon-img" 
          />
          <h3 className="lp2-stat-number">1,17 MILHÃO</h3>
          <p className="lp2-stat-desc">
            de <strong>estudantes</strong> brasileiros tiveram as aulas interrompidas em 2024 por
            eventos climáticos extremos
          </p>
          <small className="lp2-stat-source">fonte: Unicef</small>
        </div>
      </section> */}

      {/* BLOCO: A Campanha */}
      <section className="lp2-about-campaign">
        <div style={{ 
          backgroundColor: '#f6cc18',
          padding: '1.5rem 0',
          position: 'relative',
          width: '100%'
        }}>
          <div style={{ 
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 2rem'
          }}>
            {/* Título dentro do bloco amarelo */}
            <div style={{ 
              marginBottom: '1rem',
              textAlign: 'center'
            }}>
              <h2 className="font-chinese-rocks" style={{ 
                fontSize: '2.2rem',
                fontWeight: 'bold',
                color: '#000',
                textTransform: 'uppercase',
                marginBottom: '0.3rem',
                lineHeight: '1.2'
              }}>
                ORGANIZE UMA CAMPANHA<br />
                COM A SUA COMUNIDADE
              </h2>
              <p className="font-chinese-rocks" style={{ 
                fontSize: '1.4rem',
                fontWeight: 'bold',
                color: '#000',
                textTransform: 'uppercase'
              }}>
                EM 4 PASSOS:
              </p>
            </div>
            
            {/* Lista numerada de passos */}
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1rem 2rem',
              maxWidth: '1000px',
              margin: '0 auto'
            }}>
            {/* Passo 1: CONHECER */}
            <div style={{ 
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.8rem'
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '0.2rem' }}>
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              <div style={{ flex: 1 }}>
                <div style={{ 
                  display: 'inline-block',
                  backgroundColor: '#fff',
                  padding: '0.4rem 0.8rem',
                  marginBottom: '0.4rem'
                }}>
                  <span className="font-chinese-rocks" style={{ 
                    fontWeight: 'bold',
                    fontSize: '1.2rem',
                    color: '#000',
                    textTransform: 'uppercase'
                  }}>1. CONHECER</span>
                </div>
                <p style={{ 
                  fontSize: '1rem',
                  color: '#000',
                  margin: 0,
                  lineHeight: '1.4'
                }}>
                  Identifique quais são os riscos da sua comunidade e onde eles estão.
                </p>
              </div>
            </div>

            {/* Passo 2: CRIAR */}
            <div style={{ 
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.8rem'
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '0.2rem' }}>
                <path d="M9 21h6M12 3v1M12 20v2"/>
                <path d="M12 4a5 5 0 0 1 5 5c0 2-1.5 3.5-3 4.2L13 18h-2l-1-4.8C9.5 12.5 8 11 8 9a5 5 0 0 1 4-5z"/>
              </svg>
              <div style={{ flex: 1 }}>
                <div style={{ 
                  display: 'inline-block',
                  backgroundColor: '#fff',
                  padding: '0.4rem 0.8rem',
                  marginBottom: '0.4rem'
                }}>
                  <span className="font-chinese-rocks" style={{ 
                    fontWeight: 'bold',
                    fontSize: '1.2rem',
                    color: '#000',
                    textTransform: 'uppercase'
                  }}>2. CRIAR</span>
                </div>
                <p style={{ 
                  fontSize: '1rem',
                  color: '#000',
                  margin: 0,
                  lineHeight: '1.4'
                }}>
                  Faça uma campanha que engaje as pessoas para proteger a comunidade.
                </p>
              </div>
            </div>

            {/* Passo 3: COMUNICAR */}
            <div style={{ 
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.8rem'
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '0.2rem' }}>
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                <circle cx="9" cy="12" r="1" fill="#000"/>
                <circle cx="12" cy="12" r="1" fill="#000"/>
                <circle cx="15" cy="12" r="1" fill="#000"/>
              </svg>
              <div style={{ flex: 1 }}>
                <div style={{ 
                  display: 'inline-block',
                  backgroundColor: '#fff',
                  padding: '0.4rem 0.8rem',
                  marginBottom: '0.4rem'
                }}>
                  <span className="font-chinese-rocks" style={{ 
                    fontWeight: 'bold',
                    fontSize: '1.2rem',
                    color: '#000',
                    textTransform: 'uppercase'
                  }}>3. COMUNICAR</span>
                </div>
                <p style={{ 
                  fontSize: '1rem',
                  color: '#000',
                  margin: 0,
                  lineHeight: '1.4'
                }}>
                  Divulgue sua campanha de diferentes formas e envolva o maior número de pessoas.
                </p>
              </div>
            </div>

            {/* Passo 4: INSCREVER */}
            <div style={{ 
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.8rem'
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '0.2rem' }}>
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <path d="M9 9h6M9 12h6M9 15h4"/>
                <circle cx="18" cy="6" r="1"/>
              </svg>
              <div style={{ flex: 1 }}>
                <div style={{ 
                  display: 'inline-block',
                  backgroundColor: '#fff',
                  padding: '0.4rem 0.8rem',
                  marginBottom: '0.4rem'
                }}>
                  <span className="font-chinese-rocks" style={{ 
                    fontWeight: 'bold',
                    fontSize: '1.2rem',
                    color: '#000',
                    textTransform: 'uppercase'
                  }}>4. INSCREVER</span>
                </div>
                <p style={{ 
                  fontSize: '1rem',
                  color: '#000',
                  margin: 0,
                  lineHeight: '1.4'
                }}>
                  Registre todas as ações e inscreva sua campanha no site da Campanha Nacional!
                </p>
              </div>
            </div>
          </div>

            {/* Call to Action */}
            <div style={{ 
              marginTop: '1.5rem',
              textAlign: 'center'
            }}>
              <p className="font-chinese-rocks" style={{ 
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#183EFF',
                textTransform: 'uppercase',
                lineHeight: '1.2'
              }}>
                VAMOS JUNTOS TRANSFORMAR<br />
                CONHECIMENTO EM AÇÃO!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO: Por que participar da campanha */}
      <section className="lp2-why-participate">
        <div className="lp2-why-participate-content">
          {/* Banner amarelo com estilo recortado */}
          <div className="lp2-why-banner-wrapper">
            <div className="lp2-why-yellow-banner">
              <h2 className="lp2-why-banner-text">
                Por que participar da campanha
              </h2>
            </div>
          </div>

          {/* Lista de pontos */}
          <div className="lp2-why-points">
            <ul className="lp2-why-list">
              <li>Preparar pessoas para agir antes do risco virar perigo</li>
              <li>Fortalecer escolas, universidades e comunidades</li>
              <li>Agir antes do desastre e proteger vidas no território</li>
              <li>Integrar uma rede nacional que aprende e age frente às mudanças climáticas</li>
            </ul>
          </div>
        </div>
        <img 
          src={getImagePath('/img/cinza_terra.png')} 
          alt="Marca d'água" 
          className="lp2-why-watermark"
        />
      </section>

      {/* SEÇÃO: Reconhecimento e incentivos */}
      <section className="lp2-recognition" ref={recognitionSectionRef}>
        <div className="lp2-recognition-content">
          <h2 className="lp2-recognition-title">Reconhecimento e incentivos</h2>
          
          <div className="lp2-recognition-grid">
            <div className="lp2-recognition-item lp2-recognition-item-1">
              <div className="lp2-recognition-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="#FFD000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <h3 className="lp2-recognition-item-title">Prêmios</h3>
              <p className="lp2-recognition-item-desc">Instituições participantes concorrem a prêmios</p>
            </div>

            <div className="lp2-recognition-item lp2-recognition-item-2">
              <div className="lp2-recognition-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="#183EFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
              </div>
              <h3 className="lp2-recognition-item-title">Incentivos Financeiros</h3>
              <p className="lp2-recognition-item-desc">Professores podem receber incentivos financeiros</p>
            </div>

            <div className="lp2-recognition-item lp2-recognition-item-3">
              <div className="lp2-recognition-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="#00D000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <h3 className="lp2-recognition-item-title">Visibilidade Nacional</h3>
              <p className="lp2-recognition-item-desc">Ações ganham visibilidade nacional</p>
            </div>

            <div className="lp2-recognition-item lp2-recognition-item-4">
              <div className="lp2-recognition-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="#FF0000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <h3 className="lp2-recognition-item-title">Rede Nacional</h3>
              <p className="lp2-recognition-item-desc">A instituição passa a integrar uma rede nacional de prevenção dos riscos de desastres socioambientais</p>
            </div>
          </div>
          
          <p className="lp2-recognition-cta">Venha Fazer Parte Dessa Campanha!</p>
        </div>
      </section>

      {/* BLOCO HERO DUPLICADO NO FINAL */}
      <section className="lp2-hero">
        {/* Lado esquerdo: foto grande + logo e foto de apoio embaixo */}
        <div className="lp2-hero-bg-container">
          <img src={getImagePath('/img/teste-2.png')} alt="Cidades sem risco" className="lp2-hero-bg" />
          <div className="lp2-logo-container">
            <img src={getImagePath('/img/logo.png')} alt="Cidades sem Risco" className="lp2-hero-logo" />
          </div>
          <div className="lp2-footer-images-row">
              <img
                src={getImagePath('/img/rodape_2.png')}
                alt="Parcerias e apoiadores da campanha"
                className="lp2-hero-footer-img2"
              />
              <img
                src={getImagePath('/img/rodape_1.png')}
                alt="Parcerias e apoiadores da campanha"
                className="lp2-hero-footer-img"
              />
          </div>
        </div>

        {/* Lado direito: bloco amarelo com formulário */}
        <div className="lp2-hero-right">
          <div className="lp2-form-card">
            <h2 className="lp2-form-title">Participe da Campanha</h2>
            <form className="lp2-form" onSubmit={handleSubmit}>
              <div className="lp2-input">
                <input
                  name="nomeResponsavel"
                  value={form.nomeResponsavel}
                  onChange={handleChange}
                  placeholder="Nome*"
                  required
                />
              </div>
              <div className="lp2-input">
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="E-mail*"
                  required
                />
              </div>
              <div className="lp2-input">
                <input
                  name="municipio"
                  value={form.municipio}
                  onChange={handleChange}
                  placeholder="Cidade*"
                  required
                />
              </div>
              <div className="lp2-input">
                <select
                  name="cidadeEstado"
                  value={form.cidadeEstado}
                  onChange={handleChange}
                  className="lp2-select"
                  required
                >
                  {estadosBrasileiros.map((estado) => (
                    <option key={estado.value} value={estado.value}>
                      {estado.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="lp2-buttons-container">
                <button className="lp2-button lp2-button-sidebar" type="submit">
                EU QUERO!
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Alerta customizado */}
      {showAlert && (
        <div className="lp2-alert-overlay" onClick={closeAlert}>
          <div className="lp2-alert-box" onClick={(e) => e.stopPropagation()}>
            <p className="lp2-alert-message">{alertMessage}</p>
            <button className="lp2-alert-button" onClick={closeAlert}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Sidebar lateral (Pop-up fixo à direita) */}
      {showSidebar && (
        <div className="lp2-sidebar-overlay">
          <div className="lp2-sidebar-content">
            <div className="lp2-sidebar-logo">
              <img src={getImagePath('/img/logo.png')} alt="Logo Cemaden Educação" />
            </div>
            <p className="lp2-sidebar-text">
              Fique por dentro de todas as novidades da campanha! Acesse nosso canal do WhatsApp onde você terá notícias em tempo real, alertas de novos conteúdos e muito mais.
            </p>
            <div className="lp2-sidebar-buttons">
              <button className="lp2-sidebar-whatsapp-btn" onClick={handleWhatsAppClick}>
                <span className="lp2-sidebar-whatsapp-text">
                  Acesse aqui o canal do<br />WhatsApp
                </span>
              </button>
              <button className="lp2-sidebar-sair-btn" onClick={handleSairClick}>
                Sair
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
