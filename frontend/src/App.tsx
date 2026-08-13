import { useState, useCallback, useEffect } from 'react'
import type { Page, Skill, Unit, ToastData, GameState } from './types'
import { INITIAL_UNITS, INITIAL_GAME_STATE } from './data/seed'
import Sidebar, { BottomNav } from './components/layout/Sidebar'
import MobileBottomNav from './components/layout/MobileBottomNav'
import TopStatsBar from './components/layout/TopStatsBar'
import ToastContainer from './components/ui/Toast'
import LearnPage from './pages/LearnPage'
import LessonPage from './pages/LessonPage'
import PracticePage from './pages/PracticePage'
import LeaderboardPage from './pages/LeaderboardPage'
import AchievementsPage from './pages/AchievementsPage'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'
import ShopPage from './pages/ShopPage'
import LandingPage from './pages/LandingPage'

export default function App() {
  const [page, setPage] = useState<Page>('learn')
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE)
  const [units, setUnits] = useState<Unit[]>(INITIAL_UNITS)
  const [toasts, setToasts] = useState<ToastData[]>([])
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'))
  const [isInitializing, setIsInitializing] = useState(true)
  
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'light'
  })

  const syncGameState = useCallback(async () => {
    if (!token) return

    try {
      const [userRes, courseRes] = await Promise.all([
        fetch('http://localhost:8000/api/user/', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('http://localhost:8000/api/course/', { headers: { 'Authorization': `Bearer ${token}` } })
      ])

      if (!userRes.ok || !courseRes.ok) {
        // Token might be invalid
        localStorage.removeItem('token')
        setToken(null)
        return
      }

      if (!userRes.ok || !courseRes.ok) {
        if (userRes.status === 401) {
          localStorage.removeItem('token')
          localStorage.removeItem('dailyQuests')
          setToken(null)
          return
        }
        throw new Error('Failed to fetch data from backend')
      }
      
      const userData = await userRes.json()
      const courseData = await courseRes.json()

      setGameState(prev => ({
        ...prev,
        username: userData.username,
        xp: userData.xp,
        streak: userData.streak,
        hearts: userData.hearts,
        maxHearts: userData.max_hearts,
        gems: userData.gems,
        dailyXP: userData.daily_xp,
        dailyGoal: userData.daily_goal,
        joinedDate: userData.joined_date,
        league: userData.league,
        top3Finishes: userData.top_3_finishes,
        unlockedAchievements: userData.unlocked_achievements || [],
        followersCount: userData.followers_count,
        followingCount: userData.following_count,
        lastHeartRefill: userData.last_heart_refill,
        rank: userData.rank
      }))

      // Use backend course data directly
      let previousWasCompleted = true
      const mappedUnits = courseData.map((u: any) => ({
        ...u,
        skills: u.skills.map((s: any) => {
          if (s.state === 'completed') {
            previousWasCompleted = true
            return s
          }
          if (s.state === 'locked' && previousWasCompleted) {
            previousWasCompleted = false
            return { ...s, state: 'current' }
          }
          previousWasCompleted = false
          return s
        })
      }))
      setUnits(mappedUnits)
    } catch (err) {
      console.error("Failed to connect to backend API, using local state.", err)
    }
  }, [token])

  // Fetch user data when token changes
  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) {
        setIsInitializing(false)
        return
      }
      await syncGameState()
      setIsInitializing(false)
    }
    fetchUserData()
  }, [token, syncGameState])

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  // Lesson flow
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)
  const [showStartModal, setShowStartModal] = useState(false)
  const [inLesson, setInLesson] = useState(false)

  const addToast = useCallback((message: string, icon: string) => {
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev, { id, message, icon }])
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const handleSkillClick = (skill: Skill) => {
    if (gameState.hearts <= 0) {
      addToast('You have 0 hearts! Wait for a refill.', '💔')
      return
    }
    setSelectedSkill(skill)
    setShowStartModal(true)
  }

  const handleStartLesson = () => {
    setShowStartModal(false)
    setInLesson(true)
  }

  const handleLessonComplete = async ({
    xpEarned,
    correctCount,
    total,
    heartsLeft,
  }: {
    xpEarned: number
    correctCount: number
    total: number
    heartsLeft: number
  }) => {
    setInLesson(false)
    const skillId = selectedSkill?.id
    setSelectedSkill(null)

    if (token && skillId && typeof skillId === 'number') {
      try {
        await fetch('http://localhost:8000/api/lessons/complete/', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ 
            skillId: skillId, 
            xpEarned, 
            heartsRemaining: heartsLeft 
          })
        })

        // Re-fetch state
        const [userRes, courseRes] = await Promise.all([
          fetch('http://localhost:8000/api/user/', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('http://localhost:8000/api/course/', { headers: { 'Authorization': `Bearer ${token}` } })
        ])

        if (!userRes.ok || !courseRes.ok) {
          if (userRes.status === 401) {
            localStorage.removeItem('token')
            localStorage.removeItem('dailyQuests')
            setToken(null)
            return
          }
          throw new Error('Failed to fetch data from backend')
        }

        const userData = await userRes.json()
        const courseData = await courseRes.json()

        setGameState(prev => ({
          ...prev,
          username: userData.username,
          xp: userData.xp,
          streak: userData.streak,
          hearts: userData.hearts,
          maxHearts: userData.max_hearts,
          gems: userData.gems,
          dailyXP: userData.daily_xp,
          dailyGoal: userData.daily_goal,
          joinedDate: userData.joined_date,
          league: userData.league,
          top3Finishes: userData.top_3_finishes,
          unlockedAchievements: userData.unlocked_achievements || [],
          followersCount: userData.followers_count,
          followingCount: userData.following_count,
          lastHeartRefill: userData.last_heart_refill
        }))

        let previousWasCompleted = true
        const mappedUnits = courseData.map((u: any) => ({
          ...u,
          skills: u.skills.map((s: any) => {
            if (s.state === 'completed') {
              previousWasCompleted = true
              return s
            }
            if (s.state === 'locked' && previousWasCompleted) {
              previousWasCompleted = false
              return { ...s, state: 'current' }
            }
            previousWasCompleted = false
            return s
          })
        }))
        setUnits(mappedUnits)
        
      } catch (err) {
        console.error("Failed to sync progress with backend", err)
      }
    } else {
      // Fallback local logic if no backend token
      setGameState((prev) => ({
        ...prev,
        xp: prev.xp + xpEarned,
        dailyXP: Math.min(prev.dailyGoal, prev.dailyXP + xpEarned),
        hearts: heartsLeft,
      }))

      setUnits((prev) => {
        const mappedUnits = prev.map((unit) => ({
          ...unit,
          totalXP: unit.totalXP + (unit.skills.find((s) => s.id === skillId) ? xpEarned : 0),
          skills: unit.skills.map((skill) => {
            if (skill.id !== skillId) return skill
            return {
              ...skill,
              progress: 100,
              xpEarned: skill.xpEarned + xpEarned,
              state: 'completed',
            }
          }),
        }))

        let previousWasCompleted = true
        return mappedUnits.map(u => ({
          ...u,
          skills: u.skills.map(s => {
            if (s.state === 'completed') {
              previousWasCompleted = true
              return s
            }
            if (s.state === 'locked' && previousWasCompleted) {
              previousWasCompleted = false
              return { ...s, state: 'current' }
            }
            previousWasCompleted = false
            return s
          })
        }))
      })
    }

    // Toasts
    addToast(`+${xpEarned} XP`, '⭐')
    if (correctCount === total) {
      setTimeout(() => addToast('Perfect lesson!', '🎯'), 600)
    }
    setTimeout(() => addToast('Streak maintained!', '🔥'), 1200)
  }

  const handleExitLesson = async (heartsLeft: number) => {
    setInLesson(false)
    const skillId = selectedSkill?.id
    setSelectedSkill(null)
    setGameState(prev => ({ ...prev, hearts: heartsLeft }))

    if (token && skillId && typeof skillId === 'number') {
      try {
        await fetch('http://localhost:8000/api/lessons/complete/', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ 
            skillId: skillId, 
            xpEarned: 0, 
            heartsRemaining: heartsLeft 
          })
        })
      } catch (err) {
        console.error("Failed to sync hearts with backend", err)
      }
    }
  }

  // Lesson player takes over full screen
  if (inLesson && selectedSkill) {
    return (
      <div className="fixed inset-0 z-50 bg-white dark:bg-[#131F24] overflow-y-auto">
        <LessonPage
          skill={selectedSkill}
          initialHearts={gameState.hearts}
          username={gameState.username}
          onComplete={handleLessonComplete}
          onExit={handleExitLesson}
        />
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </div>
    )
  }

  if (isInitializing) {
    return <div className="min-h-screen bg-white dark:bg-[#111A1E] flex flex-col items-center justify-center font-black text-2xl text-[#1CB0F6]">LOADING...</div>
  }

  if (!token) {
    return (
      <LandingPage 
        theme={theme}
        setTheme={setTheme}
        onLoginSuccess={(newToken) => {
          localStorage.setItem('token', newToken)
          setToken(newToken)
        }} 
      />
    )
  }

  return (
    <div
      className="bg-[#F7F9FA] dark:bg-[#111A1E] text-[#202124] dark:text-[#E5E7EB]"
      style={{
        display: 'flex',
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Sidebar 
        page={page} 
        setPage={setPage} 
        onLogout={() => {
          localStorage.removeItem('token')
          localStorage.removeItem('dailyQuests')
          setToken(null)
          setPage('learn') // Reset to default page for next login
        }}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <TopStatsBar state={gameState} onNavigate={setPage} />

        <main
          style={{
            flex: 1,
            overflowY: 'auto',
          }}
          className="pb-[80px] lg:pb-0"
        >
          {page === 'learn' && (
            <LearnPage units={units} gameState={gameState} onSkillClick={handleSkillClick} onNavigate={setPage} />
          )}
          {page === 'practice' && <PracticePage gameState={gameState} onNavigate={setPage} onStartLesson={() => {
            // Start a lesson from the current skill
            const currentSkill = units.flatMap((u) => u.skills).find((s) => s.state === 'current')
            if (currentSkill) handleSkillClick(currentSkill)
          }} />}
          {page === 'leaderboard' && <LeaderboardPage gameState={gameState} onFriendAction={syncGameState} />}
          {page === 'achievements' || page === 'quests' ? <AchievementsPage gameState={gameState} /> : null}
          {page === 'shop' && <ShopPage gameState={gameState} onNavigate={setPage} />}
          {page === 'profile' && <ProfilePage gameState={gameState} onNavigate={setPage} onLogout={() => {
            localStorage.removeItem('token')
            localStorage.removeItem('dailyQuests')
            setToken(null)
            setPage('learn')
          }} />}
          {page === 'settings' && <SettingsPage theme={theme} setTheme={setTheme} onNavigate={setPage} onLogout={() => {
            localStorage.removeItem('token')
            localStorage.removeItem('dailyQuests')
            setToken(null)
            setPage('learn')
          }} />}
        </main>
        
        <BottomNav 
          page={page} 
          setPage={setPage}
          onLogout={() => {
            localStorage.removeItem('token')
            localStorage.removeItem('dailyQuests')
            setToken(null)
            setPage('learn')
          }}
        />
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Lesson Start Modal */}
      {showStartModal && selectedSkill && (
        <LessonStartModal
          skill={selectedSkill}
          onStart={handleStartLesson}
          onClose={() => { setShowStartModal(false); setSelectedSkill(null) }}
        />
      )}
    </div>
  )
}

