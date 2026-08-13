import { useState } from 'react'

interface SettingsPageProps {
  theme: 'light' | 'dark'
  setTheme: (t: 'light' | 'dark') => void
  onNavigate?: (page: string) => void
  onLogout?: () => void
}

interface ToggleProps {
  value: boolean
  onChange: () => void
}

function Toggle({ value, onChange }: ToggleProps) {
  return (
    <button
      onClick={onChange}
      role="switch"
      aria-checked={value}
      className={`w-[48px] h-[28px] rounded-full relative transition-colors duration-200 cursor-pointer border-none shrink-0 ${
        value ? 'bg-[#1CB0F6]' : 'bg-[#E5E7EB] dark:bg-[#3A464D]'
      }`}
    >
      <div
        className={`absolute top-[2px] w-[24px] h-[24px] rounded-full bg-white shadow-sm transition-all duration-200 ${
          value ? 'left-[22px]' : 'left-[2px]'
        }`}
      />
    </button>
  )
}

export default function SettingsPage({ theme, setTheme, onNavigate, onLogout }: SettingsPageProps) {
  const [sound, setSound] = useState(true)
  const [animations, setAnimations] = useState(true)
  const [motivational, setMotivational] = useState(true)
  const [listening, setListening] = useState(true)
  const [pronunciation, setPronunciation] = useState(true)

  return (
    <div className="flex flex-col xl:flex-row gap-8 max-w-[950px] mx-auto pb-[100px] px-4 pt-6 text-[#202124] dark:text-white">
      {/* Left Column - Main Settings Content */}
      <div className="flex-1 min-w-0">
        <h1 className="font-extrabold text-[24px] sm:text-[28px] mb-8">Preferences</h1>

        {/* Lesson experience */}
        <div className="mb-10">
          <div className="font-bold text-[18px] mb-4 pb-2 border-b-2 border-[#E5E7EB] dark:border-[#202F36]">
            Lesson experience
          </div>
          
          <div className="flex flex-col gap-6 px-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[15px]">Sound effects</span>
              <Toggle value={sound} onChange={() => setSound(v => !v)} />
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-[15px]">Animations</span>
              <Toggle value={animations} onChange={() => setAnimations(v => !v)} />
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-[15px]">Motivational messages</span>
              <Toggle value={motivational} onChange={() => setMotivational(v => !v)} />
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-[15px]">Listening exercises</span>
              <Toggle value={listening} onChange={() => setListening(v => !v)} />
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="mb-10">
          <div className="font-bold text-[18px] mb-4 pb-2 border-b-2 border-[#E5E7EB] dark:border-[#202F36]">
            Appearance
          </div>
          
          <div className="flex flex-col gap-2 px-1">
            <label className="font-bold text-[15px]">Dark mode</label>
            <div className="relative">
              <select
                value={theme === 'dark' ? 'ON' : 'OFF'}
                onChange={(e) => setTheme(e.target.value === 'ON' ? 'dark' : 'light')}
                className="w-full appearance-none bg-transparent border-2 border-[#E5E7EB] dark:border-[#202F36] rounded-2xl px-4 py-3 font-bold text-[14px] text-[#202124] dark:text-white outline-none focus:border-[#1CB0F6] cursor-pointer"
              >
                <option value="ON" className="text-black">ON</option>
                <option value="OFF" className="text-black">OFF</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#AFAFAF]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Course specific (Korean) */}
        <div className="mb-10">
          <div className="font-bold text-[18px] mb-4 pb-2 border-b-2 border-[#E5E7EB] dark:border-[#202F36]">
            Korean
          </div>
          
          <div className="flex items-center justify-between px-1">
            <span className="font-bold text-[15px]">Show pronunciation</span>
            <Toggle value={pronunciation} onChange={() => setPronunciation(v => !v)} />
          </div>
        </div>
      </div>

      {/* Right Column - Navigation */}
      <div className="w-full xl:w-[320px] shrink-0 flex flex-col gap-4">
        
        {/* Main Nav Card */}
        <div className="bg-white dark:bg-transparent rounded-[18px] p-2 border-2 border-[#E5E7EB] dark:border-[#202F36] flex flex-col">
          {[
            'Account',
            'Preferences',
            'Profile',
            'Notifications',
            'Courses',
            'Duolingo for Schools',
            'Social accounts',
            'Privacy settings'
          ].map((item) => (
            <button 
              key={item} 
              onClick={() => {
                if (item === 'Profile') {
                  onNavigate?.('profile')
                } else if (item !== 'Preferences') {
                  alert(`${item} settings are not implemented in this clone.`)
                }
              }}
              className={`w-full text-left px-4 py-3 rounded-xl font-extrabold text-[15px] border-none bg-transparent cursor-pointer transition-colors ${
                item === 'Preferences' 
                  ? 'text-[#1CB0F6] bg-blue-50 dark:bg-blue-900/20' 
                  : 'text-[#202124] dark:text-white hover:bg-gray-100 dark:hover:bg-white/5'
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Subscription Card */}
        <div className="bg-white dark:bg-transparent rounded-[18px] p-2 border-2 border-[#E5E7EB] dark:border-[#202F36] flex flex-col">
          <div className="px-4 py-2 font-extrabold text-[15px]">Subscription</div>
          <button 
            className="w-full text-left px-4 py-3 rounded-xl font-bold text-[14px] text-[#202124] dark:text-white hover:bg-gray-100 dark:hover:bg-white/5 border-none bg-transparent cursor-pointer transition-colors"
            onClick={() => alert('Subscriptions are not available in this clone.')}
          >
            Choose a plan
          </button>
        </div>

        {/* Support Card */}
        <div className="bg-white dark:bg-transparent rounded-[18px] p-2 border-2 border-[#E5E7EB] dark:border-[#202F36] flex flex-col">
          <div className="px-4 py-2 font-extrabold text-[15px]">Support</div>
          <button 
            className="w-full text-left px-4 py-3 rounded-xl font-bold text-[14px] text-[#202124] dark:text-white hover:bg-gray-100 dark:hover:bg-white/5 border-none bg-transparent cursor-pointer transition-colors"
            onClick={() => alert('Help Center is not available in this clone.')}
          >
            Help Center
          </button>
        </div>

        {/* Log Out Button */}
        <button 
          className="w-full py-3.5 rounded-[16px] font-extrabold text-[13px] uppercase tracking-wide border-2 border-[#E5E7EB] dark:border-[#202F36] text-[#1CB0F6] bg-transparent hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer mt-2"
          onClick={onLogout}
        >
          LOG OUT
        </button>

      </div>
    </div>
  )
}
