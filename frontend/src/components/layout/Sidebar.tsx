import { useState } from 'react'
import type { Page } from '../../types'

interface SidebarProps {
  page: Page
  setPage: (p: Page) => void
  onLogout?: () => void
}

const NAV_ITEMS: { id: Page; label: string; icon: React.ReactNode } = [
  { 
    id: 'learn', 
    label: 'LEARN', 
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 3L3 10H5V20H19V10H21L12 3Z" fill="#FFC800" />
        <path d="M12 3L3 10H21L12 3Z" fill="#FF4B4B" />
        <circle cx="12" cy="14" r="3" fill="#A56E3B" />
      </svg>
    )
  },
  { 
    id: 'practice', 
    label: 'PRACTICE', 
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="6" width="4" height="12" rx="2" fill="#1CB0F6" />
        <rect x="16" y="6" width="4" height="12" rx="2" fill="#1CB0F6" />
        <rect x="2" y="8" width="2" height="8" rx="1" fill="#1CB0F6" />
        <rect x="20" y="8" width="2" height="8" rx="1" fill="#1CB0F6" />
        <rect x="8" y="10" width="8" height="4" fill="#1CB0F6" />
      </svg>
    ) 
  },
  { 
    id: 'leaderboard', 
    label: 'LEADERBOARDS', 
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L4 5V11C4 16.5 7.5 21.5 12 23C16.5 21.5 20 16.5 20 11V5L12 2Z" fill="#FFC800" />
      </svg>
    ) 
  },
  { 
    id: 'quests', 
    label: 'QUESTS', 
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="8" width="18" height="12" rx="2" fill="#FFC800" />
        <rect x="3" y="10" width="18" height="2" fill="#D3A100" />
        <rect x="10" y="12" width="4" height="4" rx="1" fill="#A56E3B" />
        <path d="M5 8V6C5 4.89543 5.89543 4 7 4H17C18.1046 4 19 4.89543 19 6V8" stroke="#FFC800" strokeWidth="2" />
      </svg>
    ) 
  },
  { 
    id: 'shop', 
    label: 'SHOP', 
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="10" width="16" height="10" rx="1" fill="#A56E3B" />
        <path d="M3 10L5 4H19L21 10H3Z" fill="#FF4B4B" />
        <rect x="7" y="13" width="4" height="4" fill="#84D8FF" />
        <rect x="13" y="13" width="4" height="4" fill="#84D8FF" />
      </svg>
    ) 
  },
  { 
    id: 'profile', 
    label: 'PROFILE', 
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="#FFC800" />
        <circle cx="12" cy="10" r="4" fill="#A56E3B" />
        <path d="M6 18C6 14.6863 8.68629 12 12 12C15.3137 12 18 14.6863 18 18" stroke="#A56E3B" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ) 
  },
  { 
    id: 'more', 
    label: 'MORE', 
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="#CE82FF" />
        <circle cx="8" cy="12" r="1.5" fill="white" />
        <circle cx="12" cy="12" r="1.5" fill="white" />
        <circle cx="16" cy="12" r="1.5" fill="white" />
      </svg>
    ) 
  },
]

