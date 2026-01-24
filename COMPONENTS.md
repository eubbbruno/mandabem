# 🧩 Guia de Componentes UI - MandaBem

Documentação completa dos componentes UI disponíveis na plataforma.

---

## 📦 Core Components

### Button

Botão premium com múltiplas variantes e estados.

```tsx
import { Button } from '@/components/Button'

// Variantes
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="accent">Accent</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>
<Button variant="link">Link</Button>

// Tamanhos
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
<Button size="xl">Extra Large</Button>

// Estados
<Button loading>Loading...</Button>
<Button disabled>Disabled</Button>
<Button fullWidth>Full Width</Button>

// Com ícones
<Button>
  <Icon className="h-5 w-5" />
  Com Ícone
</Button>
```

**Props:**
- `variant`: primary | secondary | accent | outline | ghost | danger | link
- `size`: sm | md | lg | xl | icon
- `loading`: boolean
- `fullWidth`: boolean
- `asChild`: boolean (para composição)

---

### Input

Input com validação visual, ícones e helper text.

```tsx
import { Input } from '@/components/Input'
import { Mail, Lock } from 'lucide-react'

<Input
  label="Email"
  type="email"
  placeholder="seu@email.com"
  leftIcon={<Mail className="h-5 w-5" />}
  helperText="Nunca compartilharemos seu email"
  error="Email inválido"
  required
/>
```

**Props:**
- `label`: string
- `error`: string
- `helperText`: string
- `leftIcon`: ReactNode
- `rightIcon`: ReactNode
- Todos os props nativos de input

---

### Card

Sistema de cards flexível com variantes.

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card'

<Card variant="default" padding="lg" hoverable>
  <CardHeader>
    <CardTitle>Título</CardTitle>
    <CardDescription>Descrição</CardDescription>
  </CardHeader>
  <CardContent>
    Conteúdo do card
  </CardContent>
  <CardFooter>
    <Button>Ação</Button>
  </CardFooter>
</Card>
```

**Variantes:**
- `default`: Sombra suave
- `bordered`: Com borda
- `ghost`: Transparente
- `gradient`: Com gradiente

---

### Badge

Badges com gradientes e tamanhos.

```tsx
import { Badge } from '@/components/ui/Badge'

<Badge variant="primary">Primary</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="danger">Danger</Badge>
<Badge size="sm">Small</Badge>
<Badge size="lg">Large</Badge>
```

---

### Alert

Alertas contextuais com ícones.

```tsx
import { Alert } from '@/components/ui/Alert'

<Alert variant="success" title="Sucesso!">
  Operação realizada com sucesso.
</Alert>

<Alert variant="error" title="Erro">
  Algo deu errado.
</Alert>
```

**Variantes:** default | success | warning | error | info

---

## 🎭 Interactive Components

### Dialog (Modal)

```tsx
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/Dialog'

<Dialog>
  <DialogTrigger asChild>
    <Button>Abrir Modal</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Título</DialogTitle>
      <DialogDescription>Descrição</DialogDescription>
    </DialogHeader>
    <div>Conteúdo</div>
  </DialogContent>
</Dialog>
```

---

### Tabs

Tabs animadas com transições suaves.

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'

<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Conteúdo 1</TabsContent>
  <TabsContent value="tab2">Conteúdo 2</TabsContent>
</Tabs>
```

---

### Tooltip

```tsx
import { SimpleTooltip } from '@/components/ui/Tooltip'

<SimpleTooltip content="Texto do tooltip">
  <Button>Hover me</Button>
</SimpleTooltip>
```

---

### Accordion

```tsx
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/Accordion'

<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>Pergunta 1</AccordionTrigger>
    <AccordionContent>Resposta 1</AccordionContent>
  </AccordionItem>
</Accordion>
```

---

## 📊 Data Display

### StatCard

Cards de estatísticas premium.

```tsx
import { StatCard } from '@/components/ui/StatCard'
import { Users } from 'lucide-react'

<StatCard
  label="Total de Usuários"
  value={1234}
  subtitle="últimos 30 dias"
  icon={Users}
  gradient="from-primary-500 to-primary-600"
  bgGradient="from-primary-50 to-primary-100"
  trend={{ value: '+12%', isPositive: true }}
/>
```

---

### Timeline

Linha do tempo visual.

```tsx
import { Timeline } from '@/components/ui/Timeline'
import { CheckCircle2 } from 'lucide-react'

<Timeline items={[
  {
    title: 'Desafio criado',
    description: 'O desafio foi publicado',
    date: '10/01/2026',
    icon: CheckCircle2,
    status: 'completed'
  },
  // ...
]} />
```

---

### Rating

Sistema de avaliação com estrelas.

