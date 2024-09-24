import { useState } from "react"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Settings, LogOut } from "lucide-react"
import { ProjectSettingsDialog } from "@/components/project-settings-dialog"
import { Project } from "@/types"

interface NavbarProps {
  userName: string
  currentProject: Project | null
  updateProject: (id: string, name: string, tradingDaysPerWeek: number) => Promise<void>
  deleteProject: (id: string) => Promise<void>
}

export function Navbar({ userName, currentProject, updateProject, deleteProject }: NavbarProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' })
  }

  return (
    <nav className="flex items-center justify-between py-4">
      <div className="text-2xl font-bold text-[rgba(191,219,254,1)]">Welcome, {userName}</div>
      <div className="flex items-center space-x-4">
        <Button
          onClick={() => setIsSettingsOpen(true)}
          variant="ghost"
          className="text-[rgba(191,219,254,0.7)] hover:text-[rgba(191,219,254,1)] flex items-center"
        >
          <Settings className="w-5 h-5 mr-1" />
          <span className="sr-only">Project Settings</span>
        </Button>
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="text-[rgba(191,219,254,0.7)] hover:text-[rgba(191,219,254,1)] flex items-center"
        >
          <LogOut className="w-5 h-5 mr-1" />
          <span className="sr-only">Logout</span>
        </Button>
      </div>
      <ProjectSettingsDialog
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentProject={currentProject}
        updateProject={updateProject}
        deleteProject={deleteProject}
      />
    </nav>
  )
}