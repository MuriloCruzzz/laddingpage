import React, { useState } from 'react'
import '../styles/LPTeste2.css'

// Helper para caminhos de imagens que funcionam tanto no Vercel quanto via WordPress
// Usa import.meta.env.BASE_URL do Vite para garantir compatibilidade
const getImagePath = (path) => {
  const baseUrl = import.meta.env.BASE_URL || '/'
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  return `${baseUrl}${cleanPath}`
}

export default function LPTeste2() {
  const [form, setForm] = useState({
    nome: '',
    email: '',
    whatsapp: '',
    instituicao: '',
    autorizo: false,
  })
  const [submitted, setSubmitted] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    
    // Validação dos campos obrigatórios
    if (!form.nome || !form.email || !form.autorizo) {
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
    window.location.href = 'https://educacao.cemaden.gov.br/'
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
            <h2 className="lp2-form-title">MOBILIZE SEU TERRITÓRIO. SALVE VIDAS!</h2>
            <form className="lp2-form" onSubmit={handleSubmit}>
              <div className="lp2-input">
                <input
                  name="nome"
                  value={form.nome}
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
                  name="whatsapp"
                  value={form.whatsapp}
                  onChange={handleChange}
                  placeholder="Whatsapp"
                />
              </div>
              <div className="lp2-input">
                <select
                  name="instituicao"
                  value={form.instituicao}
                  onChange={handleChange}
                  className="lp2-select"
                >
                  <option value="">Instituição</option>
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
                  SAIBA COMO
                </button>
              )}
            </form>
          </div>

          <p className="lp2-footer-text">
            Cursos | Webinários | Certificados | Prêmios <br /> e muito mais...
          </p>
        </div>
      </section>

      {/* SEGUNDO BLOCO: faixa amarela com chamada da campanha */}
      <section className="lp2-mobilization">
        <div className="lp2-mobilization-left">
          <img
            src={getImagePath('/img/estudo.jpeg')}
            alt="Material da campanha #AprenderParaPrevenir"
            className="lp2-mobilization-img"
          />
        </div>
        <div className="lp2-mobilization-right">
          <h2 className="lp2-mobilization-title">
            #AprenderParaPrevenir mobiliza agentes de transformação nos territórios.
          </h2>
          <p className="lp2-mobilization-subtitle">Crie e comunique sua campanha!</p>
        </div>
      </section>

      {/* TERCEIRO BLOCO: estatísticas em 3 colunas */}
      <section className="lp2-stats-new">
        <div className="lp2-stat-item">
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
        <div className="lp2-stat-item">
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
        <div className="lp2-stat-item">
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

      {/* QUARTO BLOCO: convite com triângulo amarelo e tags */}
      <section className="lp2-invite">
        <div className="lp2-invite-left">
          <div className="lp2-invite-wedge" />
          <div className="lp2-icon-circle">
            <img 
              src={getImagePath('/img/megafone.png')} 
              alt="Megafone" 
              className="lp2-icon-circle-img" 
            />
          </div>
        </div>
        <div className="lp2-invite-right">
          <div className="lp2-invite-illustration-wrapper">
            <img
              src={getImagePath('/img/teste-1.png')}
              alt="Ilustração de ações da campanha"
              className="lp2-invite-illustration"
            />
          </div>
          <p className="lp2-invite-text">
            A campanha <strong>#AprenderParaPrevenir: Cidades Sem Risco</strong> convida escolas,
            universidades, defesas civis, coletivos, instituições religiosas, a agir por:
          </p>
          <div className="lp2-invite-tags">
            <span className="lp2-tag">justiça climática</span>
            <span className="lp2-tag">resiliência</span>
            <span className="lp2-tag">educação climática</span>
            <span className="lp2-tag">campanha básica</span>
            <span className="lp2-tag">prevenção de desastres</span>
            <span className="lp2-tag">cidadania</span>
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
            <h2 className="lp2-form-title">MOBILIZE SEU TERRITÓRIO. SALVE VIDAS!</h2>
            <form className="lp2-form" onSubmit={handleSubmit}>
              <div className="lp2-input">
                <input
                  name="nome"
                  value={form.nome}
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
                  name="whatsapp"
                  value={form.whatsapp}
                  onChange={handleChange}
                  placeholder="Whatsapp"
                />
              </div>
              <div className="lp2-input">
                <select
                  name="instituicao"
                  value={form.instituicao}
                  onChange={handleChange}
                  className="lp2-select"
                >
                  <option value="">Instituição</option>
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
                  SAIBA COMO
                </button>
              )}
            </form>
          </div>

          <p className="lp2-footer-text">
            Cursos | Webinários | Certificados | Prêmios <br /> e muito mais...
          </p>
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
