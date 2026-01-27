import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { formatPrice, formatDate } from '@/lib/scoring'
import Link from 'next/link'
import { 
  User, 
  Mail, 
  Send, 
  Clock, 
  CheckCircle2, 
  Eye, 
  CreditCard,
  Trophy,
  MapPin,
  Calendar,
  Hash,
  Image as ImageIcon,
  FileText,
  Award,
  Sparkles,
  ArrowLeft,
  TrendingUp
} from 'lucide-react'

interface PageProps {
  searchParams: Promise<{ success?: string }>
}

export default async function MySubmissionsPage({ searchParams }: PageProps) {
  const params = await searchParams
  
  let userData = null
  let submissions = null
  let user = null

  try {
    const supabase = await createClient()

    // Verifica autenticação
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser) {
      redirect('/')
    }
    user = authUser

    // Busca dados do usuário
    const { data: userDataResult }: { data: any } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()
    userData = userDataResult

    // Busca todas as submissões do usuário
    const { data: submissionsResult }: { data: any } = await supabase
      .from('submissions')
      .select(`
        *,
        challenges (
          id,
          title,
          theme,
          status,
          locations (
            name,
            city
          )
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    submissions = submissionsResult
  } catch (error) {
    console.error('Error loading submissions:', error)
    // Continue rendering with empty data
  }

  const statusConfig = {
    pending_payment: { 
      icon: Clock, 
      label: '⏳ Aguardando pagamento', 
      gradient: 'from-yellow-500 to-orange-600',
      bg: 'from-yellow-50 to-orange-50'
    },
    paid: { 
      icon: CreditCard, 
      label: '💳 Pago - Aguardando avaliação', 
      gradient: 'from-blue-500 to-cyan-600',
      bg: 'from-blue-50 to-cyan-50'
    },
    evaluating: { 
      icon: Eye, 
      label: '👀 Em avaliação', 
      gradient: 'from-purple-500 to-pink-600',
      bg: 'from-purple-50 to-pink-50'
    },
    evaluated: { 
      icon: CheckCircle2, 
      label: '✅ Avaliado', 
      gradient: 'from-green-500 to-emerald-600',
      bg: 'from-green-50 to-emerald-50'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      {/* Back Button */}
      <div className="container pt-8">
        <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border-2 border-gray-200 font-bold text-gray-700 hover:bg-gray-50 transition-all hover:scale-105">
          <ArrowLeft className="h-5 w-5" />
          <span>Voltar</span>
        </Link>
      </div>

      <div className="container py-12">
        {/* Success Message */}
        {params.success && (
          <div className="card-brutal p-8 bg-gradient-to-r from-green-500 to-emerald-600 text-white mb-8 animate-bounce-soft">
            <div className="flex items-start gap-4">
              <div className="text-5xl">🎉</div>
              <div>
                <h3 className="text-2xl font-black mb-2">
                  Participação enviada com sucesso!
                </h3>
                <p className="text-lg font-bold text-white/90">
                  Sua criação será avaliada em breve. Acompanhe o status aqui.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* User Info Card ÉPICO */}
        <div className="card-brutal bg-gradient-to-br from-white to-gray-50 p-8 md:p-12 mb-8">
          <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-500 via-secondary-500 to-accent-500 flex items-center justify-center shadow-neon flex-shrink-0">
              <User className="h-12 w-12 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-display-lg text-gradient-fire mb-6">
                Minhas Participações
              </h1>
              {userData && (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="h-6 w-6 text-primary-500" />
                    <span className="text-xl font-bold text-gray-900">{userData.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-6 w-6 text-secondary-500" />
                    <span className="text-lg font-bold text-gray-700">{userData.email}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="card-brutal p-8 bg-gradient-to-br from-primary-50 to-secondary-50 text-center">
              <div className="text-6xl font-black text-gradient mb-2">
                {submissions?.length || 0}
              </div>
              <div className="text-lg font-bold text-gray-700">Participações</div>
            </div>
          </div>
        </div>

        {/* Submissions List */}
        {submissions && submissions.length > 0 ? (
          <div className="space-y-6">
            {submissions.map((submission: any) => {
              const config = statusConfig[submission.status as keyof typeof statusConfig]
              const StatusIcon = config.icon

              return (
                <div key={submission.id} className="card-brutal bg-white p-8 hover:scale-[1.02] transition-transform">
                  {/* Header */}
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
                    <div className="flex-1">
                      <Link 
                        href={`/desafio/${submission.challenges?.id}`}
                        className="text-3xl font-black text-gradient hover:text-primary-600 transition-colors mb-3 inline-block"
                      >
                        {submission.challenges?.title}
                      </Link>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary-100 to-secondary-100 border-2 border-primary-200">
                          <Sparkles className="h-5 w-5 text-primary-600" />
                          <span className="font-black text-primary-700">{submission.challenges?.theme}</span>
                        </span>
                        <span className="flex items-center gap-2 font-bold text-gray-700">
                          <MapPin className="h-5 w-5 text-primary-500" />
                          {submission.challenges?.locations?.name} • {submission.challenges?.locations?.city}
                        </span>
                      </div>
                    </div>
                    
                    {/* Status Badge ÉPICO */}
                    <div className={`card-brutal px-6 py-4 bg-gradient-to-r ${config.bg} border-2 border-gray-200 text-center`}>
                      <StatusIcon className="h-8 w-8 mx-auto mb-2 text-gray-700" />
                      <span className="font-black text-sm text-gray-900 block">
                        {config.label}
                      </span>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="card-brutal p-6 bg-gradient-to-br from-gray-50 to-white">
                      <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <Hash className="h-5 w-5" />
                        <span className="text-sm font-bold">Tentativa</span>
                      </div>
                      <div className="text-4xl font-black text-gray-900">
                        #{submission.attempt_number}
                      </div>
                    </div>

                    <div className="card-brutal p-6 bg-gradient-to-br from-primary-50 to-secondary-50">
                      <div className="flex items-center gap-2 text-primary-600 mb-2">
                        <CreditCard className="h-5 w-5" />
                        <span className="text-sm font-bold">Valor</span>
                      </div>
                      <div className="text-4xl font-black text-gradient">
                        {formatPrice(submission.payment_amount)}
                      </div>
                    </div>

                    <div className="card-brutal p-6 bg-gradient-to-br from-gray-50 to-white">
                      <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <Calendar className="h-5 w-5" />
                        <span className="text-sm font-bold">Enviado</span>
                      </div>
                      <div className="text-base font-black text-gray-900">
                        {formatDate(submission.created_at)}
                      </div>
                    </div>

                    {submission.status === 'evaluated' && submission.score_final !== null && (
                      <div className="card-brutal p-6 bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300">
                        <div className="flex items-center gap-2 text-yellow-700 mb-2">
                          <Trophy className="h-5 w-5" />
                          <span className="text-sm font-bold">Score</span>
                        </div>
                        <div className="text-5xl font-black text-gradient">
                          {submission.score_final.toFixed(2)}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content Preview */}
                  <div className="border-t-4 border-gray-200 pt-6">
                    <div className="flex items-center gap-2 font-black text-gray-900 mb-4">
                      {submission.content_type === 'photo' ? (
                        <>
                          <ImageIcon className="h-6 w-6 text-primary-500" />
                          <span className="text-lg">📸 Foto enviada</span>
                        </>
                      ) : (
                        <>
                          <FileText className="h-6 w-6 text-secondary-500" />
                          <span className="text-lg">📝 Texto enviado</span>
                        </>
                      )}
                    </div>
                    
                    {submission.content_type === 'text' && submission.content_text && (
                      <div className="card-brutal p-6 bg-gradient-to-br from-gray-50 to-white">
                        <p className="text-gray-700 font-medium text-lg whitespace-pre-wrap line-clamp-3">
                          {submission.content_text}
                        </p>
                      </div>
                    )}
                    
                    {submission.content_type === 'photo' && submission.content_url && (
                      <div className="card-brutal p-4 bg-gradient-to-br from-gray-50 to-white">
                        <img 
                          src={submission.content_url} 
                          alt="Submissão"
                          className="max-w-md rounded-xl shadow-brutal"
                        />
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {submission.status === 'evaluated' && (
                    <div className="border-t-4 border-gray-200 mt-6 pt-6">
                      <Link href={`/ranking/${submission.challenges?.id}`}>
                        <button className="btn-epic px-8 py-4 flex items-center gap-2">
                          <Award className="h-5 w-5" />
                          <span>Ver Ranking Completo</span>
                        </button>
                      </Link>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="card-brutal bg-white p-16 text-center">
            <div className="text-9xl mb-8 animate-bounce-slow">🎨</div>
            <h3 className="text-4xl font-black text-gray-900 mb-4">
              Você ainda não participou de nenhum desafio
            </h3>
            <p className="text-xl text-gray-600 font-bold mb-8 max-w-md mx-auto">
              Que tal mandar bem em algum desafio criativo?
            </p>
            <Link href="/">
              <button className="btn-epic text-xl px-12 py-6 flex items-center gap-3 mx-auto">
                <Sparkles className="h-6 w-6" />
                <span>Ver Desafios Disponíveis</span>
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
