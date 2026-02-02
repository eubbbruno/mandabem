# 🚀 INSTRUÇÕES DE SETUP - MANDABEM

## ✅ **PASSO 1: CONFIGURAR SUPABASE (OBRIGATÓRIO)**

### 1.1 Acessar o Supabase
1. Vá para https://supabase.com
2. Faça login na sua conta
3. Selecione seu projeto "MandaBem"

### 1.2 Executar SQL
1. No menu lateral, clique em **SQL Editor**
2. Clique em **New Query**
3. Abra o arquivo `SUPABASE_SETUP.sql` (está na raiz do projeto)
4. **COPIE TODO O CONTEÚDO** do arquivo
5. **COLE** no SQL Editor do Supabase
6. Clique em **RUN** (botão verde)
7. Aguarde a mensagem de sucesso ✅

### 1.3 Verificar se funcionou
No final do SQL, você vai ver uma tabela mostrando quantos registros tem em cada tabela:
```
tabela       | registros
-------------|----------
profiles     | 0
users        | 0
challenges   | X
submissions  | X
```

Se aparecer isso, **FUNCIONOU!** 🎉

---

## ✅ **PASSO 2: CONFIGURAR EMAIL DE ADMIN**

### 2.1 Editar arquivo de admin
1. Abra o arquivo `lib/admin.ts`
2. Na linha 4, **SUBSTITUA** `'seu@email.com'` pelo **SEU EMAIL REAL**
3. Exemplo:
```typescript
const ADMIN_EMAILS = [
  'bruno@mandabem.com', // ← Coloque seu email aqui
  'admin@mandabem.com',
]
```
4. Salve o arquivo

### 2.2 Fazer commit
```bash
git add .
git commit -m "config: adiciona email de admin"
git push
```

---

## ✅ **PASSO 3: TESTAR O SISTEMA**

### 3.1 Aguardar Deploy
- A Vercel vai fazer o deploy automático
- Aguarde ~2 minutos
- Acesse seu site: https://seu-site.vercel.app

### 3.2 Testar Cadastro
1. Clique em **"🔐 Entrar / Cadastrar"** no Header
2. Clique em **"Criar agora (é grátis!)"**
3. Preencha:
   - Nome: Seu nome
   - CPF: Qualquer CPF válido (pode ser fake pra teste)
   - Email: Seu email REAL
   - Senha: Mínimo 6 caracteres
4. Clique em **"✅ Criar Conta"**
5. **IMPORTANTE:** Vá no seu email e confirme o cadastro (link do Supabase)

### 3.3 Testar Login
1. Depois de confirmar o email, volte pro site
2. Clique em **"🔐 Entrar / Cadastrar"**
3. Faça login com seu email e senha
4. Se aparecer seu nome no Header, **FUNCIONOU!** 🎉

### 3.4 Testar Logout
1. Clique no botão **"Sair"** (vermelho) no Header
2. Você deve ser deslogado
3. O botão **"🔐 Entrar / Cadastrar"** deve aparecer de novo

---

## ✅ **PASSO 4: TESTAR FLUXO COMPLETO**

### 4.1 Navegar pelo Site
1. ✅ Clique em **"🚀 Ver Desafios"** → Deve rolar suavemente para os desafios
2. ✅ Clique em **"💡 Como Funciona"** → Deve rolar para a explicação
3. ✅ Clique em um card de desafio → Deve abrir a página de detalhes
4. ✅ Na página de detalhes, veja:
   - Prêmio em destaque
   - Local e prazo
   - Regras numeradas
   - Critérios de avaliação (com emojis)
   - Botão "🎨 PARTICIPAR AGORA"

### 4.2 Testar Participação (se tiver desafios ativos)
1. Clique em **"🎨 PARTICIPAR AGORA"**
2. Preencha o formulário
3. Envie
4. Vá em **"📊 Minhas Participações"**
5. Deve aparecer sua participação

---

## ✅ **PASSO 5: VERIFICAR ADMIN (OPCIONAL)**

### 5.1 Acessar Painel Admin
1. Vá para `/admin` (ex: https://seu-site.vercel.app/admin)
2. Se você configurou seu email corretamente, deve ver o dashboard
3. Se não configurou, vai dar erro de "Acesso negado"

### 5.2 Criar Desafio de Teste
1. No painel admin, role até **"Criar Novo Desafio"**
2. Preencha:
   - Título: "Teste de Desafio"
   - Descrição: "Apenas um teste"
   - Tema: "Teste"
   - Prêmio: 100
   - Selecione um local
   - Datas de início e fim
3. Clique em **"Criar Desafio"**
4. Volte pra homepage e veja se o desafio aparece

---

## 🐛 **PROBLEMAS COMUNS**

### Problema 1: "Application error: a server-side exception has occurred"
**Solução:**
- Verifique se você executou o SQL no Supabase (Passo 1)
- Verifique se as variáveis de ambiente estão configuradas no Vercel:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Problema 2: Botão "Entrar / Cadastrar" não abre nada
**Solução:**
- Limpe o cache do navegador (Ctrl + Shift + R)
- Aguarde o deploy terminar (veja no Vercel)

### Problema 3: "Email not confirmed"
**Solução:**
- Vá no seu email e clique no link de confirmação do Supabase
- Se não recebeu, vá no Supabase > Authentication > Users e confirme manualmente

### Problema 4: Não consigo acessar /admin
**Solução:**
- Verifique se você editou o arquivo `lib/admin.ts` com seu email
- Faça commit e push das mudanças
- Aguarde o deploy
- Faça login com o email que você colocou no `admin.ts`

---

## 📋 **CHECKLIST FINAL**

Antes de considerar pronto, verifique:

- [ ] SQL executado no Supabase
- [ ] Tabela `profiles` criada
- [ ] Email de admin configurado em `lib/admin.ts`
- [ ] Consegue criar conta
- [ ] Consegue fazer login
- [ ] Consegue fazer logout
- [ ] Nome aparece no Header quando logado
- [ ] Botões de scroll funcionam
- [ ] Página de desafio abre
- [ ] Página "Minhas Participações" abre (sem erro)
- [ ] FAQ aparece na homepage
- [ ] Critérios de avaliação aparecem na página de desafio

---

## 🎉 **PRONTO!**

Se todos os itens do checklist estão ✅, seu sistema está **100% FUNCIONAL!**

Agora você pode:
1. Criar desafios reais
2. Aceitar participações
3. Avaliar submissions
4. Pagar prêmios

**BOA SORTE! 🚀**

---

## 📞 **PRECISA DE AJUDA?**

Se algo não funcionou, me mande:
1. Print do erro
2. URL do site
3. O que você estava tentando fazer

Vou te ajudar a resolver! 💪
