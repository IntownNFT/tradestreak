import { useState } from 'react'
import { X } from 'lucide-react'

export function SafetyNotice() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="w-full bg-[rgba(191,219,254,1)] rounded-lg p-4 relative flex items-center">
      <p className="text-[#0f0f0f] pr-8 flex-grow font-medium">
        Please Note: We encrypt passwords for all accounts connected to follow consumer safety guidelines.
      </p>
      <button 
        onClick={() => setIsVisible(false)}
        className="text-[#0f0f0f] hover:text-[rgba(0,0,0,0.7)] flex-shrink-0"
        aria-label="Close safety notice"
      >
        <X size={20} />
      </button>
    </div>
  )
}