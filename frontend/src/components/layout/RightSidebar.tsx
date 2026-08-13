import React, { useEffect, useState } from 'react';
import { GameState } from '../../types';

interface RightSidebarProps {
  gameState: GameState;
  onNavigate?: (page: string) => void;
}

export default function RightSidebar({ gameState, onNavigate }: RightSidebarProps) {
  const [quests, setQuests] = useState({ timeSpent: 0, fiveInARow: 0 });

  useEffect(() => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const storageKey = gameState?.username ? `dailyQuests_${gameState.username}` : 'dailyQuests';
      const savedQuestsStr = localStorage.getItem(storageKey);
      if (savedQuestsStr) {
        const parsed = JSON.parse(savedQuestsStr);
        if (parsed.date === today) {
          setQuests({ timeSpent: parsed.timeSpent, fiveInARow: parsed.fiveInARow });
        }
      }
    } catch (e) {
      console.warn("Failed to read daily quests from local storage", e);
    }
  }, [gameState?.username]);

  // Compute League Box text dynamically
  const rank = gameState.rank ?? 50;
  let leagueStatusText = '';
  if (rank <= 10) {
    leagueStatusText = 'In the promotion zone!';
  } else if (rank >= 25) {
    leagueStatusText = 'In the demotion zone!';
  } else {
    const ranksAway = 25 - rank;
    leagueStatusText = `${ranksAway} ranks away from the demotion zone!`;
  }

  return (
    <div className="hidden lg:flex w-[320px] shrink-0 flex-col gap-6 sticky top-6 self-start">
      {/* Dynamic League Box */}
      <div className="border-2 border-[#E5E7EB] dark:border-[#202F36] rounded-2xl p-5 bg-white dark:bg-transparent">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-extrabold text-[18px] text-[#202124] dark:text-white">{gameState.league || 'Bronze League'}</h2>
          <button 
            className="font-extrabold text-[14px] text-[#1CB0F6] uppercase tracking-wide cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => onNavigate && onNavigate('leaderboard')}
          >
            VIEW LEAGUE
          </button>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-[60px] h-[60px] rounded-xl flex items-center justify-center border-2 border-transparent" style={{ backgroundColor: '#58CC02' }}>
            <div className="text-[32px]">🛡️</div>
          </div>
          <div>
            <div className="font-bold text-[16px] text-[#202124] dark:text-white mb-1">
              You're ranked <span className="text-[#58CC02]">#{rank}</span>
            </div>
            <div className="font-semibold text-[14px] text-[#777] dark:text-[#AFAFAF] leading-tight">
              {leagueStatusText}
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Daily Quests Box */}
      <div className="border-2 border-[#E5E7EB] dark:border-[#202F36] rounded-2xl p-5 bg-white dark:bg-transparent">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-extrabold text-[18px] text-[#202124] dark:text-white">Daily Quests</h2>
          <button 
            className="font-extrabold text-[14px] text-[#1CB0F6] uppercase tracking-wide cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => onNavigate && onNavigate('quests')}
          >
            VIEW ALL
          </button>
        </div>
        <div className="flex flex-col gap-5">
          {/* Quest 1: Spend 10 minutes learning */}
          <div className="flex items-center gap-4">
            <div className="text-[32px] shrink-0">⏱️</div>
            <div className="flex-1">
              <div className="font-bold text-[15px] text-[#202124] dark:text-white mb-2">Spend 10 minutes learning</div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-4 bg-[#E5E7EB] dark:bg-[#202F36] rounded-full overflow-hidden relative">
                  <div 
                    className="absolute top-0 left-0 h-full bg-[#FFC800] rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, (quests.timeSpent / 10) * 100)}%` }}
                  />
                </div>
                <div className="font-bold text-[14px] text-[#777] dark:text-[#AFAFAF] whitespace-nowrap">
                  {Math.min(10, quests.timeSpent)} / 10
                </div>
              </div>
            </div>
          </div>

          {/* Quest 2: 5 in a row correct in 3 lessons */}
          <div className="flex items-center gap-4">
            <div className="text-[32px] shrink-0">🦉</div>
            <div className="flex-1">
              <div className="font-bold text-[15px] text-[#202124] dark:text-white mb-2">Get 5 in a row correct in 3 lessons</div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-4 bg-[#E5E7EB] dark:bg-[#202F36] rounded-full overflow-hidden relative">
                  <div 
                    className="absolute top-0 left-0 h-full bg-[#CE82FF] rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, (quests.fiveInARow / 3) * 100)}%` }}
                  />
                </div>
                <div className="font-bold text-[14px] text-[#777] dark:text-[#AFAFAF] whitespace-nowrap">
                  {Math.min(3, quests.fiveInARow)} / 3
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
