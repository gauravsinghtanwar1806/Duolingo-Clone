import { GameState } from '../types'
import RightSidebar from '../components/layout/RightSidebar'

interface ShopPageProps {
  gameState?: GameState
  onNavigate?: (page: string) => void
}

export default function ShopPage({ gameState, onNavigate }: ShopPageProps) {
  return (
    <div className="flex flex-col xl:flex-row gap-8 max-w-[950px] mx-auto pb-[100px] px-4 pt-6 text-[#202124] dark:text-white">
      {/* Main Shop Area */}
      <div className="flex-1 min-w-0">
        
        {/* Family Plan Banner */}
        <div className="bg-gradient-to-r from-[#1B2956] to-[#45126B] rounded-2xl p-6 mb-10 relative overflow-hidden text-white flex flex-col items-start justify-center min-h-[160px] shadow-sm">
          <div className="z-10 relative max-w-[60%] sm:max-w-[70%]">
            <h2 className="font-extrabold text-[22px] sm:text-[26px] mb-2">Start a family plan!</h2>
            <p className="font-semibold text-[14px] sm:text-[15px] mb-4 leading-tight opacity-90">
              Save on Super Duolingo when you learn with friends
            </p>
            <button 
              className="bg-white text-[#202124] font-extrabold text-[13px] uppercase tracking-wider px-6 py-2.5 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors border-none"
              onClick={() => alert('Super Duolingo Family Plan is not available in this clone.')}
            >
              Learn More
            </button>
          </div>
          
          {/* Decorative characters placeholder */}
          <div className="absolute right-0 top-0 bottom-0 w-[40%] flex items-center justify-end pr-2 pointer-events-none">
            <div className="text-[100px] leading-none drop-shadow-xl translate-x-4">👩‍👩‍👦‍👦</div>
          </div>
        </div>

        {/* Hearts Section */}
        <h3 className="font-extrabold text-[20px] mb-4 text-[#202124] dark:text-white">Hearts</h3>
        <div className="flex flex-col mb-10">
          
          {/* Refill Hearts */}
          <div className="flex items-center justify-between py-6 border-t-2 border-[#E5E7EB] dark:border-[#202F36]">
            <div className="flex items-center gap-6">
              <div className="w-[60px] h-[60px] rounded-full flex items-center justify-center text-[40px] shrink-0">
                ❤️
              </div>
              <div>
                <div className="font-bold text-[17px] text-[#202124] dark:text-white mb-1.5">Refill Hearts</div>
                <div className="font-semibold text-[14px] text-[#777] dark:text-[#AFAFAF] leading-snug max-w-[300px]">
                  Get full hearts so you can worry less about making mistakes in a lesson
                </div>
              </div>
            </div>
            <button 
              className="px-6 py-2.5 rounded-xl font-extrabold text-[14px] uppercase tracking-wide border-2 border-[#E5E7EB] dark:border-[#202F36] text-[#AFAFAF] bg-transparent cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors hidden sm:block shrink-0"
              onClick={() => alert('Hearts are already full!')}
            >
              Full
            </button>
          </div>
          
          {/* Unlimited Hearts */}
          <div className="flex items-center justify-between py-6 border-t-2 border-[#E5E7EB] dark:border-[#202F36]">
            <div className="flex items-center gap-6">
              <div className="w-[60px] h-[60px] rounded-full bg-gradient-to-br from-[#1CB0F6] to-[#CE82FF] flex items-center justify-center text-[36px] text-white shrink-0 shadow-sm border-2 border-white dark:border-[#202F36]">
                ∞
              </div>
              <div>
                <div className="font-bold text-[17px] text-[#202124] dark:text-white mb-1.5">Unlimited Hearts</div>
                <div className="font-semibold text-[14px] text-[#777] dark:text-[#AFAFAF] leading-snug max-w-[300px]">
                  Never run out of hearts with Super!
                </div>
              </div>
            </div>
            <button 
              className="px-6 py-2.5 rounded-xl font-extrabold text-[14px] uppercase tracking-wide border-2 border-[#CE82FF] text-[#CE82FF] bg-transparent hover:bg-[#CE82FF]/10 transition-colors cursor-pointer hidden sm:block shrink-0"
              onClick={() => alert('Super Duolingo free trial is not available in this clone.')}
            >
              Free Trial
            </button>
          </div>
        </div>

        {/* Power-Ups Section */}
        <h3 className="font-extrabold text-[20px] mb-4 text-[#202124] dark:text-white">Power-Ups</h3>
        <div className="flex flex-col mb-10">
          
          {/* Streak Freeze */}
          <div className="flex items-center justify-between py-6 border-t-2 border-[#E5E7EB] dark:border-[#202F36]">
            <div className="flex items-center gap-6">
              <div className="w-[60px] h-[60px] flex items-center justify-center text-[45px] shrink-0">
                🧊
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="font-bold text-[17px] text-[#202124] dark:text-white">Streak Freeze</div>
                  <div className="bg-[#E8F9CC] dark:bg-[#1A3300] text-[#58CC02] border border-[#58CC02] font-extrabold text-[10px] px-2 py-0.5 rounded-md tracking-wider">
                    3 EQUIPPED
                  </div>
                </div>
                <div className="font-semibold text-[14px] text-[#777] dark:text-[#AFAFAF] leading-snug max-w-[320px]">
                  Streak Freeze allows your streak to remain in place for one full day of inactivity.
                </div>
              </div>
            </div>
            <button 
              className="px-6 py-2.5 rounded-xl font-extrabold text-[14px] uppercase tracking-wide border-2 border-[#E5E7EB] dark:border-[#202F36] text-[#AFAFAF] bg-transparent cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors hidden sm:block shrink-0"
              onClick={() => alert('Streak Freeze is already equipped!')}
            >
              Equipped
            </button>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      {gameState && <RightSidebar gameState={gameState} onNavigate={onNavigate} />}
    </div>
  )
}
