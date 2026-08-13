import { useState } from 'react'
import type { GameState } from '../types'
import RightSidebar from '../components/layout/RightSidebar'

interface PracticePageProps {
  onStartLesson: () => void
  gameState?: GameState
  onNavigate?: (page: string) => void
}

export default function PracticePage({ onStartLesson, gameState, onNavigate }: PracticePageProps) {
  return (
    <div className="flex flex-col xl:flex-row gap-6 max-w-[950px] mx-auto pb-[100px] px-4 pt-6">
      {/* Main Practice Area */}
      <div className="flex-1 min-w-0">
        
        {/* Today's Review Section */}
        <h2 className="font-extrabold text-[20px] text-[#202124] dark:text-white mb-4 tracking-wide">
          Today's Review
        </h2>
        
        <div className="bg-gradient-to-br from-[#1B3F73] to-[#46237A] rounded-[20px] p-6 mb-10 relative overflow-hidden text-white flex justify-between shadow-sm cursor-pointer hover:opacity-95 transition-opacity" onClick={onStartLesson}>
          <div className="z-10 relative flex flex-col items-start">
            <h3 className="font-black text-[22px] mb-2 tracking-wide">Target Practice</h3>
            <p className="font-semibold text-[15px] text-[#DCE6F5] max-w-[200px] sm:max-w-[240px] mb-6 leading-tight">
              Tackle weak areas with this customized session
            </p>
            <button className="bg-white hover:bg-[#F3F4F6] transition-colors text-[#3B2C7A] font-extrabold text-[14px] uppercase tracking-wider px-6 py-2.5 rounded-xl border-none cursor-pointer shadow-[0_2px_0_rgba(0,0,0,0.1)]">
              Practice
            </button>
          </div>
          
          {/* Target illustration placeholder */}
          <div className="absolute right-[-20px] bottom-[-20px] w-[140px] h-[140px] sm:w-[180px] sm:h-[180px] bg-white/10 rounded-full flex items-center justify-center pointer-events-none">
            <div className="w-[100px] h-[100px] sm:w-[130px] sm:h-[130px] bg-white/20 rounded-full flex items-center justify-center">
               <div className="text-[60px] sm:text-[80px]">🎯</div>
            </div>
          </div>
        </div>

        {/* Conversation Section */}
        <h2 className="font-extrabold text-[20px] text-[#202124] dark:text-white mb-4 tracking-wide">
          Conversation
        </h2>
        <div className="flex flex-col gap-4 mb-10">
          
          <button onClick={onStartLesson} className="flex items-center justify-between w-full p-5 bg-white dark:bg-[#131F24] border-2 border-[#E5E7EB] dark:border-[#202F36] hover:bg-[#F7F9FA] dark:hover:bg-[#202F36] rounded-[20px] cursor-pointer transition-colors text-left">
            <div>
               <div className="font-black text-[17px] text-[#202124] dark:text-white mb-1">
                 Speak
               </div>
               <div className="font-semibold text-[14px] text-[#777] dark:text-[#AFAFAF]">
                 Improve your speaking skills with these phrases
               </div>
            </div>
            <div className="w-14 h-14 shrink-0 text-[36px] flex items-center justify-center bg-transparent">
              🎙️
            </div>
          </button>
          
          <button onClick={onStartLesson} className="flex items-center justify-between w-full p-5 bg-white dark:bg-[#131F24] border-2 border-[#E5E7EB] dark:border-[#202F36] hover:bg-[#F7F9FA] dark:hover:bg-[#202F36] rounded-[20px] cursor-pointer transition-colors text-left">
            <div>
               <div className="font-black text-[17px] text-[#202124] dark:text-white mb-1">
                 Listen
               </div>
               <div className="font-semibold text-[14px] text-[#777] dark:text-[#AFAFAF]">
                 Boost your listening skills with an audio-only session
               </div>
            </div>
            <div className="w-14 h-14 shrink-0 text-[36px] flex items-center justify-center bg-transparent">
              🎧
            </div>
          </button>
          
        </div>

        {/* Your Collections Section */}
        <h2 className="font-extrabold text-[20px] text-[#202124] dark:text-white mb-4 tracking-wide">
          Your collections
        </h2>
        <div className="flex flex-col gap-4 mb-4">
          
          <button onClick={onStartLesson} className="relative flex items-center justify-between w-full p-5 bg-white dark:bg-[#131F24] border-2 border-[#E5E7EB] dark:border-[#202F36] hover:bg-[#F7F9FA] dark:hover:bg-[#202F36] rounded-[20px] cursor-pointer transition-colors text-left">
            <div>
               <div className="font-black text-[17px] text-[#202124] dark:text-white mb-1">
                 Mistakes
               </div>
               <div className="font-semibold text-[14px] text-[#777] dark:text-[#AFAFAF]">
                 Start a personalized lesson to practice your mistakes
               </div>
            </div>
            <div className="w-14 h-14 shrink-0 text-[36px] flex items-center justify-center relative">
              <div className="w-full h-full bg-[#FF9600] rounded-full flex items-center justify-center text-white p-2">
                 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
              </div>
              <div className="absolute -top-1 -right-1 bg-[#FF4B4B] text-white font-extrabold text-[12px] px-2 py-0.5 rounded-full border-2 border-white dark:border-[#131F24]">
                16
              </div>
            </div>
          </button>
          
          <button onClick={onStartLesson} className="relative flex items-center justify-between w-full p-5 bg-white dark:bg-[#131F24] border-2 border-[#E5E7EB] dark:border-[#202F36] hover:bg-[#F7F9FA] dark:hover:bg-[#202F36] rounded-[20px] cursor-pointer transition-colors text-left">
            <div>
               <div className="font-black text-[17px] text-[#202124] dark:text-white mb-1">
                 Words
               </div>
               <div className="font-semibold text-[14px] text-[#777] dark:text-[#AFAFAF]">
                 Review your Spanish vocabulary at any time
               </div>
            </div>
            <div className="w-14 h-14 shrink-0 text-[36px] flex items-center justify-center relative">
              <div className="text-[44px]">🗂️</div>
              <div className="absolute -top-1 -right-2 bg-[#FF4B4B] text-white font-extrabold text-[12px] px-1.5 py-0.5 rounded-full border-2 border-white dark:border-[#131F24]">
                30+
              </div>
            </div>
          </button>
          
        </div>
      </div>

      {/* Right Sidebar */}
      {gameState && <RightSidebar gameState={gameState} onNavigate={onNavigate} />}
    </div>
  )
}
