// Funções de cálculo de preço e scoring do MandaBem

/**
 * Calcula o preço progressivo baseado no número de tentativas
 * 1ª tentativa: R$7,00
 * 2ª tentativa: R$9,10
 * 3ª tentativa: R$11,20
 * E assim por diante...
 */
export function calculatePrice(attemptNumber: number): number {
  const basePrice = 7.00
  const increment = 2.10
  return basePrice + (increment * (attemptNumber - 1))
}

/**
 * Formata preço para exibição em BRL
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price)
}

/**
 * Interface para avaliação
 */
export interface Evaluation {
  strategy: number      // 0-10
  engagement: number    // 0-10
  adequacy: number      // 0-10
  execution: number     // 0-10
  creativity: number    // 0-10
}

/**
 * Calcula o score final baseado nas avaliações e número de tentativas
 * Pesos:
 * - Estratégia: 30%
 * - Engajamento: 30%
 * - Adequação: 20%
 * - Execução: 10%
 * - Criatividade: 5%
 * 
 * Penalidade: 0.5 pontos por tentativa adicional (máximo 2.5 = 5%)
 */
export function calculateFinalScore(
  evaluation: Evaluation,
  attemptNumber: number
): number {
  // Calcula score ponderado
  const weighted = 
    (evaluation.strategy * 0.30) +
    (evaluation.engagement * 0.30) +
    (evaluation.adequacy * 0.20) +
    (evaluation.execution * 0.10) +
    (evaluation.creativity * 0.05)

  // Aplica penalidade por tentativas (máximo 5%)
  const penalty = Math.min((attemptNumber - 1) * 0.5, 2.5)
  
  // Garante que o score não seja negativo
  return Math.max(weighted - penalty, 0)
}

/**
 * Calcula média de múltiplas avaliações
 */
export function calculateAverageEvaluation(evaluations: Evaluation[]): Evaluation {
  if (evaluations.length === 0) {
    return {
      strategy: 0,
      engagement: 0,
      adequacy: 0,
      execution: 0,
      creativity: 0
    }
  }

  const sum = evaluations.reduce((acc, evaluation) => ({
    strategy: acc.strategy + evaluation.strategy,
    engagement: acc.engagement + evaluation.engagement,
    adequacy: acc.adequacy + evaluation.adequacy,
    execution: acc.execution + evaluation.execution,
    creativity: acc.creativity + evaluation.creativity
  }), {
    strategy: 0,
    engagement: 0,
    adequacy: 0,
    execution: 0,
    creativity: 0
  })

  const count = evaluations.length

  return {
    strategy: Math.round((sum.strategy / count) * 100) / 100,
    engagement: Math.round((sum.engagement / count) * 100) / 100,
    adequacy: Math.round((sum.adequacy / count) * 100) / 100,
    execution: Math.round((sum.execution / count) * 100) / 100,
    creativity: Math.round((sum.creativity / count) * 100) / 100
  }
}

/**
 * Formata data para exibição em PT-BR
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(d)
}

/**
 * Verifica se um desafio está ativo
 */
export function isChallengeActive(startsAt: string, endsAt: string): boolean {
  const now = new Date()
  const start = new Date(startsAt)
  const end = new Date(endsAt)
  return now >= start && now <= end
}

/**
 * Valida CPF brasileiro
 */
export function validateCPF(cpf: string): boolean {
  cpf = cpf.replace(/[^\d]/g, '')
  
  if (cpf.length !== 11) return false
  if (/^(\d)\1{10}$/.test(cpf)) return false

  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i)
  }
  let digit = 11 - (sum % 11)
  if (digit >= 10) digit = 0
  if (digit !== parseInt(cpf.charAt(9))) return false

  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i)
  }
  digit = 11 - (sum % 11)
  if (digit >= 10) digit = 0
  if (digit !== parseInt(cpf.charAt(10))) return false

  return true
}

/**
 * Formata CPF para exibição
 */
export function formatCPF(cpf: string): string {
  cpf = cpf.replace(/[^\d]/g, '')
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}
