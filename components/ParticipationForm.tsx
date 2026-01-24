'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from './Button'
import { Input } from './Input'
import { Textarea } from './Textarea'
import { validateCPF, formatCPF, formatPrice } from '@/lib/scoring'
import { 
  User, 
  Mail, 
  CreditCard, 
  Image as ImageIcon, 
  FileText, 
  CheckCircle2,
  AlertCircle,
  Upload,
  QrCode,
  Copy,
  Sparkles
} from 'lucide-react'
import { toast } from 'sonner'

interface ParticipationFormProps {
  challengeId: string
  attemptNumber: number
  price: number
  isLoggedIn: boolean
}

export function ParticipationForm({ 
  challengeId, 
  attemptNumber, 
  price,
  isLoggedIn 
}: ParticipationFormProps) {
  const router = useRouter()
  const [step, setStep] = useState<'login' | 'content' | 'payment'>(isLoggedIn ? 'content' : 'login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Login fields
  const [email, setEmail] = useState('')
  const [cpf, setCpf] = useState('')
  const [name, setName] = useState('')

  // Content fields
  const [contentType, setContentType] = useState<'photo' | 'text'>('photo')
  const [contentText, setContentText] = useState('')
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

  // Payment
  const [paymentId, setPaymentId] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!validateCPF(cpf)) {
        throw new Error('CPF inválido')
      }

      const cleanCpf = cpf.replace(/[^\d]/g, '')

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, cpf: cleanCpf, name })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao fazer login')
      }

      toast.success('Login realizado com sucesso!')
      setStep('content')
    } catch (err: any) {
      setError(err.message)
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleContentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (contentType === 'text' && !contentText.trim()) {
        throw new Error('Digite seu texto criativo')
      }
      if (contentType === 'photo' && !photoFile) {
        throw new Error('Selecione uma foto')
      }

      const formData = new FormData()
      formData.append('challengeId', challengeId)
      formData.append('contentType', contentType)
      formData.append('attemptNumber', attemptNumber.toString())
      formData.append('paymentAmount', price.toString())

      if (contentType === 'text') {
        formData.append('contentText', contentText)
      } else if (photoFile) {
        formData.append('photo', photoFile)
      }

      const response = await fetch('/api/submissions/create', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar participação')
      }

      toast.success('Conteúdo enviado com sucesso!')
      setPaymentId(data.submissionId)
      setStep('payment')
    } catch (err: any) {
      setError(err.message)
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentConfirm = async () => {
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/payments/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          submissionId: paymentId,
          paymentMethod: 'pix'
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao confirmar pagamento')
      }

      toast.success('Pagamento confirmado! Redirecionando...')
      setTimeout(() => {
        router.push('/meus-envios?success=true')
      }, 1500)
    } catch (err: any) {
      setError(err.message)
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhotoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const copyPixCode = () => {
    const pixCode = `00020126580014BR.GOV.BCB.PIX0136${paymentId}5204000053039865802BR`
    navigator.clipboard.writeText(pixCode)
    toast.success('Código PIX copiado!')
  }

  const steps = [
    { id: 'login', label: 'Identificação', icon: User },
    { id: 'content', label: 'Conteúdo', icon: Sparkles },
    { id: 'payment', label: 'Pagamento', icon: CreditCard },
  ]

  const currentStepIndex = steps.findIndex(s => s.id === step)

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {steps.map((s, index) => {
          const StepIcon = s.icon
          const isActive = index === currentStepIndex
          const isCompleted = index < currentStepIndex
          
          return (
            <div key={s.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div className={`
                  flex items-center justify-center w-12 h-12 rounded-xl shadow-md transition-all
                  ${isActive ? 'bg-gradient-to-br from-primary-500 to-accent-500 scale-110' : ''}
                  ${isCompleted ? 'bg-green-500' : ''}
                  ${!isActive && !isCompleted ? 'bg-gray-200' : ''}
                `}>
                  {isCompleted ? (
                    <CheckCircle2 className="h-6 w-6 text-white" />
                  ) : (
                    <StepIcon className={`h-6 w-6 ${isActive || isCompleted ? 'text-white' : 'text-gray-400'}`} />
                  )}
                </div>
                <span className={`
                  text-xs font-medium mt-2
                  ${isActive ? 'text-primary-600' : ''}
                  ${isCompleted ? 'text-green-600' : ''}
                  ${!isActive && !isCompleted ? 'text-gray-400' : ''}
                `}>
                  {s.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`
                  h-1 flex-1 mx-2 rounded-full transition-colors
                  ${index < currentStepIndex ? 'bg-green-500' : 'bg-gray-200'}
                `} />
              )}
            </div>
          )
        })}
      </div>

      {/* Error Alert */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-start gap-3 p-4 bg-red-50 border-2 border-red-200 rounded-xl"
          >
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form Content */}
      <AnimatePresence mode="wait">
        {/* Step 1: Login */}
        {step === 'login' && (
          <motion.form
            key="login"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onSubmit={handleLogin}
            className="space-y-6"
          >
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-gray-900">Identifique-se</h3>
              <p className="text-gray-600">
                Precisamos do seu CPF para controlar tentativas e preços progressivos
              </p>
            </div>

            <Input
              label="Nome completo"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Seu nome"
              leftIcon={<User className="h-5 w-5" />}
            />

            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="seu@email.com"
              leftIcon={<Mail className="h-5 w-5" />}
            />

            <Input
              label="CPF"
              type="text"
              value={cpf}
              onChange={(e) => setCpf(formatCPF(e.target.value))}
              required
              placeholder="000.000.000-00"
              maxLength={14}
              leftIcon={<CreditCard className="h-5 w-5" />}
            />

            <Button type="submit" loading={loading} fullWidth size="lg">
              Continuar
            </Button>
          </motion.form>
        )}

        {/* Step 2: Content */}
        {step === 'content' && (
          <motion.form
            key="content"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onSubmit={handleContentSubmit}
            className="space-y-6"
          >
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-gray-900">Envie sua criação</h3>
              <p className="text-gray-600">
                Escolha entre enviar uma foto ou escrever um texto criativo
              </p>
            </div>

            {/* Content Type Selector */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setContentType('photo')}
                className={`
                  p-6 rounded-xl border-2 transition-all
                  ${contentType === 'photo' 
                    ? 'border-primary-500 bg-primary-50 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <ImageIcon className={`h-8 w-8 mx-auto mb-2 ${contentType === 'photo' ? 'text-primary-600' : 'text-gray-400'}`} />
                <div className="font-semibold text-gray-900">Foto</div>
              </button>
              
              <button
                type="button"
                onClick={() => setContentType('text')}
                className={`
                  p-6 rounded-xl border-2 transition-all
                  ${contentType === 'text' 
                    ? 'border-primary-500 bg-primary-50 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <FileText className={`h-8 w-8 mx-auto mb-2 ${contentType === 'text' ? 'text-primary-600' : 'text-gray-400'}`} />
                <div className="font-semibold text-gray-900">Texto</div>
              </button>
            </div>

            {contentType === 'text' && (
              <Textarea
                label="Seu texto criativo"
                value={contentText}
                onChange={(e) => setContentText(e.target.value)}
                rows={8}
                placeholder="Escreva sua resposta criativa aqui..."
                required
                helperText={`${contentText.length} caracteres`}
              />
            )}

            {contentType === 'photo' && (
              <div className="space-y-4">
                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 mb-2">
                    Sua foto
                  </span>
                  <div className={`
                    relative border-2 border-dashed rounded-xl p-8 transition-all cursor-pointer
                    ${photoPreview ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400'}
                  `}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      required
                    />
                    {photoPreview ? (
                      <div className="text-center">
                        <img src={photoPreview} alt="Preview" className="max-h-64 mx-auto rounded-lg shadow-md mb-4" />
                        <p className="text-sm text-gray-600">Clique para trocar a foto</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-600 font-medium mb-1">Clique para fazer upload</p>
                        <p className="text-sm text-gray-500">PNG, JPG até 10MB</p>
                      </div>
                    )}
                  </div>
                </label>
              </div>
            )}

            <Button type="submit" loading={loading} fullWidth size="lg">
              Continuar para pagamento
            </Button>
          </motion.form>
        )}

        {/* Step 3: Payment */}
        {step === 'payment' && (
          <motion.div
            key="payment"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-gray-900">Pagamento via PIX</h3>
              <p className="text-gray-600">
                Escaneie o QR Code ou copie o código PIX
              </p>
            </div>

            <div className="card p-8 bg-gradient-to-br from-primary-50 to-accent-50 border-2 border-primary-200 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white shadow-soft mb-4">
                <span className="text-sm font-medium text-gray-600">Valor a pagar</span>
              </div>
              <div className="text-5xl font-bold gradient-text mb-6">
                {formatPrice(price)}
              </div>
              
              {/* Mock QR Code */}
              <div className="inline-block p-6 bg-white rounded-2xl shadow-strong mb-6">
                <div className="w-48 h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center rounded-xl">
                  <div className="text-center">
                    <QrCode className="h-16 w-16 mx-auto mb-2 text-gray-400" />
                    <p className="text-gray-500 text-xs">QR Code PIX<br/>(Mock para MVP)</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 mb-4">
                <p className="text-xs font-medium text-gray-500 mb-2">Código PIX</p>
                <div className="flex items-center gap-2">
                  <p className="font-mono text-xs text-gray-700 break-all flex-1">
                    00020126580014BR.GOV.BCB.PIX0136{paymentId}5204000053039865802BR
                  </p>
                  <button
                    type="button"
                    onClick={copyPixCode}
                    className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Copy className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            <div className="card p-4 bg-yellow-50 border-2 border-yellow-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <strong>MVP Mock:</strong> Clique em confirmar para simular o pagamento. 
                  Em produção, aqui seria integrado com Mercado Pago.
                </div>
              </div>
            </div>

            <Button 
              onClick={handlePaymentConfirm} 
              loading={loading}
              fullWidth
              size="lg"
              variant="accent"
            >
              <CheckCircle2 className="h-5 w-5" />
              Confirmar Pagamento (Mock)
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
