import React, { useState, useEffect, useRef } from 'react'
import '../styles/fonts.css'
import '../styles/colors.css'
import '../styles/LPTeste2.css'

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
    nomeInstituicao: '',
    nomeResponsavel: '',
    email: '',
    cidadeEstado: '',
    tipoInstituicao: '',
    autorizo: false,
  })
  const [submitted, setSubmitted] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const statsSectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const statItems = entry.target.querySelectorAll('.lp2-stat-item')
            statItems.forEach((item, index) => {
              setTimeout(() => {
                item.classList.add('lp2-stat-visible')
              }, index * 200)
            })
            observer.unobserve(entry.target)
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

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    
    // Validação dos campos obrigatórios
    if (!form.nomeInstituicao || !form.nomeResponsavel || !form.email || !form.cidadeEstado || !form.autorizo) {
      setAlertMessage('Por favor, preencha todos os campos obrigatórios e autorize o uso dos dados.')
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

    // Se tudo estiver ok, mostra mensagem de agradecimento e redireciona imediatamente
    setSubmitted(true)

    // Redireciona imediatamente após mostrar a mensagem
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
          <img
            src={getImagePath('/img/rodape.png')}
            alt="Parcerias e apoiadores da campanha"
            className="lp2-hero-footer-img"
          />
        </div>

        {/* Lado direito: bloco amarelo com formulário */}
        <div className="lp2-hero-right">
          <div className="lp2-form-card">
            <h2 className="lp2-form-title">Inscreva sua instituição</h2>
            <form className="lp2-form" onSubmit={handleSubmit}>
              <div className="lp2-input">
                <input
                  name="nomeInstituicao"
                  value={form.nomeInstituicao}
                  onChange={handleChange}
                  placeholder="Nome da instituição*"
                  required
                />
              </div>
              <div className="lp2-input">
                <input
                  name="nomeResponsavel"
                  value={form.nomeResponsavel}
                  onChange={handleChange}
                  placeholder="Nome do responsável*"
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
              <div className="lp2-input">
                <select
                  name="tipoInstituicao"
                  value={form.tipoInstituicao}
                  onChange={handleChange}
                  className="lp2-select"
                >
                  <option value="">Tipo de instituição</option>
                  <option value="Educacional">Educacional</option>
                  <option value="Defesa Civil">Defesa Civil</option>
                  <option value="Religiosa">Religiosa</option>
                  <option value="Sociedade Civil">Sociedade Civil</option>
                  <option value="Governamental">Governamental</option>
                  <option value="Iniciativa Privada">Iniciativa Privada</option>
                </select>
              </div>
              <label className="lp2-check">
                <input
                  type="checkbox"
                  name="autorizo"
                  checked={form.autorizo}
                  onChange={handleChange}
                />
                <span>Autorizo o uso dos dados para contato</span>
              </label>
              {submitted ? (
                <div className="lp2-thank-you">
                  <p className="lp2-thank-you-message">
                    Obrigado pelo seu interesse!<br />
                    Você será redirecionado em instantes...
                  </p>
                </div>
              ) : (
                <button className="lp2-button" type="submit">
                  PARTICIPAR DA CAMPANHA!
                </button>
              )}
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
                O que é a campanha Aprender para Prevenir?
              </h2>
            </div>
          </div>

          <div className="lp2-what-is-main">
            {/* Lado esquerdo: Texto */}
            <div className="lp2-what-is-text">
              <p className="lp2-what-is-intro">
                A campanha <strong>#Aprender para Prevenir</strong> é uma iniciativa nacional de educação voltada à prevenção dos riscos de desastres socioambientais.
              </p>
              <p className="lp2-what-is-description">
                A campanha convida escolas, universidades e outras instituições a desenvolver ações educativas para preparar pessoas e comunidades, ajudando a reconhecer riscos e saber como agir diante de situações de emergência.
              </p>

              <div className="lp2-what-is-divider"></div>

              <h3 className="lp2-what-is-subtitle">O que são desastres socioambientais?</h3>
              <p className="lp2-what-is-description">
                Desastres socioambientais são eventos que impactam diretamente a vida das pessoas, das cidades e dos territórios, muitas vezes intensificados pelas mudanças climáticas e pelas condições locais.
              </p>

              <div className="lp2-what-is-examples">
                <h4 className="lp2-what-is-examples-title">Exemplos:</h4>
                <ul className="lp2-what-is-examples-list">
                  <li>Inundações e alagamentos</li>
                  <li>Enchentes e transbordamento de rios</li>
                  <li>Ondas de calor extremo</li>
                  <li>Ventos muito fortes e queda de árvores</li>
                  <li>Deslizamentos de encostas</li>
                  <li>Incêndios florestais e queimadas</li>
                </ul>
              </div>

              <p className="lp2-what-is-question">
                <strong>Sua instituição está preparada para lidar com situações como essas?</strong>
              </p>
            </div>

            {/* Lado direito: Imagem */}
            <div className="lp2-what-is-image">
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
      <section className="lp2-stats-new" ref={statsSectionRef}>
        <div className="lp2-stat-item lp2-stat-item-1">
          <img 
            src={getImagePath('/img/globo_alerta.png')} 
            alt="Globo de alerta" 
            className="lp2-stat-icon-img" 
          />
          <h3 className="lp2-stat-number">3,3 BILHÕES</h3>
          <p className="lp2-stat-desc">
            de <strong>pessoas</strong> vivem em locais altamente vulneráveis à crise climática
            no mundo
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
            <strong>escolas</strong> em áreas de risco no Brasil
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
      </section>

      {/* BLOCO: A Campanha */}
      <section className="lp2-about-campaign">
        <div className="lp2-about-campaign-content">
          {/* Banner amarelo com estilo recortado */}
          <div className="lp2-campaign-banner-wrapper">
            <div className="lp2-campaign-yellow-banner">
              <h2 className="lp2-campaign-banner-text">
                Como participar da Campanha?
              </h2>
            </div>
          </div>
          
          {/* Passos conectados em linha */}
          <div className="lp2-campaign-steps">
            <div className="lp2-campaign-step lp2-step-1">
              <div className="lp2-step-icon lp2-icon-know">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
              </div>
              <div className="lp2-step-content">
                <h3 className="lp2-step-action">CONHECER</h3>
                <p className="lp2-step-desc">os riscos da sua cidade, bairro, comunidade</p>
              </div>
            </div>

            {/* Seta entre passo 1 e 2 */}
            <div className="lp2-step-arrow lp2-arrow-1-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>

            <div className="lp2-campaign-step lp2-step-2">
              <div className="lp2-step-icon lp2-icon-create">
                <svg viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21h6M12 3v1M12 20v2"/>
                  <path d="M12 4a5 5 0 0 1 5 5c0 2-1.5 3.5-3 4.2L13 18h-2l-1-4.8C9.5 12.5 8 11 8 9a5 5 0 0 1 4-5z"/>
                  <path d="M8 9h8M7 12h10M8 15h8"/>
                </svg>
              </div>
              <div className="lp2-step-content">
                <h3 className="lp2-step-action">CRIAR</h3>
                <p className="lp2-step-desc">a campanha para mobilizar e cuidar da sua comunidade</p>
              </div>
            </div>

            {/* Seta entre passo 2 e 3 */}
            <div className="lp2-step-arrow lp2-arrow-2-3">
              <svg viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>

            <div className="lp2-campaign-step lp2-step-3">
              <div className="lp2-step-icon lp2-icon-communicate">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                  <line x1="12" y1="19" x2="12" y2="23"/>
                  <line x1="8" y1="23" x2="16" y2="23"/>
                  <path d="M8 10c0-2 1-4 4-4s4 2 4 4"/>
                </svg>
              </div>
              <div className="lp2-step-content">
                <h3 className="lp2-step-action">COMUNICAR</h3>
                <p className="lp2-step-desc">a mensagem e compartilhar o conhecimento</p>
              </div>
            </div>

            {/* Seta entre passo 3 e 4 */}
            <div className="lp2-step-arrow lp2-arrow-3-4">
              <svg viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>

            <div className="lp2-campaign-step lp2-step-4">
              <div className="lp2-step-icon lp2-icon-register">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="6" width="20" height="12" rx="2"/>
                  <path d="M6 10h12M6 14h12M6 18h8"/>
                  <circle cx="18" cy="14" r="1"/>
                  <path d="M8 10v-2M8 18v2M16 10v-2M16 18v2"/>
                </svg>
              </div>
              <div className="lp2-step-content">
                <h3 className="lp2-step-action">INSCREVER</h3>
                <p className="lp2-step-desc">a Campanha local na Campanha nacional #AprenderParaPrevenir</p>
              </div>
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
              <li>Contribuir para a prevenção de desastres no território</li>
              <li>Fazer parte de uma rede nacional de prevenção de riscos</li>
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
      <section className="lp2-recognition">
        <div className="lp2-recognition-content">
          <h2 className="lp2-recognition-title">Reconhecimento e incentivos</h2>
          
          <div className="lp2-recognition-grid">
            <div className="lp2-recognition-item">
              <div className="lp2-recognition-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="#FFD000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <h3 className="lp2-recognition-item-title">Prêmios</h3>
              <p className="lp2-recognition-item-desc">Instituições participantes concorrem a prêmios</p>
            </div>

            <div className="lp2-recognition-item">
              <div className="lp2-recognition-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="#183EFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
              </div>
              <h3 className="lp2-recognition-item-title">Incentivos Financeiros</h3>
              <p className="lp2-recognition-item-desc">Professores podem receber incentivos financeiros</p>
            </div>

            <div className="lp2-recognition-item">
              <div className="lp2-recognition-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="#00D000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <h3 className="lp2-recognition-item-title">Visibilidade Nacional</h3>
              <p className="lp2-recognition-item-desc">Ações ganham visibilidade nacional</p>
            </div>

            <div className="lp2-recognition-item">
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
          <img
            src={getImagePath('/img/rodape.png')}
            alt="Parcerias e apoiadores da campanha"
            className="lp2-hero-footer-img"
          />
        </div>

        {/* Lado direito: bloco amarelo com formulário */}
        <div className="lp2-hero-right">
          <div className="lp2-form-card">
            <h2 className="lp2-form-title">Inscreva sua instituição</h2>
            <form className="lp2-form" onSubmit={handleSubmit}>
              <div className="lp2-input">
                <input
                  name="nomeInstituicao"
                  value={form.nomeInstituicao}
                  onChange={handleChange}
                  placeholder="Nome da instituição*"
                  required
                />
              </div>
              <div className="lp2-input">
                <input
                  name="nomeResponsavel"
                  value={form.nomeResponsavel}
                  onChange={handleChange}
                  placeholder="Nome do responsável*"
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
              <div className="lp2-input">
                <select
                  name="tipoInstituicao"
                  value={form.tipoInstituicao}
                  onChange={handleChange}
                  className="lp2-select"
                >
                  <option value="">Tipo de instituição</option>
                  <option value="Educacional">Educacional</option>
                  <option value="Defesa Civil">Defesa Civil</option>
                  <option value="Religiosa">Religiosa</option>
                  <option value="Sociedade Civil">Sociedade Civil</option>
                  <option value="Governamental">Governamental</option>
                  <option value="Iniciativa Privada">Iniciativa Privada</option>
                </select>
              </div>
              <label className="lp2-check">
                <input
                  type="checkbox"
                  name="autorizo"
                  checked={form.autorizo}
                  onChange={handleChange}
                />
                <span>Autorizo o uso dos dados para contato</span>
              </label>
              {submitted ? (
                <div className="lp2-thank-you">
                  <p className="lp2-thank-you-message">
                    Obrigado pelo seu interesse!<br />
                    Você será redirecionado em instantes...
                  </p>
                </div>
              ) : (
                <button className="lp2-button" type="submit">
                  PARTICIPAR DA CAMPANHA!
                </button>
              )}
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
    </div>
  )
}
