import React from 'react'

const steps = [
  {
    id: 1,
    title: 'Inscrição Prévia',
    period: '01/08 a 31/10',
    color: 'verde',
    description:
      'Acesse o topo do site e preencha o formulário de inscrição prévia para manifestar interesse, com o nome da instituição e o e-mail de contato.'
  },
  {
    id: 2,
    title: 'Complete o cadastro',
    color: 'amarelo',
    description:
      'Após a inscrição prévia, você recebe um e-mail com o link para finalizar o cadastro na Rede do Cemaden Educação.'
  },
  {
    id: 3,
    title: 'Escolha da Jornada',
    period: '01/08 a 31/10',
    color: 'azul',
    description:
      'No site, escolha uma das jornadas pedagógicas e defina a atividade da ação com sua turma, mantendo a comunidade escolar informada.'
  },
  {
    id: 4,
    title: 'Entrega dos Trabalhos',
    period: '01/10 a 31/10',
    color: 'vermelho',
    description:
      'Faça login na Rede do Cemaden para enviar as evidências das atividades realizadas e clique em “Inscrever atividade na campanha 2024”.'
  },
  {
    id: 5,
    title: 'Certificado e Premiação',
    color: 'preto',
    description:
      'Avaliação: 01/11 a 08/11. Certificados emitidos entre 15/11 e 15/12. Destaque as ações nas redes usando #AprenderParaPrevenir.'
  }
]

export default function TimelinePage() {
  return (
    <div className="timeline-wrapper">
      <div className="timeline-strip">
        <div className="timeline-paper">
          <header className="timeline-hero">
            <span className="timeline-label">Passo a passo</span>
            <h1>Como Participar</h1>
            <p>
              Use este percurso para acompanhar todas as etapas da campanha e garantir que a sua instituição esteja com tudo em
              dia.
            </p>
          </header>

          <div className="timeline-grid">
            {steps.map((step, index) => (
              <article key={step.id} className={`grid-step ${index % 2 === 0 ? 'even' : 'odd'} ${step.color || ''}`}>
                <span className="grid-step-number">{index + 1}</span>
                <div className="grid-step-body">
                  <div className="grid-step-header">
                    <h2>{step.title}</h2>
                    {step.period && <small>{step.period}</small>}
                  </div>
                  <p>{step.description}</p>
                </div>
              </article>
            ))}
          </div>

          <footer className="timeline-footer">
            <p>
              Precisa de ajuda? Fale com o time do Cemaden Educação em <strong>educacao@cemaden.gov.br</strong> e marque suas ações
              com <strong>#AprenderParaPrevenir</strong>.
            </p>
          </footer>
        </div>
      </div>
    </div>
  )
}

