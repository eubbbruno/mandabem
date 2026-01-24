import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { formatPrice, formatDate, isChallengeActive } from '@/lib/scoring'
import { Button } from '@/components/Button'
import Link from 'next/link'
import { 
  MapPin, 
  Calendar, 
  Trophy, 
  FileText, 
  Target, 
  Users, 
  Sparkles,
  Clock,
  CheckCircle2,
  Flame,
  ArrowLeft,
  TrendingUp,
  Award
} from 'lucide-react'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ChallengePage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Busca detalhes do desafio
  const { data: challenge }: { data: any } = await supabase
    .from('challenges')
    .select(`
      *,
      locations (
        id,
        name,
        address,
        city
      )
    `)
    .eq('id', id)
    .single()

  if (!challenge) {
    notFound()
  }

  // Busca top 10 do ranking
  const { data: topSubmissions }: { data: any } = await supabase
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
    .limit(10)

  const isActive = isChallengeActive(challenge.starts_at, challenge.ends_at)
  const rules = Array.isArray(challenge.rules) ? challenge.rules : []

  const statusConfig = {
    active: { icon: Flame, label: 'Rolando agora', color: 'from-accent-500 to-accent-600' },
    evaluating: { icon: Clock, label: 'Em avaliação', color: 'from-secondary-400 to-secondary-500' },
    finished: { icon: CheckCircle2, label: 'Finalizado', color: 'from-gray-400 to-gray-500' }
  }

  const config = statusConfig[challenge.status as keyof typeof statusConfig] || statusConfig.active
  const StatusIcon = config.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Back Button */}
      <div className="container pt-8">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span className="font-medium">Voltar aos desafios</span>
        </Link>
      </div>

      {/* Hero Section */}
      <section className="container py-12">
        <div className="card p-8 md:p-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column */}
            <div className="flex-1 space-y-6">
              {/* Status Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-white to-gray-50 border-2 border-gray-200 shadow-soft">
                <StatusIcon className="h-5 w-5 text-primary-600" />
                <span className="font-semibold text-gray-700">{config.label}</span>
              </div>

              {/* Title */}
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  {challenge.title}
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  {challenge.description}
                </p>
              </div>

              {/* Theme Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-secondary-50 to-accent-50 border border-secondary-200">
                <Sparkles className="h-4 w-4 text-secondary-600" />
                <span className="font-semibold text-gray-700">{challenge.theme}</span>
              </div>

              {/* Location */}
              <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50">
                <MapPin className="h-5 w-5 text-primary-500 mt-0.5" />
                <div>
                  <div className="font-semibold text-gray-900">{challenge.locations?.name}</div>
                  <div className="text-sm text-gray-600">{challenge.locations?.address}</div>
                  <div className="text-sm text-gray-500">{challenge.locations?.city}</div>
                </div>
              </div>
            </div>

            {/* Right Column - Prize Card */}
            <div className="lg:w-80">
              <div className="card p-8 bg-gradient-to-br from-primary-50 to-accent-50 border-2 border-primary-200 sticky top-24">
                <div className="text-center space-y-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 shadow-strong">
                    <Trophy className="h-8 w-8 text-white" />
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-gray-600 mb-2">Prêmio Total</div>
                    <div className="text-5xl font-bold gradient-text mb-4">
                      {formatPrice(challenge.prize)}
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="space-y-3 pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Início</span>
                      <span className="font-semibold text-gray-900">{formatDate(challenge.starts_at)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Término</span>
                      <span className="font-semibold text-gray-900">{formatDate(challenge.ends_at)}</span>
                    </div>
                  </div>

                  {/* CTA */}
                  {challenge.status === 'active' && (
                    <Link href={`/participar/${challenge.id}`} className="block">
                      <Button size="lg" fullWidth className="shadow-strong">
                        <Sparkles className="h-5 w-5" />
                        Participar Agora
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container pb-12">
        <div className="card p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-100">
              <TrendingUp className="h-5 w-5 text-primary-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Preços por Tentativa</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((attempt) => {
              const price = 7.00 + (2.10 * (attempt - 1))
              return (
                <div key={attempt} className="card p-4 text-center bg-gradient-to-br from-primary-50 to-secondary-50 border border-primary-200">
                  <div className="text-xs font-medium text-gray-600 mb-2">{attempt}ª tentativa</div>
                  <div className="text-2xl font-bold text-primary-600">{formatPrice(price)}</div>
                </div>
              )
            })}
          </div>
          
          <p className="text-sm text-gray-500 mt-4 text-center">
            💡 Tentativas adicionais têm penalidade de 0,5 pontos no score (máximo 2,5 pontos)
          </p>
        </div>
      </section>

      {/* Rules Section */}
      <section className="container pb-12">
        <div className="card p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent-100">
              <FileText className="h-5 w-5 text-accent-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Regras do Desafio</h2>
          </div>
          
          <ul className="space-y-3">
            {rules.map((rule: string, index: number) => (
              <li key={index} className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center mt-0.5">
                  <span className="text-white text-xs font-bold">{index + 1}</span>
                </div>
                <span className="text-gray-700 leading-relaxed">{rule}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Criteria Section */}
      <section className="container pb-12">
        <div className="card p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-secondary-100">
              <Target className="h-5 w-5 text-secondary-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Critérios de Avaliação</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'Estratégia', weight: '30%', color: 'from-primary-500 to-primary-600', desc: 'Planejamento e abordagem' },
              { name: 'Engajamento', weight: '30%', color: 'from-secondary-500 to-secondary-600', desc: 'Capacidade de gerar interesse' },
              { name: 'Adequação', weight: '20%', color: 'from-accent-500 to-accent-600', desc: 'Aderência ao tema' },
              { name: 'Execução', weight: '10%', color: 'from-purple-500 to-purple-600', desc: 'Qualidade técnica' },
              { name: 'Criatividade', weight: '5%', color: 'from-pink-500 to-pink-600', desc: 'Originalidade' },
            ].map((criteria, index) => (
              <div key={index} className="card p-6 hover:shadow-medium transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-gray-900">{criteria.name}</h3>
                  <span className={`px-3 py-1 rounded-lg text-sm font-bold text-white bg-gradient-to-r ${criteria.color}`}>
                    {criteria.weight}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{criteria.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ranking Section */}
      <section className="container pb-16">
        <div className="card p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-yellow-100">
                <Award className="h-5 w-5 text-yellow-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Top 10 Ranking</h2>
            </div>
            <Link href={`/ranking/${challenge.id}`}>
              <Button variant="outline" size="sm">
                Ver ranking completo
              </Button>
            </Link>
          </div>

          {topSubmissions && topSubmissions.length > 0 ? (
            <div className="space-y-3">
              {topSubmissions.map((submission: any, index: number) => {
                const medals = ['🥇', '🥈', '🥉']
                const isTop3 = index < 3
                
                return (
                  <div 
                    key={submission.id}
                    className={`
                      flex items-center justify-between p-4 rounded-xl transition-all
                      ${isTop3 
                        ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 shadow-md' 
                        : 'bg-gray-50 hover:bg-gray-100'
                      }
                    `}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`
                        w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg
                        ${index === 0 ? 'bg-yellow-400 text-yellow-900 shadow-md' : ''}
                        ${index === 1 ? 'bg-gray-300 text-gray-700 shadow-md' : ''}
                        ${index === 2 ? 'bg-orange-400 text-orange-900 shadow-md' : ''}
                        ${index > 2 ? 'bg-gray-200 text-gray-600' : ''}
                      `}>
                        {isTop3 ? medals[index] : index + 1}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{submission.users?.name}</p>
                        <p className="text-xs text-gray-500">
                          {submission.attempt_number}ª tentativa
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-3xl font-bold ${isTop3 ? 'gradient-text' : 'text-primary-600'}`}>
                        {submission.score_final?.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">pontos</p>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">Ainda não há participantes avaliados</p>
              <p className="text-sm">Seja o primeiro a participar!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
