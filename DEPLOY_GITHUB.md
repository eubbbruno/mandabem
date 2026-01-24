# 🚀 Deploy no GitHub + Vercel

## Passo 1: Criar Repositório no GitHub

1. Acesse: https://github.com/new
2. Nome: `mandabem`
3. **NÃO** inicialize com README
4. Clique em "Create repository"

## Passo 2: Conectar ao GitHub

Execute estes comandos (substitua SEU-USUARIO pelo seu usuário do GitHub):

```bash
git remote add origin https://github.com/SEU-USUARIO/mandabem.git
git branch -M main
git push -u origin main
```

## Passo 3: Deploy na Vercel

1. Acesse: https://vercel.com/new
2. Clique em "Import Project"
3. Selecione o repositório `mandabem`
4. Configure as variáveis de ambiente:

```
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key-aqui
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key-aqui
NEXT_PUBLIC_APP_URL=https://seu-app.vercel.app
```

5. Clique em "Deploy"

## ✅ Pronto!

Seu app estará no ar em ~2 minutos!

---

## 🔄 Para Atualizar (Futuros Commits)

```bash
git add .
git commit -m "descrição da mudança"
git push
```

A Vercel fará deploy automático! 🎉
