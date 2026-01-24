# ⚡ Quick Start - MandaBem

Guia rápido para rodar o projeto em 5 minutos!

## 🚀 Passos Rápidos

### 1. Instalar dependências

```bash
cd mandabem
npm install
```

### 2. Configurar Supabase

1. Crie conta em [supabase.com](https://supabase.com)
2. Crie novo projeto
3. Vá em SQL Editor e execute: `supabase/migrations/001_initial_schema.sql`
4. Vá em Storage e crie bucket `submissions` (público)
5. Copie as credenciais em Settings > API

### 3. Configurar .env

Crie `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=sua-url-aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-key-aqui
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-aqui
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Rodar

```bash
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

## 🎯 Próximos Passos

1. **Criar um local** (Admin > Criar Novo Local)
2. **Criar um desafio** (Admin > Criar Novo Desafio)
3. **Testar participação** (Página inicial > Ver desafio > Participar)
4. **Avaliar** (Admin > Avaliar)
5. **Ver ranking** (Página do desafio > Ver ranking)

## 🔧 Comandos Úteis

```bash
npm run dev      # Desenvolvimento
npm run build    # Build
npm run start    # Produção
npm run lint     # Linter
```

## 📝 Dados de Teste

Para popular o banco rapidamente, use estes dados:

### Local de Teste
- Nome: Bar do Teste
- Endereço: Rua Teste, 123
- Cidade: São Paulo

### Desafio de Teste
- Título: Melhor slogan para cerveja
- Tema: Marketing
- Prêmio: 500
- Regras: 
  - Máximo 50 caracteres
  - Deve ser engraçado
  - Não pode ofender

### Participação de Teste
- Email: teste@teste.com
- CPF: 123.456.789-00 (formato válido mas fictício)
- Nome: João Teste

## ❓ Problemas Comuns

### Erro de conexão com Supabase
- Verifique se as URLs estão corretas
- Verifique se executou a migration
- Verifique se o projeto está ativo

### Erro no upload de imagem
- Verifique se criou o bucket `submissions`
- Verifique se o bucket está público
- Verifique CORS no Storage

### Erro de autenticação
- Verifique se a anon key está correta
- Verifique se o email provider está habilitado
- Verifique spam no email

## 📚 Documentação Completa

Para mais detalhes, veja:
- [README.md](./README.md) - Documentação completa
- [DEPLOY.md](./DEPLOY.md) - Guia de deploy

## 🆘 Ajuda

Problemas? Abra uma issue no GitHub!

---

**Boa sorte! 🎨🚀**
