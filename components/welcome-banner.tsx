import { BarChart2 } from "lucide-react"
import { ProjectSelector } from "./project-selector"
import { Project } from "@/types"

interface WelcomeBannerProps {
  userName: string
  projects: Project[]
  currentProject: Project | null
  setCurrentProject: (project: Project | null) => void
  addProject: (name: string, tradingDaysPerWeek: number) => void
}

export function WelcomeBanner({ 
  userName, 
  projects, 
  currentProject, 
  setCurrentProject, 
  addProject 
}: WelcomeBannerProps) {
  return (
    <div className="w-full p-8 rounded-xl relative overflow-hidden bg-[#141414] mb-16">
      <div className="max-w-4xl relative z-10">
        <h1 className="text-4xl font-bold mb-12 text-[rgba(191,219,254,1)]">
          Welcome {userName}
        </h1>
        <h2 className="text-2xl font-semibold mb-2 text-[rgba(191,219,254,0.9)]">
          Ready to start your trading journey?
        </h2>
        <p className="mb-6 text-[rgba(229,231,235,1)]">
          To connect an account, first create a portfolio.
        </p>
        <div>
          <ProjectSelector
            projects={projects}
            currentProject={currentProject}
            setCurrentProject={setCurrentProject}
            addProject={addProject}
          />
        </div>
      </div>
      <div className="absolute top-1/2 right-8 transform -translate-y-1/2">
        <BarChart2 className="w-48 h-48 text-[rgba(191,219,254,1)]" />
      </div>
    </div>
  )
}