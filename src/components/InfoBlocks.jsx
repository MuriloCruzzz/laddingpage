import React from 'react'

const cards = [
  {
    id: 1,
    title: 'Bloco 2',
    highlight: 'Benefícios',
    subtitle: 'Lista de tarefas',
    description:
      'Organize as ações, prazos e responsáveis da campanha em um checklist compartilhado. Assim, toda a equipe acompanha o progresso e não perde nenhuma etapa.'
  },
  {
    id: 2,
    title: 'Bloco 3',
    highlight: 'O Cemaden Educação',
    subtitle: 'Autoridade',
    description:
      'Conte com a experiência do Cemaden Educação para orientar a jornada. Materiais, webinários e exemplos práticos ajudam a fortalecer as ações na sua comunidade.'
  },
  {
    id: 3,
    title: 'Bloco 4',
    highlight: 'Urgências e reforço',
    subtitle: 'Chamadas para ação',
    description:
      'Receba lembretes alinhados ao cronograma oficial e mensagens prontas para mobilizar estudantes, famílias e parceiros em cada fase da campanha.'
  }
]

export default function InfoBlocks() {
  return (
    <section className="section info-blocks">
      <div className="info-grid">
        {cards.map(card => (
          <article key={card.id} className="info-card">
            <span className="info-pill">{card.title}</span>
            <h2>
              {card.highlight} <span>{card.subtitle}</span>
            </h2>
            <p>{card.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