export default function Sidebar({ page, setPage, onLogout }: SidebarProps) {
  const [isMoreHovered, setIsMoreHovered] = useState(false)
  const [moreTimeout, setMoreTimeout] = useState<NodeJS.Timeout | null>(null)

  const handleMoreMouseEnter = () => {
    if (moreTimeout) clearTimeout(moreTimeout)
    setIsMoreHovered(true)
  }

  const handleMoreMouseLeave = () => {
    const timeout = setTimeout(() => {
      setIsMoreHovered(false)
    }, 300)
    setMoreTimeout(timeout)
  }

  return (
    <aside
      className="hidden lg:flex flex-col w-[256px] min-w-[256px] h-screen bg-white dark:bg-[#131F24] border-r-2 border-[#E5E7EB] dark:border-[#202F36] sticky top-0 z-50"
    >
      {/* Logo */}
      <div 
        className="pt-8 px-6 pb-6 cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => setPage('learn')}
      >
        <div className="font-black text-[32px] text-[#58CC02] tracking-[-1px] font-['Nunito',sans-serif]">
          duolingo
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-4 overflow-visible">
        {NAV_ITEMS.map((item) => {
          const isMore = item.id === 'more'
          const active = page === item.id

          return (
            <div 
              key={item.id} 
              className={isMore ? 'relative' : ''}
              onMouseEnter={isMore ? handleMoreMouseEnter : undefined}
              onMouseLeave={isMore ? handleMoreMouseLeave : undefined}
            >
              <button
                onClick={() => {
                  if (!isMore) setPage(item.id as any)
                }}
                className={`btn-tactile w-full flex items-center gap-5 p-[10px_16px] rounded-2xl font-extrabold text-[15px] cursor-pointer text-left mb-2 transition-all duration-150 border-2 ${
                  active 
                    ? 'border-[#84D8FF] bg-[#84D8FF]/10 text-[#1CB0F6] dark:text-[#84D8FF]' 
                    : 'border-transparent text-[#777] dark:text-white hover:bg-gray-100 dark:hover:bg-white/10'
                }`}
              >
                <div className="shrink-0 flex items-center justify-center">
                  {item.icon}
                </div>
                <span className="pt-[2px]">{item.label}</span>
              </button>

              {/* Hover Dropdown for MORE */}
              {isMore && isMoreHovered && (
                <div className="absolute left-full bottom-0 ml-4 z-50 animate-bounce-in">
                  <div className="bg-white dark:bg-[#131F24] border-2 border-[#E5E7EB] dark:border-[#202F36] rounded-2xl w-[280px] py-2 shadow-xl flex flex-col">
                    <div className="flex flex-col px-2 py-1">
                      <button onClick={() => window.open('https://englishtest.duolingo.com/', '_blank')} className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 text-left transition-colors cursor-pointer border-none bg-transparent">
                        <div className="w-6 h-6 flex items-center justify-center">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2L14.4 5.6L18.7 5.1L19.8 9.3L23.4 11.2L20.6 14.5L19.9 18.8L15.6 18.8L12.4 22L9.2 18.8L4.9 18.8L4.2 14.5L1.4 11.2L5 9.3L6.1 5.1L10.4 5.6L12 2Z" fill="#58CC02"/>
                            <path d="M12 8.5C10.067 8.5 8.5 10.067 8.5 12C8.5 13.933 10.067 15.5 12 15.5C13.933 15.5 15.5 13.933 15.5 12C15.5 10.067 13.933 8.5 12 8.5Z" fill="white"/>
                          </svg>
                        </div>
                        <span className="font-extrabold text-[13px] text-[#777] dark:text-white">DUOLINGO ENGLISH TEST</span>
                      </button>
                      <button onClick={() => window.open('https://schools.duolingo.com/', '_blank')} className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 text-left transition-colors cursor-pointer border-none bg-transparent">
                        <div className="w-6 h-6 flex items-center justify-center text-[22px]">🌍</div>
                        <span className="font-extrabold text-[13px] text-[#777] dark:text-white">SCHOOLS</span>
                      </button>
                      <button onClick={() => window.open('https://podcast.duolingo.com/', '_blank')} className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 text-left transition-colors cursor-pointer border-none bg-transparent">
                        <div className="w-6 h-6 flex items-center justify-center text-[22px]">🎧</div>
                        <span className="font-extrabold text-[13px] text-[#777] dark:text-white">PODCAST</span>
                      </button>
                    </div>
                    <div className="h-[2px] bg-[#E5E7EB] dark:bg-[#202F36] my-1"></div>
                    <div className="flex flex-col px-2 py-1">
                      <button onClick={() => onLogout && onLogout()} className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 text-left transition-colors cursor-pointer border-none bg-transparent">
                        <span className="font-extrabold text-[13px] text-[#777] dark:text-white uppercase">Log out</span>
                      </button>
                    </div>
                    <div className="h-[2px] bg-[#E5E7EB] dark:bg-[#202F36] w-full my-1"></div>
                    <div className="flex flex-col px-2 py-1">
                      <button onClick={() => setPage('settings')} className="flex items-center px-4 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 text-left transition-colors cursor-pointer border-none bg-transparent">
                        <span className="font-extrabold text-[13px] text-[#777] dark:text-white">SETTINGS</span>
                      </button>
                      <button onClick={() => window.open('https://support.duolingo.com/', '_blank')} className="flex items-center px-4 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 text-left transition-colors cursor-pointer border-none bg-transparent">
                        <span className="font-extrabold text-[13px] text-[#777] dark:text-white">HELP</span>
                      </button>
                      <button onClick={() => onLogout && onLogout()} className="flex items-center px-4 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 text-left transition-colors cursor-pointer border-none bg-transparent">
                        <span className="font-extrabold text-[13px] text-[#777] dark:text-white">LOG OUT</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </aside>
  )
}

export function BottomNav({ page, setPage }: SidebarProps) {
  // Only show core navigation items on mobile (exclude MORE and maybe Profile/Shop depending on space, but we'll show a few)
  const mobileItems = NAV_ITEMS.filter(item => ['learn', 'practice', 'leaderboard', 'quests', 'profile'].includes(item.id))

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-[80px] bg-white dark:bg-[#131F24] border-t-2 border-[#E5E7EB] dark:border-[#202F36] z-50 flex items-center justify-around px-2 pb-safe">
      {mobileItems.map(item => {
        const active = page === item.id
        return (
          <button
            key={item.id}
            onClick={() => setPage(item.id as any)}
            className={`flex flex-col items-center justify-center w-16 h-16 rounded-xl transition-colors ${
              active 
                ? 'bg-[#84D8FF]/10 text-[#1CB0F6] dark:text-[#84D8FF] border-2 border-[#84D8FF]' 
                : 'text-[#777] dark:text-[#AFAFAF] border-2 border-transparent hover:bg-gray-100 dark:hover:bg-white/10'
            }`}
          >
            <div className="scale-75 origin-center">
              {item.icon}
            </div>
          </button>
        )
      })}
    </nav>
  )
}
