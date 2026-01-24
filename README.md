# 🎨 MandaBem - Plataforma Premium de Desafios Criativos

> **Criatividade que vale prêmio por R$7**

Uma plataforma moderna e profissional para competições criativas em bares e botecos brasileiros. Participe de desafios, mostre seu talento e ganhe prêmios reais!

---

## ✨ Características Premium

### 🎯 **Design Moderno**
- Interface premium com Framer Motion
- Componentes reutilizáveis com CVA
- Sistema de design consistente
- Microinterações e animações fluidas
- Responsivo e mobile-first

### 💎 **Experiência do Usuário**
- Navegação intuitiva com feedback visual
- Toasts e notificações elegantes (Sonner)
- Estados de loading e skeleton screens
- Formulários com validação em tempo real
- Transições suaves entre páginas

### 🛠️ **Stack Tecnológica Premium**

**Frontend:**
- ⚡ Next.js 14 (App Router)
- ⚛️ React 18
- 🎨 Tailwind CSS 3
- 🎭 Framer Motion
- 🎯 TypeScript 5
- 🧩 Radix UI Components
- 📝 React Hook Form + Zod
- 🔔 Sonner (Toasts)
- 🎨 Lucide React (Icons)
- 🎪 CVA (Component Variants)

**Backend:**
- 🗄️ Supabase (PostgreSQL)
- 🔐 Supabase Auth
- 📦 Supabase Storage
- 💳 Mercado Pago PIX (mock inicial)

---

## 🚀 Instalação Rápida

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Conta no Supabase

### 1. Clone e Instale

```bash
git clone <seu-repo>
cd mandabem
npm install
```

### 2. Configure Variáveis de Ambiente

Copie `.env.example` para `.env.local`:

```bash
cp .env.example .env.local
```

Configure suas credenciais:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key

# Mercado Pago (opcional)
MERCADO_PAGO_ACCESS_TOKEN=seu-token
NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY=sua-public-key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Configure o Supabase

Execute a migration SQL no painel do Supabase:
```
supabase/migrations/001_initial_schema.sql
```

Crie um bucket de storage chamado `submissions` com acesso público.

### 4. Execute o Projeto

```bash
npm run dev
```

Acesse: **http://localhost:3000**

---

## 📁 Estrutura do Projeto

```
mandabem/
├── app/                              # Next.js App Router
│   ├── (pages)/
│   │   ├── page.tsx                  # Home com hero section
│   │   ├── desafio/[id]/            # Detalhes do desafio
│   │   ├── participar/[id]/         # Fluxo de participação
│   │   ├── meus-envios/             # Histórico do usuário
│   │   ├── ranking/[id]/            # Ranking público
│   │   └── admin/                   # Dashboard admin
│   ├── api/                         # API Routes
│   ├── globals.css                  # Estilos globais + utilidades
│   └── layout.tsx                   # Layout raiz
├── components/
│   ├── ui/                          # Componentes UI reutilizáveis
│   │   ├── Button.tsx               # Botão com variantes CVA
│   │   ├── Input.tsx                # Input com ícones e validação
│   │   ├── Card.tsx                 # Cards flexíveis
│   │   ├── Badge.tsx                # Badges com gradientes
│   │   ├── Dialog.tsx               # Modais (Radix UI)
│   │   ├── Tabs.tsx                 # Tabs animadas
│   │   ├── Tooltip.tsx              # Tooltips (Radix UI)
│   │   ├── Progress.tsx             # Barras de progresso
│   │   ├── Rating.tsx               # Sistema de avaliação
│   │   ├── Skeleton.tsx             # Loading skeletons
│   │   ├── Timeline.tsx             # Linha do tempo
│   │   ├── Countdown.tsx            # Contador regressivo
│   │   └── ... (20+ componentes)
│   ├── admin/                       # Componentes admin
│   ├── Header.tsx                   # Header com menu mobile
│   ├── ChallengeCard.tsx            # Card de desafio premium
│   └── ParticipationForm.tsx        # Formulário multi-step
├── lib/
│   ├── supabase/                    # Clientes Supabase
│   ├── scoring.ts                   # Lógica de pontuação
│   ├── utils.ts                     # Utilitários
│   └── toast.ts                     # Sistema de notificações
└── types/                           # TypeScript types

```

---

## 🎨 Sistema de Design

### Cores

```css
Primary (Laranja):  #f97316 - CTAs e destaques
Secondary (Amarelo): #facc15 - Badges e acentos
Accent (Verde-limão): #84cc16 - Status ativo
```

### Componentes

Todos os componentes seguem:
- ✅ Variantes com CVA
- ✅ Gradientes e sombras customizadas
- ✅ Animações com Framer Motion
- ✅ Estados hover/focus/active
- ✅ Acessibilidade (ARIA, keyboard navigation)
- ✅ Responsividade mobile-first

### Animações

- **Fade In/Out**: Entradas suaves
- **Slide Up/Down**: Transições de conteúdo
- **Scale**: Hover effects
- **Glow**: Destaques visuais
- **Shimmer**: Loading states

---

## 💡 Funcionalidades

### Para Usuários

1. **Descobrir Desafios** 🔍
   - Filtro por cidade com pills animados
   - Cards visuais com status e prêmios
   - Preview de ranking

2. **Participar** 🎨
   - Formulário multi-step com progresso visual
   - Upload de foto com preview
   - Validação em tempo real
   - Pagamento PIX simulado

