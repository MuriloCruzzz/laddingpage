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
    autorizacao: false,
  })
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [showSidebar, setShowSidebar] = useState(false)
  const statsSectionRef = useRef(null)
  const videoContainerRef = useRef(null)
  const recognitionSectionRef = useRef(null)
  
  // Estados para autocomplete de municípios
  const [allMunicipios, setAllMunicipios] = useState([])
  const [municipios, setMunicipios] = useState([])
  const [municipioSearch, setMunicipioSearch] = useState('')
  const [showMunicipioList, setShowMunicipioList] = useState(false)
  const municipioInputRef = useRef(null)

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

  // Função para buscar municípios por estado usando API do IBGE
  async function fetchMunicipios(estadoSigla) {
    try {
      const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoSigla}/municipios`)
      const data = await response.json()
      const municipiosList = data.map(m => ({ id: m.id, nome: m.nome }))
      setAllMunicipios(municipiosList)
      setMunicipios(municipiosList)
    } catch (error) {
      console.error('Erro ao buscar municípios:', error)
      setAllMunicipios([])
      setMunicipios([])
    }
  }
  
  // Função para buscar municípios quando o usuário digita (a partir de 3 caracteres)
  function handleMunicipioSearch(e) {
    const searchValue = e.target.value
    
    if (!form.cidadeEstado) {
      setMunicipioSearch('')
      setShowMunicipioList(false)
      return
    }
    
    // Permite apenas busca, não escrita livre
    setMunicipioSearch(searchValue)
    
    if (searchValue.length >= 3) {
      const filtered = allMunicipios.filter(m => 
        m.nome.toLowerCase().includes(searchValue.toLowerCase())
      )
      setMunicipios(filtered)
      setShowMunicipioList(filtered.length > 0)
    } else {
      setShowMunicipioList(false)
      setMunicipios(allMunicipios)
      // Limpa o campo de município se tiver menos de 3 caracteres
      if (searchValue.length < 3) {
        setForm(prev => ({ ...prev, municipio: '' }))
      }
    }
  }
  
  // Valida se o município selecionado é válido ao perder o foco
  function handleMunicipioBlur() {
    // Adiciona um pequeno delay para permitir que o clique no item da lista seja processado primeiro
    setTimeout(() => {
      // Se já tem um município selecionado no form, mantém e fecha a lista
      if (form.municipio && form.municipio.trim()) {
        setMunicipioSearch(form.municipio)
        setShowMunicipioList(false)
        return
      }
      
      // Se não tem município no form mas tem no search, verifica se é válido
      if (municipioSearch && municipioSearch.trim()) {
        const isValid = allMunicipios.some(m => m.nome === municipioSearch)
        if (isValid) {
          // Se for válido, atualiza o form
          setForm(prev => ({ ...prev, municipio: municipioSearch }))
        } else {
          // Se não for válido, limpa
          setMunicipioSearch('')
          setForm(prev => ({ ...prev, municipio: '' }))
        }
      }
      setShowMunicipioList(false)
    }, 150)
  }
  
  // Função para selecionar um município
  function selectMunicipio(municipio) {
    setForm(prev => ({ ...prev, municipio: municipio.nome }))
    setMunicipioSearch(municipio.nome)
    setShowMunicipioList(false)
  }
  
  // Fechar lista ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (municipioInputRef.current && !municipioInputRef.current.contains(event.target)) {
        const municipioList = document.querySelector('.lp2-municipio-list')
        if (municipioList && !municipioList.contains(event.target)) {
          setShowMunicipioList(false)
        }
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
  
  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    
    // Quando o estado mudar, limpar município e buscar cidades
    if (name === 'cidadeEstado') {
      setForm(prev => ({ ...prev, municipio: '' }))
      setMunicipioSearch('')
      setAllMunicipios([])
      setMunicipios([])
      setShowMunicipioList(false)
      if (value) {
        fetchMunicipios(value)
      }
    }
  }
  
  // Carregar municípios quando o estado for selecionado
  useEffect(() => {
    if (form.cidadeEstado) {
      fetchMunicipios(form.cidadeEstado)
    }
  }, [form.cidadeEstado])

  function handleSubmit(e) {
    e.preventDefault()
    
    // Rastreia clique no botão
    trackButtonClick()
    
    // Validação dos campos obrigatórios
    const nomeCompleto = (form.nomeResponsavel || '').trim()
    const emailValido = (form.email || '').trim()
    const municipioValido = (form.municipio || '').trim()
    const estadoValido = (form.cidadeEstado || '').trim()
    
    if (!nomeCompleto || !emailValido || !municipioValido || !estadoValido) {
      setAlertMessage('Por favor, preencha todos os campos obrigatórios.')
      setShowAlert(true)
      return
    }

    // Validação de autorização
    if (!form.autorizacao) {
      setAlertMessage('Por favor, aceite os termos de autorização para continuar.')
      setShowAlert(true)
      return
    }

    // Validação de nome completo (mínimo 2 nomes)
    const nomes = nomeCompleto.split(/\s+/).filter(nome => nome.length > 0)
    if (nomes.length < 2) {
      setAlertMessage('Por favor, insira seu nome completo (nome e sobrenome).')
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
            <h2 className="lp2-form-title">Participe dessa campanha</h2>
            <form className="lp2-form" onSubmit={handleSubmit}>
              <div className="lp2-input">
                <input
                  name="nomeResponsavel"
                  value={form.nomeResponsavel}
                  onChange={handleChange}
                  placeholder="Nome Completo*"
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
              {form.cidadeEstado && (
                <div className="lp2-input lp2-municipio-autocomplete">
                  <input
                    ref={municipioInputRef}
                    name="municipio"
                    value={municipioSearch || form.municipio}
                    onChange={handleMunicipioSearch}
                    onBlur={handleMunicipioBlur}
                    onFocus={() => {
                      if (municipioSearch.length >= 3 && municipios.length > 0) {
                        setShowMunicipioList(true)
                      }
                    }}
                    placeholder="Município*"
                    required
                    disabled={!form.cidadeEstado}
                  />
                  {showMunicipioList && municipios.filter(m => 
                    m.nome.toLowerCase().includes(municipioSearch.toLowerCase())
                  ).length > 0 && (
                    <div className="lp2-municipio-list">
                      {municipios
                        .filter(m => m.nome.toLowerCase().includes(municipioSearch.toLowerCase()))
                        .map((municipio) => (
                          <div
                            key={municipio.id}
                            className="lp2-municipio-item"
                            onMouseDown={(e) => {
                              e.preventDefault() // Previne o blur do input
                              selectMunicipio(municipio)
                            }}
                          >
                            {municipio.nome}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}
              <div className="lp2-check">
                <input
                  type="checkbox"
                  name="autorizacao"
                  id="autorizacao"
                  checked={form.autorizacao}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="autorizacao">
                  Autorizo o uso dos meus dados para contato sobre a campanha*
                </label>
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
              ORGANIZE UMA CAMPANHA NA SUA COMUNIDADE
              </h2>
            </div>
          </div>

          <div className="lp2-what-is-main">
            {/* Lado esquerdo: Texto */}
            <div className="lp2-what-is-text">
              <p className="lp2-what-is-intro">
              A Campanha Nacional <strong style={{ color: 'rgb(192, 33, 37)' }}>#AprenderParaPrevenir</strong> Cidades Sem Risco é um chamado para prevenção de risco e adaptação climática. 
              </p>
              <p className="lp2-what-is-intro">
              Busca mobilizar e engajar pessoas e instituições para organizarem uma campanha na sua comunidade.
              </p>

              <h3 className="lp2-what-is-subtitle" style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>
                É uma Campanha de Campanhas que:
              </h3>
              <ul className="lp2-what-is-intro-list" style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                <li>Dialoga com ciência, justiça climática, educação e comunicação.</li>
                <li>Fortalece educação, prevenção de riscos e adaptação climática.</li>
                <li>Apoia e reconhece comunidades para ação transformadora.</li>
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
                <div className="lp2-target-groups font-chinese-rocks">
                  <div className="lp2-target-yellow-block">
                    <span>LIDERANÇAS COMUNITÁRIAS</span>
                  </div>
                  <br />
                  <div style={{ 
                    display: 'flex', 
                    gap: '1rem',
                    margin: '0.5rem 0',
                    flexWrap: 'wrap',
                    justifyContent: 'center'
                  }}>
                    <div className="lp2-target-yellow-block" style={{ margin: '0.5rem 0.3rem' }}>
                      <span>MOBILIZADORES SOCIAIS</span>
                    </div>
                    <div className="lp2-target-yellow-block" style={{ margin: '0.5rem 0.3rem' }}>
                      <span>EDUCADORES</span>
                    </div>
                  </div>
                  <div className="lp2-target-yellow-block">
                    <span>GESTORES E FUNCIONÁRIOS PÚBLICOS</span>
                  </div>
                </div>

                {/* Seção: você já reparou? */}
                <div className="lp2-climate-question" style={{ marginBottom: '2rem' }}>
                  <div className="lp2-climate-question-container" style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div className="lp2-climate-question-text">
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
                    <div className="lp2-climate-question-content" style={{ flex: 1 }}>
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
                        <div className="lp2-climate-impact-deslizamento" style={{ textAlign: 'center' }}>
                          <img 
                            src={getImagePath('/img/deslizamento.png')} 
                            alt="Deslizamentos" 
                            style={{ width: '110px', height: '80px', objectFit: 'contain' }}
                          />
                        </div>
                        <div className="lp2-climate-impact-onda-calor" style={{ textAlign: 'center' }}>
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
      <section className="lp2-about-campaign" aria-labelledby="lp2-about-campaign-heading">
        <div className="lp2-about-campaign-yellow" style={{ 
          backgroundColor: '#f6cc18',
          padding: '1.5rem 0',
          position: 'relative',
          width: '100%'
        }}>
          <div className="lp2-about-campaign-inner" style={{ 
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 2rem'
          }}>
            {/* Título à esquerda */}
            <div className="lp2-about-campaign-title-wrap" style={{ marginBottom: '3rem' }}>
              <h2 id="lp2-about-campaign-heading" className="lp2-about-campaign-heading font-mighty-souly" style={{ 
                fontSize: '3rem',
                fontWeight: 'bold',
                color: '#000',
                textTransform: 'uppercase',
                marginBottom: '1rem',
                lineHeight: '0.9',
                textAlign: 'left',
                letterSpacing: '2px',
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem',
                flexWrap: 'wrap'
              }}>
                <span>ORGANIZE UMA CAMPANHA<br />COM A SUA COMUNIDADE</span>
                <div className="lp2-campaign-white-block font-chinese-rocks lp2-about-campaign-4passos" style={{ fontSize: '2.5rem', marginTop: '2.5rem' }}>
                  <span>EM 4 PASSOS:</span>
                </div>
              </h2>
            </div>
              
            {/* Lista de passos em coluna vertical */}
            <div className="lp2-about-campaign-steps-wrap" style={{ 
              flexDirection: 'column',
              gap: '2rem',
              maxWidth: '800px'
            }}>
              {/* Passo 1: MOBILIZAR - uma linha: ícone | número+título | texto + faixa branca atrás */}
              <div className="lp2-campaign-step-item lp2-campaign-step-item-oneline">
                <div className="lp2-campaign-step-oneline-head">
                  <img
                    src={getImagePath('/img/passos_1.png')}
                    alt="Passo 1"
                    className="lp2-campaign-step-icon"
                  />
                  <div className="lp2-campaign-step-label font-chinese-rocks">
                    <span>1. MOBILIZAR</span>
                  </div>
                </div>
                <p className="lp2-campaign-step-text">
                  pessoas e instituições da comunidade para fazer a campanha.
                </p>
              </div>

              {/* Passo 2: CRIAR - mesma estilização: uma linha | ícone | título | texto + faixa branca */}
              <div className="lp2-campaign-step-item lp2-campaign-step-item-oneline">
                <div className="lp2-campaign-step-oneline-head">
                  <img
                    src={getImagePath('/img/passos_2.png')}
                    alt="Passo 2"
                    className="lp2-campaign-step-icon"
                  />
                  <div className="lp2-campaign-step-label font-chinese-rocks">
                    <span>2. CRIAR</span>
                  </div>
                </div>
                <p className="lp2-campaign-step-text">
                  coletivamente o plano de ação da campanha da comunidade
                </p>
              </div>

              {/* Passo 3: REALIZAR - mesma estilização */}
              <div className="lp2-campaign-step-item lp2-campaign-step-item-oneline">
                <div className="lp2-campaign-step-oneline-head">
                  <img
                    src={getImagePath('/img/passos_3.png')}
                    alt="Passo 3"
                    className="lp2-campaign-step-icon lp2-campaign-step-icon-sm"
                  />
                  <div className="lp2-campaign-step-label font-chinese-rocks">
                    <span>3. REALIZAR</span>
                  </div>
                </div>
                <p className="lp2-campaign-step-text">
                  atividades de mobilização e comunicação da campanha da comunidade
                </p>
              </div>

              {/* Passo 4: INSCREVER - mesma estilização */}
              <div className="lp2-campaign-step-item lp2-campaign-step-item-oneline">
                <div className="lp2-campaign-step-oneline-head">
                  <img
                    src={getImagePath('/img/passos_4.png')}
                    alt="Passo 4"
                    className="lp2-campaign-step-icon lp2-campaign-step-icon-xs"
                  />
                  <div className="lp2-campaign-step-label font-chinese-rocks">
                    <span>4. INSCREVER</span>
                  </div>
                </div>
                <p className="lp2-campaign-step-text">
                  a campanha da comunidade no site da Campanha Nacional.
                </p>
              </div>
            </div>
          </div>
          
        </div>
      </section>
      {/* SEÇÃO: Eixos Temáticos — conteúdo à esquerda, imagem à direita */}
      <section className="lp2-thematic-axes" aria-labelledby="lp2-thematic-axes-heading">
        <div className="lp2-thematic-axes-wrapper">
          <div className="lp2-thematic-axes-content">
            <h2 id="lp2-thematic-axes-heading" className="lp2-thematic-axes-title font-mighty-souly">
              EIXOS TEMÁTICOS
            </h2>
            <ul className="lp2-thematic-axes-list">
              <li className="lp2-thematic-axes-item">
                <span className="lp2-thematic-axes-num" aria-hidden="true">1</span>
                <div className="lp2-thematic-axes-text">
                  <span className="lp2-thematic-axes-label font-mighty-souly">Prevenção começa antes:</span>
                  <span className="lp2-thematic-axes-desc">conhecer o risco para proteger a vida</span>
                </div>
              </li>
              <li className="lp2-thematic-axes-item">
                <span className="lp2-thematic-axes-num" aria-hidden="true">2</span>
                <div className="lp2-thematic-axes-text">
                  <span className="lp2-thematic-axes-label font-mighty-souly">Desastres não são naturais:</span>
                  <span className="lp2-thematic-axes-desc">justiça climática e direito à vida</span>
                </div>
              </li>
              <li className="lp2-thematic-axes-item">
                <span className="lp2-thematic-axes-num" aria-hidden="true">3</span>
                <div className="lp2-thematic-axes-text">
                  <span className="lp2-thematic-axes-label font-mighty-souly">Comunidade no centro:</span>
                  <span className="lp2-thematic-axes-desc">mobilização e ação coletiva</span>
                </div>
              </li>
              <li className="lp2-thematic-axes-item">
                <span className="lp2-thematic-axes-num" aria-hidden="true">4</span>
                <div className="lp2-thematic-axes-text">
                  <span className="lp2-thematic-axes-label font-mighty-souly">Educação que protege:</span>
                  <span className="lp2-thematic-axes-desc">escolas e territórios seguros</span>
                </div>
              </li>
              <li className="lp2-thematic-axes-item">
                <span className="lp2-thematic-axes-num" aria-hidden="true">5</span>
                <div className="lp2-thematic-axes-text">
                  <span className="lp2-thematic-axes-label font-mighty-souly">Ciência e alerta:</span>
                  <span className="lp2-thematic-axes-desc">monitoramento e prevenção</span>
                </div>
              </li>
            </ul>
          </div>
          <div className="lp2-thematic-axes-image-wrap">
            <img
              src={getImagePath('/img/Pessoas_participe.png')}
              alt="Pessoas participando da campanha"
              className="lp2-thematic-axes-image"
              loading="lazy"
            />
          </div>
          
        </div>
        <div className="lp2-why-cta">
            <div className="lp2-why-cta-white-block">
              <p className="lp2-why-cta-text">VENHA FAZER PARTE <br className="lp2-why-cta-br" />DESSA CAMPANHA!</p>
            </div>
          </div>
      </section>

      {/* SEÇÃO: Por que participar da campanha */}
      {/*<section className="lp2-why-participate">
         <div className="lp2-why-participate-content">
          {/* Banner amarelo com estilo recortado 
          <div className="lp2-why-banner-wrapper">
            <div className="lp2-why-yellow-banner">
              <h2 className="lp2-why-banner-text">
                POR QUE PARTICIPAR DA CAMPANHA
              </h2>
            </div>
          </div>

          {/* Lista elaborada de benefícios 
          <div className="lp2-why-benefits-list">
            <div className="lp2-why-benefit-item">
              <div className="lp2-why-benefit-arrow">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>
              <div className="lp2-why-benefit-content">
                <strong className="lp2-why-benefit-label">Pessoas:</strong>
                <span className="lp2-why-benefit-text">Preparar pessoas para agir antes do risco virar perigo</span>
              </div>
            </div>

            <div className="lp2-why-benefit-item">
              <div className="lp2-why-benefit-arrow">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>
              <div className="lp2-why-benefit-content">
                <strong className="lp2-why-benefit-label">Fortalecimento:</strong>
                <span className="lp2-why-benefit-text">Fortalecer escolas, comunidades e seu diálogo com as universidades</span>
              </div>
            </div>

            <div className="lp2-why-benefit-item">
              <div className="lp2-why-benefit-arrow">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>
              <div className="lp2-why-benefit-content">
                <strong className="lp2-why-benefit-label">Prevenção Local:</strong>
                <span className="lp2-why-benefit-text">Agir antes do desastre e proteger vidas no território</span>
              </div>
            </div>

            <div className="lp2-why-benefit-item">
              <div className="lp2-why-benefit-arrow">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>
              <div className="lp2-why-benefit-content">
                <strong className="lp2-why-benefit-label">Rede Nacional:</strong>
                <span className="lp2-why-benefit-text">Integrar uma rede nacional que aprende e age frente às mudanças climáticas</span>
              </div>
            </div>

            <div className="lp2-why-benefit-item">
              <div className="lp2-why-benefit-arrow">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>
              <div className="lp2-why-benefit-content">
                <strong className="lp2-why-benefit-label">Premiação e Reconhecimento:</strong>
                <span className="lp2-why-benefit-text lp2-why-benefit-text-break">Concorrer a prêmios educativos e ser reconhecido pela Campanha realizada com a comunidade!</span>
              </div>
            </div>
          </div>
          
          {/* Call to Action 
          
        </div>
        
        
      </section>*/}

      {/* SEÇÃO: Reconhecimento e incentivos */}
      {/* <section className="lp2-recognition" ref={recognitionSectionRef}>
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
      </section> */}

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
            <h2 className="lp2-form-title">Participe dessa Campanha</h2>
            <form className="lp2-form" onSubmit={handleSubmit}>
              <div className="lp2-input">
                <input
                  name="nomeResponsavel"
                  value={form.nomeResponsavel}
                  onChange={handleChange}
                  placeholder="Nome Completo*"
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
              {form.cidadeEstado && (
                <div className="lp2-input lp2-municipio-autocomplete">
                  <input
                    ref={municipioInputRef}
                    name="municipio"
                    value={municipioSearch || form.municipio}
                    onChange={handleMunicipioSearch}
                    onBlur={handleMunicipioBlur}
                    onFocus={() => {
                      if (municipioSearch.length >= 3 && municipios.length > 0) {
                        setShowMunicipioList(true)
                      }
                    }}
                    placeholder="Município*"
                    required
                    disabled={!form.cidadeEstado}
                  />
                  {showMunicipioList && municipios.filter(m => 
                    m.nome.toLowerCase().includes(municipioSearch.toLowerCase())
                  ).length > 0 && (
                    <div className="lp2-municipio-list">
                      {municipios
                        .filter(m => m.nome.toLowerCase().includes(municipioSearch.toLowerCase()))
                        .map((municipio) => (
                          <div
                            key={municipio.id}
                            className="lp2-municipio-item"
                            onMouseDown={(e) => {
                              e.preventDefault() // Previne o blur do input
                              selectMunicipio(municipio)
                            }}
                          >
                            {municipio.nome}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}
              <div className="lp2-check">
                <input
                  type="checkbox"
                  name="autorizacao"
                  id="autorizacao2"
                  checked={form.autorizacao}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="autorizacao2">
                  Autorizo o uso dos meus dados para contato sobre a campanha*
                </label>
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
