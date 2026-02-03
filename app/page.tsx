import { createClient } from '@/lib/supabase/server'
import { ChallengeCard } from '@/components/ChallengeCard'
import { CityFilter } from '@/components/CityFilter'
import { ScrollButton } from '@/components/ScrollButton'

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
      {/* Hero Section - SUPER CLARO */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 via-gray-900 to-black px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full px-4 py-2 mb-8">
            <span className="text-yellow-400 text-sm font-medium">🎮 Não é sorteio. É talento!</span>
          </div>

          {/* Título Principal */}
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight text-white">
            Mostre sua criatividade.<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
              Ganhe prêmios de verdade.
            </span>
          </h1>

          {/* Explicação SIMPLES */}
          <p className="text-xl md:text-2xl text-gray-300 mb-4 max-w-2xl mx-auto">
            Participe de desafios criativos em bares e restaurantes da sua cidade.
          </p>
          
          <p className="text-lg text-gray-400 mb-8 max-w-xl mx-auto leading-relaxed">
            📸 Tire uma foto criativa ou escreva um texto engraçado<br/>
            💰 Pague só R$7 para participar<br/>
            🏆 Se os jurados gostarem, você leva o prêmio!
          </p>

          {/* Botões */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <ScrollButton targetId="desafios" className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-black rounded-2xl text-lg hover:scale-105 transition">
              🎯 Ver Desafios Abertos
            </ScrollButton>
            <ScrollButton targetId="como-funciona" className="px-8 py-4 bg-gray-800 border-2 border-gray-700 text-white font-bold rounded-2xl text-lg hover:border-yellow-500 transition">
              🤔 Como Funciona?
            </ScrollButton>
          </div>

          {/* Prova Social Simples */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
            <span>✅ Sem pegadinha</span>
            <span>✅ Prêmio real via Pix</span>
            <span>✅ Resultado por mérito</span>
          </div>
        </div>
      </section>

      {/* Como Funciona - SUPER DETALHADO */}
      <section id="como-funciona" className="py-20 bg-black">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4 text-white">🤔 Como Funciona?</h2>
            <p className="text-xl text-gray-400">
              É mais simples que pedir comida por delivery. Olha só:
            </p>
          </div>

          {/* Passo a Passo Visual */}
          <div className="space-y-8">
            
            {/* PASSO 1 */}
            <div className="bg-gray-900 rounded-3xl p-8 border border-gray-800">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center text-3xl font-black text-black shrink-0">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-yellow-400 mb-3">Escolha um Desafio</h3>
                  <p className="text-gray-300 text-lg mb-4">
                    Cada bar ou restaurante parceiro cria um desafio diferente. 
                    Por exemplo: "Foto mais criativa comendo nosso hambúrguer" ou 
                    "Melhor frase sobre nossa cerveja artesanal".
                  </p>
                  <div className="bg-gray-800 rounded-xl p-4">
                    <p className="text-sm text-gray-400">
                      <strong className="text-yellow-400">💡 Exemplo real:</strong> O Bar do Zé quer a foto mais 
                      engraçada de alguém comendo pastel. Prêmio: R$500 em consumação!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* PASSO 2 */}
            <div className="bg-gray-900 rounded-3xl p-8 border border-gray-800">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center text-3xl font-black text-black shrink-0">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-green-400 mb-3">Crie e Envie</h3>
                  <p className="text-gray-300 text-lg mb-4">
                    Use seu celular mesmo! Tire a foto ou escreva o texto. 
                    Não precisa ser profissional - o importante é ser CRIATIVO e DIVERTIDO.
                  </p>
                  <div className="bg-gray-800 rounded-xl p-4">
                    <p className="text-sm text-gray-400">
                      <strong className="text-green-400">📸 Dica:</strong> Fotos com boa luz ficam melhores, 
                      mas já teve gente que ganhou com foto tremida porque era muito engraçada!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* PASSO 3 */}
            <div className="bg-gray-900 rounded-3xl p-8 border border-gray-800">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center text-3xl font-black text-black shrink-0">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-blue-400 mb-3">Pague R$7 via Pix</h3>
                  <p className="text-gray-300 text-lg mb-4">
                    Cada participação custa R$7. É o preço de um lanche! 
                    Esse dinheiro vai para o prêmio e para manter a plataforma funcionando.
                  </p>
                  <div className="bg-gray-800 rounded-xl p-4">
                    <p className="text-sm text-gray-400 mb-2">
                      <strong className="text-blue-400">💰 Por que o preço aumenta?</strong>
                    </p>
                    <p className="text-sm text-gray-400 mb-3">
                      Se quiser tentar de novo no MESMO desafio, pode! Mas fica um pouco mais caro 
                      pra dar chance pra todo mundo, não só pra quem tem mais dinheiro.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-gray-700 rounded-full text-xs">1ª vez: R$7</span>
                      <span className="px-3 py-1 bg-gray-700 rounded-full text-xs">2ª vez: R$9,10</span>
                      <span className="px-3 py-1 bg-gray-700 rounded-full text-xs">3ª vez: R$11,20</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* PASSO 4 */}
            <div className="bg-gray-900 rounded-3xl p-8 border border-gray-800">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center text-3xl font-black text-black shrink-0">
                  4
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-purple-400 mb-3">Jurados Avaliam</h3>
                  <p className="text-gray-300 text-lg mb-4">
                    Pessoas de verdade (não robôs!) olham todas as participações e dão notas. 
                    Eles avaliam: criatividade, qualidade, se combina com o tema, e outras coisas.
                  </p>
                  <div className="bg-gray-800 rounded-xl p-4">
                    <p className="text-sm text-gray-400">
                      <strong className="text-purple-400">⚖️ Importante:</strong> NÃO É SORTEIO! 
                      Quem for mais criativo e caprichoso, ganha. Simples assim.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* PASSO 5 */}
            <div className="bg-gray-900 rounded-3xl p-8 border border-gray-800 border-yellow-500/50">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center text-3xl font-black text-black shrink-0">
                  🏆
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-yellow-400 mb-3">Ganhe o Prêmio!</h3>
                  <p className="text-gray-300 text-lg mb-4">
                    Quando o desafio termina, a gente anuncia o vencedor e faz o Pix do prêmio 
                    em até 7 dias. Pode ser dinheiro, vale-consumação, produtos... depende do desafio!
                  </p>
                  <div className="bg-gray-800 rounded-xl p-4">
                    <p className="text-sm text-gray-400">
                      <strong className="text-yellow-400">🎉 Resultado:</strong> Você acompanha o ranking 
                      em tempo real e vê sua posição subindo (ou descendo) conforme mais pessoas participam.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-center mb-8 text-white">❓ Perguntas Frequentes</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-900 rounded-xl p-5">
                <h4 className="font-bold text-yellow-400 mb-2">É tipo uma loteria?</h4>
                <p className="text-gray-400 text-sm">
                  Não! Loteria é sorte. Aqui é TALENTO. Os jurados escolhem os melhores, não tem sorteio.
                </p>
              </div>
              <div className="bg-gray-900 rounded-xl p-5">
                <h4 className="font-bold text-yellow-400 mb-2">Posso participar de longe?</h4>
                <p className="text-gray-400 text-sm">
                  Alguns desafios são só pra quem vai no local. Outros você pode fazer de casa. Leia as regras de cada um!
                </p>
              </div>
              <div className="bg-gray-900 rounded-xl p-5">
                <h4 className="font-bold text-yellow-400 mb-2">E se eu não ganhar?</h4>
                <p className="text-gray-400 text-sm">
                  Você não perde nada além dos R$7. E ainda se divertiu criando algo legal! Tenta no próximo desafio.
                </p>
              </div>
              <div className="bg-gray-900 rounded-xl p-5">
                <h4 className="font-bold text-yellow-400 mb-2">Vocês são confiáveis?</h4>
                <p className="text-gray-400 text-sm">
                  Sim! Somos empresa registrada com CNPJ. Cada desafio tem regulamento público. Transparência total.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Desafios Ativos - NEON STYLE */}
      {!error && (
        <section id="desafios" className="section bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white relative overflow-hidden">
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
            <ScrollButton targetId="desafios" className="card-brutal px-16 py-8 text-2xl font-black bg-white hover:bg-sunshine-300 transition-all hover:scale-110">
              🎨 VER DESAFIOS AGORA
            </ScrollButton>
          </div>
        </div>
      </section>
    </div>
  )
}
