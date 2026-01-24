import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { formatPrice, formatDate } from '@/lib/scoring'
import Link from 'next/link'
import { Button } from '@/components/Button'
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
  Sparkles
} from 'lucide-react'

interface PageProps {
  searchParams: Promise<{ success?: string }>
}

export default async function MySubmissionsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const supabase = await createClient()

  // Verifica autenticação
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/')
  }

  // Busca dados do usuário
  const { data: userData }: { data: any } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  // Busca todas as submissões do usuário
  const { data: submissions }: { data: any } = await supabase
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

  const statusConfig = {
    pending_payment: { 
      icon: Clock, 
      label: 'Aguardando pagamento', 
      color: 'from-yellow-400 to-yellow-500',
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-700'
    },
    paid: { 
      icon: CreditCard, 
      label: 'Pago - Aguardando avaliação', 
      color: 'from-blue-400 to-blue-500',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-700'
    },
    evaluating: { 
      icon: Eye, 
      label: 'Em avaliação', 
      color: 'from-purple-400 to-purple-500',
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      text: 'text-purple-700'
    },
    evaluated: { 
      icon: CheckCircle2, 
      label: 'Avaliado', 
      color: 'from-green-400 to-green-500',
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-700'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="container py-12">
        {/* Success Message */}
        {params.success && (
          <div className="card p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 mb-8">
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-green-500 shadow-md flex-shrink-0">
                <CheckCircle2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-green-900 mb-1">
                  Participação enviada com sucesso!
                </h3>
                <p className="text-green-700">
                  Sua criação será avaliada em breve. Acompanhe o status aqui.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* User Info Card */}
        <div className="card p-8 mb-8">
          <div className="flex items-start gap-6">
            <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 shadow-strong flex-shrink-0">
              <User className="h-10 w-10 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                Minhas Participações
              </h1>
              {userData && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-700">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">{userData.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span>{userData.email}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold gradient-text mb-1">
                {submissions?.length || 0}
              </div>
              <div className="text-sm text-gray-600">Participações</div>
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
                <div key={submission.id} className="card p-6 hover:shadow-medium transition-shadow">
                  {/* Header */}
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                    <div className="flex-1">
                      <Link 
                        href={`/desafio/${submission.challenges?.id}`}
                        className="text-2xl font-bold text-primary-600 hover:text-primary-700 transition-colors mb-2 inline-block"
                      >
                        {submission.challenges?.title}
                      </Link>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-secondary-100 text-secondary-800 text-sm font-semibold">
                          <Sparkles className="h-3.5 w-3.5" />
                          {submission.challenges?.theme}
                        </span>
                        <span className="flex items-center gap-1.5 text-sm text-gray-600">
                          <MapPin className="h-3.5 w-3.5" />
                          {submission.challenges?.locations?.name} • {submission.challenges?.locations?.city}
                        </span>
                      </div>
                    </div>
                    
                    {/* Status Badge */}
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 ${config.border} ${config.bg} shadow-soft`}>
                      <StatusIcon className={`h-5 w-5 ${config.text}`} />
                      <span className={`font-bold text-sm ${config.text}`}>
                        {config.label}
                      </span>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="p-4 rounded-xl bg-gray-50">
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <Hash className="h-4 w-4" />
                        <span className="text-xs font-medium">Tentativa</span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        #{submission.attempt_number}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-primary-50">
                      <div className="flex items-center gap-2 text-primary-600 mb-1">
                        <CreditCard className="h-4 w-4" />
                        <span className="text-xs font-medium">Valor</span>
                      </div>
                      <div className="text-2xl font-bold text-primary-600">
                        {formatPrice(submission.payment_amount)}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-gray-50">
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <Calendar className="h-4 w-4" />
                        <span className="text-xs font-medium">Enviado</span>
                      </div>
                      <div className="text-sm font-semibold text-gray-900">
                        {formatDate(submission.created_at)}
                      </div>
                    </div>

                    {submission.status === 'evaluated' && submission.score_final !== null && (
                      <div className="p-4 rounded-xl bg-gradient-to-br from-accent-50 to-secondary-50 border-2 border-accent-200">
                        <div className="flex items-center gap-2 text-accent-700 mb-1">
                          <Trophy className="h-4 w-4" />
                          <span className="text-xs font-medium">Score</span>
                        </div>
                        <div className="text-3xl font-bold gradient-text">
                          {submission.score_final.toFixed(2)}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content Preview */}
                  <div className="border-t pt-6">
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      {submission.content_type === 'photo' ? (
                        <>
                          <ImageIcon className="h-4 w-4" />
                          <span>Foto enviada</span>
                        </>
                      ) : (
                        <>
                          <FileText className="h-4 w-4" />
                          <span>Texto enviado</span>
                        </>
                      )}
                    </div>
                    
                    {submission.content_type === 'text' && submission.content_text && (
                      <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                        <p className="text-gray-700 whitespace-pre-wrap line-clamp-3">
                          {submission.content_text}
                        </p>
                      </div>
                    )}
                    
                    {submission.content_type === 'photo' && submission.content_url && (
                      <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                        <img 
                          src={submission.content_url} 
                          alt="Submissão"
                          className="max-w-md rounded-lg shadow-md"
                        />
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {submission.status === 'evaluated' && (
                    <div className="border-t mt-6 pt-6">
                      <Link href={`/ranking/${submission.challenges?.id}`}>
                        <Button variant="outline" size="sm">
                          <Award className="h-4 w-4" />
                          Ver ranking completo
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="card p-16 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
              <Send className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Você ainda não participou de nenhum desafio
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Que tal mandar bem em algum desafio criativo?
            </p>
            <Link href="/">
              <Button size="lg">
                <Sparkles className="h-5 w-5" />
                Ver desafios disponíveis
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
