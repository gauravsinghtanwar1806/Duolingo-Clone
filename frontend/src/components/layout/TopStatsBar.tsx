import { useState, useEffect } from 'react'
import type { GameState } from '../../types'

interface TopStatsBarProps {
  state: GameState
  onNavigate?: (page: string) => void
}

export default function TopStatsBar({ state, onNavigate }: TopStatsBarProps) {
  const { xp, streak, hearts, maxHearts, gems, lastHeartRefill } = state
  const [timeLeft, setTimeLeft] = useState<string | null>(null)

  useEffect(() => {
    if (hearts >= maxHearts || !lastHeartRefill) {
      setTimeLeft(null)
      return
    }

    const updateTimer = () => {
      const refillDate = new Date(lastHeartRefill)
      const targetTime = refillDate.getTime() + 15 * 60 * 1000
      const now = new Date().getTime()
      const diff = targetTime - now

      if (diff <= 0) {
        setTimeLeft('00:00')
      } else {
        const m = Math.floor(diff / 1000 / 60)
        const s = Math.floor((diff / 1000) % 60)
        setTimeLeft(`${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`)
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [hearts, maxHearts, lastHeartRefill])

  return (
    <header
      className="h-[60px] bg-white dark:bg-[#131F24] border-b-2 border-[#E5E7EB] dark:border-[#202F36] flex items-center justify-end px-5 gap-1.5 shrink-0 sticky top-0 z-50"
    >
      {/* Streak */}
      <StatBadge
        icon="🔥"
        value={streak.toString()}
        color="#FF9600"
        bg="#FFF0D6"
      />

      {/* XP */}
      <StatBadge
        icon="⭐"
        value={xp.toLocaleString()}
        color="#FFC800"
        bg="#FFF8D6"
        suffix=" XP"
      />

      {/* Hearts */}
      <StatBadge
        icon="❤️"
        value={timeLeft ? `${hearts} (${timeLeft})` : `${hearts}/${maxHearts}`}
        color="#FF4B4B"
        bg="#FFE8E8"
      />

      {/* Gems */}
      <StatBadge
        icon="💎"
        value={gems.toLocaleString()}
        color="#1CB0F6"
        bg="#D6F0FF"
      />

      {/* Avatar */}
      <div
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #1CB0F6, #0A9AD9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          marginLeft: '6px',
          border: '2px solid #E5E7EB',
          cursor: 'pointer',
          flexShrink: 0,
        }}
        onClick={() => onNavigate && onNavigate('profile')}
      >
        🐼
      </div>
    </header>
  )
}

interface StatBadgeProps {
  icon: string
  value: string
  color: string
  bg: string
  suffix?: string
}

function StatBadge({ icon, value, color, bg, suffix }: StatBadgeProps) {
  return (
    <div
      className="relative flex items-center gap-[5px] px-3 py-1.5 rounded-full border-1.5 overflow-hidden"
      style={{
        backgroundColor: bg,
        borderColor: `${color}30`,
      }}
    >
      <div className="absolute inset-0 dark:bg-[#131F24] opacity-0 dark:opacity-80 pointer-events-none" />
      <span className="text-[16px] z-10">{icon}</span>
      <span className="font-extrabold text-[14px] z-10 relative" style={{ color }}>
        {value}{suffix}
      </span>
    </div>
  )
}
