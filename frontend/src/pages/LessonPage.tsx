import { useState, useCallback, useEffect, useMemo } from 'react'
import type { Skill, Exercise } from '../types'
import Confetti from '../components/ui/Confetti'
import { playCorrectSound, playIncorrectSound } from '../utils/audio'

interface LessonPageProps {
  skill: Skill
  initialHearts: number
  username?: string
  onComplete: (result: { xpEarned: number; correctCount: number; total: number; heartsLeft: number; skillId: string }) => void
  onExit: (heartsLeft: number) => void
}

export default function LessonPage({ skill, initialHearts, username, onComplete, onExit }: LessonPageProps) {
  const exercises = skill.lessons[0]?.exercises ?? []
  const total = exercises.length

  const [index, setIndex] = useState(0)
  const [hearts, setHearts] = useState(initialHearts)
  const [correctCount, setCorrectCount] = useState(0)
  const [feedback, setFeedback] = useState<{ correct: boolean; correctAnswer: string } | null>(null)
  const [showComplete, setShowComplete] = useState(false)
  const [showHeartsModal, setShowHeartsModal] = useState(false)
  const [floatingXP, setFloatingXP] = useState<number | null>(null)
  const [shakeCard, setShakeCard] = useState(false)
  const [startTime] = useState<number>(Date.now())
  const [currentStreak, setCurrentStreak] = useState(0)
  const [hasReached5InARow, setHasReached5InARow] = useState(false)

  // Per-exercise answer state
  const [mcAnswer, setMcAnswer] = useState<string | null>(null)
  const [wordSelected, setWordSelected] = useState<string[]>([])
  const [wordBank, setWordBank] = useState<string[]>([])
  const [fillAnswer, setFillAnswer] = useState<string | null>(null)
  const [typeAnswer, setTypeAnswer] = useState('')
  const [matchLeft, setMatchLeft] = useState<string | null>(null)
  const [matchedPairs, setMatchedPairs] = useState<string[]>([])
  const [wrongPair, setWrongPair] = useState<[string, string] | null>(null)
  const [allMatched, setAllMatched] = useState(false)

  const exercise = exercises[index]

  // Reset answer state when exercise changes
  useEffect(() => {
    setMcAnswer(null)
    setFillAnswer(null)
    setTypeAnswer('')
    setMatchLeft(null)
    setMatchedPairs([])
    setWrongPair(null)
    setAllMatched(false)
    setFeedback(null)

    if (exercise?.type === 'word-bank') {
      const shuffled = [...exercise.wordBank].sort(() => Math.random() - 0.5)
      setWordBank(shuffled)
      setWordSelected([])
    }
    if (exercise?.type === 'match-pairs') {
      setMatchedPairs([])
    }
  }, [index, exercise?.type])

  const isAnswerReady = useCallback((): boolean => {
    if (!exercise) return false
    switch (exercise.type) {
      case 'multiple-choice': return mcAnswer !== null
      case 'fill-blank': return fillAnswer !== null
      case 'type-answer': return typeAnswer.trim().length > 0
      case 'word-bank': return wordSelected.length > 0
      case 'match-pairs': return allMatched
      default: return false
    }
  }, [exercise, mcAnswer, fillAnswer, typeAnswer, wordSelected, allMatched])

  const getCorrectAnswer = (): string => {
    if (!exercise) return ''
    switch (exercise.type) {
      case 'multiple-choice': return exercise.answer
      case 'fill-blank': return exercise.answer
      case 'type-answer': return exercise.answer
      case 'word-bank': return exercise.correctOrder.join(' ')
      case 'match-pairs': return 'All pairs matched!'
      default: return ''
    }
  }

  const checkAnswer = (): boolean => {
    if (!exercise) return false
    switch (exercise.type) {
      case 'multiple-choice': return mcAnswer === exercise.answer
      case 'fill-blank': return fillAnswer === exercise.answer
      case 'type-answer': {
        const normalized = typeAnswer.trim().toLowerCase()
        const acceptable = [exercise.answer, ...(exercise.acceptableAnswers ?? [])].map(a => a.toLowerCase())
        return acceptable.includes(normalized)
      }
      case 'word-bank':
        return wordSelected.join(' ') === exercise.correctOrder.join(' ')
      case 'match-pairs': return allMatched
      default: return false
    }
  }

  const handleCheck = () => {
    if (!isAnswerReady() || feedback) return
    const correct = checkAnswer()
    const correctAnswer = getCorrectAnswer()
    setFeedback({ correct, correctAnswer })

    if (correct) {
      playCorrectSound()
      setCorrectCount((c) => c + 1)
      setCurrentStreak((s) => {
        const next = s + 1
        if (next >= 5) setHasReached5InARow(true)
        return next
      })
      setFloatingXP(10)
      setTimeout(() => setFloatingXP(null), 1600)
    } else {
      playIncorrectSound()
      setCurrentStreak(0)
      const newHearts = Math.max(0, hearts - 1)
      setHearts(newHearts)
      setShakeCard(true)
      setTimeout(() => setShakeCard(false), 500)
      if (newHearts <= 0) {
        setTimeout(() => setShowHeartsModal(true), 600)
      }
    }
  }

  const handleFinish = () => {
    const timeSpentMs = Date.now() - startTime
    const minutesSpent = Math.max(1, Math.round(timeSpentMs / 60000))
    
    try {
      const today = new Date().toISOString().split('T')[0]
      const storageKey = username ? `dailyQuests_${username}` : 'dailyQuests'
      const savedQuestsStr = localStorage.getItem(storageKey)
      let quests = { date: today, timeSpent: 0, fiveInARow: 0 }
      
      if (savedQuestsStr) {
        const parsed = JSON.parse(savedQuestsStr)
        if (parsed.date === today) {
          quests = parsed
        }
      }
      
      quests.timeSpent += minutesSpent
      if (hasReached5InARow) {
        quests.fiveInARow += 1
      }
      
      localStorage.setItem(storageKey, JSON.stringify(quests))
    } catch (e) {
      console.warn('Failed to update local quests', e)
    }

    onComplete({
      xpEarned: 10 + correctCount * 2,
      correctCount,
      total: total,
      heartsLeft: hearts,
      skillId: skill.id
    })
  }

  const handleContinue = () => {
    if (index >= total - 1) {
      setShowComplete(true)
    } else {
      setIndex((i) => i + 1)
      setFeedback(null)
    }
  }

  const handleMatchSelect = (side: 'left' | 'right', value: string) => {
    if (matchedPairs.includes(value)) return

    if (side === 'left') {
      setMatchLeft(value)
    } else {
      if (!matchLeft) return
      if (!exercise || exercise.type !== 'match-pairs') return

      const pair = exercise.pairs.find(
        (p) => (p.left === matchLeft && p.right === value) || (p.right === matchLeft && p.left === value)
      )

      if (pair) {
        const newMatched = [...matchedPairs, pair.left, pair.right]
        setMatchedPairs(newMatched)
        setMatchLeft(null)
        setWrongPair(null)
        if (newMatched.length === exercise.pairs.length * 2) {
          setAllMatched(true)
        }
      } else {
        setWrongPair([matchLeft, value])
        setTimeout(() => {
          setWrongPair(null)
          setMatchLeft(null)
        }, 700)
      }
    }
  }

  const progress = ((index + (feedback ? 1 : 0)) / total) * 100

  if (showHeartsModal) {
    return (
      <div
        className="fixed inset-0 bg-[#F7F9FA] dark:bg-[#111A1E] flex items-center justify-center z-[200] p-6"
      >
        <div
          className="animate-bounce-in bg-white dark:bg-[#131F24] rounded-3xl p-[40px_32px] max-w-[360px] w-full text-center border-2 border-[#E5E7EB] dark:border-[#202F36] shadow-[0_20px_60px_rgba(0,0,0,0.12)]"
        >
          <div style={{ fontSize: '60px', marginBottom: '16px' }}>💔</div>
          <div className="font-black text-[24px] text-[#202124] dark:text-white mb-2">
            Out of Hearts!
          </div>
          <div className="font-semibold text-[15px] text-[#777] dark:text-[#AFAFAF] mb-7">
            Don't worry — practice to restore your hearts.
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              className="btn-tactile"
              onClick={() => {
                setHearts(5)
                setShowHeartsModal(false)
              }}
              style={{
                padding: '14px',
                background: '#58CC02',
                color: '#fff',
                border: 'none',
                borderRadius: '14px',
                fontWeight: 900,
                fontSize: '16px',
                cursor: 'pointer',
                boxShadow: '0 4px 0 #46A302',
              }}
            >
              💪 Practice to Refill
            </button>
            <button
              className="btn-tactile"
              onClick={() => {
                setHearts(5)
                setShowHeartsModal(false)
              }}
              style={{
                padding: '14px',
                background: '#FFF0D6',
                color: '#FF9600',
                border: '2px solid #FF9600',
                borderRadius: '14px',
                fontWeight: 800,
                fontSize: '16px',
                cursor: 'pointer',
              }}
            >
              💎 Refill Hearts
            </button>
            <button
              onClick={() => onExit(hearts)}
              style={{
                padding: '12px',
                background: 'transparent',
                color: '#777',
                border: '2px solid #E5E7EB',
                borderRadius: '14px',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              Exit Lesson
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (showComplete) {
    const xpEarned = correctCount * 10 + (correctCount === total ? 5 : 0)
    const accuracy = Math.round((correctCount / total) * 100)
    return (
      <div
        className="fixed inset-0 bg-[#F7F9FA] dark:bg-[#111A1E] flex flex-col items-center justify-center z-[200] p-6 text-center"
      >
        <Confetti />
        <div className="animate-bounce-in w-full max-w-[400px]">
          <div style={{ fontSize: '72px', marginBottom: '8px' }}>🎉</div>
          <div className="font-black text-[32px] text-[#202124] dark:text-white mb-1">
            Lesson Complete!
          </div>
          <div style={{ fontWeight: 700, fontSize: '18px', color: '#58CC02', marginBottom: '24px' }}>
            🔥 Streak maintained!
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 28px',
              background: '#FFF8D6',
              borderRadius: '20px',
              border: '2px solid #FFC800',
              marginBottom: '24px',
            }}
          >
            <span style={{ fontSize: '28px' }}>⭐</span>
            <span style={{ fontWeight: 900, fontSize: '32px', color: '#FFC800' }}>+{xpEarned} XP</span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '12px',
              marginBottom: '24px',
            }}
          >
            {[
              { label: 'Correct', value: `${correctCount}/${total}`, color: '#58CC02' },
              { label: 'Accuracy', value: `${accuracy}%`, color: '#1CB0F6' },
              { label: 'XP Earned', value: `+${xpEarned}`, color: '#FFC800' },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-white dark:bg-[#131F24] rounded-2xl p-[14px_8px] border-2 border-[#E5E7EB] dark:border-[#202F36]"
              >
                <div style={{ fontWeight: 900, fontSize: '20px', color: s.color }}>{s.value}</div>
                <div className="font-bold text-[11px] text-[#777] dark:text-[#AFAFAF] mt-[2px]">{s.label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              className="btn-tactile"
              onClick={handleFinish}
              style={{
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
              CONTINUE →
            </button>
            <button
              className="btn-tactile"
              onClick={() => {
                setIndex(0)
                setCorrectCount(0)
                setFeedback(null)
                setShowComplete(false)
                setHearts(initialHearts)
              }}
              style={{
                padding: '14px',
                background: 'transparent',
                color: '#1CB0F6',
                border: '2px solid #1CB0F6',
                borderRadius: '16px',
                fontWeight: 800,
                fontSize: '16px',
                cursor: 'pointer',
              }}
            >
              Practice Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="fixed inset-0 bg-[#F7F9FA] dark:bg-[#111A1E] flex flex-col z-[200]"
    >
      {/* Header */}
      <div
        className="flex items-center gap-4 p-[16px_20px] bg-white dark:bg-[#131F24] border-b-2 border-[#E5E7EB] dark:border-[#202F36]"
      >
        <button
          onClick={() => onExit(hearts)}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            border: '2px solid #E5E7EB',
            background: '#fff',
            fontSize: '16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#9CA3AF',
            fontWeight: 800,
            flexShrink: 0,
          }}
          aria-label="Exit lesson"
        >
          ✕
        </button>

        {/* Progress bar */}
        <div
          className="flex-1 h-[14px] rounded-[14px] bg-[#E5E7EB] dark:bg-[#202F36] overflow-hidden"
        >
          <div
            style={{
              height: '100%',
              borderRadius: '14px',
              background: 'linear-gradient(90deg, #58CC02, #46A302)',
              width: `${progress}%`,
              transition: 'width 0.5s ease',
            }}
          />
        </div>

        {/* Hearts */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontWeight: 900,
            fontSize: '16px',
            color: '#FF4B4B',
            flexShrink: 0,
          }}
        >
          ❤️ {hearts}
        </div>
      </div>

      {/* Exercise area */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px 20px',
          paddingBottom: feedback ? '220px' : '100px',
        }}
      >
        {exercise && (
          <div
            className={shakeCard ? 'animate-shake' : ''}
            style={{ width: '100%', maxWidth: '600px' }}
          >
            <ExerciseRenderer
              exercise={exercise}
              mcAnswer={mcAnswer}
              setMcAnswer={setMcAnswer}
              fillAnswer={fillAnswer}
              setFillAnswer={setFillAnswer}
              typeAnswer={typeAnswer}
              setTypeAnswer={setTypeAnswer}
              wordSelected={wordSelected}
              setWordSelected={setWordSelected}
              wordBank={wordBank}
              setWordBank={setWordBank}
              matchLeft={matchLeft}
              matchedPairs={matchedPairs}
              wrongPair={wrongPair}
              allMatched={allMatched}
              onMatchSelect={handleMatchSelect}
              feedback={feedback}
              disabled={!!feedback}
            />
          </div>
        )}

        {/* Floating XP */}
        {floatingXP !== null && (
          <div
            className="animate-float-xp"
            style={{
              position: 'fixed',
              top: '30%',
              left: '50%',
              transform: 'translateX(-50%)',
              fontWeight: 900,
              fontSize: '28px',
              color: '#FFC800',
              zIndex: 300,
              pointerEvents: 'none',
              textShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            +{floatingXP} XP ⭐
          </div>
        )}
      </div>

      {/* Bottom: Check button or feedback */}
      {feedback ? (
        <div
          className="animate-slide-up"
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            background: feedback.correct ? '#D7F5B5' : '#FFE0E0',
            borderTop: `3px solid ${feedback.correct ? '#58CC02' : '#FF4B4B'}`,
            padding: '20px 24px',
            paddingBottom: 'max(20px, env(safe-area-inset-bottom))',
          }}
        >
          <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontWeight: 900,
                  fontSize: '20px',
                  color: feedback.correct ? '#46A302' : '#CC3030',
                  marginBottom: '2px',
                }}
              >
                {feedback.correct ? '✓ Excellent!' : '✕ Almost!'}
              </div>
              {!feedback.correct && (
                <div className="font-semibold text-[13px] text-[#777] dark:text-[#AFAFAF]">
                  Correct: <strong className="text-[#202124] dark:text-white">{feedback.correctAnswer}</strong>
                </div>
              )}
              {feedback.correct && (
                <div style={{ fontWeight: 600, fontSize: '13px', color: '#58CC02' }}>
                  That's correct. Keep it up!
                </div>
              )}
            </div>
            <button
              className="btn-tactile"
              onClick={handleContinue}
              style={{
                padding: '14px 28px',
                background: feedback.correct ? '#58CC02' : '#FF4B4B',
                color: '#fff',
                border: 'none',
                borderRadius: '14px',
                fontWeight: 900,
                fontSize: '16px',
                cursor: 'pointer',
                boxShadow: `0 4px 0 ${feedback.correct ? '#46A302' : '#CC3030'}`,
                flexShrink: 0,
              }}
            >
              CONTINUE →
            </button>
          </div>
        </div>
      ) : (
        <div
          className="fixed bottom-0 left-0 right-0 p-[16px_24px] pb-[max(16px,env(safe-area-inset-bottom))] bg-[#F7F9FA] dark:bg-[#111A1E] border-t-2 border-[#E5E7EB] dark:border-[#202F36]"
        >
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <button
              className={`btn-tactile ${
                isAnswerReady()
                  ? 'bg-[#58CC02] text-white shadow-[0_4px_0_#46A302]'
                  : 'bg-[#E5E7EB] dark:bg-[#37464F] text-[#9CA3AF] dark:text-[#52656D]'
              }`}
              onClick={handleCheck}
              disabled={!isAnswerReady()}
              style={{
                width: '100%',
                padding: '16px',
                border: 'none',
                borderRadius: '16px',
                fontWeight: 900,
                fontSize: '18px',
                cursor: isAnswerReady() ? 'pointer' : 'not-allowed',
                transition: 'background 0.15s ease, box-shadow 0.15s ease',
                letterSpacing: '0.5px',
              }}
            >
              CHECK
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Exercise Renderers ─────────────────────────────────────────────────────

interface ExerciseRendererProps {
  exercise: Exercise
  mcAnswer: string | null
  setMcAnswer: (a: string) => void
  fillAnswer: string | null
  setFillAnswer: (a: string) => void
  typeAnswer: string
  setTypeAnswer: (a: string) => void
  wordSelected: string[]
  setWordSelected: (w: string[]) => void
  wordBank: string[]
  setWordBank: (w: string[]) => void
  matchLeft: string | null
  matchedPairs: string[]
  wrongPair: [string, string] | null
  allMatched: boolean
  onMatchSelect: (side: 'left' | 'right', value: string) => void
  feedback: { correct: boolean; correctAnswer: string } | null
  disabled: boolean
}

function ExerciseRenderer({ exercise, ...props }: ExerciseRendererProps) {
  const renderHeader = (title: string, isNewWord: boolean = false) => (
    <div className="mb-6 flex flex-col gap-2 w-full max-w-[600px]">
      {isNewWord && (
        <div className="flex items-center gap-1.5 text-[#CE82FF] font-black text-[14px] uppercase tracking-wider">
          <span className="text-[16px]">✨</span> NEW WORD
        </div>
      )}
      <div className="font-black text-[24px] md:text-[28px] text-[#202124] dark:text-white leading-snug">
        {title}
      </div>
    </div>
  )

  const renderCharacterPrompt = (character: string, prompt: string) => (
    <div className="flex items-end gap-4 mb-8">
      <div className="text-[80px] leading-none select-none drop-shadow-md hidden sm:block">
        {character}
      </div>
      <div className="relative bg-white dark:bg-[#131F24] border-2 border-[#E5E7EB] dark:border-[#202F36] rounded-2xl p-4 flex-1">
        {/* Speech bubble arrow */}
        <div className="absolute top-1/2 -left-[10px] -translate-y-1/2 w-4 h-4 bg-white dark:bg-[#131F24] border-l-2 border-b-2 border-[#E5E7EB] dark:border-[#202F36] rotate-45 hidden sm:block"></div>
        
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 shrink-0 rounded-full bg-[#1CB0F6] text-white flex items-center justify-center text-xl cursor-pointer hover:bg-[#1899D6] transition-colors border-none shadow-[0_2px_0_#1899D6]">
            🔈
          </button>
          <div className="font-medium text-[20px] text-[#202124] dark:text-white">
            {prompt}
          </div>
        </div>
      </div>
    </div>
  )

  if (exercise.type === 'multiple-choice') {
    return (
      <div className="w-full flex flex-col max-w-[600px]">
        {renderHeader(exercise.question)}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          {exercise.options.map((opt, idx) => {
            const selected = props.mcAnswer === opt
            const isCorrect = props.feedback && opt === exercise.answer
            const isWrong = props.feedback && selected && !props.feedback.correct

            return (
              <button
                key={opt}
                className={`btn-tactile group ${
                  isCorrect
                    ? 'border-[#58CC02] bg-[#E8F9CC] dark:bg-[#1A3300] text-[#58CC02]'
                    : isWrong
                    ? 'border-[#FF4B4B] bg-[#FFE0E0] dark:bg-[#331414] text-[#FF4B4B]'
                    : selected
                    ? 'border-[#1CB0F6] bg-[#EBF7FF] dark:bg-[#142D3D] text-[#1CB0F6]'
                    : 'border-[#E5E7EB] dark:border-[#202F36] bg-white dark:bg-[#131F24] text-[#202124] dark:text-[#E5E7EB] shadow-[0_2px_0_#E5E7EB] dark:shadow-[0_2px_0_#202F36]'
                }`}
                onClick={() => !props.disabled && props.setMcAnswer(opt)}
                style={{
                  padding: '16px',
                  borderRadius: '16px',
                  borderWidth: selected || isCorrect || isWrong ? '3px' : '2px',
                  borderStyle: 'solid',
                  fontWeight: 700,
                  fontSize: '18px',
                  cursor: props.disabled ? 'default' : 'pointer',
                  textAlign: 'left',
                  boxShadow: selected || isCorrect || isWrong ? 'none' : undefined,
                  transition: 'all 0.1s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[14px] font-bold border-2 ${
                  isCorrect ? 'border-[#58CC02] text-[#58CC02]' :
                  isWrong ? 'border-[#FF4B4B] text-[#FF4B4B]' :
                  selected ? 'border-[#1CB0F6] text-[#1CB0F6]' :
                  'border-[#E5E7EB] dark:border-[#202F36] text-[#AFAFAF] group-hover:border-[#1CB0F6] group-hover:text-[#1CB0F6]'
                }`}>
                  {idx + 1}
                </div>
                {opt}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  if (exercise.type === 'fill-blank') {
    const parts = exercise.sentence.split('___')
    return (
      <div className="w-full flex flex-col max-w-[600px]">
        {renderHeader('Fill in the blank')}
        <div className="flex items-center gap-4 mb-10 mt-4">
          <div className="text-[64px] hidden sm:block drop-shadow-md">🦉</div>
          <div className="flex items-center gap-3 text-[20px] font-bold text-[#202124] dark:text-white flex-wrap">
            <span>{parts[0]}</span>
            <div
              className={`min-w-[100px] h-[40px] border-b-[3px] flex items-center justify-center px-4 font-bold text-[18px] transition-colors ${
                props.fillAnswer ? 'border-[#1CB0F6] text-[#1CB0F6]' : 'border-[#E5E7EB] dark:border-[#37464F]'
              }`}
            >
              {props.fillAnswer}
            </div>
            <span>{parts[1]}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          {exercise.options.map((opt) => {
            const selected = props.fillAnswer === opt
            const isCorrect = props.feedback && opt === exercise.answer
            const isWrong = props.feedback && selected && !props.feedback.correct

            return (
              <button
                key={opt}
                className={`btn-tactile ${
                  isCorrect
                    ? 'border-[#58CC02] bg-[#E8F9CC] dark:bg-[#1A3300] text-[#58CC02]'
                    : isWrong
                    ? 'border-[#FF4B4B] bg-[#FFE0E0] dark:bg-[#331414] text-[#FF4B4B]'
                    : selected
                    ? 'border-[#1CB0F6] bg-[#EBF7FF] dark:bg-[#142D3D] text-[#1CB0F6]'
                    : 'border-[#E5E7EB] dark:border-[#202F36] bg-white dark:bg-[#131F24] text-[#202124] dark:text-[#E5E7EB] shadow-[0_2px_0_#E5E7EB] dark:shadow-[0_2px_0_#202F36]'
                }`}
                onClick={() => !props.disabled && props.setFillAnswer(opt)}
                style={{
                  padding: '12px 20px',
                  borderRadius: '16px',
                  borderWidth: selected || isCorrect || isWrong ? '3px' : '2px',
                  borderStyle: 'solid',
                  fontWeight: 700,
                  fontSize: '18px',
                  cursor: props.disabled ? 'default' : 'pointer',
                  boxShadow: selected || isCorrect || isWrong ? 'none' : undefined,
                  transition: 'all 0.1s ease',
                }}
              >
                {opt}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  if (exercise.type === 'word-bank') {
    const addWord = (w: string, bankIdx: number) => {
      if (props.disabled) return
      const newBank = [...props.wordBank]
      newBank.splice(bankIdx, 1)
      props.setWordBank(newBank)
      props.setWordSelected([...props.wordSelected, w])
    }

    const removeWord = (w: string, i: number) => {
      if (props.disabled) return
      const newSelected = [...props.wordSelected]
      newSelected.splice(i, 1)
      props.setWordSelected(newSelected)
      props.setWordBank([...props.wordBank, w])
    }

    return (
      <div className="w-full flex flex-col max-w-[600px]">
        {renderHeader('Write this in English')}
        
        {renderCharacterPrompt('🐻', exercise.question)}

        {/* Answer area */}
        <div className="w-full relative mb-8">
          <div
            className="w-full border-b-[3px] border-[#E5E7EB] dark:border-[#202F36] absolute top-1/2 left-0 -z-10"
          ></div>
          <div
            className={`min-h-[44px] flex flex-wrap gap-2 items-center`}
          >
            {props.wordSelected.map((w, i) => (
              <button
                key={`sel-${i}`}
                onClick={() => removeWord(w, i)}
                className="bg-white dark:bg-[#131F24] border-2 border-[#E5E7EB] dark:border-[#202F36] text-[#202124] dark:text-white rounded-[12px] font-bold text-[16px] px-[16px] py-[10px] shadow-[0_2px_0_#E5E7EB] dark:shadow-[0_2px_0_#202F36]"
                style={{ cursor: props.disabled ? 'default' : 'pointer' }}
              >
                {w}
              </button>
            ))}
          </div>
        </div>

        {/* Word bank */}
        <div className="flex flex-wrap gap-2 justify-center">
          {props.wordBank.map((w, i) => (
            <button
              key={`bank-${i}`}
              onClick={() => addWord(w, i)}
              className="bg-white dark:bg-[#131F24] border-2 border-[#E5E7EB] dark:border-[#202F36] text-[#202124] dark:text-[#E5E7EB] shadow-[0_2px_0_#E5E7EB] dark:shadow-[0_2px_0_#202F36] rounded-[12px] font-bold text-[16px] px-[16px] py-[10px] transition-transform hover:-translate-y-0.5 active:translate-y-0 active:shadow-none"
              style={{ cursor: props.disabled ? 'default' : 'pointer' }}
            >
              {w}
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (exercise.type === 'match-pairs') {
    const { leftItems, rightItems } = useMemo(() => {
      const left = exercise.pairs.map((p) => p.left)
      const right = [...exercise.pairs.map((p) => p.right)].sort(() => Math.random() - 0.5)
      return { leftItems: left, rightItems: right }
    }, [exercise])

    return (
      <div className="w-full max-w-[600px] flex flex-col">
        {renderHeader(exercise.question)}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {leftItems.map((item) => {
              const isMatched = props.matchedPairs.includes(item)
              const isSelected = props.matchLeft === item
              const isWrong = props.wrongPair && props.wrongPair[0] === item

              return (
                <button
                  key={item}
                  className={`${isWrong ? 'animate-shake' : ''} btn-tactile ${
                    isMatched
                      ? 'border-[#58CC02] bg-[#E8F9CC] dark:bg-[#1A3300] text-[#58CC02]'
                      : isWrong
                      ? 'border-[#FF4B4B] bg-[#FFE0E0] dark:bg-[#331414] text-[#FF4B4B]'
                      : isSelected
                      ? 'border-[#1CB0F6] bg-[#EBF7FF] dark:bg-[#142D3D] text-[#1CB0F6]'
                      : 'border-[#E5E7EB] dark:border-[#202F36] bg-white dark:bg-[#131F24] text-[#202124] dark:text-[#E5E7EB] shadow-[0_2px_0_#E5E7EB] dark:shadow-[0_2px_0_#202F36]'
                  }`}
                  onClick={() => !isMatched && !props.disabled && props.onMatchSelect('left', item)}
                  style={{
                    padding: '14px 10px',
                    borderRadius: '14px',
                    borderWidth: '2px',
                    borderStyle: 'solid',
                    fontWeight: 700,
                    fontSize: '15px',
                    cursor: isMatched || props.disabled ? 'default' : 'pointer',
                    opacity: isMatched ? 0.7 : 1,
                    boxShadow: isMatched ? 'none' : undefined,
                  }}
                >
                  {isMatched ? `✓ ${item}` : item}
                </button>
              )
            })}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {rightItems.map((item) => {
              const isMatched = props.matchedPairs.includes(item)
              const isWrong = props.wrongPair && props.wrongPair[1] === item

              return (
                <button
                  key={item}
                  className={`${isWrong ? 'animate-shake' : ''} btn-tactile ${
                    isMatched
                      ? 'border-[#58CC02] bg-[#E8F9CC] dark:bg-[#1A3300] text-[#58CC02]'
                      : isWrong
                      ? 'border-[#FF4B4B] bg-[#FFE0E0] dark:bg-[#331414] text-[#FF4B4B]'
                      : 'border-[#E5E7EB] dark:border-[#202F36] bg-white dark:bg-[#131F24] text-[#202124] dark:text-[#E5E7EB] shadow-[0_2px_0_#E5E7EB] dark:shadow-[0_2px_0_#202F36]'
                  }`}
                  onClick={() => !isMatched && !props.disabled && props.onMatchSelect('right', item)}
                  style={{
                    padding: '14px 10px',
                    borderRadius: '14px',
                    borderWidth: '2px',
                    borderStyle: 'solid',
                    fontWeight: 700,
                    fontSize: '15px',
                    cursor: isMatched || props.disabled ? 'default' : 'pointer',
                    opacity: isMatched ? 0.7 : 1,
                    boxShadow: isMatched ? 'none' : undefined,
                  }}
                >
                  {isMatched ? `✓ ${item}` : item}
                </button>
              )
            })}
          </div>
        </div>

        {props.allMatched && (
          <div
            style={{
              marginTop: '16px',
              textAlign: 'center',
              fontWeight: 800,
              fontSize: '16px',
              color: '#58CC02',
            }}
          >
            🎉 All matched!
          </div>
        )}
      </div>
    )
  }

  if (exercise.type === 'type-answer') {
    return (
      <div className="w-full max-w-[600px] flex flex-col">
        {renderHeader('Type what you hear')}
        
        {renderCharacterPrompt('👩🏼‍🎤', exercise.prompt)}

        <textarea
          value={props.typeAnswer}
          onChange={(e) => !props.disabled && props.setTypeAnswer(e.target.value)}
          placeholder="Type in the language you are learning"
          disabled={props.disabled}
          className={`w-full p-[16px_18px] rounded-2xl border-2 text-[18px] font-medium outline-none transition-colors resize-none ${
            props.feedback
              ? props.feedback.correct
                ? 'border-[#58CC02] bg-[#E8F9CC] dark:bg-[#1A3300] text-[#58CC02]'
                : 'border-[#FF4B4B] bg-[#FFE0E0] dark:bg-[#331414] text-[#FF4B4B]'
              : 'border-[#E5E7EB] dark:border-[#202F36] bg-[#F3F4F6] dark:bg-[#131F24] text-[#202124] dark:text-white focus:bg-white focus:border-[#1CB0F6]'
          }`}
          style={{
            fontFamily: 'Nunito, sans-serif',
            boxSizing: 'border-box',
            minHeight: '120px'
          }}
          autoFocus
        />
      </div>
    )
  }

  return null
}
