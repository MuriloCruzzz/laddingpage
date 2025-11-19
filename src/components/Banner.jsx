import React, { useState } from 'react'

export default function Banner({ submitted, onSubmit }) {
  const [form, setForm] = useState({ nome: '', instituicao: '', email: '' })
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }
  function handleSubmit(e) {
    e.preventDefault()
    if (!form.nome || !form.instituicao || !form.email) return
    onSubmit?.()
  }
  return (
    <section className="section banner">
      <div className="hero">
        <div className="hero-left">
          <img src="/img/logo.png" alt="Logo da campanha" className="hero-logo" />
          <img src="/img/teste-3.png" alt="Imagem da campanha" className="hero-image" />
        </div>
        <div className="hero-right">
          {!submitted ? (
            <>
              <h3 className="form-title">🚀 Participe da Campanha #AprenderParaPrevenir 2026</h3>
              <p className="form-subtitle">Inscreva sua instituição e faça parte desta iniciativa!</p>
              <form onSubmit={handleSubmit} className="form form-pill">
                <input name="instituicao" placeholder="🏫 Nome da Instituição" value={form.instituicao} onChange={handleChange} required />
                <input name="nome" placeholder="👤 Seu nome" value={form.nome} onChange={handleChange} required />
                <input name="email" type="tel" placeholder="📞 E-mail para contato" value={form.email} onChange={handleChange} required />
                <button type="submit" className="cta-button">✨ Queremos participar</button>
              </form>
            </>
          ) : (
            <div className="thanks">
              <div className="thanks-header">
                <img src="/img/logo.png" alt="Logo da campanha" />
                <div>
                  <h3>Parabéns por querer participar!</h3>
                  <p>Sua instituição foi registrada. Em breve você receberá orientações personalizadas da equipe do Cemaden Educação.  Confira seu e-mail para acessar o material da campanha!</p>
                </div>
              </div>
              <div className="email-preview">
                <a className="btn-secondary" href="https://educacao.cemaden.gov.br/" target="_blank" rel="noopener noreferrer">
                  Voltar para o site do Cemaden Educação
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}