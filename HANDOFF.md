# 📋 HANDOFF - Estado Atual do Projeto MandaBem

## 🎯 Visão Geral
Plataforma de concursos culturais onde usuários participam de desafios criativos em estabelecimentos parceiros e concorrem a prêmios reais baseados em avaliação de jurados (não é sorteio).

---

## 🛠️ Stack Tecnológica

### Frontend
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** (design system customizado)
- **Framer Motion** (animações)
- **Lucide React** (ícones)

### Backend/Infraestrutura
- **Supabase**
  - Auth (autenticação com email/senha)
  - Database (PostgreSQL)
  - Storage (upload de imagens)
- **Vercel** (deploy automático via GitHub)

### Pacotes Principais
```json
{
  "@supabase/ssr": "^0.5.2",
  "@supabase/supabase-js": "^2.47.10",
  "framer-motion": "^11.15.0",
  "lucide-react": "^0.468.0",
  "next": "14.2.35",
  "react": "^18.3.1",
  "tailwindcss": "^3.4.17"
}
```

---

## 📁 Estrutura de Arquivos

```
/app
  /page.tsx                    # Landing page (hero + como funciona + FAQ)
  /desafio/[id]/page.tsx       # Detalhes do desafio
  /participar/[id]/page.tsx    # Formulário de participação
  /meus-envios/page.tsx        # Dashboard do usuário
  /ranking/[id]/page.tsx       # Ranking do desafio
  /admin/page.tsx              # Dashboard administrativo
  /admin/avaliar/page.tsx      # Painel de jurados
  /api/
    /auth/login/route.ts       # API de autenticação
    /submissions/create/route.ts
    /payments/confirm/route.ts
    /admin/challenges/create/route.ts
    /admin/locations/create/route.ts
    /admin/evaluations/create/route.ts

/components
  /AuthModal.tsx               # Modal de login/cadastro
  /Header.tsx                  # Navegação principal
  /Footer.tsx                  # Rodapé
  /ScrollButton.tsx            # Botão com scroll suave
  /ChallengeCard.tsx           # Card de desafio
  /CityFilter.tsx              # Filtro por cidade
  /ParticipationForm.tsx       # Formulário de participação
  /admin/
    /CreateChallengeForm.tsx
    /CreateLocationForm.tsx
    /EvaluationPanel.tsx

/lib
  /supabase/
    /client.ts                 # Cliente Supabase (browser)
    /server.ts                 # Cliente Supabase (server)
  /admin.ts                    # Verificação de admin
  /scoring.ts                  # Cálculo de pontuação
  /utils.ts                    # Funções utilitárias
  /validations.ts              # Schemas Zod

/hooks
  /useMediaQuery.ts
  /useLocalStorage.ts
  /useDebounce.ts
  /useIntersectionObserver.ts
```

---

## 🗄️ Banco de Dados (Supabase)

### Tabelas Principais

#### `profiles`
```sql
id          uuid (PK, FK -> auth.users)
email       text
cpf         text (unique)
name        text
created_at  timestamp
```

#### `locations` (estabelecimentos parceiros)
```sql
id          uuid (PK)
name        text
address     text
city        text
active      boolean
created_at  timestamp
```

#### `challenges` (desafios)
```sql
id          uuid (PK)
location_id uuid (FK -> locations)
title       text
description text
theme       text
prize       text
rules       text
starts_at   timestamp
ends_at     timestamp
status      text (active, evaluating, finished)
created_at  timestamp
```

#### `submissions` (participações)
```sql
id              uuid (PK)
challenge_id    uuid (FK -> challenges)
user_id         uuid (FK -> auth.users)
content_type    text (photo, text)
content_url     text
content_text    text
payment_amount  decimal
attempt_number  integer
score_final     decimal
status          text (pending_payment, paid, evaluating, evaluated)
created_at      timestamp
```

#### `evaluations` (avaliações dos jurados)
```sql
id              uuid (PK)
submission_id   uuid (FK -> submissions)
judge_id        uuid (FK -> judges)
creativity      integer (0-10)
adequacy        integer (0-10)
execution       integer (0-10)
engagement      integer (0-10)
strategy        integer (0-10)
notes           text
created_at      timestamp
```

#### `judges` (jurados)
```sql
id          uuid (PK)
user_id     uuid (FK -> auth.users)
active      boolean
created_at  timestamp
```

