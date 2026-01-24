import { z } from 'zod'
import { validateCPF } from './scoring'

/**
 * Schemas de Validação com Zod
 */

// Auth
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  cpf: z.string().refine(validateCPF, 'CPF inválido'),
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
})

// Challenge
export const createChallengeSchema = z.object({
  title: z.string().min(5, 'Título deve ter no mínimo 5 caracteres').max(100),
  description: z.string().min(20, 'Descrição deve ter no mínimo 20 caracteres').max(500),
  theme: z.string().min(3, 'Tema deve ter no mínimo 3 caracteres'),
  prize: z.number().positive('Prêmio deve ser positivo').min(10, 'Prêmio mínimo: R$ 10'),
  locationId: z.string().uuid('Local inválido'),
  startsAt: z.string().datetime('Data de início inválida'),
  endsAt: z.string().datetime('Data de término inválida'),
  rules: z.array(z.string()).min(1, 'Adicione pelo menos uma regra').max(20, 'Máximo 20 regras'),
}).refine(
  (data) => new Date(data.endsAt) > new Date(data.startsAt),
  {
    message: 'Data de término deve ser posterior à data de início',
    path: ['endsAt'],
  }
)

// Location
export const createLocationSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').max(100),
  address: z.string().min(10, 'Endereço deve ter no mínimo 10 caracteres').max(200),
  city: z.string().min(3, 'Cidade deve ter no mínimo 3 caracteres').max(100),
})

// Submission
export const createSubmissionSchema = z.object({
  challengeId: z.string().uuid('Desafio inválido'),
  contentType: z.enum(['photo', 'text'], {
    errorMap: () => ({ message: 'Tipo de conteúdo inválido' }),
  }),
  contentText: z.string().max(5000, 'Texto muito longo (máximo 5000 caracteres)').optional(),
  attemptNumber: z.number().int().positive().min(1),
  paymentAmount: z.number().positive('Valor de pagamento inválido'),
})

// Evaluation
export const createEvaluationSchema = z.object({
  submissionId: z.string().uuid('Submissão inválida'),
  strategy: z.number().min(0, 'Score mínimo: 0').max(10, 'Score máximo: 10'),
  engagement: z.number().min(0, 'Score mínimo: 0').max(10, 'Score máximo: 10'),
  adequacy: z.number().min(0, 'Score mínimo: 0').max(10, 'Score máximo: 10'),
  execution: z.number().min(0, 'Score mínimo: 0').max(10, 'Score máximo: 10'),
  creativity: z.number().min(0, 'Score mínimo: 0').max(10, 'Score máximo: 10'),
  notes: z.string().max(1000, 'Observações muito longas (máximo 1000 caracteres)').optional(),
})

// Payment
export const confirmPaymentSchema = z.object({
  submissionId: z.string().uuid('Submissão inválida'),
  paymentMethod: z.enum(['pix', 'credit_card', 'debit_card'], {
    errorMap: () => ({ message: 'Método de pagamento inválido' }),
  }),
})

// Types
export type LoginInput = z.infer<typeof loginSchema>
export type CreateChallengeInput = z.infer<typeof createChallengeSchema>
export type CreateLocationInput = z.infer<typeof createLocationSchema>
export type CreateSubmissionInput = z.infer<typeof createSubmissionSchema>
export type CreateEvaluationInput = z.infer<typeof createEvaluationSchema>
export type ConfirmPaymentInput = z.infer<typeof confirmPaymentSchema>
