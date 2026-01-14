// Meta Pixel (Facebook Pixel) - Utilitário de rastreamento

// Substitua 'SEU_PIXEL_ID' pelo ID do seu Meta Pixel
const PIXEL_ID = 'SEU_PIXEL_ID' // Exemplo: '123456789012345'

// Inicializa o Meta Pixel
export function initMetaPixel() {
  if (typeof window === 'undefined') return

  // Verifica se já foi inicializado
  if (window.fbq) return

  // Carrega o script do Meta Pixel
  !(function (f, b, e, v, n, t, s) {
    if (f.fbq) return
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
    }
    if (!f._fbq) f._fbq = n
    n.push = n
    n.loaded = !0
    n.version = '2.0'
    n.queue = []
    t = b.createElement(e)
    t.async = !0
    t.src = v
    s = b.getElementsByTagName(e)[0]
    s.parentNode.insertBefore(t, s)
  })(
    window,
    document,
    'script',
    'https://connect.facebook.net/en_US/fbevents.js'
  )

  // Inicializa o pixel
  window.fbq('init', PIXEL_ID)
  window.fbq('track', 'PageView')
}

// Rastreia visualização de conteúdo (quando a página é carregada)
export function trackPageView() {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'PageView')
  }
}

// Rastreia visualização completa da landing page (scroll até o final)
export function trackViewContent() {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'ViewContent', {
      content_name: 'Landing Page - Aprender para Prevenir',
      content_category: 'Landing Page',
    })
  }
}

// Rastreia início de preenchimento do formulário (quando começa a preencher)
export function trackLeadStart() {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Lead', {
      content_name: 'Formulário - Início de Preenchimento',
      content_category: 'Formulário',
    })
  }
}

// Rastreia clique no botão de submit
export function trackButtonClick() {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Lead', {
      content_name: 'Botão - Participar da Campanha',
      content_category: 'CTA',
    })
  }
}

// Rastreia submissão completa do formulário
export function trackCompleteRegistration(formData) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'CompleteRegistration', {
      content_name: 'Formulário - Registro Completo',
      content_category: 'Formulário',
      value: 1.0,
      currency: 'BRL',
      // Dados adicionais (opcional - respeitando LGPD)
      estado: formData.cidadeEstado || '',
      tipo_instituicao: formData.tipoInstituicao || '',
    })
  }
}

// Rastreia quando o usuário percorre toda a landing page (scroll completo)
export function trackScrollComplete() {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'ViewContent', {
      content_name: 'Landing Page - Scroll Completo',
      content_category: 'Engagement',
    })
  }
}

// Rastreia visualização de seções específicas
export function trackSectionView(sectionName) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', 'ViewSection', {
      section_name: sectionName,
    })
  }
}

