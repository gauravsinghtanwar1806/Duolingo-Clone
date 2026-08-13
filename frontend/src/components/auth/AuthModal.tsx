import { useState } from 'react'

interface AuthModalProps {
  mode: 'login' | 'register'
  onClose: () => void
  onSuccess: (token: string) => void
}

export default function AuthModal({ mode, onClose, onSuccess }: AuthModalProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const [resetSent, setResetSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }
    
    setIsLoading(true)

    const endpoint = mode === 'login' ? '/api/auth/login/' : '/api/auth/register/'
    const body = mode === 'login' 
      ? { username, password } 
      : { username, password, email }

    try {
      const res = await fetch(`http://localhost:8000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || data.detail || 'Authentication failed')
      }

      if (data.access) {
        onSuccess(data.access)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setResetSent(true)
    }, 1000)
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 500,
        padding: '24px',
      }}
    >
      <div
        className="animate-bounce-in bg-white dark:bg-[#131F24] text-[#202124] dark:text-[#E5E7EB]"
        onClick={(e) => e.stopPropagation()}
        style={{
          borderRadius: '24px',
          padding: '32px',
          width: '100%',
          maxWidth: '400px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
          position: 'relative'
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#777'
          }}
        >
          ✕
        </button>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div className="font-black text-[24px]">
            {isForgotPassword ? 'Reset Password' : (mode === 'login' ? 'Log in' : 'Create your profile')}
          </div>
        </div>

        {isForgotPassword ? (
          resetSent ? (
            <div className="text-center">
              <div className="font-bold text-[16px] text-[#777] dark:text-[#AFAFAF] mb-6">
                We've sent a password reset link to the email associated with your account.
              </div>
              <button
                type="button"
                className="btn-tactile w-full p-4 bg-[#1CB0F6] text-white rounded-[16px] font-black text-[16px] shadow-[0_4px_0_#1899D6] tracking-wide cursor-pointer"
                onClick={() => { setIsForgotPassword(false); setResetSent(false); }}
              >
                BACK TO LOGIN
              </button>
            </div>
          ) : (
            <form onSubmit={handleResetSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="font-bold text-[14px] text-[#777] dark:text-[#AFAFAF] text-center mb-2">
                Enter your username or email and we'll send you a link to reset your password.
              </div>
              
              <input
                type="text"
                placeholder="Username or Email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full p-[14px] rounded-[16px] border-2 border-[#E5E7EB] dark:border-[#202F36] bg-[#F7F9FA] dark:bg-[#202F36] text-[16px] font-semibold text-[#202124] dark:text-white placeholder-[#AFAFAF] dark:placeholder-[#777]"
                style={{ outline: 'none' }}
              />

              <button
                type="submit"
                disabled={isLoading}
                className="btn-tactile w-full p-4 bg-[#1CB0F6] text-white rounded-[16px] font-black text-[16px] shadow-[0_4px_0_#1899D6] tracking-wide cursor-pointer mt-2"
                style={{ cursor: isLoading ? 'not-allowed' : 'pointer' }}
              >
                {isLoading ? 'SENDING...' : 'SEND RESET LINK'}
              </button>

              <div className="text-center mt-2">
                <button
                  type="button"
                  className="text-[#AFAFAF] font-bold text-[14px] bg-transparent border-none cursor-pointer hover:text-[#777] transition-colors p-0 m-0"
                  onClick={() => setIsForgotPassword(false)}
                >
                  Back to login
                </button>
              </div>
            </form>
          )
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {mode === 'register' && (
            <input
              type="email"
              placeholder="Email (optional)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-[14px] rounded-[16px] border-2 border-[#E5E7EB] dark:border-[#202F36] bg-[#F7F9FA] dark:bg-[#202F36] text-[16px] font-semibold text-[#202124] dark:text-white placeholder-[#AFAFAF] dark:placeholder-[#777]"
              style={{
                outline: 'none',
              }}
            />
          )}
          
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full p-[14px] rounded-[16px] border-2 border-[#E5E7EB] dark:border-[#202F36] bg-[#F7F9FA] dark:bg-[#202F36] text-[16px] font-semibold text-[#202124] dark:text-white placeholder-[#AFAFAF] dark:placeholder-[#777]"
            style={{
              outline: 'none',
            }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-[14px] rounded-[16px] border-2 border-[#E5E7EB] dark:border-[#202F36] bg-[#F7F9FA] dark:bg-[#202F36] text-[16px] font-semibold text-[#202124] dark:text-white placeholder-[#AFAFAF] dark:placeholder-[#777]"
            style={{
              outline: 'none',
            }}
          />

          {mode === 'login' && (
            <div className="flex justify-end w-full">
              <button
                type="button"
                className="text-[#1CB0F6] font-bold text-[14px] bg-transparent border-none cursor-pointer hover:underline p-0 m-0 -mt-2"
                onClick={() => setIsForgotPassword(true)}
              >
                Forgot password?
              </button>
            </div>
          )}

          {error && (
            <div style={{ color: '#FF4B4B', fontWeight: 600, fontSize: '14px', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="btn-tactile"
            style={{
              width: '100%',
              padding: '16px',
              background: '#1CB0F6',
              color: '#fff',
              border: 'none',
              borderRadius: '16px',
              fontWeight: 900,
              fontSize: '16px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 0 #1899D6',
              letterSpacing: '0.5px',
              marginTop: '8px'
            }}
          >
            {isLoading ? 'LOADING...' : (mode === 'login' ? 'LOG IN' : 'CREATE ACCOUNT')}
          </button>
        </form>
        )}
      </div>
    </div>
  )
}
