import { Button } from "@/components/ui/button"
import { BarChart2 } from "lucide-react"
import { AddAccountDialog } from "./add-account-dialog"
import { useState } from "react"

interface WelcomeBannerProps {
  userName: string
  onUserGuideClick: () => void
}

export function WelcomeBanner({ userName, onUserGuideClick }: WelcomeBannerProps) {
  const [isAddAccountDialogOpen, setIsAddAccountDialogOpen] = useState(false)

  return (
    <div className="w-full p-8 rounded-xl relative overflow-hidden bg-[#141414]">
      <div className="max-w-4xl relative z-10">
        <h1 className="text-4xl font-bold mb-12 text-[rgba(191,219,254,1)]">
          Welcome {userName}
        </h1>
        <h2 className="text-2xl font-semibold mb-2 text-[rgba(191,219,254,0.9)]">
          Ready to start your trading journey?
        </h2>
        <p className="mb-6 text-[rgba(229,231,235,1)]">
          We recommend that you go through the User Guide section before connecting an account
        </p>
        <div className="flex flex-wrap gap-4">
          <Button 
            className="bg-[rgba(191,219,254,1)] text-[#0f0f0f] hover:bg-[rgba(191,219,254,0.8)]"
          >
            Enter Competition
          </Button>
          <Button 
            onClick={() => setIsAddAccountDialogOpen(true)}
            className="bg-[rgba(191,219,254,1)] text-[#0f0f0f] hover:bg-[rgba(191,219,254,0.8)]"
          >
            Connect Account
          </Button>
          <Button 
            className="bg-[rgba(191,219,254,1)] text-[#0f0f0f] hover:bg-[rgba(191,219,254,0.8)]"
            onClick={onUserGuideClick}
          >
            User Guide
          </Button>
        </div>
        <AddAccountDialog 
          isOpen={isAddAccountDialogOpen} 
          onClose={() => setIsAddAccountDialogOpen(false)} 
        />
      </div>
      <div className="absolute top-1/2 right-8 transform -translate-y-1/2">
        <BarChart2 className="w-48 h-48 text-[rgba(191,219,254,1)]" />
      </div>
    </div>
  )
}