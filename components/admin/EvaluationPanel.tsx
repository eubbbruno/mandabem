'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../Button'
import { Textarea } from '../Textarea'
import { 
  Target, 
  Users, 
  CheckSquare, 
  Wrench, 
  Lightbulb,
  ChevronRight,
  ChevronLeft,
  Save,
  SkipForward,
  Image as ImageIcon,
  FileText,
  Hash,
  Sparkles,
  AlertCircle
} from 'lucide-react'
import { toast } from 'sonner'

interface Submission {
  id: string
  content_type: 'photo' | 'text'
  content_url: string | null
  content_text: string | null
  attempt_number: number
  challenges: {
    id: string
    title: string
    theme: string
  }
  users: {
    name: string
  }
}

interface EvaluationPanelProps {
  submissions: Submission[]
}

export function EvaluationPanel({ submissions }: EvaluationPanelProps) {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Scores
  const [strategy, setStrategy] = useState(5)
  const [engagement, setEngagement] = useState(5)
  const [adequacy, setAdequacy] = useState(5)
  const [execution, setExecution] = useState(5)
  const [creativity, setCreativity] = useState(5)
  const [notes, setNotes] = useState('')

  const currentSubmission = submissions[currentIndex]

  const criteria = [
    { 
      name: 'Estratégia', 
      key: 'strategy', 
      value: strategy, 
      setValue: setStrategy, 
      weight: '30%', 
      icon: Target,
      color: 'primary',
      desc: 'Planejamento e abordagem'
    },
    { 
      name: 'Engajamento', 
      key: 'engagement', 
      value: engagement, 
      setValue: setEngagement, 
      weight: '30%', 
      icon: Users,
      color: 'primary',
      desc: 'Capacidade de gerar interesse'
    },
    { 
      name: 'Adequação', 
      key: 'adequacy', 
      value: adequacy, 
      setValue: setAdequacy, 
      weight: '20%', 
      icon: CheckSquare,
      color: 'secondary',
      desc: 'Aderência ao tema'
    },
    { 
      name: 'Execução', 
      key: 'execution', 
      value: execution, 
      setValue: setExecution, 
      weight: '10%', 
      icon: Wrench,
      color: 'accent',
      desc: 'Qualidade técnica'
    },
    { 
      name: 'Criatividade', 
      key: 'creativity', 
      value: creativity, 
      setValue: setCreativity, 
      weight: '5%', 
      icon: Lightbulb,
      color: 'accent',
      desc: 'Originalidade'
    },
  ]

  const calculatePreviewScore = () => {
    const weighted = 
      (strategy * 0.30) +
      (engagement * 0.30) +
      (adequacy * 0.20) +
      (execution * 0.10) +
      (creativity * 0.05)
    
    const penalty = Math.min((currentSubmission.attempt_number - 1) * 0.5, 2.5)
    return Math.max(weighted - penalty, 0).toFixed(2)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const scores = [strategy, engagement, adequacy, execution, creativity]
      if (scores.some(s => s < 0 || s > 10)) {
        throw new Error('Todos os scores devem estar entre 0 e 10')
      }

      const response = await fetch('/api/admin/evaluations/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId: currentSubmission.id,
          strategy,
          engagement,
          adequacy,
          execution,
          creativity,
          notes
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao salvar avaliação')
      }

      toast.success('Avaliação salva com sucesso!')

      // Reset form
      setStrategy(5)
      setEngagement(5)
      setAdequacy(5)
      setExecution(5)
      setCreativity(5)
      setNotes('')

      // Next submission or refresh
      if (currentIndex < submissions.length - 1) {
        setCurrentIndex(currentIndex + 1)
      } else {
        toast.success('Todas as submissões foram avaliadas!', {
          description: 'Recarregando painel...'
        })
        setTimeout(() => router.refresh(), 1500)
      }
    } catch (err: any) {
      setError(err.message)
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleNext = () => {
    if (currentIndex < submissions.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  if (!currentSubmission) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="card p-6 bg-gradient-to-r from-primary-50 to-accent-50 border-2 border-primary-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-500 shadow-md">
              <Hash className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                Participação {currentIndex + 1} de {submissions.length}
              </p>
              <p className="text-xs text-gray-500">
                {Math.round(((currentIndex + 1) / submissions.length) * 100)}% concluído
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="p-2 rounded-lg hover:bg-white transition-colors disabled:opacity-30"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={currentIndex === submissions.length - 1}
              className="p-2 rounded-lg hover:bg-white transition-colors disabled:opacity-30"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <motion.div 
            className="bg-gradient-to-r from-primary-500 to-accent-500 h-2.5 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / submissions.length) * 100}%` }}
            transition={{ type: 'spring', stiffness: 100 }}
          />
        </div>
      </div>

      {/* Error Alert */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-start gap-3 p-4 bg-red-50 border-2 border-red-200 rounded-xl"
          >
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submission Info */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSubmission.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-6"
        >
          {/* Info Card */}
          <div className="card p-6 bg-gradient-to-br from-secondary-50 to-accent-50 border-2 border-secondary-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">Participante</p>
                <p className="font-bold text-gray-900">{currentSubmission.users.name}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">Desafio</p>
                <p className="font-bold text-gray-900">{currentSubmission.challenges.title}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">Tema</p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-secondary-200">
                  <Sparkles className="h-3.5 w-3.5 text-secondary-600" />
                  <span className="font-semibold text-gray-900 text-sm">{currentSubmission.challenges.theme}</span>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">Tentativa</p>
                <p className="font-bold text-gray-900">#{currentSubmission.attempt_number}</p>
              </div>
            </div>
          </div>

          {/* Content Display */}
          <div className="card p-8">
            <div className="flex items-center gap-3 mb-6">
              {currentSubmission.content_type === 'photo' ? (
                <>
                  <ImageIcon className="h-6 w-6 text-primary-600" />
                  <h3 className="text-xl font-bold text-gray-900">Foto Enviada</h3>
                </>
              ) : (
                <>
                  <FileText className="h-6 w-6 text-primary-600" />
                  <h3 className="text-xl font-bold text-gray-900">Texto Enviado</h3>
                </>
              )}
            </div>

            {currentSubmission.content_type === 'text' && currentSubmission.content_text && (
              <div className="p-6 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200">
                <p className="text-gray-900 whitespace-pre-wrap text-lg leading-relaxed">
                  {currentSubmission.content_text}
                </p>
              </div>
            )}
            
            {currentSubmission.content_type === 'photo' && currentSubmission.content_url && (
              <div className="flex justify-center p-6 bg-gray-50 rounded-xl">
                <img 
                  src={currentSubmission.content_url} 
                  alt="Submissão"
                  className="max-w-full max-h-[500px] rounded-xl shadow-strong"
                />
              </div>
            )}
          </div>

          {/* Evaluation Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="card p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Avaliação por Critérios</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {criteria.map((criterion) => {
                  const Icon = criterion.icon
                  const colorClasses = {
                    primary: 'bg-primary-50 border-primary-200 text-primary-700',
                    secondary: 'bg-secondary-50 border-secondary-200 text-secondary-700',
                    accent: 'bg-accent-50 border-accent-200 text-accent-700',
                  }
                  
                  return (
                    <div key={criterion.key} className={`p-6 rounded-xl border-2 ${colorClasses[criterion.color as keyof typeof colorClasses]}`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5" />
                          <div>
                            <div className="font-bold text-gray-900">{criterion.name}</div>
                            <div className="text-xs text-gray-600">{criterion.desc}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-600">{criterion.weight}</span>
                          <div className="px-3 py-1 rounded-lg bg-white shadow-soft">
                            <span className="text-2xl font-bold text-gray-900">{criterion.value}</span>
                            <span className="text-sm text-gray-500">/10</span>
                          </div>
                        </div>
                      </div>
                      
                      <input
                        type="range"
                        min="0"
                        max="10"
                        step="0.5"
                        value={criterion.value}
                        onChange={(e) => criterion.setValue(parseFloat(e.target.value))}
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-200"
                        style={{
                          background: `linear-gradient(to right, 
                            rgb(249, 115, 22) 0%, 
                            rgb(249, 115, 22) ${criterion.value * 10}%, 
                            rgb(229, 231, 235) ${criterion.value * 10}%, 
                            rgb(229, 231, 235) 100%)`
                        }}
                      />
                      
                      <div className="flex justify-between text-xs text-gray-500 mt-2">
                        <span>0</span>
                        <span>5</span>
                        <span>10</span>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Preview Score */}
              <div className="mt-8 p-6 rounded-xl bg-gradient-to-br from-accent-50 to-secondary-50 border-2 border-accent-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Score Final Estimado</p>
                    <p className="text-xs text-gray-500">
                      Penalidade de tentativas: -{Math.min((currentSubmission.attempt_number - 1) * 0.5, 2.5).toFixed(1)} pontos
                    </p>
                  </div>
                  <div className="text-5xl font-bold gradient-text">
                    {calculatePreviewScore()}
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="card p-8">
              <Textarea
                label="Observações (opcional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder="Comentários sobre a avaliação..."
                helperText="Essas observações são apenas para registro interno"
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                type="submit" 
                loading={loading}
                size="lg"
                fullWidth
                variant="primary"
              >
                <Save className="h-5 w-5" />
                Salvar Avaliação
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleNext}
                disabled={currentIndex >= submissions.length - 1}
                size="lg"
              >
                <SkipForward className="h-5 w-5" />
                Pular
              </Button>
            </div>
          </form>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
