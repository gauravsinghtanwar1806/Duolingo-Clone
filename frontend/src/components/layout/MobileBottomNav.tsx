import type { Page } from '../../types'
import React from 'react'

interface MobileBottomNavProps {
  page: Page
  setPage: (p: Page) => void
}

const NAV_ITEMS: { id: Page; label: string; icon: React.ReactNode } = [
  { 
    id: 'learn', 
    label: 'LEARN', 
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
    label: 'LEAGUES', 
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L4 5V11C4 16.5 7.5 21.5 12 23C16.5 21.5 20 16.5 20 11V5L12 2Z" fill="#FFC800" />
      </svg>
    )
  },
  { 
    id: 'profile', 
    label: 'PROFILE', 
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="#FFC800" />
        <circle cx="12" cy="10" r="4" fill="#A56E3B" />
        <path d="M6 18C6 14.6863 8.68629 12 12 12C15.3137 12 18 14.6863 18 18" stroke="#A56E3B" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  },
]

export default function MobileBottomNav({ page, setPage }: MobileBottomNavProps) {
  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-[#131F24] border-t-2 border-[#E5E7EB] dark:border-[#202F36] flex z-100 pb-[env(safe-area-inset-bottom)]"
    >
      {NAV_ITEMS.map((item) => {
        const active = page === item.id
        return (
          <button
            key={item.id}
            onClick={() => setPage(item.id)}
            className={`flex-1 flex flex-col items-center justify-center py-2.5 px-1 border-none bg-transparent cursor-pointer gap-1 relative ${active ? 'text-[#84D8FF]' : 'text-[#9CA3AF] dark:text-[#777]'}`}
          >
            <span className="flex items-center justify-center">{item.icon}</span>
            <span className={`text-[10px] ${active ? 'font-black' : 'font-bold'}`}>{item.label}</span>
            {active && (
              <div
                className="w-1 h-1 rounded-full bg-[#84D8FF] absolute bottom-1.5"
              />
            )}
          </button>
        )
      })}
    </nav>
  )
}