```tsx
import { Rating, ScoreBar } from '@/components/ui/Rating'

<Rating 
  value={8.5} 
  max={10} 
  onChange={(value) => console.log(value)}
/>

<ScoreBar 
  label="Estratégia" 
  value={8} 
  max={10}
  color="from-primary-500 to-accent-500"
/>
```

---

### Progress

Barras de progresso animadas.

```tsx
import { Progress, CircularProgress } from '@/components/ui/Progress'

<Progress value={75} max={100} showLabel />

<CircularProgress value={75} size={120} />
```

---

### Countdown

Contador regressivo.

```tsx
import { Countdown, CountdownCompact } from '@/components/ui/Countdown'

<Countdown 
  targetDate="2026-12-31T23:59:59"
  onComplete={() => console.log('Finished!')}
/>

<CountdownCompact targetDate="2026-12-31T23:59:59" />
```

---

## 🎨 Layout Components

### Section

Seções com animações ao scroll.

```tsx
import { Section, SectionHeader } from '@/components/ui/Section'

<Section animate delay={0.2}>
  <SectionHeader 
    title="Título da Seção"
    subtitle="Subtítulo"
    badge="Novo"
    align="center"
  />
  <div>Conteúdo</div>
</Section>
```

---

### Grid & Flex

Sistemas de layout flexíveis.

```tsx
import { Grid, Flex } from '@/components/ui/Grid'

<Grid cols={{ default: 1, md: 2, lg: 3 }} gap={6}>
  <div>Item 1</div>
  <div>Item 2</div>
</Grid>

<Flex direction="row" align="center" justify="between" gap={4}>
  <div>Left</div>
  <div>Right</div>
</Flex>
```

---

## 🎯 Specialized Components

### ChallengeCard

Card de desafio com animações premium.

```tsx
import { ChallengeCard } from '@/components/ChallengeCard'

<ChallengeCard
  id="123"
  title="Desafio Criativo"
  theme="Marketing"
  prize={500}
  locationName="Bar do Zé"
  city="São Paulo"
  endsAt="2026-12-31"
  status="active"
/>
```

---

### EmptyState

Estados vazios elegantes.

```tsx
import { EmptyState } from '@/components/ui/EmptyState'
import { Inbox } from 'lucide-react'

<EmptyState
  icon={Inbox}
  title="Nenhum item encontrado"
  description="Não há itens para exibir no momento"
  action={{
    label: 'Criar Novo',
    onClick: () => {}
  }}
/>
```

---

## 🎨 Utilities

### Toast System

```tsx
import { toast } from '@/lib/toast'

toast.success('Sucesso!', 'Operação concluída')
toast.error('Erro!', 'Algo deu errado')
toast.warning('Atenção!', 'Verifique os dados')
toast.info('Info', 'Informação importante')
toast.loading('Carregando...')

// Promise toast
toast.promise(
  fetchData(),
  {
    loading: 'Carregando...',
    success: 'Sucesso!',
    error: 'Erro!'
  }
)
```

---

## 🎭 Animation Classes

### CSS Classes

```css
.animate-fade-in      /* Fade in suave */
.animate-slide-up     /* Slide de baixo para cima */
.animate-slide-down   /* Slide de cima para baixo */
.animate-scale-in     /* Scale in */
.animate-bounce-soft  /* Bounce suave */
.animate-spin-slow    /* Spin lento */
.animate-pulse-slow   /* Pulse lento */
.animate-float        /* Float up/down */
.animate-glow         /* Glow effect */
```

### Utility Classes

```css
.card                 /* Card base */
.card-hover           /* Card com hover effect */
.gradient-text        /* Texto com gradiente */
.gradient-primary     /* Background gradiente primary */
.glass                /* Glass morphism */
.text-balance         /* Text wrap balance */
```

---

## 📐 Design Tokens

### Shadows

```css
shadow-soft          /* Sombra suave */
shadow-medium        /* Sombra média */
shadow-strong        /* Sombra forte */
shadow-glow-primary  /* Glow primary */
shadow-glow-accent   /* Glow accent */
```

### Border Radius

```css
rounded-lg   /* 8px */
rounded-xl   /* 12px */
rounded-2xl  /* 16px */
rounded-3xl  /* 24px */
```

---

## 🎯 Best Practices

### Performance
- Use `loading="lazy"` em imagens
- Prefira server components
- Use `use client` apenas quando necessário
- Otimize imports (tree shaking)

### Acessibilidade
- Sempre use `aria-label` em ícones
- Mantenha contraste adequado
- Teste com keyboard navigation
- Use semantic HTML

### Responsividade
- Mobile-first approach
- Teste em múltiplos dispositivos
- Use breakpoints do Tailwind
- Otimize touch targets (min 44px)

---

**Última atualização:** Janeiro 2026
