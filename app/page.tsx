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

    // Busca cidades disponíveis
    const { data: cities } = await supabase
      .from('locations')
      .select('city')
      .eq('active', true)
      .order('city')

    uniqueCities = [...new Set(cities?.map((l: any) => l.city) || [])] as string[]

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

    const { data } = await query
    challenges = data || []
  } catch (e) {
    error = e
    console.error('Erro ao buscar dados:', e)
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="section bg-neutral-50">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-neutral-200 text-sm font-medium text-neutral-700">
              ✨ Concurso Cultural 100% Legal
            </div>

            {/* Headline */}
            <h1 className="text-display-xl md:text-display-2xl text-neutral-900">
              Sua <span className="italic">criatividade</span> vale{' '}
              <span className="italic">prêmio</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Participe de desafios criativos em bares e botecos. 
              Mostre seu talento, seja avaliado por jurados e ganhe prêmios reais.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button className="btn btn-primary">
                Ver Desafios
              </button>
              <button className="btn btn-secondary">
                Como Funciona
              </button>
            </div>

            {/* Stats */}
            <div className="pt-12 border-t border-neutral-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-neutral-900 mb-2">R$ 7</div>
                  <div className="text-sm text-neutral-600">Primeira tentativa</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-neutral-900 mb-2">100%</div>
                  <div className="text-sm text-neutral-600">Avaliação objetiva</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-neutral-900 mb-2">Legal</div>
                  <div className="text-sm text-neutral-600">Concurso cultural</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-display-md text-neutral-900 mb-4">
              Como funciona
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Simples, rápido e transparente. Do desafio ao prêmio em 4 passos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                number: '01',
                title: 'Escolha um desafio',
                description: 'Veja os desafios ativos nos bares e botecos da sua cidade.',
              },
              {
                number: '02',
                title: 'Crie sua resposta',
                description: 'Envie uma foto ou texto criativo seguindo as regras do desafio.',
              },
              {
                number: '03',
                title: 'Pague via PIX',
                description: 'R$ 7 na primeira tentativa. Preço aumenta progressivamente.',
              },
              {
                number: '04',
                title: 'Ganhe prêmios',
                description: 'Jurados avaliam objetivamente. Os melhores ganham o prêmio!',
              },
            ].map((step, index) => (
              <div key={index} className="card card-hover p-8 text-center">
                <div className="text-5xl font-bold text-neutral-200 mb-6">{step.number}</div>
                <h3 className="text-base font-bold text-neutral-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Desafios Ativos */}
      {!error && (
        <section className="section bg-neutral-50">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-display-md text-neutral-900 mb-4">
                Desafios ativos
              </h2>
              <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                Escolha um desafio e mostre sua criatividade
              </p>
            </div>

            {/* Filtro de Cidade */}
            {uniqueCities.length > 0 && (
              <div className="mb-12">
                <CityFilter cities={uniqueCities} selectedCity={params.city} />
              </div>
            )}

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
                  Nenhum desafio disponível no momento
                </h3>
                <p className="text-neutral-600 max-w-md mx-auto">
                  {params.city && params.city !== 'all' 
                    ? 'Tente selecionar outra cidade ou aguarde novos desafios.'
                    : 'Novos desafios serão publicados em breve!'}
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Por que participar */}
      <section className="section">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-display-md text-neutral-900 mb-6">
                Por que participar?
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-neutral-900 text-white flex items-center justify-center font-bold">
                    ✓
                  </div>
                  <div>
                    <h3 className="font-bold text-neutral-900 mb-1">Prêmios reais em dinheiro</h3>
                    <p className="text-sm text-neutral-600">Ganhe prêmios que valem a pena pelo seu talento criativo.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-neutral-900 text-white flex items-center justify-center font-bold">
                    ✓
                  </div>
                  <div>
                    <h3 className="font-bold text-neutral-900 mb-1">Avaliação objetiva e transparente</h3>
                    <p className="text-sm text-neutral-600">Critérios claros de avaliação. Sem sorteio, sem azar.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-neutral-900 text-white flex items-center justify-center font-bold">
                    ✓
                  </div>
                  <div>
                    <h3 className="font-bold text-neutral-900 mb-1">100% legal e regulamentado</h3>
                    <p className="text-sm text-neutral-600">Concurso cultural com regulamento próprio e critérios objetivos.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-neutral-900 text-white flex items-center justify-center font-bold">
                    ✓
                  </div>
                  <div>
                    <h3 className="font-bold text-neutral-900 mb-1">Preço justo e progressivo</h3>
                    <p className="text-sm text-neutral-600">R$ 7 na primeira tentativa. Você decide se quer tentar novamente.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="card p-8">
              <div className="space-y-6">
                <div>
                  <div className="text-4xl font-bold text-neutral-900 mb-1">R$ 7,00</div>
                  <div className="text-sm text-neutral-600 mb-6">Primeira tentativa</div>
                </div>
                <div className="space-y-3">
                  {[
                    { label: '1ª tentativa', value: 'R$ 7,00' },
                    { label: '2ª tentativa', value: 'R$ 9,10' },
                    { label: '3ª tentativa', value: 'R$ 11,20' },
                    { label: '4ª tentativa', value: 'R$ 13,30' },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-neutral-50">
                      <span className="text-sm font-medium text-neutral-600">{item.label}</span>
                      <span className="text-sm font-bold text-neutral-900">{item.value}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t border-neutral-200">
                  <p className="text-xs text-neutral-500">
                    * Preço aumenta R$ 2,10 por tentativa no mesmo desafio
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="section bg-neutral-900 text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-display-md">
              Pronto para mandar bem?
            </h2>
            <p className="text-xl text-neutral-300">
              Escolha um desafio e mostre do que você é capaz
            </p>
            <button className="btn bg-white text-neutral-900 hover:bg-neutral-100">
              Ver Desafios Disponíveis
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
