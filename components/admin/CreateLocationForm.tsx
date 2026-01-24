'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '../Button'
import { Input } from '../Input'
import { MapPin, Building2, Map, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

export function CreateLocationForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/admin/locations/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, address, city })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar local')
      }

      // Reset form
      setName('')
      setAddress('')
      setCity('')

      toast.success('Local criado com sucesso!', {
        description: 'O local já está disponível para novos desafios'
      })
      
      router.refresh()
    } catch (err: any) {
      setError(err.message)
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

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
          label="Nome do local"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Ex: Bar do Zé"
          leftIcon={<Building2 className="h-5 w-5" />}
          helperText="Nome do bar, boteco ou estabelecimento"
        />

        <Input
          label="Cidade"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
          placeholder="Ex: São Paulo"
          leftIcon={<Map className="h-5 w-5" />}
          helperText="Cidade onde o local está localizado"
        />
      </div>

      <Input
        label="Endereço completo"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        required
        placeholder="Rua, número, bairro"
        leftIcon={<MapPin className="h-5 w-5" />}
        helperText="Endereço completo para os participantes"
      />

      <Button type="submit" loading={loading} fullWidth size="lg">
        <MapPin className="h-5 w-5" />
        Criar Local
      </Button>
    </form>
  )
}
