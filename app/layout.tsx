import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { ToastProvider } from "@/components/providers/ToastProvider";

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "MandaBem - Criatividade que vale prêmio por R$7",
  description: "Participe de desafios criativos em bares e botecos. Concurso cultural com avaliação objetiva. Primeira tentativa por apenas R$7!",
  keywords: ["concurso cultural", "desafios criativos", "prêmios", "competição", "criatividade", "bares", "botecos"],
  authors: [{ name: "MandaBem" }],
  creator: "MandaBem",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="font-sans antialiased">
        <ToastProvider />
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="relative bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500 rounded-full blur-[120px] animate-pulse-slow" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary-500 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '1s' }} />
          </div>

          <div className="container py-20 relative z-10">
            {/* Top Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
              {/* Brand ÉPICO */}
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-br from-primary-500 via-secondary-500 to-accent-500 p-3 rounded-xl shadow-neon">
                    <span className="text-3xl">✨</span>
                  </div>
                  <div className="text-4xl font-black text-gradient-fire">
                    MandaBem
                  </div>
                </div>
                <p className="text-xl text-gray-300 font-bold mb-8 max-w-md leading-relaxed">
                  Criatividade que vale prêmio. Participe de desafios criativos e ganhe prêmios reais! 🏆
                </p>
                {/* Social Links */}
                <div className="flex items-center gap-4">
                  {['📱', '💬', '📧', '🎨'].map((emoji, index) => (
                    <a
                      key={index}
                      href="#"
                      className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-2xl hover:bg-gradient-to-br hover:from-primary-500 hover:to-secondary-500 hover:scale-110 transition-all"
                    >
                      {emoji}
                    </a>
                  ))}
                </div>
              </div>

              {/* Links Plataforma */}
              <div>
                <h3 className="text-xl font-black mb-6 text-gradient">🚀 Plataforma</h3>
                <ul className="space-y-4">
                  {[
                    { name: 'Desafios', href: '/', emoji: '🎨' },
                    { name: 'Como Funciona', href: '#como-funciona', emoji: '💡' },
                    { name: 'Minhas Participações', href: '/meus-envios', emoji: '📊' },
                    { name: 'Admin', href: '/admin', emoji: '⚙️' },
                  ].map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="flex items-center gap-2 text-gray-300 hover:text-white font-bold transition-colors group"
                      >
                        <span className="group-hover:animate-bounce">{item.emoji}</span>
                        <span className="group-hover:translate-x-1 transition-transform">{item.name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Links Legal */}
              <div>
                <h3 className="text-xl font-black mb-6 text-gradient">⚖️ Legal</h3>
                <ul className="space-y-4">
                  {[
                    { name: 'Regulamento', emoji: '📋' },
                    { name: 'Termos de Uso', emoji: '📜' },
                    { name: 'Privacidade', emoji: '🔒' },
                    { name: 'Contato', emoji: '💬' },
                  ].map((item) => (
                    <li key={item.name}>
                      <a
                        href="#"
                        className="flex items-center gap-2 text-gray-300 hover:text-white font-bold transition-colors group"
                      >
                        <span className="group-hover:animate-bounce">{item.emoji}</span>
                        <span className="group-hover:translate-x-1 transition-transform">{item.name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Section BRUTAL */}
            <div className="pt-8 border-t-4 border-white/20">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                  <p className="text-lg font-bold text-white mb-2">
                    © MandaBem 2026. Todos os direitos reservados. 🎨
                  </p>
                  <p className="text-sm text-gray-400 font-medium">
                    ✅ Concurso cultural com critérios objetivos de avaliação
                  </p>
                </div>
                <div className="card-brutal px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-black text-lg hover:scale-105 transition-transform">
                  Feito com 💜 no Brasil
                </div>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
