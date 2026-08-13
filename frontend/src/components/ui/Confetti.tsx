import { useMemo } from 'react'

const COLORS = ['#58CC02', '#1CB0F6', '#FFC800', '#FF9600', '#FF4B4B', '#CE82FF', '#46A302', '#0A9AD9']

interface Piece {
  left: number
  delay: number
  duration: number
  color: string
  size: number
  isCircle: boolean
  rotation: number
}

export default function Confetti() {
  const pieces = useMemo<Piece[]>(() => {
    return Array.from({ length: 60 }, () => ({
      left: Math.random() * 100,
      delay: Math.random() * 1.5,
      duration: 2.5 + Math.random() * 2,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: 6 + Math.floor(Math.random() * 8),
      isCircle: Math.random() > 0.4,
      rotation: Math.random() * 360,
    }))
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 9000,
        overflow: 'hidden',
      }}
    >
      {pieces.map((p, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${p.left}%`,
            top: '-20px',
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.isCircle ? '50%' : '2px',
            animationName: 'confetti-fall',
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            animationTimingFunction: 'linear',
            animationFillMode: 'forwards',
            transform: `rotate(${p.rotation}deg)`,
          }}
        />
      ))}
    </div>
  )
}
