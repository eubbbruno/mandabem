import { createClient } from '@/lib/supabase/server'
import { ChallengeCard } from '@/components/ChallengeCard'
import { CityFilter } from '@/components/CityFilter'

interface PageProps {
  searchParams: Promise<{ city?: string }>
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams
  
  let uniqueCities: string[] = []
  let challenges: any[] = []
  let error = null

  try {
    const supabase = await createClient()
    const { data: cities } = await supabase.from('locations').select('city').eq('active', true).order('city')
    uniqueCities = [...new Set(cities?.map((l: any) => l.city) || [])] as string[]

    let query = supabase.from('challenges').select(`*, locations (id, name, city)`).in('status', ['active', 'evaluating', 'finished']).order('ends_at', { ascending: false })
    if (params.city && params.city !== 'all') query = query.eq('locations.city', params.city)
    
    const { data } = await query
    challenges = data || []
  } catch (e) {
    error = e
  }

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section ÉPICO */}
      <section className="relative section pt-32 pb-20">
        {/* Background Blobs Animados */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-primary-400 to-secondary-400 opacity-30 blur-3xl blob animate-float" />
          <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-gradient-to-br from-accent-400 to-electric-400 opacity-30 blur-3xl blob animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-secondary-300 to-sunshine-300 opacity-20 blur-3xl blob animate-float" style={{ animationDelay: '2s' }} />
        </div>

        <div className="container relative z-10">
          <div className="max-w-5xl mx-auto text-center space-y-10">
            {/* Badge NEON */}
            <div className="inline-block animate-bounce-slow">
              <div className="badge-neon text-white">
                <span className="text-2xl">✨</span>
                <span>Concurso Cultural 100% Legal</span>
              </div>
            </div>

            {/* Headline EXPLOSIVO */}
            <h1 className="text-display-2xl md:text-[7rem] leading-none">
              <span className="block text-gradient-fire animate-pulse-slow">
                SUA CRIATIVIDADE
              </span>
              <span className="block text-gray-900 mt-4">
                VALE <span className="text-gradient">PRÊMIO</span>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-2xl md:text-3xl text-gray-700 font-bold max-w-3xl mx-auto">
              Desafios criativos em bares e botecos. 
              <span className="text-gradient"> Mostre seu talento</span> e ganhe prêmios reais! 💰
            </p>

            {/* CTA Buttons ÉPICOS */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
              <button className="btn-epic text-xl px-12 py-6">
                🚀 Ver Desafios
              </button>
              <button className="card-brutal px-12 py-6 text-xl font-bold hover:bg-gradient-to-r hover:from-primary-500 hover:to-secondary-500 hover:text-white transition-all">
                📖 Como Funciona
              </button>
            </div>

            {/* Stats Cards BRUTAIS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16">
              <div className="card-brutal p-8 bg-gradient-to-br from-primary-50 to-primary-100">
                <div className="text-6xl font-black text-gradient mb-2">R$ 7</div>
                <div className="text-lg font-bold text-gray-700">Primeira tentativa</div>
              </div>
              <div className="card-brutal p-8 bg-gradient-to-br from-secondary-50 to-secondary-100">
                <div className="text-6xl font-black text-gradient mb-2">100%</div>
                <div className="text-lg font-bold text-gray-700">Avaliação objetiva</div>
              </div>
              <div className="card-brutal p-8 bg-gradient-to-br from-accent-50 to-accent-100">
                <div className="text-6xl font-black text-gradient mb-2">LEGAL</div>
                <div className="text-lg font-bold text-gray-700">Concurso cultural</div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Como Funciona - ESTILO BRUTAL */}
      <section className="section bg-white relative">
        <div className="container">
          <div className="text-center mb-20">
            <div className="inline-block mb-6">
              <span className="text-6xl">🎯</span>
            </div>
            <h2 className="text-display-lg text-gradient mb-6">
              Como funciona?
            </h2>
            <p className="text-2xl text-gray-600 font-bold max-w-2xl mx-auto">
              Simples, rápido e transparente
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                number: '01',
                emoji: '🎨',
                title: 'Escolha um desafio',
                description: 'Veja os desafios ativos nos bares da sua cidade',
                color: 'from-primary-500 to-orange-600',
              },
              {
                number: '02',
                emoji: '💡',
                title: 'Crie sua resposta',
                description: 'Envie foto ou texto criativo seguindo as regras',
                color: 'from-secondary-500 to-pink-600',
              },
              {
                number: '03',
                emoji: '💳',
                title: 'Pague via PIX',
                description: 'R$ 7 na primeira. Preço aumenta progressivamente',
                color: 'from-accent-500 to-green-600',
              },
              {
                number: '04',
                emoji: '🏆',
                title: 'Ganhe prêmios',
                description: 'Jurados avaliam. Os melhores ganham!',
                color: 'from-electric-500 to-blue-600',
              },
            ].map((step, index) => (
              <div key={index} className="group">
                <div className="card-brutal p-8 h-full bg-white hover:bg-gradient-to-br hover:from-white hover:to-gray-50 transition-all">
                  <div className="text-7xl mb-4 group-hover:animate-bounce">{step.emoji}</div>
                  <div className={`text-5xl font-black bg-gradient-to-r ${step.color} bg-clip-text text-transparent mb-4`}>
                    {step.number}
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 font-medium leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Desafios Ativos - NEON STYLE */}
      {!error && (
        <section className="section bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white relative overflow-hidden">
          {/* Neon Glow Background */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500 rounded-full blur-[100px] animate-pulse-slow" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-500 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '1s' }} />
          </div>

          <div className="container relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-display-lg text-white mb-6">
                Desafios <span className="text-gradient-fire">Ativos</span>
              </h2>
              <p className="text-2xl text-gray-300 font-bold">
                Escolha um e mostre sua criatividade 🔥
              </p>
            </div>

            {uniqueCities.length > 0 && (
              <div className="mb-12 flex justify-center">
                <CityFilter cities={uniqueCities} selectedCity={params.city} />
              </div>
            )}

            {challenges && challenges.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {challenges.map((challenge: any) => (
                  <ChallengeCard
                    key={challenge.id}
                    id={challenge.id}
                    title={challenge.title}
                    theme={challenge.theme}
                    prize={challenge.prize}
                    locationName={challenge.locations?.name || 'Local'}
                    city={challenge.locations?.city || ''}
                    endsAt={challenge.ends_at}
                    status={challenge.status}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="text-9xl mb-8 animate-bounce-slow">🎨</div>
                <h3 className="text-4xl font-black text-white mb-4">
                  Nenhum desafio disponível
                </h3>
                <p className="text-xl text-gray-300 max-w-md mx-auto">
                  Novos desafios épicos chegando em breve! 🚀
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Por que participar - CARDS NEON */}
      <section className="section bg-white">
        <div className="container">
          <div className="text-center mb-20">
            <h2 className="text-display-lg text-gradient mb-6">
              Por que participar?
            </h2>
            <p className="text-2xl text-gray-600 font-bold">
              4 motivos para você mandar bem agora! 💪
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              {
                emoji: '💰',
                title: 'Prêmios reais em dinheiro',
                description: 'Ganhe prêmios que valem a pena pelo seu talento criativo',
                gradient: 'from-primary-500 to-orange-600',
              },
              {
                emoji: '📊',
                title: 'Avaliação objetiva',
                description: 'Critérios claros. Sem sorteio, sem azar. Só talento!',
                gradient: 'from-secondary-500 to-pink-600',
              },
              {
                emoji: '✅',
                title: '100% legal',
                description: 'Concurso cultural regulamentado com critérios objetivos',
                gradient: 'from-accent-500 to-green-600',
              },
              {
                emoji: '💳',
                title: 'Preço justo',
                description: 'R$ 7 na primeira. Você decide se quer tentar de novo',
                gradient: 'from-electric-500 to-blue-600',
              },
            ].map((item, index) => (
              <div key={index} className="card-neon group hover:scale-105 transition-transform">
                <div className="card-neon-inner">
                  <div className="text-6xl mb-4 group-hover:animate-bounce">{item.emoji}</div>
                  <h3 className={`text-2xl font-black mb-3 bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent`}>
                    {item.title}
                  </h3>
                  <p className="text-gray-600 font-medium text-lg">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final EXPLOSIVO */}
      <section className="section relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500 via-secondary-500 to-accent-500" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTIwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMjAgMjBjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00eiIvPjwvZz48L2c+PC9zdmc+')] animate-spin-slow" />
        </div>
        
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-10">
            <div className="text-8xl animate-bounce-slow">🚀</div>
            <h2 className="text-display-xl text-white drop-shadow-2xl">
              Pronto para <span className="text-sunshine-300">MANDAR BEM</span>?
            </h2>
            <p className="text-3xl text-white font-bold">
              Escolha um desafio e mostre do que você é capaz! 💪
            </p>
            <button className="card-brutal px-16 py-8 text-2xl font-black bg-white hover:bg-sunshine-300 transition-all hover:scale-110">
              🎨 VER DESAFIOS AGORA
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
