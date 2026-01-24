import { toast as sonnerToast } from 'sonner'
import { CheckCircle2, XCircle, AlertCircle, Info, Loader2 } from 'lucide-react'

export const toast = {
  success: (message: string, description?: string) => {
    return sonnerToast.success(message, {
      description,
      icon: <CheckCircle2 className="h-5 w-5" />,
    })
  },

  error: (message: string, description?: string) => {
    return sonnerToast.error(message, {
      description,
      icon: <XCircle className="h-5 w-5" />,
    })
  },

  warning: (message: string, description?: string) => {
    return sonnerToast.warning(message, {
      description,
      icon: <AlertCircle className="h-5 w-5" />,
    })
  },

  info: (message: string, description?: string) => {
    return sonnerToast.info(message, {
      description,
      icon: <Info className="h-5 w-5" />,
    })
  },

  loading: (message: string, description?: string) => {
    return sonnerToast.loading(message, {
      description,
      icon: <Loader2 className="h-5 w-5 animate-spin" />,
    })
  },

  promise: <T,>(
    promise: Promise<T>,
    {
      loading,
      success,
      error,
    }: {
      loading: string
      success: string | ((data: T) => string)
      error: string | ((error: any) => string)
    }
  ) => {
    return sonnerToast.promise(promise, {
      loading,
      success,
      error,
    })
  },
}
