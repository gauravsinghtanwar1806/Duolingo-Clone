import { useState, useEffect, useRef } from 'react'
import type { Unit, Skill, GameState } from '../types'
import ProgressRing from '../components/ui/ProgressRing'
import RightSidebar from '../components/layout/RightSidebar'

interface LearnPageProps {
  units: Unit[]
  gameState: GameState
  onSkillClick: (skill: Skill) => void
  onNavigate?: (page: string) => void
}

export default function LearnPage({ units, gameState, onSkillClick, onNavigate }: LearnPageProps) {
  const [selectedGuidebookUnit, setSelectedGuidebookUnit] = useState<Unit | null>(null)

  // Auto-scroll to the current lesson on load
  useEffect(() => {
    // Small delay to ensure DOM is fully rendered
    const timeout = setTimeout(() => {
      const currentNodes = document.querySelectorAll('[data-state="current"]')
      if (currentNodes.length > 0) {
        // Scroll to the lowest current node
        currentNodes[currentNodes.length - 1].scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }, 100)
    return () => clearTimeout(timeout)
  }, [units])

  return (
    <div style={{ display: 'flex', gap: '24px', maxWidth: '1056px', margin: '0 auto', padding: '24px 16px 100px' }}>
      {/* Main path */}
      <div className="flex-1 min-w-0 flex flex-col gap-10">
        {units.map((unit) => (
          <div key={unit.id} className="w-full">
            <UnitHeader unit={unit} onOpenGuidebook={() => setSelectedGuidebookUnit(unit)} />
            <SkillPath unit={unit} onSkillClick={onSkillClick} />
          </div>
        ))}
      </div>
      
      {selectedGuidebookUnit && (
        <GuidebookModal
          unit={selectedGuidebookUnit}
          onClose={() => setSelectedGuidebookUnit(null)}
        />
      )}

      {/* Right Column */}
      <RightSidebar gameState={gameState} onNavigate={onNavigate} />
    </div>
  )
}

function UnitHeader({ unit, onOpenGuidebook }: { unit: Unit, onOpenGuidebook: () => void }) {
  return (
    <div
      className="rounded-2xl p-4 mb-6 relative overflow-hidden flex items-center justify-between shadow-sm"
      style={{ background: '#1CB0F6' }}
    >
      <div className="flex flex-col text-white">
        <div className="flex items-center gap-2 font-extrabold text-[15px] opacity-90 mb-1 tracking-wide uppercase">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          SECTION 1, UNIT {unit.number}
        </div>
        <div className="font-black text-[22px]">
          {unit.title}
        </div>
      </div>
      
      <button 
        onClick={() => {
          // Dynamic guidebook based on unit
          alert(`Opening Guidebook for: ${unit.title}\n\nHere you can review the concepts taught in this section!`)
        }}
        className="bg-white/20 hover:bg-white/30 transition-colors border-2 border-white/20 rounded-xl px-4 py-2 flex items-center gap-2 cursor-pointer text-white font-extrabold text-[15px] shadow-[0_2px_0_rgba(0,0,0,0.1)]"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
        </svg>
        GUIDEBOOK
      </button>
    </div>
  )
}

function SkillPath({ unit, onSkillClick }: { unit: Unit; onSkillClick: (s: Skill) => void }) {
  const skills = unit.skills

  return (
    <div style={{ position: 'relative', padding: '8px 0', marginTop: '20px' }}>
      {/* Remove the vertical line, we don't need it for the new look */}
      
      {skills.map((skill, i) => {
        // Create a smooth, wide sine curve for the path
        const cycle = [0, -45, -75, -95, -75, -45, 0, 45, 75, 95, 75, 45]
        const offset = cycle[i % cycle.length]

        // Dynamic colors: use the unit's color theme, or fallback
        const isChest = i % 8 === 3
        const isTrophy = i % 8 === 7
        const colorOverride = unit.number % 3 === 1 ? '#58CC02' : unit.number % 3 === 2 ? '#FFC800' : '#CE82FF'

        // Determine if we should show a character (every ~6 nodes)
        const showCharacterLeft = i % 12 === 2
        const showCharacterRight = i % 12 === 8

        return (
          <div
            key={skill.id}
            style={{
              display: 'flex',
              justifyContent: `${offset < 0 ? 'flex-start' : offset > 0 ? 'flex-end' : 'center'}`,
              marginBottom: i < skills.length - 1 ? '16px' : '0',
              paddingLeft: offset < 0 ? `calc(50% - 40px + ${offset}px)` : undefined,
              paddingRight: offset > 0 ? `calc(50% - 40px - ${offset}px + 80px)` : undefined,
              position: 'relative',
              zIndex: 1,
            }}
          >
            {/* Add character next to node */}
            {showCharacterLeft && (
              <div className="absolute left-[calc(50%+80px)] -translate-y-4 pointer-events-none">
                <div className="text-[64px] animate-bounce-slow">🦉</div>
              </div>
            )}
            
            {showCharacterRight && (
              <div className="absolute right-[calc(50%+60px)] translate-y-4 pointer-events-none">
                <div className="text-[64px] animate-bounce-slow">👧🏻</div>
              </div>
            )}

            <SkillNode 
              skill={skill} 
              index={i}
              onSkillClick={onSkillClick} 
              unitColor={colorOverride} 
              isChest={isChest}
              isTrophy={isTrophy}
            />
          </div>
        )
      })}
      
      {/* Floating down arrow */}
      <div 
        className="fixed bottom-6 right-6 lg:right-[350px] w-12 h-12 bg-[#202F36] rounded-full flex items-center justify-center text-[#1CB0F6] cursor-pointer hover:bg-[#2A3F49] transition-colors border-2 border-[#1CB0F6]"
        onClick={() => {
          // Find the first 'current' skill node and scroll to it
          const currentNodes = document.querySelectorAll('[data-state="current"]');
          if (currentNodes.length > 0) {
            currentNodes[currentNodes.length - 1].scrollIntoView({ behavior: 'smooth', block: 'center' });
          } else {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
          }
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M19 12l-7 7-7-7"/>
        </svg>
      </div>
    </div>
  )
}

function SkillNode({ skill, index, onSkillClick, unitColor, isChest, isTrophy }: { skill: Skill; index: number; onSkillClick: (s: Skill) => void; unitColor: string; isChest?: boolean; isTrophy?: boolean }) {
  const [hovered, setHovered] = useState(false)
  
  const nodeSize = 72
  const state = skill.state // 'locked', 'current', 'completed'

  // Colors based on state
  const isLocked = state === 'locked'
  const isCurrent = state === 'current'
  const isCompleted = state === 'completed'

  const bgColor = isLocked ? '' : unitColor
  const lockedBgClass = 'bg-[#E5E7EB] dark:bg-[#37464F]'
  const lockedShadowClass = 'shadow-[0_8px_0_#D1D5DB] dark:shadow-[0_8px_0_#202F36]'
  
  // Outer ring for current
  const outerRingColor = unitColor + '40' // 25% opacity


  // Remove the early return for isChest so it renders as a clickable button
    <div data-state={state} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', position: 'relative' }}>
      
      {/* START Tooltip for current node */}
      {isCurrent && (
        <div 
          className="absolute z-20 flex flex-col items-center animate-bounce-in"
          style={{ bottom: '100%', left: '50%', transform: 'translateX(-50%)', paddingBottom: '12px' }}
        >
          <div className="bg-[#111A1E] dark:bg-[#202F36] text-[#1CB0F6] dark:text-[#38BDF8] font-extrabold text-[15px] px-4 py-2 rounded-xl border-2 border-[#202F36] dark:border-[#37464F] tracking-wider relative whitespace-nowrap shadow-md">
            START
            {/* Tooltip triangle */}
            <div className="absolute left-1/2 -bottom-[7px] w-3 h-3 bg-[#111A1E] dark:bg-[#202F36] border-b-2 border-r-2 border-[#202F36] dark:border-[#37464F]" style={{ transform: 'translateX(-50%) rotate(45deg)' }}></div>
          </div>
        </div>
      )}

      {/* Pulsing ring for current node */}
      {isCurrent && (
        <div 
          className="absolute rounded-full animate-ping z-0"
          style={{
            width: nodeSize + 16,
            height: nodeSize + 16,
            top: -8,
            left: -8,
            border: `4px solid ${unitColor}`,
            opacity: 0.3
          }}
        />
      )}

      <button
        onClick={() => {
          if (!isLocked) onSkillClick(skill)
        }}
        onMouseEnter={() => !isLocked && setHovered(true)}
        onMouseLeave={() => !isLocked && setHovered(false)}
        className={`relative z-10 ${!isLocked ? 'btn-tactile' : ''}`}
        style={{
          width: nodeSize,
          height: nodeSize,
          borderRadius: '50%',
          border: 'none',
          background: 'transparent',
          cursor: isLocked ? 'default' : 'pointer',
          padding: 0,
          transform: hovered ? 'scale(1.05)' : 'scale(1)',
          transition: 'transform 0.15s ease',
        }}
      >
        {/* Inner circle or Chest */}
        {isChest ? (
          <div className={`relative w-full h-full flex items-center justify-center`}>
            <div className={`text-[52px] leading-none drop-shadow-md ${isLocked ? 'opacity-50 grayscale' : ''}`}>
              🧰
            </div>
          </div>
        ) : (
          <div
            className={`absolute inset-0 rounded-full flex items-center justify-center border-[3px] border-white/20 ${isLocked ? `${lockedBgClass} ${lockedShadowClass} border-transparent` : ''}`}
            style={{
              background: !isLocked ? bgColor : undefined,
              boxShadow: !isLocked ? `0 8px 0 rgba(0,0,0,0.2)` : undefined,
            }}
          >
          {isCompleted ? (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          ) : (
            // Icon based on index
            (() => {
              const iconColor = isLocked ? '#AFAFAF' : 'white'
              const darkIconColor = isLocked ? '#52656D' : 'white'
              
              if (isTrophy) {
                return <div className={`text-[32px] ${isLocked ? 'opacity-40 grayscale' : 'text-white'}`}>🏆</div>
              }
              
              const iconType = index % 3
              if (iconType === 0) {
                // Book
                return (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill={isLocked ? 'currentColor' : 'white'} stroke={isLocked ? 'currentColor' : 'white'} strokeWidth="1" className={isLocked ? 'text-[#AFAFAF] dark:text-[#52656D]' : ''}>
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                  </svg>
                )
              } else if (iconType === 1) {
                // Star
                return (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill={isLocked ? 'currentColor' : 'white'} stroke={isLocked ? 'currentColor' : 'white'} strokeWidth="2" className={isLocked ? 'text-[#AFAFAF] dark:text-[#52656D]' : ''}>
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                )
              } else {
                // Headphone
                return (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={isLocked ? 'currentColor' : 'white'} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={isLocked ? 'text-[#AFAFAF] dark:text-[#52656D]' : ''}>
                    <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
                    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
                  </svg>
                )
              }
            })()
          )}
        </div>
        )}
      </button>
    </div>
  )
}



function GuidebookModal({ unit, onClose }: { unit: Unit, onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-[#131F24] rounded-2xl w-full max-w-[600px] overflow-hidden flex flex-col max-h-[85vh] shadow-[0_4px_0_rgba(0,0,0,0.2)] animate-slide-up">
        {/* Header */}
        <div className="bg-[#1CB0F6] p-6 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
          
          <div className="font-extrabold text-[14px] uppercase tracking-wider mb-2 opacity-90">
            Section 1, Unit {unit.number} Guidebook
          </div>
          <h2 className="text-[28px] font-black leading-tight">
            {unit.title}
          </h2>
          <p className="mt-2 text-white/90 font-medium">
            {unit.description}
          </p>
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <h3 className="font-bold text-[20px] text-[#4B4B4B] dark:text-[#E5E7EB]">Key Phrases</h3>
            
            <div className="bg-[#F7F9FA] dark:bg-[#202F36] rounded-xl p-4 border-2 border-[#E5E7EB] dark:border-[#37464F] flex justify-between items-center">
              <div>
                <p className="font-bold text-[18px] text-[#4B4B4B] dark:text-[#E5E7EB]">¡Hola! ¿Cómo estás?</p>
                <p className="text-[#777] dark:text-[#999] text-[15px] font-medium">Hello! How are you?</p>
              </div>
              <button className="w-10 h-10 rounded-full bg-[#1CB0F6] flex items-center justify-center text-white hover:bg-[#1899D6] transition-colors shadow-[0_2px_0_#1899D6]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                </svg>
              </button>
            </div>
            
            <div className="bg-[#F7F9FA] dark:bg-[#202F36] rounded-xl p-4 border-2 border-[#E5E7EB] dark:border-[#37464F] flex justify-between items-center">
              <div>
                <p className="font-bold text-[18px] text-[#4B4B4B] dark:text-[#E5E7EB]">Buenos días</p>
                <p className="text-[#777] dark:text-[#999] text-[15px] font-medium">Good morning</p>
              </div>
              <button className="w-10 h-10 rounded-full bg-[#1CB0F6] flex items-center justify-center text-white hover:bg-[#1899D6] transition-colors shadow-[0_2px_0_#1899D6]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                </svg>
              </button>
            </div>
          </div>
          
          <div className="flex flex-col gap-3">
            <h3 className="font-bold text-[20px] text-[#4B4B4B] dark:text-[#E5E7EB]">Grammar Tip</h3>
            <div className="bg-[#CE82FF]/10 rounded-xl p-5 border-2 border-[#CE82FF]/30">
              <p className="text-[#4B4B4B] dark:text-[#E5E7EB] text-[16px] leading-relaxed font-medium">
                In Spanish, nouns are either masculine or feminine. Masculine nouns usually end in <strong>-o</strong> (like <em>el niño</em>) and feminine nouns usually end in <strong>-a</strong> (like <em>la niña</em>).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
