import { useEffect, useState } from 'react'
import type { ToastData } from '../../types'

interface ToastItemProps {
  toast: ToastData
  onRemove: (id: string) => void
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLeaving(true)
      setTimeout(() => onRemove(toast.id), 300)
    }, 2800)
    return () => clearTimeout(timer)
  }, [toast.id, onRemove])

  return (
    <div
      className={leaving ? 'animate-toast-out' : 'animate-toast-in'}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '12px 18px',
        background: '#fff',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
        border: '2px solid #E5E7EB',
        minWidth: '200px',
        fontWeight: 700,
        fontSize: '15px',
        color: '#202124',
      }}
    >
      <span style={{ fontSize: '20px' }}>{toast.icon}</span>
      <span>{toast.message}</span>
    </div>
  )
}

interface ToastContainerProps {
  toasts: ToastData[]
  onRemove: (id: string) => void
}

export default function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        pointerEvents: 'none',
      }}
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  )
}
