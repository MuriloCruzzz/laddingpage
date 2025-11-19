import React from 'react'

export default function Steps() {
  return (
    <section className="section steps" id="como-participar">
      <div className="steps-container">
      <h2>Como Participar</h2>
      <div className="steps-flow">
        <div className="step bubble pink">Inscrição</div>
        <div className="connector"></div>
        <div className="step bubble teal">Planejamento</div>
        <div className="connector"></div>
        <div className="step bubble yellow">Atividades</div>
        <div className="connector"></div>
        <div className="step bubble purple">Entrega dos trabalhos</div>
      </div>
      <p className="hint"><a href="#" target="_blank" rel="noopener noreferrer">Link da entrega dos trabalhos</a></p>
      </div>
    </section>
  )
}