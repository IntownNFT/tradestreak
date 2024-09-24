import { useState } from "react"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Settings, LogOut, BarChart2 } from "lucide-react"
import { ProjectSettingsDialog } from "@/components/project-settings-dialog"
import { Project } from "@/types"

interface NavbarProps {
  currentProject: Project | null
  updateProject: (id: string, name: string, tradingDaysPerWeek: number) => Promise<Project | undefined>
  deleteProject: (id: string) => Promise<void>
}

export function Navbar({ currentProject, updateProject, deleteProject }: NavbarProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' })
  }

  return (
    <nav>
      <div className="flex items-center justify-between pb-4 border-b border-[rgba(191,219,254,0.2)]">
        <div className="flex-1 flex justify-start">
          <BarChart2 className="w-8 h-8 text-[rgba(191,219,254,1)]" />
        </div>
        <div className="flex items-center space-x-4 flex-1 justify-center">
          <p className="text-sm text-[rgba(191,219,254,0.7)]">This is just a demo</p>
          <Button className="bg-[rgba(191,219,254,1)] text-[#0f0f0f] hover:bg-[rgba(191,219,254,0.8)] px-8 py-1 h-8">
            Get Project
          </Button>
        </div>
        <div className="flex items-center space-x-4 flex-1 justify-end">
          <Button
            onClick={() => setIsSettingsOpen(true)}
            variant="ghost"
            className="text-[rgba(191,219,254,0.7)] hover:text-[rgba(191,219,254,1)] flex items-center"
          >
            <Settings className="w-5 h-5" />
            <span className="sr-only">Project Settings</span>
          </Button>
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="text-[rgba(191,219,254,0.7)] hover:text-[rgba(191,219,254,1)] flex items-center"
          >
            <LogOut className="w-5 h-5" />
            <span className="sr-only">Logout</span>
          </Button>
        </div>
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