import { useState } from 'react'
import AuthModal from '../components/auth/AuthModal'

interface LandingPageProps {
  theme: 'light' | 'dark'
  setTheme: (theme: 'light' | 'dark') => void
  onLoginSuccess: (token: string) => void
}

export default function LandingPage({ theme, setTheme, onLoginSuccess }: LandingPageProps) {
  const [authMode, setAuthMode] = useState<'login' | 'register' | null>(null)

  const languages = [
    { name: 'SPANISH', flag: '🇪🇸' },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-[#131F24] text-[#202124] dark:text-[#E5E7EB] font-sans flex flex-col relative overflow-hidden transition-colors">
      {/* Header */}
      <header className="absolute top-0 left-0 w-full p-4 px-6 md:px-12 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          {/* Duolingo Logo approximation */}
          <div className="text-[32px] font-black text-[#58CC02] tracking-tighter" style={{ fontFamily: "'Nunito', sans-serif" }}>
            duolingo
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="w-10 h-10 rounded-full bg-[#F3F4F6] dark:bg-[#202F36] flex items-center justify-center text-[#777] hover:text-[#1CB0F6] transition-colors cursor-pointer border-none"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center max-w-[1000px] mx-auto w-full px-6 gap-8 lg:gap-16 pt-20 pb-24">
        {/* Left Graphic */}
        <div className="flex-1 flex justify-center w-full max-w-[480px]">
          <img 
            src="/duo_orbit.png" 
            alt="Duolingo Characters" 
            className="w-full h-auto object-contain max-h-[500px] rounded-[48px] dark:shadow-2xl bg-white"
            style={{ 
              animation: 'float 6s ease-in-out infinite' 
            }}
          />
        </div>

        {/* Right Content */}
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left max-w-[400px]">
          <h1 className="font-black text-[32px] md:text-[36px] leading-[1.2] text-[#202124] dark:text-white mb-10 opacity-90 tracking-wide">
            The most fun way to learn languages, chess, and more!
          </h1>
          
          <div className="w-full flex flex-col gap-3.5">
            <button
              onClick={() => setAuthMode('register')}
              className="w-full py-4 bg-[#58CC02] text-white rounded-[16px] font-extrabold text-[15px] uppercase tracking-wide cursor-pointer border-none shadow-[0_4px_0_#46A302] hover:bg-[#46A302] transition-colors"
            >
              GET STARTED
            </button>
            <button
              onClick={() => setAuthMode('login')}
              className="w-full py-4 bg-white dark:bg-[#131F24] text-[#1CB0F6] rounded-[16px] font-extrabold text-[15px] uppercase tracking-wide cursor-pointer border-2 border-[#E5E7EB] dark:border-[#202F36] shadow-[0_4px_0_#E5E7EB] dark:shadow-[0_4px_0_#202F36] hover:bg-[#F7F9FA] dark:hover:bg-[#202F36] transition-colors"
            >
              I ALREADY HAVE AN ACCOUNT
            </button>
          </div>
        </div>
      </main>

      {/* Language Carousel Bottom Bar */}
      <div className="border-t-2 border-[#E5E7EB] dark:border-[#202F36] bg-white dark:bg-[#131F24] py-4 w-full overflow-hidden absolute bottom-0 left-0 transition-colors">
        <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-center">
          <div className="flex items-center gap-8 px-4">
            {languages.map(lang => (
              <div key={lang.name} className="flex items-center gap-2 cursor-pointer group">
                <div className="text-[24px] rounded-sm overflow-hidden" style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>{lang.flag}</div>
                <div className="font-bold text-[13px] text-[#777] group-hover:text-[#1CB0F6] transition-colors tracking-wide">
                  {lang.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {authMode && (
        <AuthModal
          mode={authMode}
          onClose={() => setAuthMode(null)}
          onSuccess={onLoginSuccess}
        />
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .mask-edges {
          -webkit-mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
          mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
        }
      `}} />
    </div>
  )
}
