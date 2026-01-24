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
  title: "Orga - Financial Planning Made Simple",
  description: "Ensuring your financial plan stays organized with data-driven insights and exceptional services.",
  keywords: ["financial planning", "stocks", "bonds", "banking", "investment"],
  authors: [{ name: "Orga" }],
  creator: "Orga",
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
                <div className="text-2xl font-bold text-neutral-900 mb-4">Orga.</div>
                <p className="text-neutral-600 mb-6 max-w-md">
                  Ensuring your financial plan stays organized with exceptional services.
                </p>
              </div>

              {/* Links */}
              <div>
                <h3 className="font-bold text-neutral-900 mb-4 text-sm">Solution</h3>
                <ul className="space-y-3">
                  <li><a href="#" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">Loan & Mortgage</a></li>
                  <li><a href="#" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">Negotiation</a></li>
                  <li><a href="#" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">Taxes</a></li>
                  <li><a href="#" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">Support</a></li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-neutral-900 mb-4 text-sm">Resources</h3>
                <ul className="space-y-3">
                  <li><a href="#" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">Blog</a></li>
                  <li><a href="#" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">Contact</a></li>
                  <li><a href="#" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">Careers</a></li>
                  <li><a href="#" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">About</a></li>
                </ul>
              </div>
            </div>

            {/* Bottom */}
            <div className="pt-8 border-t border-neutral-200 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-neutral-500">
                © Orga. 2025
              </p>
              <div className="flex items-center gap-6">
                <a href="#" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">Privacy Policy</a>
                <a href="#" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">Terms & Conditions</a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
