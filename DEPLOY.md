# 🚀 Guia de Deploy - MandaBem

Este guia detalha o processo completo de deploy da plataforma MandaBem.

## 📋 Checklist Pré-Deploy

- [ ] Conta no Supabase criada
- [ ] Projeto Supabase configurado
- [ ] Migrations executadas
- [ ] Storage bucket criado
- [ ] Variáveis de ambiente configuradas
- [ ] Build local testado
- [ ] Conta Vercel/plataforma de deploy

## 🗄️ 1. Configuração do Supabase

### 1.1. Criar Projeto

1. Acesse [supabase.com](https://supabase.com)
2. Clique em "New Project"
3. Escolha:
   - Nome: `mandabem-prod`
   - Database Password: (gere uma senha forte)
   - Region: South America (São Paulo) - mais próximo do Brasil
   - Pricing: Free (para começar)

### 1.2. Executar Migrations

1. No painel do Supabase, vá em **SQL Editor**
2. Clique em "New Query"
3. Copie todo o conteúdo de `supabase/migrations/001_initial_schema.sql`
4. Cole no editor e clique em "Run"
5. Aguarde a confirmação de sucesso

### 1.3. Configurar Storage

1. Vá em **Storage** no menu lateral
2. Clique em "Create a new bucket"
3. Nome: `submissions`
4. Public bucket: **SIM** (marque a opção)
5. Clique em "Create bucket"

### 1.4. Configurar Autenticação

1. Vá em **Authentication** > **Providers**
2. Habilite **Email** (já vem habilitado)
3. Em **Email Templates**, customize os emails:
   - Confirm signup
   - Magic Link
   - Change Email Address
   - Reset Password

### 1.5. Pegar Credenciais

1. Vá em **Settings** > **API**
2. Copie:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ NUNCA exponha no frontend!)

## 🌐 2. Deploy na Vercel

### 2.1. Preparar Repositório

```bash
# Inicialize o git se ainda não fez
git init
git add .
git commit -m "Initial commit - MandaBem MVP"

# Crie um repositório no GitHub e faça push
git remote add origin https://github.com/seu-usuario/mandabem.git
git branch -M main
git push -u origin main
```

### 2.2. Conectar Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Clique em "Add New Project"
3. Importe seu repositório do GitHub
4. Configure:
   - Framework Preset: **Next.js**
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

### 2.3. Configurar Variáveis de Ambiente

Na seção "Environment Variables", adicione:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key
NEXT_PUBLIC_APP_URL=https://seu-dominio.vercel.app
```

⚠️ **IMPORTANTE**: 
- Marque todas como disponíveis em **Production**, **Preview** e **Development**
- NUNCA commite o arquivo `.env` no git

### 2.4. Deploy

1. Clique em "Deploy"
2. Aguarde o build (2-3 minutos)
3. Acesse o link gerado (ex: `mandabem.vercel.app`)

## 🔧 3. Configurações Pós-Deploy

### 3.1. Configurar Domínio Customizado (Opcional)

1. Na Vercel, vá em **Settings** > **Domains**
2. Adicione seu domínio (ex: `mandabem.com.br`)
3. Configure os DNS conforme instruções
4. Aguarde propagação (até 48h)

### 3.2. Atualizar URLs no Supabase

1. No Supabase, vá em **Authentication** > **URL Configuration**
2. Adicione seu domínio em:
   - Site URL: `https://seu-dominio.com.br`
   - Redirect URLs: `https://seu-dominio.com.br/**`

### 3.3. Testar Funcionalidades

Teste cada fluxo:
- [ ] Landing page carrega
- [ ] Filtro de cidades funciona
- [ ] Detalhes do desafio abrem
- [ ] Login/cadastro funciona
- [ ] Upload de foto funciona
- [ ] Pagamento (mock) funciona
- [ ] Meus envios exibe corretamente
- [ ] Ranking exibe corretamente
- [ ] Admin dashboard abre
- [ ] Criação de desafio funciona
- [ ] Avaliação funciona

## 💳 4. Integração Mercado Pago (Produção)

### 4.1. Criar Conta

