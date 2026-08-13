import { useState, useEffect } from 'react'
import type { GameState } from '../types'
import { ACHIEVEMENTS } from '../data/seed'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

interface ProfilePageProps {
  gameState: GameState
  onNavigate?: (page: string) => void
  onLogout?: () => void
}

export default function ProfilePage({ gameState, onNavigate, onLogout }: ProfilePageProps) {
  const [feedEvents, setFeedEvents] = useState<any[]>([])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      fetch(`${API_URL}/api/user/feed/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setFeedEvents(data)
          } else {
            setFeedEvents([])
          }
        })
        .catch(console.error)
    }
  }, [])

  return (
    <div className="flex flex-col xl:flex-row gap-8 max-w-[950px] mx-auto pb-[100px] px-4 pt-6 text-[#202124] dark:text-white">
      {/* Main Profile Area */}
      <div className="flex-1 min-w-0">
        
        {/* Profile Header section */}
        <div className="mb-8">
          <div className="h-[200px] sm:h-[250px] bg-[#FCEBE7] rounded-3xl mb-5 relative flex items-end justify-center overflow-hidden border-2 border-[#E5E7EB] dark:border-[#202F36]">
            {/* Avatar placeholder */}
            <div className="relative w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] translate-y-4">
              {/* Very rough shapes just to convey the avatar in the screenshot */}
              <div className="absolute inset-0 flex flex-col items-center">
                <div className="w-[100px] sm:w-[120px] h-[50px] sm:h-[60px] bg-[#9B59B6] rounded-t-[50px] z-20"></div>
                <div className="w-[110px] sm:w-[130px] h-[20px] bg-[#8E44AD] rounded-full -mt-2 z-30"></div>
                <div className="w-[90px] sm:w-[110px] h-[70px] sm:h-[80px] bg-[#E59866] rounded-b-[40px] -mt-2 z-10 relative flex justify-center pt-2">
                  <div className="w-[60px] sm:w-[70px] h-[25px] sm:h-[30px] bg-[#2C3E50] rounded-xl flex items-center justify-between px-2">
                    <div className="w-[20px] h-[15px] bg-[#85C1E9] rounded-md"></div>
                    <div className="w-[20px] h-[15px] bg-[#85C1E9] rounded-md"></div>
                  </div>
                </div>
                <div className="w-[30px] h-[40px] bg-[#D35400] -mt-4 z-0"></div>
                <div className="w-[120px] sm:w-[140px] h-[60px] sm:h-[80px] bg-[#A569BD] rounded-t-[40px] -mt-2 z-20 flex justify-center pt-2">
                  <div className="w-[40px] h-full bg-[#8E44AD] opacity-50"></div>
                </div>
              </div>
            </div>
            
            {/* Top Right Action Buttons */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button 
                className="w-10 h-10 bg-white dark:bg-[#202F36] rounded-full flex items-center justify-center border-2 border-[#E5E7EB] dark:border-[#131F24] hover:bg-gray-50 dark:hover:bg-[#2A3F49] cursor-pointer transition-colors shadow-sm"
                onClick={() => onNavigate && onNavigate('settings')}
                title="Settings"
              >
                <span className="text-[20px]">⚙️</span>
              </button>
              <button 
                className="h-10 px-4 bg-white dark:bg-[#202F36] rounded-full flex items-center justify-center border-2 border-[#E5E7EB] dark:border-[#131F24] hover:bg-[#FF4B4B]/10 hover:text-[#FF4B4B] hover:border-[#FF4B4B] cursor-pointer transition-colors shadow-sm font-extrabold text-[13px] text-[#777] dark:text-[#AFAFAF] uppercase tracking-wide"
                onClick={() => onLogout && onLogout()}
                title="Log out"
              >
                Log Out
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <h1 className="font-extrabold text-[24px] text-[#202124] dark:text-white mb-1">{gameState.username || 'Guest User'}</h1>
              <div className="font-semibold text-[15px] text-[#777] dark:text-[#AFAFAF] mb-1">@{gameState.username || 'guest'}</div>
              <div className="font-semibold text-[15px] text-[#777] dark:text-[#AFAFAF] mb-4">Joined {gameState.joinedDate}</div>
              
              <div className="flex items-center gap-4 font-bold text-[15px]">
                <button className="text-[#1CB0F6] hover:opacity-80 transition-opacity bg-transparent border-none cursor-pointer p-0">{gameState.followingCount} Following</button>
                <button className="text-[#1CB0F6] hover:opacity-80 transition-opacity bg-transparent border-none cursor-pointer p-0">{gameState.followersCount} Followers</button>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-6 rounded-md overflow-hidden bg-white shadow-sm flex items-center justify-center text-xl">🇪🇸</div>
              <div className="w-8 h-6 rounded-md overflow-hidden bg-white shadow-sm flex items-center justify-center text-xl">🇫🇷</div>
              <div className="w-8 h-6 rounded-md overflow-hidden bg-white shadow-sm flex items-center justify-center text-xl">🦉</div>
              <div className="w-8 h-6 rounded-md overflow-hidden bg-white shadow-sm flex items-center justify-center text-xl">🇰🇷</div>
            </div>
          </div>
        </div>

        <div className="h-[2px] w-full bg-[#E5E7EB] dark:bg-[#202F36] mb-8"></div>

        {/* Statistics */}
        <div className="mb-10">
          <h2 className="font-extrabold text-[22px] text-[#202124] dark:text-white mb-5">Statistics</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="border-2 border-[#E5E7EB] dark:border-[#202F36] rounded-2xl p-4 flex items-start gap-3">
              <div className="text-[28px] leading-none shrink-0">🔥</div>
              <div>
                <div className="font-extrabold text-[18px] text-[#202124] dark:text-white mb-0.5">{gameState.streak}</div>
                <div className="font-bold text-[14px] text-[#777] dark:text-[#AFAFAF]">Day streak</div>
              </div>
            </div>
            <div className="border-2 border-[#E5E7EB] dark:border-[#202F36] rounded-2xl p-4 flex items-start gap-3">
              <div className="text-[28px] leading-none shrink-0">⚡</div>
              <div>
                <div className="font-extrabold text-[18px] text-[#202124] dark:text-white mb-0.5">{gameState.xp}</div>
                <div className="font-bold text-[14px] text-[#777] dark:text-[#AFAFAF]">Total XP</div>
              </div>
            </div>
            <div className="border-2 border-[#E5E7EB] dark:border-[#202F36] rounded-2xl p-4 flex items-start gap-3 relative">
              <div className="absolute -top-3 right-4 bg-[#58CC02] text-white font-extrabold text-[11px] px-2 py-0.5 rounded-md tracking-wider">WEEK 1</div>
              <div className="text-[28px] leading-none shrink-0">🛡️</div>
              <div>
                <div className="font-extrabold text-[18px] text-[#202124] dark:text-white mb-0.5">{gameState.league}</div>
                <div className="font-bold text-[14px] text-[#777] dark:text-[#AFAFAF]">Current league</div>
              </div>
            </div>
            <div className="border-2 border-[#E5E7EB] dark:border-[#202F36] rounded-2xl p-4 flex items-start gap-3">
              <div className="text-[28px] leading-none shrink-0">🏅</div>
              <div>
                <div className="font-extrabold text-[18px] text-[#202124] dark:text-white mb-0.5">{gameState.top3Finishes}</div>
                <div className="font-bold text-[14px] text-[#777] dark:text-[#AFAFAF]">Top 3 finishes</div>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-extrabold text-[22px] text-[#202124] dark:text-white">Achievements</h2>
            <button className="font-extrabold text-[14px] text-[#1CB0F6] uppercase bg-transparent border-none cursor-pointer tracking-wide">
              View All
            </button>
          </div>
          
          <div className="flex flex-col">
            {ACHIEVEMENTS.map((ach) => {
              const isUnlocked = gameState.unlockedAchievements?.includes(ach.id)
              const color = isUnlocked ? ach.color : '#777777'
              const bg = isUnlocked ? ach.bg : '#F3F4F6'
              
              return (
                <div key={ach.id} className="flex items-start gap-5 py-6 border-t-2 border-[#E5E7EB] dark:border-[#202F36]">
                  <div className="relative shrink-0">
                    <div className="w-[72px] h-[72px] rounded-2xl flex items-center justify-center text-[40px] shadow-sm" style={{ backgroundColor: color }}>
                      {ach.emoji}
                    </div>
                  </div>
                  <div className="flex-1 mt-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-extrabold text-[18px] text-[#202124] dark:text-white">{ach.title}</div>
                      <div className="font-bold text-[14px] text-[#777] dark:text-[#AFAFAF]">
                        {isUnlocked ? 'Unlocked' : 'Locked'}
                      </div>
                    </div>
                    <div className="font-semibold text-[15px] text-[#777] dark:text-[#AFAFAF]">
                      {ach.description}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

      </div>

      {/* Right Sidebar */}
      <div className="w-full xl:w-[320px] shrink-0 flex flex-col gap-6">
        
        {/* Feed Card */}
        <div className="bg-white dark:bg-transparent rounded-2xl border-2 border-[#E5E7EB] dark:border-[#202F36] flex flex-col">
          {(!feedEvents || feedEvents.length === 0) ? (
            <div className="p-5 text-center font-bold text-[15px] text-[#777] dark:text-[#AFAFAF]">
              No recent activity
            </div>
          ) : (
            feedEvents.map((event: any, i: number) => (
              <div key={event.id} className={`p-5 ${i < feedEvents.length - 1 ? 'border-b-2 border-[#E5E7EB] dark:border-[#202F36]' : ''}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-[#E5E7EB] dark:bg-[#202F36] flex items-center justify-center text-xl shrink-0">
                    {event.type === 'achievement' ? '🏆' : '🦉'}
                  </div>
                  <div>
                    <div className="font-bold text-[15px] text-[#202124] dark:text-white">{event.username}</div>
                    <div className="font-semibold text-[13px] text-[#777] dark:text-[#AFAFAF]">Recent</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 mb-4">
                  <div className="font-semibold text-[15px] text-[#202124] dark:text-white leading-snug flex-1 mt-1">
                    {event.message}
                  </div>
                </div>
              </div>
            ))
          )}
          
          <div className="p-4 border-t-2 border-[#E5E7EB] dark:border-[#202F36]">
            <button 
              className="w-full flex items-center justify-between font-extrabold text-[14px] text-[#202124] dark:text-white uppercase tracking-wide bg-transparent border-none cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => alert('No more recent activity to show.')}
            >
              View all
              <span className="text-[#AFAFAF]">&gt;</span>
            </button>
          </div>
        </div>

        {/* Following/Followers Card */}
        <div className="bg-white dark:bg-transparent rounded-2xl border-2 border-[#E5E7EB] dark:border-[#202F36] flex flex-col overflow-hidden">
          <div className="flex font-extrabold text-[13px] text-[#777] dark:text-[#AFAFAF] uppercase tracking-wide border-b-2 border-[#E5E7EB] dark:border-[#202F36]">
            <button className="flex-1 py-4 text-center border-b-2 border-[#1CB0F6] text-[#1CB0F6] bg-transparent cursor-pointer">
              Following
            </button>
            <button className="flex-1 py-4 text-center border-b-2 border-transparent hover:bg-gray-50 dark:hover:bg-[#202F36] bg-transparent cursor-pointer transition-colors">
              Followers
            </button>
          </div>
          
          <div className="p-5 flex flex-col gap-5">
            {gameState.followingCount === 0 && gameState.followersCount === 0 ? (
               <div className="text-center font-bold text-[15px] text-[#777] dark:text-[#AFAFAF]">
                 No friends yet
               </div>
            ) : (
               <div className="text-center font-bold text-[15px] text-[#777] dark:text-[#AFAFAF]">
                 Friends feature coming soon...
               </div>
            )}
          </div>
        </div>

        {/* Add friends Card */}
        <div className="bg-white dark:bg-transparent rounded-2xl border-2 border-[#E5E7EB] dark:border-[#202F36] flex flex-col">
          <div className="p-5 pb-3">
            <h3 className="font-extrabold text-[16px] text-[#202124] dark:text-white">Add friends</h3>
          </div>
          
          <button 
            className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 dark:hover:bg-[#202F36] transition-colors bg-transparent border-none cursor-pointer"
            onClick={() => onNavigate && onNavigate('leaderboard')}
          >
            <div className="flex items-center gap-4">
              <div className="text-2xl">🔍</div>
              <div className="font-bold text-[15px] text-[#202124] dark:text-white">Find friends</div>
            </div>
            <div className="text-[#AFAFAF] font-bold">&gt;</div>
          </button>
          
          <button 
            className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 dark:hover:bg-[#202F36] transition-colors bg-transparent border-none cursor-pointer mb-2"
            onClick={() => alert('Invite link copied to clipboard!')}
          >
            <div className="flex items-center gap-4">
              <div className="text-2xl">✉️</div>
              <div className="font-bold text-[15px] text-[#202124] dark:text-white">Invite friends</div>
            </div>
            <div className="text-[#AFAFAF] font-bold">&gt;</div>
          </button>
        </div>

        {/* Footer Links */}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 px-4 mt-2">
          {['ABOUT', 'BLOG', 'STORE', 'EFFICACY', 'CAREERS', 'INVESTORS', 'TERMS', 'PRIVACY'].map(link => (
            <a key={link} href="#" className="font-bold text-[11px] text-[#777] dark:text-[#AFAFAF] hover:text-[#202124] dark:hover:text-[#E5E7EB] transition-colors">
              {link}
            </a>
          ))}
        </div>

      </div>
    </div>
  )
}
