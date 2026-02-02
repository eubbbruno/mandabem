import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { formatPrice, formatDate } from '@/lib/scoring'
import Link from 'next/link'
import { 
  MapPin, 
  Calendar, 
  Trophy, 
  Target, 
  Sparkles,
  Clock,
  ArrowLeft,
  ArrowRight,
  CheckCircle2
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

  const endDate = new Date(challenge.ends_at)
  const now = new Date()
  const daysLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  const rules = Array.isArray(challenge.rules) ? challenge.rules : []

  const statusConfig = {
    active: { 
      label: '🔥 ATIVO AGORA', 
      gradient: 'from-green-500 to-emerald-600',
      bg: 'from-green-50 to-emerald-50'
    },
    evaluating: { 
      label: '⏳ Em Avaliação', 
      gradient: 'from-yellow-500 to-orange-600',
      bg: 'from-yellow-50 to-orange-50'
    },
    finished: { 
      label: '✅ Finalizado', 
      gradient: 'from-gray-400 to-gray-600',
      bg: 'from-gray-50 to-gray-100'
    }
  }

  const config = statusConfig[challenge.status as keyof typeof statusConfig] || statusConfig.active

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      {/* Back Button */}
      <div className="container pt-8">
        <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border-2 border-gray-200 font-bold text-gray-700 hover:bg-gray-50 transition-all hover:scale-105">
          <ArrowLeft className="h-5 w-5" />
          <span>Voltar</span>
        </Link>
      </div>

      {/* Hero Section ÉPICO */}
      <section className="container py-12">
        <div className="card-brutal bg-gradient-to-br from-white to-gray-50 p-8 md:p-16">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-black text-lg mb-8 shadow-neon-green">
            <span>{config.label}</span>
          </div>

          {/* Título ÉPICO */}
          <h1 className="text-display-lg md:text-display-xl text-gradient-fire mb-6">
            {challenge.title}
          </h1>

          {/* Tema */}
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary-100 to-secondary-100 border-2 border-primary-300 mb-8">
            <Sparkles className="h-5 w-5 text-primary-600" />
            <span className="text-xl font-black text-primary-700">{challenge.theme}</span>
          </div>

          {/* Descrição */}
          <p className="text-2xl text-gray-700 font-bold leading-relaxed mb-12 max-w-3xl">
            {challenge.description}
          </p>

          {/* Info Grid BRUTAL */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Prêmio */}
            <div className="card-brutal p-8 bg-gradient-to-br from-yellow-50 to-orange-50">
              <div className="flex items-center gap-3 mb-3">
                <Trophy className="h-8 w-8 text-yellow-600" />
                <span className="text-lg font-bold text-gray-700">PRÊMIO</span>
              </div>
              <div className="text-5xl font-black text-gradient">
                {formatPrice(challenge.prize)}
              </div>
            </div>

            {/* Local */}
            <div className="card-brutal p-8 bg-gradient-to-br from-blue-50 to-cyan-50">
              <div className="flex items-center gap-3 mb-3">
                <MapPin className="h-8 w-8 text-blue-600" />
                <span className="text-lg font-bold text-gray-700">LOCAL</span>
              </div>
              <div className="text-2xl font-black text-gray-900">
                {challenge.locations?.name}
              </div>
              <div className="text-lg font-bold text-gray-600">
                {challenge.locations?.city}
              </div>
            </div>

            {/* Prazo */}
            <div className="card-brutal p-8 bg-gradient-to-br from-purple-50 to-pink-50">
              <div className="flex items-center gap-3 mb-3">
                <Clock className="h-8 w-8 text-purple-600" />
                <span className="text-lg font-bold text-gray-700">PRAZO</span>
              </div>
              {daysLeft > 0 ? (
                <>
                  <div className="text-5xl font-black text-gradient">
                    {daysLeft}
                  </div>
                  <div className="text-lg font-bold text-gray-600">
                    {daysLeft === 1 ? 'dia' : 'dias'} restantes
                  </div>
                </>
              ) : (
                <div className="text-2xl font-black text-gray-600">
                  Encerrado
                </div>
              )}
            </div>
          </div>

          {/* CTA ÉPICO */}
          {challenge.status === 'active' && daysLeft > 0 && (
            <Link href={`/participar/${id}`} className="inline-block">
              <button className="btn-epic text-2xl px-16 py-6 flex items-center gap-3 group">
                <span>🎨 PARTICIPAR AGORA</span>
                <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
              </button>
            </Link>
          )}
        </div>
      </section>

      {/* Regras - ESTILO BRUTAL */}
      {rules.length > 0 && (
        <section className="container pb-12">
          <div className="card-brutal bg-white p-8 md:p-12">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-4xl font-black text-gray-900">
                Regras do Desafio
              </h2>
            </div>

            <div className="space-y-4">
              {rules.map((rule: string, index: number) => (
                <div key={index} className="flex items-start gap-4 p-6 rounded-xl bg-gradient-to-r from-gray-50 to-white border-l-4 border-primary-500">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-black">
                    {index + 1}
                  </div>
                  <p className="text-lg font-bold text-gray-700 pt-1">
                    {rule}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Critérios de Avaliação - PARA LEIGOS */}
      <section className="container pb-12">
        <div className="card-brutal bg-white p-8 md:p-12">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              Como Vão te Avaliar?
            </h2>
            <p className="text-xl text-gray-600 font-bold max-w-2xl mx-auto">
              Os jurados vão dar nota de 0 a 10 em cada item. Quanto maior a nota, melhor!
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="flex items-start gap-4 p-6 rounded-2xl bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200">
              <div className="w-16 h-16 bg-yellow-500 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">🎨</div>
              <div>
                <p className="font-black text-yellow-700 text-lg mb-2">Criatividade (vale muito!)</p>
                <p className="text-sm text-gray-700 font-medium">Sua ideia é diferente? Faz a pessoa rir ou pensar? Nunca viram algo assim?</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
              <div className="w-16 h-16 bg-green-500 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">🎯</div>
              <div>
                <p className="font-black text-green-700 text-lg mb-2">Tem a Ver com o Tema</p>
                <p className="text-sm text-gray-700 font-medium">Se o desafio é sobre pizza, tem que ter pizza! Não adianta mandar foto de cachorro.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
              <div className="w-16 h-16 bg-blue-500 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">✨</div>
              <div>
                <p className="font-black text-blue-700 text-lg mb-2">Qualidade</p>
                <p className="text-sm text-gray-700 font-medium">Tá bem feito? Dá pra ver direito? O texto tá escrito certo?</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
              <div className="w-16 h-16 bg-purple-500 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">❤️</div>
              <div>
                <p className="font-black text-purple-700 text-lg mb-2">As Pessoas Gostaram</p>
                <p className="text-sm text-gray-700 font-medium">Se você postou no Instagram, as pessoas curtiram? Comentaram coisas legais?</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 md:col-span-2">
              <div className="w-16 h-16 bg-orange-500 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">📢</div>
              <div>
                <p className="font-black text-orange-700 text-lg mb-2">Divulgação</p>
                <p className="text-sm text-gray-700 font-medium">Você mostrou pro mundo? Postou nas redes? Marcou o estabelecimento? Quanto mais gente ver, melhor!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Como Participar - SIMPLES E CLARO */}
      <section className="container pb-12">
        <div className="card-brutal bg-gradient-to-br from-primary-500 via-secondary-500 to-accent-500 p-8 md:p-12 text-white">
          <div className="text-center space-y-8">
            <div className="text-7xl animate-bounce-slow">🚀</div>
            <h2 className="text-4xl md:text-5xl font-black">
              Como Participar?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border-2 border-white/20">
                <div className="text-5xl mb-4">📝</div>
                <div className="text-2xl font-black mb-2">1. Crie</div>
                <p className="font-bold">Envie foto ou texto criativo</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border-2 border-white/20">
                <div className="text-5xl mb-4">💳</div>
                <div className="text-2xl font-black mb-2">2. Pague</div>
                <p className="font-bold">R$ 7 via PIX (primeira tentativa)</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border-2 border-white/20">
                <div className="text-5xl mb-4">🏆</div>
                <div className="text-2xl font-black mb-2">3. Ganhe</div>
                <p className="font-bold">Jurados avaliam e premiam!</p>
              </div>
            </div>
            {challenge.status === 'active' && daysLeft > 0 && (
              <Link href={`/participar/${id}`}>
                <button className="card-brutal px-12 py-6 text-2xl font-black bg-white text-gray-900 hover:bg-yellow-300 transition-all hover:scale-110">
                  🎨 COMEÇAR AGORA
                </button>
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
