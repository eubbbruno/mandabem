# ⚙️ Configurar Variáveis de Ambiente na Vercel

## 🚨 IMPORTANTE: O site está com erro porque faltam as variáveis de ambiente!

Siga estes passos:

## 1️⃣ Acesse o Painel do Supabase

1. Vá para: https://supabase.com/dashboard
2. Selecione seu projeto (ou crie um novo)
3. Vá em **Settings** > **API**

## 2️⃣ Copie as Credenciais

Você vai precisar de:

- **Project URL**: `https://seu-projeto.supabase.co`
- **anon public**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **service_role**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (⚠️ Mantenha secreto!)

## 3️⃣ Configure na Vercel

1. Acesse: https://vercel.com/dashboard
2. Selecione o projeto `mandabem`
3. Vá em **Settings** > **Environment Variables**
4. Adicione estas 3 variáveis:

```
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key-aqui
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key-aqui
```

5. Clique em **Save**

## 4️⃣ Redeploy

1. Vá em **Deployments**
2. Clique nos 3 pontinhos do último deploy
3. Clique em **Redeploy**

## ✅ Pronto!

Aguarde ~2 minutos e o site estará funcionando!

---

## 🗄️ Criar Tabelas no Supabase (Se ainda não criou)

Execute este SQL no **SQL Editor** do Supabase:

```sql
-- Ver arquivo: supabase/migrations/001_initial_schema.sql
```

Ou copie o conteúdo do arquivo `supabase/migrations/001_initial_schema.sql` e execute no SQL Editor.

---

## 🎨 Site Funcionará Sem Supabase?

**SIM!** Agora o site mostra a landing page mesmo sem Supabase configurado.

Mas para ver os **desafios reais**, você precisa configurar o Supabase.
