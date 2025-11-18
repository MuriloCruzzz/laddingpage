import React, { useState } from 'react'

export default function Banner() {
  const [form, setForm] = useState({ nome: '', instituicao: '' })
  const [submitted, setSubmitted] = useState(false)
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }
  function handleSubmit(e) {
    e.preventDefault()
    if (!form.nome || !form.instituicao) return
    setSubmitted(true)
  }
  return (
    <section className="section banner">
      <div className="hero">
        <div className="hero-left">
          <img src="/img/logo.png" alt="Logo da campanha" className="hero-logo" />
          <img src="/img/ai-natu2.jpg" alt="Imagem da campanha" className="hero-image" />
        </div>
        <div className="hero-right">
          {!submitted ? (
            <>
              <h3 className="form-title">🚀 Participe da Campanha #AprenderParaPrevenir 2026</h3>
              <p className="form-subtitle">Inscreva sua instituição e faça parte desta iniciativa!</p>
              <form onSubmit={handleSubmit} className="form form-pill">
                <input name="instituicao" placeholder="🏫 Nome da Instituição" value={form.instituicao} onChange={handleChange} required />
                <input name="nome" placeholder="👤 Seu nome" value={form.nome} onChange={handleChange} required />
                <button type="submit" className="cta-button">✨ Queremos participar</button>
              </form>
            </>
          ) : (
            <div className="thanks">
              <p>Obrigada pelo seu interesse! Acesse seu e-mail e confira mais detalhes sobre como sua instituição pode participar!</p>
              <div className="email-preview">
                <p>Olá! Que bom que você se interessou pela campanha. Em breve enviaremos orientações para sua instituição participar.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}