// ─── Lesson Start Modal ──────────────────────────────────────────────────────

function LessonStartModal({
  skill,
  onStart,
  onClose,
}: {
  skill: Skill
  onStart: () => void
  onClose: () => void
}) {
  const practiceFocus = ['Vocabulary', 'Translation', 'Sentence construction', 'Matching pairs']

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        zIndex: 500,
        padding: '0 0 0',
      }}
    >
      <div
        className="animate-slide-up bg-white dark:bg-[#131F24]"
        onClick={(e) => e.stopPropagation()}
        style={{
          borderRadius: '28px 28px 0 0',
          padding: '32px 28px',
          width: '100%',
          maxWidth: '520px',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '52px', marginBottom: '8px' }}>{skill.emoji}</div>
          <div className="font-black text-[26px] text-[#202124] dark:text-white">{skill.name}</div>
          <div
            className="bg-[#F3F4F6] dark:bg-[#202F36] text-[#777] dark:text-[#AFAFAF]"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              marginTop: '6px',
              padding: '4px 14px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: 700,
            }}
          >
            Level {skill.level} •{' '}
            {skill.state === 'completed' ? '✅ Completed' : skill.state === 'current' ? '▶ In progress' : '🔓 Start'}
          </div>
        </div>

        {/* You'll practice */}
        <div
          className="bg-[#F9FAFB] dark:bg-[#202F36]"
          style={{
            borderRadius: '16px',
            padding: '16px',
            marginBottom: '20px',
          }}
        >
          <div style={{ fontWeight: 800, fontSize: '13px', color: '#777', marginBottom: '10px' }}>
            YOU'LL PRACTICE
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {practiceFocus.map((item) => (
              <div key={item} className="text-[#202124] dark:text-[#E5E7EB]" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '14px' }}>
                <span style={{ color: '#58CC02', fontWeight: 900 }}>✓</span> {item}
              </div>
            ))}
          </div>
        </div>

        {/* Rewards */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <div
            className="bg-[#FFF8D6] dark:bg-[#4D3F00] border-[#FFC800] dark:border-[#FFC800]"
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '14px',
              textAlign: 'center',
              borderWidth: '1.5px',
              borderStyle: 'solid',
            }}
          >
            <div style={{ fontSize: '22px' }}>⭐</div>
            <div style={{ fontWeight: 900, fontSize: '16px', color: '#FFC800' }}>+10–20 XP</div>
            <div style={{ fontWeight: 600, fontSize: '11px', color: '#777' }}>Per lesson</div>
          </div>
          <div
            className="bg-[#E8F9CC] dark:bg-[#1A3300] border-[#58CC02] dark:border-[#58CC02]"
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '14px',
              textAlign: 'center',
              borderWidth: '1.5px',
              borderStyle: 'solid',
            }}
          >
            <div style={{ fontSize: '22px' }}>👑</div>
            <div style={{ fontWeight: 900, fontSize: '16px', color: '#58CC02' }}>Skill XP</div>
            <div style={{ fontWeight: 600, fontSize: '11px', color: '#777' }}>Progress boost</div>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            className="btn-tactile"
            onClick={onStart}
            style={{
              width: '100%',
              padding: '16px',
              background: '#58CC02',
              color: '#fff',
              border: 'none',
              borderRadius: '16px',
              fontWeight: 900,
              fontSize: '18px',
              cursor: 'pointer',
              boxShadow: '0 4px 0 #46A302',
              letterSpacing: '0.5px',
            }}
          >
            {skill.state === 'current' ? 'CONTINUE LESSON →' : 'START LESSON →'}
          </button>
          <button
            className="btn-tactile bg-white dark:bg-[#202F36] text-[#1CB0F6] dark:text-[#38BDF8]"
            onClick={onStart}
            style={{
              width: '100%',
              padding: '14px',
              border: '2px solid #1CB0F6',
              borderRadius: '16px',
              fontWeight: 800,
              fontSize: '16px',
              cursor: 'pointer',
            }}
          >
            PRACTICE
          </button>
        </div>

        {/* Safe area */}
        <div style={{ height: 'env(safe-area-inset-bottom, 0px)' }} />
      </div>
    </div>
  )
}
