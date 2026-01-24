import { createClient } from '@/lib/supabase/server'
import { ChallengeCard } from '@/components/ChallengeCard'
import { CityFilter } from '@/components/CityFilter'

interface PageProps {
  searchParams: Promise<{ city?: string }>
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams
  const supabase = await createClient()

  // Busca cidades disponíveis
  const { data: cities }: { data: any } = await supabase
    .from('locations')
    .select('city')
    .eq('active', true)
    .order('city')

  const uniqueCities = [...new Set(cities?.map((l: any) => l.city) || [])] as string[]

  // Busca desafios ativos
  let query = supabase
    .from('challenges')
    .select(`
      *,
      locations (
        id,
        name,
        city
      )
    `)
    .in('status', ['active', 'evaluating', 'finished'])
    .order('ends_at', { ascending: false })

  // Filtro por cidade se selecionado
  if (params.city && params.city !== 'all') {
    query = query.eq('locations.city', params.city)
  }

  const { data: challenges }: { data: any } = await query

  return (
    <div className="min-h-screen">
      {/* Hero Section Minimalista */}
      <section className="section bg-neutral-50">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-neutral-200 text-sm font-medium text-neutral-700">
              ✨ Concurso Cultural Legal
            </div>

            {/* Headline */}
            <h1 className="text-display-xl md:text-display-2xl text-neutral-900">
              Ensuring your <span className="italic">financial</span> plan{' '}
              <span className="italic">stays organized</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Participe de desafios criativos em bares e botecos da sua cidade. 
              Mostre seu talento e ganhe prêmios reais!
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button className="btn btn-primary">
                Get Started
              </button>
              <button className="btn btn-secondary">
                How it works
              </button>
            </div>

            {/* Logos */}
            <div className="pt-12 border-t border-neutral-200">
              <p className="text-sm text-neutral-500 mb-6">OUR RECENT CLIENTS & PARTNERS</p>
              <div className="flex flex-wrap items-center justify-center gap-8 opacity-40">
                <div className="text-2xl font-bold text-neutral-400">Olypus</div>
                <div className="text-2xl font-bold text-neutral-400">Jibo</div>
                <div className="text-2xl font-bold text-neutral-400">Spotify</div>
                <div className="text-2xl font-bold text-neutral-400">DRIBBBLE</div>
                <div className="text-2xl font-bold text-neutral-400">BEHANCE</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-display-md text-neutral-900 mb-4">
              Exceptional Financial Services
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              We offer the best services available for you to manage your finances wisely.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '💰',
                title: 'FINANCIAL PLANNING',
                description: 'The Stocks series of products: Stocks: Landing Page Kit, Stocks Portfolio Kit, Stocks: eCommerce Kit. Stocks is a product.',
              },
              {
                icon: '📊',
                title: 'STOCKS & BONDS',
                description: 'The Stocks series of products: Stocks: Landing Page Kit, Stocks Portfolio Kit, Stocks: eCommerce Kit. Stocks is a product.',
              },
              {
                icon: '🏦',
                title: 'BANKING SERVICES',
                description: 'The Stocks series of products: Stocks: Landing Page Kit, Stocks Portfolio Kit, Stocks: eCommerce Kit. Stocks is a product.',
              },
            ].map((service, index) => (
              <div key={index} className="card card-hover p-8 text-center">
                <div className="text-5xl mb-6">{service.icon}</div>
                <h3 className="text-sm font-bold text-neutral-900 mb-3 tracking-wide">
                  {service.title}
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Challenges Section */}
      <section className="section bg-neutral-50">
        <div className="container">
          {/* Filtro de Cidade */}
          <div className="mb-12">
            <CityFilter cities={uniqueCities} selectedCity={params.city} />
          </div>

          {/* Lista de Desafios */}
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
              <div className="text-6xl mb-6">🎨</div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-2">
                Nenhum desafio disponível
              </h3>
              <p className="text-neutral-600 max-w-md mx-auto">
                {params.city && params.city !== 'all' 
                  ? 'Tente selecionar outra cidade ou aguarde novos desafios.'
                  : 'Aguarde novos desafios em breve!'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="section">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-display-md text-neutral-900 mb-6">
                Everything is based on data not assumptions
              </h2>
              <p className="text-lg text-neutral-600 mb-8">
                The Stocks series of products: Stocks: Landing Page Kit, Stocks Portfolio Kit, 
                Stocks: eCommerce Kit. Stocks is a product family plenty of resusable content.
              </p>
              <button className="btn btn-primary">
                Learn More
              </button>
            </div>
            <div className="card p-8">
              <div className="space-y-6">
                <div>
                  <div className="text-4xl font-bold text-neutral-900 mb-1">10,000+</div>
                  <div className="text-sm text-neutral-600">Active users right now</div>
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'FINANCIAL PLANNING', value: '12%' },
                    { label: 'STOCKS & BONDS', value: '10%' },
                    { label: 'BANKING SERVICES', value: '8%' },
                    { label: 'LOAN & MORTGAGE', value: '20%' },
                  ].map((item, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-neutral-600">{item.label}</span>
                        <span className="text-sm font-bold text-neutral-900">{item.value}</span>
                      </div>
                      <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-neutral-900 rounded-full"
                          style={{ width: item.value }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
