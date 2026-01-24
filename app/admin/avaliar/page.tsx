import { createClient } from '@/lib/supabase/server'
import { EvaluationPanel } from '@/components/admin/EvaluationPanel'
import { 
  Eye, 
  Clock, 
  CheckCircle2, 
  TrendingUp,
  Target,
  Users,
  Zap,
  CheckSquare,
  Wrench,
  Lightbulb,
  Info
} from 'lucide-react'

export default async function EvaluatePage() {
  const supabase = await createClient()

  // Busca submissões pagas que ainda não foram avaliadas ou estão em avaliação
  const { data: submissions } = await supabase
    .from('submissions')
    .select(`
      *,
      challenges (
        id,
        title,
        theme,
        status
      ),
      users (
        name
      )
    `)
    .in('status', ['paid', 'evaluating'])
    .order('created_at', { ascending: true })

  // Busca submissões já avaliadas (últimas 20)
  const { data: evaluated } = await supabase
    .from('submissions')
    .select(`
      *,
      challenges (
        id,
        title,
        theme
      ),
      users (
        name
      )
    `)
    .eq('status', 'evaluated')
    .order('evaluated_at', { ascending: false })
    .limit(20)

  const stats = [
    {
      label: 'Aguardando Avaliação',
      value: submissions?.length || 0,
      icon: Clock,
      gradient: 'from-yellow-500 to-yellow-600',
      bg: 'from-yellow-50 to-yellow-100',
    },
    {
      label: 'Avaliadas Recentemente',
      value: evaluated?.length || 0,
      icon: CheckCircle2,
      gradient: 'from-green-500 to-green-600',
      bg: 'from-green-50 to-green-100',
    },
    {
      label: 'Total Processado',
      value: (submissions?.length || 0) + (evaluated?.length || 0),
      icon: TrendingUp,
      gradient: 'from-blue-500 to-blue-600',
      bg: 'from-blue-50 to-blue-100',
    },
  ]

  const criteria = [
    { name: 'Estratégia', weight: '30%', icon: Target, desc: 'Planejamento da solução' },
    { name: 'Engajamento', weight: '30%', icon: Users, desc: 'Capacidade de gerar interesse' },
    { name: 'Adequação', weight: '20%', icon: CheckSquare, desc: 'Aderência ao tema' },
    { name: 'Execução', weight: '10%', icon: Wrench, desc: 'Qualidade técnica' },
    { name: 'Criatividade', weight: '5%', icon: Lightbulb, desc: 'Originalidade' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="container py-12 space-y-8">
        {/* Header */}
        <div className="card p-8 bg-gradient-to-r from-white to-gray-50">
          <div className="flex items-start gap-6">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-500 to-secondary-500 shadow-strong">
              <Eye className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Painel de Avaliação
              </h1>
              <p className="text-gray-600">
                Avalie as participações dos desafios com critérios objetivos
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className={`card p-6 bg-gradient-to-br ${stat.bg} border-2 border-gray-200`}>
                <div className="flex items-center gap-4">
                  <div className={`flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-md`}>
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600 mb-1">{stat.label}</div>
                    <div className="text-4xl font-bold text-gray-900">{stat.value}</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Instructions */}
        <div className="card p-8 bg-gradient-to-br from-accent-50 to-accent-100 border-2 border-accent-200">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-accent-500 shadow-md flex-shrink-0">
              <Info className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg text-gray-900 mb-4">Instruções de Avaliação</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="font-semibold text-gray-900 mb-3">Critérios (0-10):</p>
                  <ul className="space-y-2">
                    {criteria.map((c, i) => {
                      const Icon = c.icon
                      return (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <Icon className="h-4 w-4 text-accent-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">
                            <strong>{c.name} ({c.weight}):</strong> {c.desc}
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-3">Importante:</p>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent-600 flex-shrink-0 mt-0.5" />
                      <span>Avalie com base nos critérios objetivos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent-600 flex-shrink-0 mt-0.5" />
                      <span>Não há dados pessoais sensíveis visíveis</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent-600 flex-shrink-0 mt-0.5" />
                      <span>Tentativas adicionais têm penalidade automática</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent-600 flex-shrink-0 mt-0.5" />
                      <span>Score final é calculado automaticamente</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Evaluation Panel */}
        <div className="card p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Participações para Avaliar</h2>
          {submissions && submissions.length > 0 ? (
            <EvaluationPanel submissions={submissions} />
          ) : (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Tudo em dia!
              </h3>
              <p className="text-gray-600">
                Nenhuma participação aguardando avaliação
              </p>
            </div>
          )}
        </div>

        {/* Recently Evaluated */}
        {evaluated && evaluated.length > 0 && (
          <div className="card p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Avaliadas Recentemente</h2>
            <div className="space-y-3">
              {evaluated.map((submission: any) => (
                <div key={submission.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">{submission.users?.name}</p>
                    <p className="text-sm text-gray-600">
                      {submission.challenges?.title} • {submission.challenges?.theme}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Tentativa #{submission.attempt_number}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold gradient-text">
                      {submission.score_final?.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">pontos</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
