import React, { useState, useEffect } from 'react';

import { GameState } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface LeaderboardUser {
  id: number;
  rank: number;
  username: string;
  xp: number;
  avatar: string;
  friend_status: 'none' | 'self' | 'pending_sent' | 'pending_received' | 'friends';
  isInitial: boolean;
}

interface LeaderboardPageProps {
  gameState: GameState;
  onFriendAction?: () => void;
}

export default function LeaderboardPage({ gameState, onFriendAction }: LeaderboardPageProps) {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusIcon, setStatusIcon] = useState<string | null>('🦉');

  const fetchLeaderboard = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/leaderboard/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setLeaderboardData(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const sendFriendRequest = async (userId: number) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/friends/request/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ receiver_id: userId })
      });
      if (res.ok) {
        fetchLeaderboard();
        if (onFriendAction) onFriendAction();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const acceptFriendRequest = async (userId: number) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/friends/accept/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ sender_id: userId })
      });
      if (res.ok) {
        fetchLeaderboard();
        if (onFriendAction) onFriendAction();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const statusIcons = ['😎', '🎉', '💪', '👀', '🍿', '🇪🇸', '🦉', '💯', '💩', '🏆', '🍿', '🐱']

  return (
    <div className="flex flex-col xl:flex-row gap-8 max-w-[950px] mx-auto pb-[100px] px-4 pt-6 text-[#202124] dark:text-white">
      {/* Main Leaderboard Area */}
      <div className="flex-1 min-w-0">
        
        {/* Shields Header */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-4 h-[100px]">
          {renderShields(gameState.league || 'Bronze League')}
        </div>

        <div className="text-center mb-8">
          <h2 className="font-extrabold text-[24px] mb-2 text-[#202124] dark:text-white">{gameState.league || 'Bronze League'}</h2>
          <div className="font-semibold text-[15px] text-[#777] dark:text-[#AFAFAF] mb-1">
            Top 11 advance to the next league
          </div>
          <div className="font-bold text-[15px] text-[#FFC800]">
            3 days
          </div>
        </div>

        <div className="h-[2px] w-full bg-[#E5E7EB] dark:bg-[#202F36] mb-4"></div>

        {/* Leaderboard List */}
        <div className="flex flex-col">
          {loading ? (
            <div className="text-center text-[#AFAFAF] py-8 font-bold">Loading...</div>
          ) : leaderboardData.length === 0 ? (
            <div className="text-center text-[#AFAFAF] py-8 font-bold">No players found</div>
          ) : (
            leaderboardData.map((user, index) => (
              <React.Fragment key={user.id}>
                <div 
                  className={`flex items-center justify-between px-4 py-3 rounded-2xl ${
                    user.friend_status === 'self' ? 'bg-[#E8F9CC] dark:bg-[#1A3300] border border-[#58CC02]' : 'hover:bg-[#F7F9FA] dark:hover:bg-[#202F36] transition-colors cursor-pointer border border-transparent'
                  }`}
                >
                <div className="flex items-center gap-4">
                  {/* Rank Medal/Number */}
                  <div className="w-8 flex justify-center">
                    {user.rank === 1 ? (
                      <div className="text-[24px]">🥇</div>
                    ) : user.rank === 2 ? (
                      <div className="text-[24px]">🥈</div>
                    ) : user.rank === 3 ? (
                      <div className="text-[24px]">🥉</div>
                    ) : (
                      <div className={`font-bold text-[15px] text-[#58CC02]`}>
                        {user.rank}
                      </div>
                    )}
                  </div>

                  {/* Avatar with Status */}
                  <div className="relative">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-[16px] ${user.isInitial ? 'bg-[#CE82FF] text-white' : 'bg-gray-200 dark:bg-gray-300'}`}>
                      {user.avatar}
                    </div>
                  </div>

                  {/* Name */}
                  <div className="font-bold text-[15px] text-[#202124] dark:text-[#E5E7EB]">
                    {user.username}
                  </div>
                </div>

                {/* Right Side Info */}
                <div className="flex items-center gap-4">
                  <div className="font-semibold text-[14px] text-[#777] dark:text-[#AFAFAF]">
                    {user.xp} XP
                  </div>

                  {/* Friend Actions */}
                  {user.friend_status === 'none' && (
                    <button 
                      onClick={() => sendFriendRequest(user.id)}
                      className="px-3 py-1.5 rounded-lg border-2 border-[#E5E7EB] dark:border-[#202F36] bg-transparent text-[#1CB0F6] font-extrabold text-[12px] uppercase tracking-wide hover:bg-[#F3F4F6] dark:hover:bg-[#202F36] transition-colors"
                    >
                      Add
                    </button>
                  )}
                  {user.friend_status === 'pending_sent' && (
                    <div className="px-3 py-1.5 font-bold text-[12px] text-[#AFAFAF] uppercase tracking-wide">
                      Pending
                    </div>
                  )}
                  {user.friend_status === 'pending_received' && (
                    <button 
                      onClick={() => acceptFriendRequest(user.id)}
                      className="px-3 py-1.5 rounded-lg border-2 border-transparent bg-[#1CB0F6] text-white font-extrabold text-[12px] uppercase tracking-wide hover:bg-[#1899D6] transition-colors"
                    >
                      Accept
                    </button>
                  )}
                  {user.friend_status === 'friends' && (
                    <div className="px-3 py-1.5 font-bold text-[12px] text-[#58CC02] uppercase tracking-wide">
                      Friend
                    </div>
                  )}
                </div>
                </div>
                
                {/* Promotion Zone */}
                {index === 10 && (
                  <div className="flex items-center justify-center gap-3 my-6">
                    <div className="text-[#58CC02] text-[20px] font-black">↑</div>
                    <div className="font-extrabold text-[13px] text-[#58CC02] tracking-wider uppercase">Promotion Zone</div>
                    <div className="text-[#58CC02] text-[20px] font-black">↑</div>
                  </div>
                )}

                {/* Demotion Zone */}
                {index === Math.max(11, leaderboardData.length - 6) && leaderboardData.length > 15 && (
                  <div className="flex items-center justify-center gap-3 my-6 opacity-60">
                    <div className="text-[#FF4B4B] text-[20px] font-black">↓</div>
                    <div className="font-extrabold text-[13px] text-[#FF4B4B] tracking-wider uppercase">Demotion Zone</div>
                    <div className="text-[#FF4B4B] text-[20px] font-black">↓</div>
                  </div>
                )}
              </React.Fragment>
            ))
          )}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-full xl:w-[320px] shrink-0 flex flex-col gap-6">
        
        {/* Set your status */}
        <div className="border-2 border-[#E5E7EB] dark:border-[#202F36] rounded-2xl p-5 bg-white dark:bg-transparent relative overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <div className="font-extrabold text-[16px] text-[#202124] dark:text-white">Set your status</div>
            <button 
              className="font-extrabold text-[13px] text-[#1CB0F6] uppercase bg-transparent border-none cursor-pointer tracking-wide hover:opacity-80 transition-opacity"
              onClick={() => setStatusIcon(null)}
            >
              Clear
            </button>
          </div>

          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-[72px] h-[72px] rounded-full bg-gray-200 dark:bg-gray-300 flex items-center justify-center text-[40px] border-2 border-transparent">
                👩🏻‍🎤
              </div>
              {statusIcon && (
                <div className="absolute -top-1 -right-3 text-[32px] drop-shadow-md">
                  {statusIcon}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3 bg-[#F3F4F6] dark:bg-[#131F24] p-2 rounded-xl">
            {statusIcons.map((icon, i) => (
              <button 
                key={i} 
                onClick={() => setStatusIcon(icon)}
                className={`flex items-center justify-center h-12 rounded-xl border-2 text-[24px] cursor-pointer transition-colors ${statusIcon === icon ? 'border-[#58CC02] bg-[#E8F9CC] dark:bg-[#1A3300]' : 'border-[#E5E7EB] dark:border-transparent bg-white dark:bg-[#202F36] hover:bg-[#F3F4F6] dark:hover:bg-[#2A3F49]'}`}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* Footer Links */}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 px-4 mt-2">
          {['ABOUT', 'BLOG', 'STORE', 'EFFICACY', 'CAREERS', 'INVESTORS', 'TERMS', 'PRIVACY'].map(link => (
            <a key={link} href="#" className="font-bold text-[11px] text-[#AFAFAF] hover:text-[#E5E7EB] transition-colors">
              {link}
            </a>
          ))}
        </div>

      </div>
    </div>
  )
}

const LEAGUES = [
  { name: 'Bronze League', color: '#B87A45', shape: 'shield' },
  { name: 'Silver League', color: '#AFAFAF', shape: 'shield' },
  { name: 'Gold League', color: '#FFC800', shape: 'shield' },
  { name: 'Sapphire League', color: '#1CB0F6', shape: 'shield' },
  { name: 'Ruby League', color: '#FF4B4B', shape: 'hexagon' },
  { name: 'Emerald League', color: '#58CC02', shape: 'hexagon' },
  { name: 'Amethyst League', color: '#CE82FF', shape: 'hexagon' },
  { name: 'Pearl League', color: '#FF96CB', shape: 'hexagon' },
  { name: 'Obsidian League', color: '#4B4B4B', shape: 'diamond' },
  { name: 'Diamond League', color: '#00FFFF', shape: 'diamond' },
];

function renderShields(currentLeagueName: string) {
  let currentIndex = LEAGUES.findIndex(l => l.name === currentLeagueName);
  if (currentIndex === -1) currentIndex = 0;

  let start = Math.max(0, currentIndex - 3);
  let end = start + 7;
  
  if (end > LEAGUES.length) {
    end = LEAGUES.length;
    start = Math.max(0, end - 7);
  }

  const visibleLeagues = LEAGUES.slice(start, end);

  return visibleLeagues.map((league, index) => {
    const actualIndex = start + index;
    const isActive = actualIndex === currentIndex;
    const isLocked = actualIndex > currentIndex;
    
    // Scale size based on distance from active
    let size = 50;
    if (isActive) size = 80;
    else if (Math.abs(actualIndex - currentIndex) === 1) size = 60;
    else if (Math.abs(actualIndex - currentIndex) === 2) size = 50;
    else size = 45;

    return (
      <Shield 
        key={league.name}
        color={league.color}
        shape={league.shape}
        size={size}
        active={isActive}
        locked={isLocked}
      />
    );
  });
}

function Shield({ color, shape, size, active, locked }: { color: string, shape: string, size: number, active?: boolean, locked?: boolean }) {
  // Base SVG shapes with 3D layers
  const paths = {
    shield: (
      <>
        <path d="M 15 10 L 85 10 L 85 55 C 85 85 50 100 50 100 C 50 100 15 85 15 55 Z" fill="currentColor" />
        <path d="M 25 20 L 75 20 L 75 55 C 75 75 50 85 50 85 C 50 85 25 75 25 55 Z" fill="rgba(255,255,255,0.2)" />
        <path d="M 15 55 C 15 85 50 100 50 100 L 50 85 C 50 85 25 75 25 55 L 25 20 L 15 10 Z" fill="rgba(0,0,0,0.15)" />
      </>
    ),
    hexagon: (
      <>
        <path d="M 30 5 L 70 5 L 95 50 L 70 95 L 30 95 L 5 50 Z" fill="currentColor" />
        <path d="M 35 15 L 65 15 L 83 50 L 65 85 L 35 85 L 17 50 Z" fill="rgba(255,255,255,0.2)" />
        <path d="M 5 50 L 30 95 L 70 95 L 65 85 L 35 85 L 17 50 Z" fill="rgba(0,0,0,0.15)" />
      </>
    ),
    diamond: (
      <>
        <path d="M 50 5 L 95 50 L 50 95 L 5 50 Z" fill="currentColor" />
        <path d="M 50 18 L 82 50 L 50 82 L 18 50 Z" fill="rgba(255,255,255,0.2)" />
        <path d="M 5 50 L 50 95 L 50 82 L 18 50 Z" fill="rgba(0,0,0,0.15)" />
      </>
    )
  };

  const renderShape = () => {
    if (shape === 'shield') return paths.shield;
    if (shape === 'hexagon') return paths.hexagon;
    return paths.diamond;
  };

  const actualColor = locked ? '#37464F' : color;

  return (
    <div 
      className="relative flex items-center justify-center shrink-0 transition-all duration-300"
      style={{
        width: size,
        height: size,
        marginTop: active ? -15 : 0,
        color: actualColor
      }}
    >
      <svg viewBox="0 0 100 100" fill="none" className={`w-full h-full ${active ? 'drop-shadow-xl' : 'drop-shadow-sm'}`}>
        {renderShape()}
      </svg>
      {locked && (
        <div className="absolute inset-0 flex items-center justify-center text-[#131F24] text-[18px] font-black opacity-30">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-1/2 h-1/2">
            <path d="M12 2C9.243 2 7 4.243 7 7V10H6C4.897 10 4 10.897 4 12V20C4 21.103 4.897 22 6 22H18C19.103 22 20 21.103 20 20V12C20 10.897 19.103 10 18 10H17V7C17 4.243 14.757 2 12 2ZM9 7C9 5.346 10.346 4 12 4C13.654 4 15 5.346 15 7V10H9V7ZM12 18C10.895 18 10 17.105 10 16C10 14.895 10.895 14 12 14C13.105 14 14 14.895 14 16C14 17.105 13.105 18 12 18Z" />
          </svg>
        </div>
      )}
      {active && (
        <div className="absolute inset-0 flex items-center justify-center text-white text-[32px] opacity-90 drop-shadow-md">
          {shape === 'hexagon' ? '🪶' : '🛡️'}
        </div>
      )}
    </div>
  )
}
