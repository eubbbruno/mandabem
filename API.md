# 🔌 API Documentation - MandaBem

Documentação das APIs do MandaBem para desenvolvedores.

## 🔐 Autenticação

Todas as APIs protegidas requerem autenticação via Supabase Auth.

```typescript
// Cliente
import { createClient } from '@/lib/supabase/client'
const supabase = createClient()

// Login
const { data, error } = await supabase.auth.signInWithOtp({
  email: 'usuario@email.com'
})
```

## 📡 Endpoints

### Auth

#### POST `/api/auth/login`

Faz login ou cria conta de usuário.

**Request:**
```json
{
  "email": "joao@email.com",
  "cpf": "12345678900",
  "name": "João Silva"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Link de login enviado para seu email",
  "userId": "uuid"
}
```

---

### Submissions

#### POST `/api/submissions/create`

Cria uma nova participação em um desafio.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request (FormData):**
```
challengeId: "uuid"
contentType: "photo" | "text"
attemptNumber: 1
paymentAmount: 7.00
photo: File (se contentType = photo)
contentText: "texto" (se contentType = text)
```

**Response:**
```json
{
  "success": true,
  "submissionId": "uuid"
}
```

---

### Payments

#### POST `/api/payments/confirm`

Confirma pagamento de uma participação.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**
```json
{
  "submissionId": "uuid",
  "paymentMethod": "pix"
}
```

**Response:**
```json
{
  "success": true,
  "paymentId": "PIX_123456",
  "message": "Pagamento confirmado!"
}
```

---

### Admin - Challenges

#### POST `/api/admin/challenges/create`

Cria um novo desafio (requer permissões admin).

**Request:**
```json
{
  "title": "Melhor slogan para cerveja",
  "description": "Crie um slogan criativo...",
  "theme": "Marketing",
  "prize": 500.00,
  "locationId": "uuid",
  "startsAt": "2026-01-20T18:00:00Z",
  "endsAt": "2026-01-27T23:59:59Z",
  "rules": [
    "Máximo 50 caracteres",
    "Deve ser engraçado",
    "Não pode ofender"
  ]
}
```

**Response:**
```json
{
  "success": true,
  "challenge": {
    "id": "uuid",
    "title": "...",
    ...
  }
}
```

---

### Admin - Locations

#### POST `/api/admin/locations/create`

Cria um novo local (requer permissões admin).

**Request:**
```json
{
  "name": "Bar do Zé",
  "address": "Rua das Flores, 123",
  "city": "São Paulo"
}
```

**Response:**
```json
{
  "success": true,
  "location": {
    "id": "uuid",
    "name": "Bar do Zé",
    ...
  }
}
```

---

### Admin - Evaluations

#### POST `/api/admin/evaluations/create`

Cria uma avaliação para uma participação (requer ser jurado).

**Request:**
```json
{
  "submissionId": "uuid",
  "strategy": 8,
  "engagement": 9,
  "adequacy": 7,
  "execution": 8,
  "creativity": 9,
  "notes": "Muito criativo e bem executado"
}
```

**Response:**
```json
{
  "success": true,
  "evaluation": {
    "id": "uuid",
    ...
  }
}
```

**Nota:** O score final é calculado automaticamente via trigger no banco.

---

## 🗄️ Database Queries

### Buscar Desafios Ativos

```typescript
const { data: challenges } = await supabase
  .from('challenges')
  .select(`
    *,
    locations (
      id,
      name,
      city
    )
  `)
  .eq('status', 'active')
  .order('starts_at', { ascending: false })
```

### Buscar Ranking de um Desafio

```typescript
const { data: ranking } = await supabase
  .from('submissions')
  .select(`
    *,
    users (
      name
    )
  `)
  .eq('challenge_id', challengeId)
  .eq('status', 'evaluated')
  .not('score_final', 'is', null)
  .order('score_final', { ascending: false })
  .limit(10)
```

### Buscar Participações do Usuário

```typescript
const { data: submissions } = await supabase
  .from('submissions')
  .select(`
    *,
    challenges (
      id,
      title,
      theme
    )
  `)
  .eq('user_id', userId)
  .order('created_at', { ascending: false })
```

### Calcular Número de Tentativa

