export type Page = 'learn' | 'practice' | 'leaderboard' | 'quests' | 'shop' | 'profile' | 'more' | 'achievements' | 'settings'

export type SkillState = 'completed' | 'current' | 'available' | 'locked'
export type ExerciseType = 'multiple-choice' | 'word-bank' | 'match-pairs' | 'fill-blank' | 'type-answer'

export interface MultipleChoiceExercise {
  type: 'multiple-choice'
  question: string
  options: string[]
  answer: string
}

export interface WordBankExercise {
  type: 'word-bank'
  question: string
  correctOrder: string[]
  wordBank: string[]
}

export interface MatchPairsExercise {
  type: 'match-pairs'
  question: string
  pairs: { left: string; right: string }[]
}

export interface FillBlankExercise {
  type: 'fill-blank'
  question: string
  sentence: string
  options: string[]
  answer: string
}

export interface TypeAnswerExercise {
  type: 'type-answer'
  question: string
  prompt: string
  answer: string
  acceptableAnswers?: string[]
}

export type Exercise =
  | MultipleChoiceExercise
  | WordBankExercise
  | MatchPairsExercise
  | FillBlankExercise
  | TypeAnswerExercise

export interface Lesson {
  id: string
  title: string
  exercises: Exercise[]
}

export interface Skill {
  id: string
  name: string
  emoji: string
  state: SkillState
  progress: number
  level: number
  xpEarned: number
  lessons: Lesson[]
}

export interface Unit {
  id: string
  number: number
  title: string
  description: string
  color: string
  bgColor: string
  borderColor: string
  emoji: string
  skills: Skill[]
  totalXP: number
}

export interface ToastData {
  id: string
  message: string
  icon: string
}

export interface GameState {
  username: string
  xp: number
  streak: number
  hearts: number
  maxHearts: number
  gems: number
  dailyXP: number
  dailyGoal: number
  joinedDate: string
  league: string
  top3Finishes: number
  unlockedAchievements: string[]
  followersCount: number
  followingCount: number
  lastHeartRefill?: string
  rank?: number
}

export interface LessonResult {
  xpEarned: number
  correctCount: number
  totalCount: number
  heartsRemaining: number
  skillId: string
}
