import { useState, useEffect } from 'react'
import { GameState } from '../types'

export default function AchievementsPage({ gameState }: { gameState?: GameState }) {
  const dailyXP = gameState?.dailyXP || 0;
  const [questsStore, setQuestsStore] = useState({ timeSpent: 0, fiveInARow: 0 });

  useEffect(() => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const storageKey = gameState?.username ? `dailyQuests_${gameState.username}` : 'dailyQuests';
      const savedQuestsStr = localStorage.getItem(storageKey);
      if (savedQuestsStr) {
        const parsed = JSON.parse(savedQuestsStr);
        if (parsed.date === today) {
          setQuestsStore({ timeSpent: parsed.timeSpent, fiveInARow: parsed.fiveInARow });
        }
      }
    } catch (e) {
      console.warn("Failed to read daily quests from local storage", e);
    }
  }, []);

  const dailyQuests = [
    { title: 'Earn 20 XP', icon: '⚡', progress: Math.min(20, dailyXP), total: 20 },
    { title: 'Spend 10 minutes learning', icon: '⏱️', progress: Math.min(10, questsStore.timeSpent), total: 10 },
    { title: 'Get 5 in a row correct in 3 lessons', icon: '🦉', progress: Math.min(3, questsStore.fiveInARow), total: 3 },
  ]

  const monthlyBadges = [
    { title: "Complete 30 quests to earn this month's badge", subtitle: "", icon: '🐻', bg: '#58CC02' },
    { title: "July Quest", subtitle: "July 2026", icon: '👨🏻', bg: '#FF9600' },
    { title: "2024 Summer Owlympics", subtitle: "August 2024", icon: '🏅', bg: '#1CB0F6' },
  ]

  return (
    <div className="flex flex-col xl:flex-row gap-8 max-w-[950px] mx-auto pb-[100px] px-4 pt-6 text-[#202124] dark:text-white">
      {/* Main Quests Area */}
      <div className="flex-1 min-w-0">
        
        {/* August Quest Banner */}
        <div className="bg-[#58CC02] rounded-3xl p-6 mb-10 relative overflow-hidden shadow-sm">
          <div className="bg-white text-[#58CC02] font-extrabold text-[12px] uppercase tracking-wider px-3 py-1.5 rounded-xl inline-block mb-4 shadow-sm">
            August
          </div>
          <h2 className="font-extrabold text-[24px] text-white mb-2 tracking-wide">August Quest</h2>
          <div className="flex items-center gap-1.5 text-white/90 font-bold text-[14px] mb-8">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            18 DAYS
          </div>
          
          {/* Inner Progress Box */}
          <div className="bg-[#F3F4F6] dark:bg-[#202F36] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 relative overflow-hidden">
            <div className="flex-1">
              <div className="font-extrabold text-[15px] text-[#202124] dark:text-white mb-4">Complete 30 quests</div>
              <div className="h-4 bg-[#E5E7EB] dark:bg-[#131F24] rounded-full overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center font-extrabold text-[11px] text-[#777] dark:text-[#AFAFAF] z-10 tracking-wider">
                  0 / 30
                </div>
                <div className="h-full bg-[#58CC02] w-[0%] rounded-full" />
              </div>
            </div>
            
            {/* Bear avatar positioned inside the box */}
            <div className="w-12 h-12 rounded-full bg-[#FF9600] flex items-center justify-center text-[24px] shrink-0 border-2 border-white dark:border-[#202F36] z-10 self-end sm:self-auto relative sm:right-[-10px]">
              🐻
            </div>
          </div>
        </div>

        {/* Daily Quests */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-extrabold text-[20px] text-[#202124] dark:text-white tracking-wide">Daily Quests</h2>
          <div className="flex items-center gap-1.5 font-bold text-[14px] text-[#FF9600]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            22 HOURS
          </div>
        </div>

        <div className="bg-white dark:bg-[#131F24] border-2 border-[#E5E7EB] dark:border-[#202F36] rounded-2xl flex flex-col">
          {dailyQuests.map((q, i) => {
            const percent = Math.min(100, Math.round((q.progress / q.total) * 100));
            return (
              <div key={i} className={`flex items-center gap-4 p-5 ${i !== dailyQuests.length - 1 ? 'border-b-2 border-[#E5E7EB] dark:border-[#202F36]' : ''}`}>
                <div className="text-3xl shrink-0 w-8 text-center">{q.icon}</div>
                <div className="flex-1">
                  <div className="font-bold text-[15px] text-[#202124] dark:text-white mb-3">{q.title}</div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-4 bg-[#E5E7EB] dark:bg-[#202F36] rounded-full overflow-hidden relative border-2 border-transparent">
                      <div className="absolute inset-0 flex items-center justify-center font-extrabold text-[11px] text-[#777] dark:text-[#AFAFAF] z-10 tracking-wider">
                        {q.progress} / {q.total}
                      </div>
                      <div className="h-full bg-[#FFC800]" style={{ width: `${percent}%` }} />
                    </div>
                    <div className="text-2xl opacity-90 drop-shadow-sm">🧰</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

      </div>

      {/* Right Sidebar */}
      <div className="w-full xl:w-[320px] shrink-0 flex flex-col gap-6">
        
        {/* Monthly Badges */}
        <div className="border-2 border-[#E5E7EB] dark:border-[#202F36] rounded-2xl p-5 bg-white dark:bg-transparent overflow-hidden">
          <div className="font-extrabold text-[16px] text-[#202124] dark:text-white mb-6">Monthly Badges</div>

          <div className="flex flex-col gap-6">
            {monthlyBadges.map((badge, i) => (
              <div key={i} className="flex items-center gap-4">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-[24px] shrink-0 text-white shadow-sm"
                  style={{ background: badge.bg }}
                >
                  {badge.icon}
                </div>
                <div>
                  <div className={`font-bold text-[13px] ${badge.subtitle ? 'text-[#202124] dark:text-white' : 'text-[#777] dark:text-[#E5E7EB] leading-snug'}`}>
                    {badge.title}
                  </div>
                  {badge.subtitle && (
                    <div className="font-semibold text-[13px] text-[#777] dark:text-[#AFAFAF] mt-1">
                      {badge.subtitle}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
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
