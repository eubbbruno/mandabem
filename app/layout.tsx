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
        <footer className="bg-neutral-50 border-t border-neutral-200">
          <div className="container py-16">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
              {/* Brand */}
              <div className="md:col-span-2">
                <div className="text-2xl font-bold text-neutral-900 mb-4">MandaBem</div>
                <p className="text-neutral-600 mb-6 max-w-md">
                  Criatividade que vale prêmio. Participe de desafios criativos e ganhe prêmios reais.
                </p>
              </div>

              {/* Links */}
              <div>
                <h3 className="font-bold text-neutral-900 mb-4 text-sm">Plataforma</h3>
                <ul className="space-y-3">
                  <li><a href="/" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">Desafios</a></li>
                  <li><a href="#como-funciona" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">Como Funciona</a></li>
                  <li><a href="/meus-envios" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">Minhas Participações</a></li>
                  <li><a href="/admin" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">Admin</a></li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-neutral-900 mb-4 text-sm">Legal</h3>
                <ul className="space-y-3">
                  <li><a href="#" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">Regulamento</a></li>
                  <li><a href="#" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">Termos de Uso</a></li>
                  <li><a href="#" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">Privacidade</a></li>
                  <li><a href="#" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">Contato</a></li>
                </ul>
              </div>
            </div>

            {/* Bottom */}
            <div className="pt-8 border-t border-neutral-200 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-neutral-500">
                © MandaBem 2026. Todos os direitos reservados.
              </p>
              <p className="text-xs text-neutral-400">
                Concurso cultural com critérios objetivos de avaliação
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