### Políticas RLS (Row Level Security)
- Leitura pública para `locations`, `challenges`, `submissions` (rankings)
- Usuários só veem próprio perfil
- Apenas admins podem criar/editar desafios e locais

---

## ✅ O que FUNCIONA

### Autenticação
- ✅ Cadastro com email/senha
- ✅ Login com email/senha
- ✅ Logout
- ✅ Criação automática de perfil (tabela `profiles`)
- ✅ Verificação de usuário logado
- ✅ Modal de auth com design épico

### Landing Page
- ✅ Hero section clara e objetiva
- ✅ Seção "Como Funciona" com 5 passos detalhados
- ✅ FAQ com 4 perguntas comuns
- ✅ Listagem de desafios ativos
- ✅ Filtro por cidade
- ✅ Scroll suave entre seções

### Páginas
- ✅ Página de detalhes do desafio
- ✅ Página "Minhas Participações" (dashboard do usuário)
- ✅ Página de ranking
- ✅ Estrutura de admin dashboard

### Design
- ✅ Design system completo com Tailwind
- ✅ Cores vibrantes e gradientes
- ✅ Animações suaves
- ✅ Responsivo (mobile, tablet, desktop)
- ✅ Cards brutais e neon
- ✅ Tipografia customizada

---

## ❌ O que FALTA (próximo agente deve implementar)

### 1. 💳 Integração de Pagamento REAL
**Prioridade: ALTA**

Atualmente o pagamento é MOCK. Precisa integrar:
- Mercado Pago PIX ou Stripe
- Gerar QR Code de pagamento
- Webhook para confirmar pagamento
- Atualizar status da submission

**Arquivos a modificar:**
- `/app/participar/[id]/page.tsx` - Adicionar botão de pagamento real
- `/app/api/payments/confirm/route.ts` - Implementar webhook
- `.env.local` - Adicionar chaves do Mercado Pago

**Referência:**
```typescript
// Mercado Pago PIX
import mercadopago from 'mercadopago'

mercadopago.configure({
  access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN
})

const payment = await mercadopago.payment.create({
  transaction_amount: 7.00,
  description: 'Participação em desafio',
  payment_method_id: 'pix',
  payer: { email: user.email }
})

// Retornar payment.body.point_of_interaction.transaction_data.qr_code
```

### 2. 📸 Upload de Imagens
**Prioridade: ALTA**

Atualmente não há upload funcional. Precisa:
- Integrar Supabase Storage
- Criar bucket público `submissions`
- Upload com preview
- Validação de tamanho/formato
- Compressão de imagem

**Arquivos a modificar:**
- `/components/ParticipationForm.tsx` - Adicionar input de file
- `/app/api/submissions/create/route.ts` - Fazer upload para Supabase Storage

**Referência:**
```typescript
// Upload para Supabase Storage
const file = formData.get('photo')
const fileName = `${userId}_${Date.now()}.jpg`

const { data, error } = await supabase.storage
  .from('submissions')
  .upload(fileName, file)

const publicUrl = supabase.storage
  .from('submissions')
  .getPublicUrl(fileName).data.publicUrl
```

### 3. ⚖️ Sistema de Avaliação dos Jurados
**Prioridade: MÉDIA**

Painel de avaliação existe mas precisa:
- Listar submissions pendentes
- Formulário de avaliação (5 critérios de 0-10)
- Cálculo automático do score final
- Atualizar ranking em tempo real

**Arquivos a modificar:**
- `/app/admin/avaliar/page.tsx` - Melhorar UI
- `/lib/scoring.ts` - Implementar cálculo de score

**Fórmula do Score:**
```
score_final = (creativity * 0.30) + 
              (adequacy * 0.25) + 
              (execution * 0.20) + 
              (engagement * 0.15) + 
              (strategy * 0.10)
```

### 4. 📧 Notificações por Email
**Prioridade: BAIXA**

Enviar emails em:
- Confirmação de cadastro
- Pagamento confirmado
- Submission avaliada
- Resultado do desafio

**Integração sugerida:** Resend ou SendGrid

### 5. 🔧 Admin 100% Funcional
**Prioridade: MÉDIA**

Falta:
- Editar desafios existentes
- Encerrar desafios manualmente
- Ver lista de participações por desafio
- Exportar relatórios (CSV)
- Gerenciar jurados

**Arquivo principal:**
- `/app/admin/page.tsx`

### 6. 🧪 Testes
**Prioridade: BAIXA**

Não há testes implementados. Sugestão:
- Jest + React Testing Library
- Testes unitários para `lib/scoring.ts`
- Testes E2E com Playwright

