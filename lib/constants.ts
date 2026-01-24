/**
 * Constantes da Aplicação MandaBem
 */

export const APP_NAME = 'MandaBem'
export const APP_DESCRIPTION = 'Criatividade que vale prêmio por R$7'
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

// Pricing
export const PRICING = {
  BASE_PRICE: 7.00,
  INCREMENT: 2.10,
  MAX_PENALTY: 2.5,
  PENALTY_PER_ATTEMPT: 0.5,
} as const

// Scoring Weights
export const SCORING_WEIGHTS = {
  STRATEGY: 0.30,
  ENGAGEMENT: 0.30,
  ADEQUACY: 0.20,
  EXECUTION: 0.10,
  CREATIVITY: 0.05,
} as const

// Status
export const CHALLENGE_STATUS = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  EVALUATING: 'evaluating',
  FINISHED: 'finished',
} as const

export const SUBMISSION_STATUS = {
  PENDING_PAYMENT: 'pending_payment',
  PAID: 'paid',
  EVALUATING: 'evaluating',
  EVALUATED: 'evaluated',
} as const

// Content Types
export const CONTENT_TYPES = {
  PHOTO: 'photo',
  TEXT: 'text',
} as const

// Limits
export const LIMITS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_TEXT_LENGTH: 5000,
  MAX_RULES: 20,
  MIN_CHALLENGE_DURATION_HOURS: 1,
  MAX_CHALLENGE_DURATION_DAYS: 30,
} as const

// UI
export const ANIMATION_DURATION = {
  FAST: 150,
  BASE: 200,
  SLOW: 300,
  SLOWER: 500,
} as const

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const

// Messages
export const MESSAGES = {
  SUCCESS: {
    CHALLENGE_CREATED: 'Desafio criado com sucesso!',
    LOCATION_CREATED: 'Local criado com sucesso!',
    EVALUATION_SAVED: 'Avaliação salva com sucesso!',
    PAYMENT_CONFIRMED: 'Pagamento confirmado!',
    SUBMISSION_CREATED: 'Participação enviada com sucesso!',
  },
  ERROR: {
    GENERIC: 'Algo deu errado. Tente novamente.',
    NETWORK: 'Erro de conexão. Verifique sua internet.',
    UNAUTHORIZED: 'Você não tem permissão para esta ação.',
    NOT_FOUND: 'Recurso não encontrado.',
    VALIDATION: 'Verifique os dados e tente novamente.',
  },
} as const

// Social Links (exemplo)
export const SOCIAL_LINKS = {
  INSTAGRAM: 'https://instagram.com/mandabem',
  TWITTER: 'https://twitter.com/mandabem',
  FACEBOOK: 'https://facebook.com/mandabem',
  WHATSAPP: 'https://wa.me/5511999999999',
} as const

// Support
export const SUPPORT = {
  EMAIL: 'suporte@mandabem.com.br',
  PHONE: '(11) 9xxxx-xxxx',
} as const