1. Acesse [mercadopago.com.br](https://www.mercadopago.com.br)
2. Crie uma conta empresarial
3. Complete a verificação

### 4.2. Obter Credenciais

1. Vá em **Seu negócio** > **Configurações** > **Credenciais**
2. Copie:
   - Access Token (produção)
   - Public Key (produção)

### 4.3. Implementar PIX

Substitua o mock em `app/api/payments/confirm/route.ts`:

```typescript
// Exemplo de integração real
import { MercadoPagoConfig, Payment } from 'mercadopago';

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN! 
});

const payment = new Payment(client);

const body = {
  transaction_amount: paymentAmount,
  description: `Participação no desafio ${challengeTitle}`,
  payment_method_id: 'pix',
  payer: {
    email: userEmail,
  }
};

const response = await payment.create({ body });
// Use response.point_of_interaction.transaction_data.qr_code
```

### 4.4. Configurar Webhook

1. No Mercado Pago, configure webhook para:
   `https://seu-dominio.com.br/api/webhooks/mercadopago`
2. Implemente o endpoint para processar notificações

## 📊 5. Monitoramento

### 5.1. Vercel Analytics

1. Na Vercel, habilite **Analytics**
2. Monitore:
   - Page views
   - Unique visitors
   - Top pages
   - Performance

### 5.2. Supabase Logs

1. No Supabase, vá em **Logs**
2. Monitore:
   - API requests
   - Database queries
   - Auth events
   - Storage uploads

### 5.3. Error Tracking (Opcional)

Integre Sentry para tracking de erros:

```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

## 🔒 6. Segurança

### 6.1. Checklist de Segurança

- [ ] RLS policies ativas no Supabase
- [ ] Service role key apenas no servidor
- [ ] HTTPS forçado (Vercel faz automaticamente)
- [ ] Rate limiting configurado
- [ ] Validação de dados no backend
- [ ] Sanitização de inputs
- [ ] CORS configurado corretamente

### 6.2. Backup

Configure backup automático no Supabase:
1. Vá em **Settings** > **Database**
2. Habilite **Point-in-time Recovery** (plano pago)
3. Ou configure backups manuais semanais

## 📈 7. Otimizações

### 7.1. Performance

- [ ] Imagens otimizadas (Next.js Image)
- [ ] Lazy loading implementado
- [ ] Cache configurado
- [ ] CDN ativo (Vercel Edge Network)

### 7.2. SEO

Adicione em cada página:

```typescript
export const metadata = {
  title: 'Título da Página - MandaBem',
  description: 'Descrição otimizada',
  openGraph: {
    images: ['/og-image.jpg'],
  },
}
```

## 🆘 8. Troubleshooting

### Build Falha

```bash
# Teste local
npm run build

# Se falhar, verifique:
# - Erros de TypeScript
# - Imports faltando
# - Variáveis de ambiente
```

### Erro 500 em Produção

1. Verifique logs na Vercel
2. Verifique logs no Supabase
3. Teste endpoints da API individualmente

### Imagens não carregam

1. Verifique bucket público no Supabase
2. Verifique CORS no Storage
3. Verifique `next.config.js` domains

### Auth não funciona

1. Verifique URLs no Supabase
2. Verifique redirect URLs
3. Teste magic link no email

## 📞 9. Suporte

- **Vercel**: [vercel.com/support](https://vercel.com/support)
- **Supabase**: [supabase.com/support](https://supabase.com/support)
- **Mercado Pago**: [mercadopago.com.br/developers](https://www.mercadopago.com.br/developers)

## ✅ 10. Checklist Final

Antes de anunciar:

- [ ] Todos os testes passando
- [ ] Performance otimizada (Lighthouse > 90)
- [ ] Mobile testado em dispositivos reais
- [ ] Emails de autenticação funcionando
- [ ] Pagamentos funcionando (mesmo que mock)
- [ ] Regulamento legal revisado
- [ ] Termos de uso e privacidade publicados
- [ ] Suporte configurado
- [ ] Monitoramento ativo
- [ ] Backup configurado

---

🎉 **Parabéns! Seu MandaBem está no ar!**

Próximos passos:
1. Crie os primeiros desafios
2. Convide jurados
3. Divulgue nos locais parceiros
4. Monitore e itere baseado no feedback