---

## 🔑 Variáveis de Ambiente

### `.env.local` (já configurado)
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://eafjcrvelxiklsdpimlu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...

# Mercado Pago (FALTA CONFIGURAR)
MERCADO_PAGO_ACCESS_TOKEN=seu-token-aqui
NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY=sua-public-key-aqui

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🔐 Configuração de Admin

Para acessar `/admin`, adicione seu email em:

**`/lib/admin.ts`:**
```typescript
const ADMIN_EMAILS = [
  'seu-email@exemplo.com', // ← TROCAR AQUI
  'admin@mandabem.com',
]
```

---

## 🚀 Como Rodar Localmente

```bash
# 1. Clonar repo
git clone https://github.com/eubbbruno/mandabem.git
cd mandabem

# 2. Instalar dependências
npm install

# 3. Configurar .env.local
cp .env.example .env.local
# Editar .env.local com suas chaves do Supabase

# 4. Executar SQL no Supabase
# Abrir SUPABASE_SETUP.sql e executar no SQL Editor

# 5. Rodar dev server
npm run dev

# 6. Acessar
# http://localhost:3000
```

---

## 📊 Fluxo Completo do Usuário

```
1. Usuário acessa homepage
   ↓
2. Vê desafios ativos
   ↓
3. Clica em "Participar"
   ↓
4. Se não logado: Modal de login/cadastro
   ↓
5. Preenche formulário (foto ou texto)
   ↓
6. Paga R$7 via PIX (MOCK - precisa implementar)
   ↓
7. Submission criada com status "pending_payment"
   ↓
8. Webhook confirma pagamento → status "paid"
   ↓
9. Jurados avaliam → status "evaluating"
   ↓
10. Score calculado → status "evaluated"
    ↓
11. Ranking atualizado
    ↓
12. Vencedor recebe prêmio via Pix
```

---

## 🐛 Problemas Conhecidos

### 1. Pagamento é MOCK
- Não há integração real com gateway de pagamento
- Botão "Confirmar Pagamento (Mock)" apenas simula

### 2. Upload de imagem não funciona
- Input de file existe mas não faz upload
- Precisa integrar Supabase Storage

### 3. Avaliação dos jurados incompleta
- Painel existe mas não lista submissions
- Não calcula score automaticamente

### 4. Admin não tem CRUD completo
- Não dá pra editar desafios
- Não dá pra ver participações por desafio

---

## 📝 Próximos Passos Recomendados

### Fase 1 - MVP Funcional (1-2 semanas)
1. ✅ Integrar Mercado Pago PIX
2. ✅ Implementar upload de imagens
3. ✅ Completar sistema de avaliação
4. ✅ Testar fluxo completo end-to-end

### Fase 2 - Melhorias (1 semana)
1. ✅ Notificações por email
2. ✅ Admin CRUD completo
3. ✅ Relatórios e exportação

### Fase 3 - Polimento (1 semana)
1. ✅ Testes automatizados
2. ✅ Otimização de performance
3. ✅ SEO e meta tags
4. ✅ Analytics

---

## 🆘 Troubleshooting

### "Application error: a server-side exception has occurred"
**Causa:** Variáveis de ambiente não configuradas no Vercel

**Solução:**
1. Vercel Dashboard → Settings → Environment Variables
2. Adicionar `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Redeploy

### "Property 'email' does not exist on type 'never'"
**Causa:** TypeScript não conhece estrutura das tabelas

**Solução:** Adicionar `as any` nos inserts/selects do Supabase

### Build falha com erro de tipagem
**Solução:**
```bash
npm run build
# Ver erros
# Adicionar `as any` onde necessário
```

---

## 📞 Contato

- **Repositório:** https://github.com/eubbbruno/mandabem
- **Deploy:** https://mandabem.vercel.app
- **Supabase:** https://eafjcrvelxiklsdpimlu.supabase.co

---

## ✅ Checklist para Próximo Agente

Antes de começar, verifique:

- [ ] Consegue rodar `npm run dev` sem erros
- [ ] Consegue fazer login/cadastro
- [ ] Consegue ver desafios na homepage
- [ ] Consegue acessar `/admin` (depois de configurar email)
- [ ] Leu este documento completo
- [ ] Entendeu o fluxo do usuário
- [ ] Sabe quais são as prioridades (pagamento + upload)

**BOA SORTE! 🚀**

---

_Última atualização: Janeiro 2026_
