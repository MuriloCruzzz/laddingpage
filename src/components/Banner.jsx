import React, { useState } from 'react'

export default function Banner({ submitted, onSubmit }) {
  const [form, setForm] = useState({ nome: '', instituicao: '', email: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.nome || !form.instituicao || !form.email) return
    const apiBase = import.meta.env.VITE_API_BASE || ''
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch(`${apiBase}/api/submit-form`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nomeCompleto: form.nome.trim(),
          email: form.email.trim(),
          estado: 'Não informado',
          municipio: 'Não informado',
          instituicao: form.instituicao.trim(),
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error || 'Falha ao enviar. Tente novamente.')
        return
      }
      try { localStorage.setItem('passou_lp', 'sim') } catch (_) {}
      onSubmit?.()
    } catch (err) {
      setError('Erro de conexão. Verifique sua internet e tente novamente.')
    } finally {
      setSubmitting(false)
    }
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
                <input name="instituicao" placeholder="🏫 Nome da Instituição" value={form.instituicao} onChange={handleChange} required disabled={submitting} />
                <input name="nome" placeholder="👤 Seu nome" value={form.nome} onChange={handleChange} required disabled={submitting} />
                <input name="email" type="email" placeholder="📩 E-mail para contato" value={form.email} onChange={handleChange} required disabled={submitting} />
                {error && <p className="form-error" style={{ color: '#c00', marginTop: '0.5rem', fontSize: '0.9rem' }}>{error}</p>}
                <button type="submit" className="cta-button" disabled={submitting}>
                  {submitting ? 'Enviando...' : '✨ Queremos participar'}
                </button>
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
                <a className="btn-secondary" href="https://educacao.cemaden.gov.br/campanhacidades/" target="_blank" rel="noopener noreferrer">
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