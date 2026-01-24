'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '../Button'
import { Input } from '../Input'
import { Textarea } from '../Textarea'
import { Select } from '../Select'
import { 
  Trophy, 
  MapPin, 
  Calendar, 
  FileText,
  Sparkles,
  DollarSign,
  AlertCircle
} from 'lucide-react'
import { toast } from 'sonner'

interface Location {
  id: string
  name: string
  city: string
}

interface CreateChallengeFormProps {
  locations: Location[]
}

export function CreateChallengeForm({ locations }: CreateChallengeFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [theme, setTheme] = useState('')
  const [prize, setPrize] = useState('')
  const [locationId, setLocationId] = useState('')
  const [startsAt, setStartsAt] = useState('')
  const [endsAt, setEndsAt] = useState('')
  const [rules, setRules] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const rulesArray = rules.split('\n').filter(r => r.trim())

      const response = await fetch('/api/admin/challenges/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          theme,
          prize: parseFloat(prize),
          locationId,
          startsAt,
          endsAt,
          rules: rulesArray
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar desafio')
      }

      // Reset form
      setTitle('')
      setDescription('')
      setTheme('')
      setPrize('')
      setLocationId('')
      setStartsAt('')
      setEndsAt('')
      setRules('')

      toast.success('Desafio criado com sucesso!', {
        description: 'O desafio já está disponível na plataforma'
      })
      
      router.refresh()
    } catch (err: any) {
      setError(err.message)
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const locationOptions = [
    { value: '', label: 'Selecione um local' },
    ...locations.map(l => ({ value: l.id, label: `${l.name} - ${l.city}` }))
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3 p-4 bg-red-50 border-2 border-red-200 rounded-xl"
        >
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700 font-medium">{error}</p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Título do desafio"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Ex: Melhor slogan para cerveja artesanal"
          leftIcon={<Trophy className="h-5 w-5" />}
        />

        <Input
          label="Tema"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          required
          placeholder="Ex: Marketing, Humor, Arte"
          leftIcon={<Sparkles className="h-5 w-5" />}
        />
      </div>

      <Textarea
        label="Descrição"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        rows={3}
        placeholder="Descreva o desafio de forma clara e objetiva..."
        helperText="Seja específico sobre o que os participantes devem criar"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Prêmio (R$)"
          type="number"
          step="0.01"
          value={prize}
          onChange={(e) => setPrize(e.target.value)}
          required
          placeholder="500.00"
          leftIcon={<DollarSign className="h-5 w-5" />}
          helperText="Valor total do prêmio"
        />

        <Select
          label="Local"
          value={locationId}
          onChange={(e) => setLocationId(e.target.value)}
          options={locationOptions}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Data/hora de início"
          type="datetime-local"
          value={startsAt}
          onChange={(e) => setStartsAt(e.target.value)}
          required
          leftIcon={<Calendar className="h-5 w-5" />}
        />

        <Input
          label="Data/hora de término"
          type="datetime-local"
          value={endsAt}
          onChange={(e) => setEndsAt(e.target.value)}
          required
          leftIcon={<Calendar className="h-5 w-5" />}
        />
      </div>

      <Textarea
        label="Regras (uma por linha)"
        value={rules}
        onChange={(e) => setRules(e.target.value)}
        required
        rows={6}
        placeholder="Digite uma regra por linha&#10;Ex: Máximo 50 caracteres&#10;Deve conter humor&#10;Não pode ofender ninguém"
        helperText="Cada linha será uma regra separada"
      />

      <Button type="submit" loading={loading} fullWidth size="lg">
        <Trophy className="h-5 w-5" />
        Criar Desafio
      </Button>
    </form>
  )
}
