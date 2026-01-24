import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { formatDate } from '@/lib/scoring'
import Link from 'next/link'
import { Button } from '@/components/Button'
import { 
  ArrowLeft, 
  Trophy, 
  Users, 
  TrendingUp, 
  Award,
  Sparkles,
  Target,
  Calendar
} from 'lucide-react'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function RankingPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Busca detalhes do desafio
  const { data: challenge }: { data: any } = await supabase
    .from('challenges')
    .select(`
      *,
      locations (
        name,
        city
      )
    `)
    .eq('id', id)
    .single()

  if (!challenge) {
    notFound()
  }

  // Busca todas as submissões avaliadas
  const { data: submissions }: { data: any } = await supabase
    .from('submissions')
    .select(`
      *,
      users (
        name
      )
    `)
    .eq('challenge_id', id)
    .eq('status', 'evaluated')
    .not('score_final', 'is', null)
    .order('score_final', { ascending: false })

  // Estatísticas
  const totalParticipants = submissions?.length || 0
  const averageScore = submissions?.length 
    ? (submissions.reduce((sum: number, s: any) => sum + (s.score_final || 0), 0) / submissions.length).toFixed(2)
    : '0.00'
  
  const topScore = submissions?.[0]?.score_final?.toFixed(2) || '0.00'

  const statusLabels = {
    active: '🔥 Rolando',
    evaluating: '⏳ Avaliando',
    finished: '✅ Finalizado'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="container pt-8 pb-6">
        <Link href={`/desafio/${id}`} className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6">
          <ArrowLeft className="h-4 w-4" />
          <span className="font-medium">Voltar ao desafio</span>
        </Link>

        <div className="card p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 shadow-strong">
              <Trophy className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Ranking
              </h1>
              <h2 className="text-xl text-gray-600 mb-3">
                {challenge.title}
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Sparkles className="h-4 w-4" />
                  <span>{challenge.theme}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Target className="h-4 w-4" />
                  <span>{challenge.locations?.name} • {challenge.locations?.city}</span>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-accent-100 text-accent-700 font-semibold">
                  {statusLabels[challenge.status as keyof typeof statusLabels]}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <section className="container pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card p-6 bg-gradient-to-br from-primary-50 to-primary-100 border-2 border-primary-200">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary-500 shadow-md">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-600 mb-1">Participantes</div>
                <div className="text-3xl font-bold text-primary-700">{totalParticipants}</div>
              </div>
            </div>
          </div>

          <div className="card p-6 bg-gradient-to-br from-secondary-50 to-secondary-100 border-2 border-secondary-200">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-secondary-500 shadow-md">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-600 mb-1">Score Médio</div>
                <div className="text-3xl font-bold text-secondary-700">{averageScore}</div>
              </div>
            </div>
          </div>

          <div className="card p-6 bg-gradient-to-br from-accent-50 to-accent-100 border-2 border-accent-200">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-accent-500 shadow-md">
                <Award className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-600 mb-1">Maior Score</div>
                <div className="text-3xl font-bold text-accent-700">{topScore}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ranking List */}
      <section className="container pb-16">
        <div className="card p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Classificação Geral</h3>

          {submissions && submissions.length > 0 ? (
            <div className="space-y-3">
              {submissions.map((submission: any, index: number) => {
                const isTop3 = index < 3
                const medalEmojis = ['🥇', '🥈', '🥉']
                
                return (
                  <div 
                    key={submission.id}
                    className={`
                      flex items-center justify-between p-6 rounded-2xl transition-all duration-300
                      ${isTop3 
                        ? 'bg-gradient-to-r from-yellow-50 via-orange-50 to-yellow-50 border-2 border-yellow-300 shadow-medium hover:shadow-strong' 
                        : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                      }
                    `}
                  >
                    <div className="flex items-center gap-6 flex-1">
                      {/* Position */}
                      <div className={`
                        w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-2xl shadow-md
                        ${index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-yellow-900' : ''}
                        ${index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-700' : ''}
                        ${index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-500 text-orange-900' : ''}
                        ${index > 2 ? 'bg-gray-200 text-gray-600' : ''}
                      `}>
                        {isTop3 ? medalEmojis[index] : index + 1}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-lg text-gray-900 mb-1 truncate">
                          {submission.users?.name}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Target className="h-3.5 w-3.5" />
                            Tentativa #{submission.attempt_number}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {formatDate(submission.evaluated_at || submission.created_at)}
                          </span>
                        </div>
                      </div>

                      {/* Score */}
                      <div className="text-right">
                        <p className={`
                          font-bold mb-1
                          ${isTop3 ? 'text-5xl gradient-text' : 'text-4xl text-primary-600'}
                        `}>
                          {submission.score_final?.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500 font-medium">pontos</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
                <Users className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Ainda não há participantes avaliados
              </h3>
              <p className="text-gray-600 mb-6">
                Aguarde as avaliações dos jurados
              </p>
              {challenge.status === 'active' && (
                <Link href={`/participar/${id}`}>
                  <Button size="lg">
                    <Sparkles className="h-5 w-5" />
                    Seja o primeiro a participar
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      {challenge.status === 'active' && submissions && submissions.length > 0 && (
        <section className="container pb-16">
          <div className="card p-8 bg-gradient-to-br from-primary-50 to-accent-50 border-2 border-primary-200 text-center">
            <Sparkles className="h-12 w-12 mx-auto mb-4 text-primary-600" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Quer entrar no ranking?
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Mostre sua criatividade e compete pelos melhores scores!
            </p>
            <Link href={`/participar/${id}`}>
              <Button size="lg">
                Participar deste desafio
              </Button>
            </Link>
          </div>
        </section>
      )}
    </div>
  )
}
