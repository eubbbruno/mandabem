import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { ParticipationForm } from '@/components/ParticipationForm'
import { formatPrice } from '@/lib/scoring'
import { 
  ArrowLeft, 
  Sparkles, 
  MapPin, 
  CreditCard, 
  AlertCircle,
  TrendingUp,
  Trophy,
  Target,
  Info,
  CheckCircle2
} from 'lucide-react'
import Link from 'next/link'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ParticipatePage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Verifica se usuário está logado
  const { data: { user } } = await supabase.auth.getUser()

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

  // Verifica se desafio está ativo
  if (challenge.status !== 'active') {
    redirect(`/desafio/${id}`)
  }

  // Se usuário logado, busca número de tentativas anteriores
  let attemptNumber = 1
  let previousSubmissions = null

  if (user) {
    const { data: userData }: { data: any } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (userData) {
      // Busca tentativas anteriores
      const { data: submissions }: { data: any } = await supabase
        .from('submissions')
        .select('*')
        .eq('challenge_id', id)
        .eq('user_id', user.id)
        .order('attempt_number', { ascending: false })

      previousSubmissions = submissions
      attemptNumber = (submissions?.[0]?.attempt_number || 0) + 1
    }
  }

  const price = 7.00 + (2.10 * (attemptNumber - 1))

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="container pt-8 pb-6">
        <Link href={`/desafio/${id}`} className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span className="font-medium">Voltar ao desafio</span>
        </Link>
      </div>

      <div className="container pb-16">
        <div className="max-w-5xl mx-auto">
          {/* Challenge Info Card */}
          <div className="card p-8 mb-8 bg-gradient-to-br from-white to-gray-50">
            <div className="flex items-start gap-6">
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 shadow-strong flex-shrink-0">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Participar do Desafio
                </h1>
                <h2 className="text-xl text-primary-600 font-semibold mb-3">
                  {challenge.title}
                </h2>
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{challenge.locations?.name} • {challenge.locations?.city}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Target className="h-4 w-4" />
                    <span>{challenge.theme}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Price Card */}
              <div className="card p-8 bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 border-2 border-primary-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <CreditCard className="h-5 w-5" />
                      <span className="text-sm font-medium">
                        {attemptNumber === 1 ? 'Primeira tentativa' : `${attemptNumber}ª tentativa`}
                      </span>
                    </div>
                    <div className="text-5xl font-bold gradient-text">
                      {formatPrice(price)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white shadow-soft">
                      <Trophy className="h-5 w-5 text-primary-500" />
                      <span className="font-bold text-gray-900">{formatPrice(challenge.prize)}</span>
                    </div>
                    <div className="text-xs text-gray-600 mt-2">Prêmio total</div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-primary-200">
                  <p className="text-sm text-gray-600">
                    💳 Pagamento via PIX após envio
                  </p>
                </div>
              </div>

              {/* Previous Attempts Warning */}
              {previousSubmissions && previousSubmissions.length > 0 && (
                <div className="card p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-yellow-500 shadow-md flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-yellow-900 mb-2">
                        Você já participou deste desafio
                      </h3>
                      <p className="text-sm text-yellow-800 mb-4">
                        Você fez {previousSubmissions.length} tentativa(s) anterior(es). 
                        O preço aumenta a cada nova tentativa e há penalidade de 0,5 pontos no score.
                      </p>
                      <div className="space-y-2">
                        {previousSubmissions.map((sub: any) => (
                          <div key={sub.id} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-soft">
                            <div>
                              <p className="font-semibold text-sm text-gray-900">Tentativa #{sub.attempt_number}</p>
                              <p className="text-xs text-gray-600">
                                {sub.status === 'evaluated' && sub.score_final 
                                  ? `Score: ${sub.score_final.toFixed(2)} pontos`
                                  : `Status: ${sub.status}`}
                              </p>
                            </div>
                            <p className="font-bold text-primary-600">{formatPrice(sub.payment_amount)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Participation Form */}
              <div className="card p-8">
                <ParticipationForm 
                  challengeId={id}
                  attemptNumber={attemptNumber}
                  price={price}
                  isLoggedIn={!!user}
                />
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Tips */}
              <div className="card p-6 sticky top-24">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent-100">
                    <Info className="h-5 w-5 text-accent-600" />
                  </div>
                  <h3 className="font-bold text-gray-900">Dicas Rápidas</h3>
                </div>
                <ul className="space-y-3">
                  {[
                    'Leia atentamente as regras do desafio',
                    'Seja criativo e original na sua resposta',
                    'Revise seu conteúdo antes de enviar',
                    'O pagamento é confirmado via PIX',
                    'Você receberá o resultado após avaliação'
                  ].map((tip, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm">
                      <CheckCircle2 className="h-5 w-5 text-accent-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pricing Info */}
              <div className="card p-6 bg-gradient-to-br from-gray-50 to-white">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-100">
                    <TrendingUp className="h-5 w-5 text-primary-600" />
                  </div>
                  <h3 className="font-bold text-gray-900">Preço Progressivo</h3>
                </div>
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((attempt) => {
                    const attemptPrice = 7.00 + (2.10 * (attempt - 1))
                    const isCurrent = attempt === attemptNumber
                    
                    return (
                      <div 
                        key={attempt}
                        className={`
                          flex items-center justify-between p-3 rounded-lg transition-colors
                          ${isCurrent 
                            ? 'bg-primary-100 border-2 border-primary-300' 
                            : 'bg-gray-50'
                          }
                        `}
                      >
                        <span className={`text-sm font-medium ${isCurrent ? 'text-primary-700' : 'text-gray-600'}`}>
                          {attempt}ª tentativa
                        </span>
                        <span className={`font-bold ${isCurrent ? 'text-primary-600' : 'text-gray-900'}`}>
                          {formatPrice(attemptPrice)}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