```typescript
const { data: attemptNumber } = await supabase
  .rpc('get_user_attempt_number', {
    p_challenge_id: challengeId,
    p_user_id: userId
  })
```

---

## 🧮 Funções Utilitárias

### Cálculo de Preço

```typescript
import { calculatePrice } from '@/lib/scoring'

const price1 = calculatePrice(1) // R$ 7.00
const price2 = calculatePrice(2) // R$ 9.10
const price3 = calculatePrice(3) // R$ 11.20
```

### Cálculo de Score

```typescript
import { calculateFinalScore } from '@/lib/scoring'

const score = calculateFinalScore(
  {
    strategy: 8,
    engagement: 9,
    adequacy: 7,
    execution: 8,
    creativity: 9
  },
  attemptNumber: 1
)
// Retorna: 8.15 (exemplo)
```

### Validação de CPF

```typescript
import { validateCPF, formatCPF } from '@/lib/scoring'

const isValid = validateCPF('12345678900') // true/false
const formatted = formatCPF('12345678900') // "123.456.789-00"
```

### Formatação

```typescript
import { formatPrice, formatDate } from '@/lib/scoring'

const price = formatPrice(7.00) // "R$ 7,00"
const date = formatDate(new Date()) // "20/01/2026 15:30"
```

---

## 🔒 Row Level Security (RLS)

O Supabase usa RLS para controlar acesso aos dados:

### Users
- Usuários podem ver/editar apenas seus próprios dados

### Challenges
- Qualquer um pode ver desafios ativos/finalizados
- Apenas admins podem criar/editar

### Submissions
- Usuários veem apenas suas próprias participações
- Participações avaliadas são públicas (para ranking)

### Evaluations
- Apenas jurados podem ver/criar avaliações

---

## 📊 Webhooks (Futuro)

### Mercado Pago Webhook

```typescript
// POST /api/webhooks/mercadopago
{
  "action": "payment.created",
  "data": {
    "id": "123456789"
  }
}
```

Processar:
1. Verificar assinatura
2. Buscar detalhes do pagamento
3. Atualizar status da submission
4. Enviar notificação ao usuário

---

## 🧪 Exemplos de Uso

### Criar Participação Completa

```typescript
// 1. Login
const { data: authData } = await fetch('/api/auth/login', {
  method: 'POST',
  body: JSON.stringify({
    email: 'joao@email.com',
    cpf: '12345678900',
    name: 'João Silva'
  })
})

// 2. Criar submission
const formData = new FormData()
formData.append('challengeId', challengeId)
formData.append('contentType', 'text')
formData.append('contentText', 'Minha resposta criativa!')
formData.append('attemptNumber', '1')
formData.append('paymentAmount', '7.00')

const { data: submission } = await fetch('/api/submissions/create', {
  method: 'POST',
  body: formData
})

// 3. Confirmar pagamento
const { data: payment } = await fetch('/api/payments/confirm', {
  method: 'POST',
  body: JSON.stringify({
    submissionId: submission.submissionId,
    paymentMethod: 'pix'
  })
})
```

### Avaliar Participação

```typescript
const { data: evaluation } = await fetch('/api/admin/evaluations/create', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    submissionId: 'uuid',
    strategy: 8,
    engagement: 9,
    adequacy: 7,
    execution: 8,
    creativity: 9,
    notes: 'Excelente trabalho!'
  })
})
```

---

## 🐛 Tratamento de Erros

Todas as APIs retornam erros no formato:

```json
{
  "error": "Mensagem de erro descritiva"
}
```

Status codes:
- `200` - Sucesso
- `400` - Erro de validação
- `401` - Não autenticado
- `404` - Não encontrado
- `500` - Erro interno

---

## 📈 Rate Limiting

Atualmente não há rate limiting implementado. Para produção, recomenda-se:

- 100 requests/minuto por IP
- 1000 requests/hora por usuário autenticado
- Usar Vercel Edge Config ou Upstash Redis

---

## 🔄 Versionamento

Atualmente v1 (sem prefixo de versão).

Futuro: `/api/v2/...` para breaking changes.

---

## 📞 Suporte

Dúvidas sobre a API? 
- GitHub Issues
- Email: dev@mandabem.com.br

---

**Happy coding! 🚀**
