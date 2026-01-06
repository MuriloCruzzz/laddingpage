import React, { useState } from 'react'
import '../styles/LPTeste2.css'

export default function LPTeste2() {
  const [form, setForm] = useState({
    nome: '',
    email: '',
    whatsapp: '',
    instituicao: '',
    autorizo: false,
  })

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    // aqui depois podemos integrar com API / formulário externo
  }

  return (
    <div className="lp2-page">
      {/* PRIMEIRO QUADRANTE: imagem + logo à esquerda / formulário à direita */}
      <section className="lp2-hero">
        {/* Lado esquerdo: foto grande + logo e foto de apoio embaixo */}
        <div className="lp2-hero-bg-container">
          <img src="/img/teste-2.png" alt="Cidades sem risco" className="lp2-hero-bg" />
          <div className="lp2-logo-container">
            <img src="/img/logo.png" alt="Cidades sem Risco" className="lp2-hero-logo" />
          </div>
          <img
            src="/img/rodape.png"
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
                <input
                  name="instituicao"
                  value={form.instituicao}
                  onChange={handleChange}
                  placeholder="Instituição"
                />
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
              <button className="lp2-button" type="submit">
                SAIBA COMO
              </button>
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
            src="/img/teste-3.png"
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
          <div className="lp2-stat-icon lp2-stat-icon--world" />
          <h3 className="lp2-stat-number">3,3 BILHÕES</h3>
          <p className="lp2-stat-desc">
            de <strong>pessoas</strong> vivem em locais altamente vulneráveis à crise climática
            no mundo
          </p>
          <small className="lp2-stat-source">fonte: IPCC AR6</small>
        </div>
        <div className="lp2-stat-item">
          <div className="lp2-stat-icon lp2-stat-icon--schools" />
          <h3 className="lp2-stat-number">+2,4 MIL</h3>
          <p className="lp2-stat-desc">
            <strong>escolas</strong> em áreas de risco no Brasil
          </p>
          <small className="lp2-stat-source">fonte: Cemaden</small>
        </div>
        <div className="lp2-stat-item">
          <div className="lp2-stat-icon lp2-stat-icon--students" />
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
          <div className="lp2-icon-circle" />
        </div>
        <div className="lp2-invite-right">
          <div className="lp2-invite-illustration-wrapper">
            <img
              src="/img/teste-1.png"
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
    </div>
  )
}