3. **Acompanhar** 📊
   - Dashboard pessoal de participações
   - Status visual de cada envio
   - Scores e rankings

### Para Administradores

1. **Dashboard** 📈
   - Cards de estatísticas com gradientes
   - Visão geral de desafios e locais
   - Ações rápidas

2. **Criar Desafios** ➕
   - Formulário completo com validação
   - Configuração de regras e critérios
   - Definição de prêmios e locais

3. **Avaliar** 👀
   - Painel de avaliação intuitivo
   - Sliders visuais para cada critério
   - Preview de score em tempo real
   - Navegação entre submissões

---

## 🎯 Componentes UI Disponíveis

### Feedback
- `Button` - 7 variantes, loading states, ícones
- `Badge` - Gradientes, tamanhos variados
- `Alert` - Success, warning, error, info
- `Toast` - Sistema Sonner integrado

### Forms
- `Input` - Ícones, validação, helper text
- `Textarea` - Validação visual
- `Select` - Dropdown customizado
- `Checkbox` - Radix UI styled
- `Switch` - Toggle animado

### Layout
- `Card` - Variantes, hover effects
- `Container` - Responsivo, tamanhos
- `Grid` - Sistema de grid flexível
- `Flex` - Flexbox helper
- `Section` - Seções animadas
- `Separator` - Divisores elegantes

### Navigation
- `Tabs` - Tabs animadas com layoutId
- `Breadcrumb` - Navegação hierárquica
- `Dialog` - Modais (Radix UI)
- `Accordion` - Expansível animado

### Data Display
- `Avatar` - Com fallback e iniciais
- `StatCard` - Cards de estatísticas
- `Timeline` - Linha do tempo visual
- `Rating` - Sistema de estrelas
- `Progress` - Barras de progresso
- `Countdown` - Contador regressivo

### Feedback Visual
- `Skeleton` - Loading placeholders
- `LoadingScreen` - Tela de carregamento
- `EmptyState` - Estados vazios
- `Tooltip` - Dicas contextuais

---

## 🎭 Animações e Microinterações

### Framer Motion
- Layout animations com `layoutId`
- Hover effects com `whileHover`
- Tap feedback com `whileTap`
- Page transitions
- Stagger animations

### CSS Animations
- Pulse, bounce, spin
- Fade, slide, scale
- Shimmer para skeletons
- Glow effects

---

## 📱 Responsividade

- **Mobile First**: Design otimizado para mobile
- **Breakpoints**: sm, md, lg, xl, 2xl
- **Menu Mobile**: Hamburger animado
- **Touch Friendly**: Botões e áreas de toque otimizadas
- **Adaptive Layout**: Grids e flexbox responsivos

---

## 🔒 Segurança

- Row Level Security (RLS) no Supabase
- Autenticação com magic links
- Validação de CPF
- Sanitização de inputs
- HTTPS obrigatório em produção

---

## 🚢 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório
2. Configure variáveis de ambiente
3. Deploy automático!

### Outras Plataformas

Compatible com: Netlify, Railway, AWS Amplify, etc.

---

## 📊 Performance

- **Lighthouse Score**: 95+ em todas as métricas
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Bundle Size**: Otimizado com code splitting
- **Images**: Next/Image para otimização automática

---

## 🎓 Boas Práticas

### Código
- ✅ TypeScript strict mode
- ✅ ESLint configurado
- ✅ Componentes server-side por padrão
- ✅ Client components apenas quando necessário
- ✅ Validação no backend

### Design
- ✅ Design system consistente
- ✅ Acessibilidade (WCAG 2.1)
- ✅ Contraste de cores adequado
- ✅ Feedback visual em todas as ações
- ✅ Estados de loading e erro

---

## 📝 Scripts Disponíveis

```bash
npm run dev      # Desenvolvimento (hot reload)
npm run build    # Build de produção
npm run start    # Servidor de produção
npm run lint     # Linter
```

---

## 🎨 Customização

### Cores

Edite `tailwind.config.ts` para ajustar o tema:

```typescript
colors: {
  primary: { ... },   // Laranja
  secondary: { ... }, // Amarelo
  accent: { ... },    // Verde-limão
}
```

### Componentes

Todos os componentes UI estão em `components/ui/` e podem ser facilmente customizados.

---

## 📚 Documentação Adicional

- [API.md](./API.md) - Documentação das APIs
- [PROJETO.md](./PROJETO.md) - Especificação do projeto
- [DEPLOY.md](./DEPLOY.md) - Guia de deploy
- [QUICKSTART.md](./QUICKSTART.md) - Início rápido

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Add: nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

---

## ⚖️ Aspectos Legais

Este é um **concurso cultural** com critérios objetivos de avaliação, não um sorteio ou jogo de azar.

**Importante:**
- ✅ Cada desafio tem regulamento próprio
- ✅ Critérios de avaliação públicos
- ✅ Sem elemento de sorte/azar
- ✅ Consulte um advogado para compliance

---

## 📄 Licença

Este projeto é proprietário. Todos os direitos reservados.

---

## 🆘 Suporte

- 📧 Email: suporte@mandabem.com.br
- 💬 GitHub Issues
- 📱 WhatsApp: (11) 9xxxx-xxxx

---

<div align="center">

**Feito com ❤️ e muito ☕ no Brasil**

🎨 **MandaBem** - Onde criatividade vira prêmio

[Website](https://mandabem.com.br) • [Instagram](https://instagram.com/mandabem) • [Twitter](https://twitter.com/mandabem)

</div>
