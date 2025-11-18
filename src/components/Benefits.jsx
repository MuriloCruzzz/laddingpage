import React from 'react'

export default function Benefits() {
  return (
    <section className="section benefits" id="beneficios">
      <div className="benefits-container">
        <h2>Benefícios</h2>
        <div className="benefits-grid">
          <div className="benefit">
            <h3>Lista de tarefas</h3>
            <p>Organização das ações e prazos da campanha para facilitar o acompanhamento.</p>
          </div>
          <div className="benefit wide">
            <h3>O Cemaden Educação</h3>
            <p>A autoridade na temática de Educação em Redução de Riscos e Desastres e Educação Ambiental Climática.</p>
          </div>
          <div className="benefit">
            <h3>Urgências e reforço</h3>
            <p>Chamadas para ação e lembretes alinhados às etapas da campanha.</p>
          </div>
          <div className="benefit">
            <h3>Link de entrega</h3>
            <p>Canal centralizado para submissão dos trabalhos.</p>
          </div>
        </div>
      </div>
    </section>
  )
}