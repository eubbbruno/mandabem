import { createClient } from '@/lib/supabase/server'
import { formatPrice, formatDate } from '@/lib/scoring'
import Link from 'next/link'
import { Button } from '@/components/Button'
import { CreateChallengeForm } from '@/components/admin/CreateChallengeForm'
import { CreateLocationForm } from '@/components/admin/CreateLocationForm'
import { 
  LayoutDashboard,
  Trophy,
  Send,
  DollarSign,
  MapPin,
  Eye,
  Plus,
  Calendar,
  Target,
  TrendingUp,
  Users,
  CheckCircle2,
  Clock,
  Flame
} from 'lucide-react'

export default async function AdminPage() {
  const supabase = await createClient()

  // Busca estatísticas gerais
  const { data: challenges } = await supabase
    .from('challenges')
    .select('*')
    .order('created_at', { ascending: false })

  const { data: submissions } = await supabase
    .from('submissions')
    .select('payment_amount, status')

  const { data: locations } = await supabase
    .from('locations')
    .select('*')
    .order('city')

  // Calcula estatísticas
  const totalChallenges = challenges?.length || 0
  const activeChallenges = challenges?.filter((c: any) => c.status === 'active').length || 0
  const totalSubmissions = submissions?.length || 0
  const totalRevenue = submissions?.reduce((sum: number, s: any) => sum + (s.payment_amount || 0), 0) || 0
  const paidSubmissions = submissions?.filter((s: any) => s.status === 'paid' || s.status === 'evaluated').length || 0

  const stats = [
    {
      label: 'Desafios Ativos',
      value: activeChallenges,
      total: `de ${totalChallenges} total`,
      icon: Flame,
      gradient: 'from-primary-500 to-primary-600',
      bg: 'from-primary-50 to-primary-100',
    },
    {
      label: 'Participações',
      value: totalSubmissions,
      total: `${paidSubmissions} pagas`,
      icon: Send,
      gradient: 'from-secondary-500 to-secondary-600',
      bg: 'from-secondary-50 to-secondary-100',
    },
    {
      label: 'Faturamento',
      value: formatPrice(totalRevenue),
      total: 'total arrecadado',
      icon: DollarSign,
      gradient: 'from-accent-500 to-accent-600',
      bg: 'from-accent-50 to-accent-100',
    },
    {
      label: 'Locais Ativos',
      value: locations?.filter((l: any) => l.active).length || 0,
      total: `de ${locations?.length || 0} total`,
      icon: MapPin,
      gradient: 'from-purple-500 to-purple-600',
      bg: 'from-purple-50 to-purple-100',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="container py-12 space-y-8">
        {/* Header */}
        <div className="card p-8 bg-gradient-to-r from-white to-gray-50">
          <div className="flex items-start gap-6">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 shadow-strong">
              <LayoutDashboard className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Admin Dashboard
              </h1>
              <p className="text-gray-600">
                Gerencie desafios, locais e avaliações da plataforma
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className={`card p-6 bg-gradient-to-br ${stat.bg} border-2 border-gray-200 hover:shadow-medium transition-shadow`}>
                <div className="flex items-start justify-between mb-4">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-md`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="text-sm font-medium text-gray-600 mb-1">{stat.label}</div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-xs text-gray-500">{stat.total}</div>
              </div>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/admin/avaliar">
            <div className="card p-8 hover:shadow-strong transition-all cursor-pointer group border-2 border-transparent hover:border-primary-500">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 shadow-md group-hover:scale-110 transition-transform">
                  <Eye className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                    Avaliar Participações
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Acesse o painel de avaliação dos jurados
                  </p>
                </div>
              </div>
            </div>
          </Link>

          <div className="card p-8 border-2 border-dashed border-gray-300">
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gray-100">
                <TrendingUp className="h-7 w-7 text-gray-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Relatórios
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Exporte dados para análise
                </p>
                <Button variant="outline" size="sm">Exportar CSV</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Create Challenge */}
        <div className="card p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary-100">
              <Plus className="h-6 w-6 text-primary-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Criar Novo Desafio</h2>
          </div>
          <CreateChallengeForm locations={locations || []} />
        </div>

        {/* Create Location */}
        <div className="card p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-accent-100">
              <MapPin className="h-6 w-6 text-accent-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Criar Novo Local</h2>
          </div>
          <CreateLocationForm />
        </div>

        {/* Challenges List */}
        <div className="card p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-secondary-100">
              <Trophy className="h-6 w-6 text-secondary-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Desafios Cadastrados</h2>
          </div>
          
          <div className="space-y-4">
            {challenges && challenges.length > 0 ? (
              challenges.map((challenge: any) => {
                const statusConfig = {
                  active: { icon: Flame, color: 'from-accent-500 to-accent-600', bg: 'bg-accent-50', text: 'text-accent-700' },
                  draft: { icon: Clock, color: 'from-gray-400 to-gray-500', bg: 'bg-gray-50', text: 'text-gray-700' },
                  evaluating: { icon: Eye, color: 'from-secondary-500 to-secondary-600', bg: 'bg-secondary-50', text: 'text-secondary-700' },
                  finished: { icon: CheckCircle2, color: 'from-green-500 to-green-600', bg: 'bg-green-50', text: 'text-green-700' },
                }
                
                const config = statusConfig[challenge.status as keyof typeof statusConfig] || statusConfig.draft
                const StatusIcon = config.icon

                return (
                  <div key={challenge.id} className="card p-6 hover:shadow-medium transition-shadow">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-xl font-bold text-gray-900">{challenge.title}</h3>
                          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg ${config.bg} border border-gray-200`}>
                            <StatusIcon className={`h-4 w-4 ${config.text}`} />
                            <span className={`text-xs font-bold ${config.text}`}>
                              {challenge.status}
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-600 mb-3">{challenge.description}</p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Target className="h-4 w-4" />
                            {challenge.theme}
                          </span>
                          <span className="flex items-center gap-1">
                            <Trophy className="h-4 w-4" />
                            {formatPrice(challenge.prize)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(challenge.starts_at)} - {formatDate(challenge.ends_at)}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Link href={`/desafio/${challenge.id}`}>
                          <Button variant="outline" size="sm" fullWidth>
                            Ver
                          </Button>
                        </Link>
                        <Link href={`/ranking/${challenge.id}`}>
                          <Button variant="ghost" size="sm" fullWidth>
                            Ranking
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Trophy className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Nenhum desafio cadastrado ainda</p>
              </div>
            )}
          </div>
        </div>

        {/* Locations List */}
        <div className="card p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-purple-100">
              <MapPin className="h-6 w-6 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Locais Cadastrados</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {locations && locations.length > 0 ? (
              locations.map((location: any) => (
                <div key={location.id} className="card p-6 hover:shadow-medium transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-1">{location.name}</h3>
                      <p className="text-sm text-gray-600 mb-1">{location.address}</p>
                      <p className="text-sm text-gray-500">{location.city}</p>
                    </div>
                    <div className={`
                      inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold
                      ${location.active 
                        ? 'bg-accent-100 text-accent-700 border border-accent-200' 
                        : 'bg-gray-100 text-gray-600 border border-gray-200'
                      }
                    `}>
                      {location.active ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Ativo
                        </>
                      ) : (
                        <>
                          <Clock className="h-3.5 w-3.5" />
                          Inativo
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center py-12 text-gray-500">
                <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Nenhum local cadastrado</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
