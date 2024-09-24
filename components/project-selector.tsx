import { useState } from "react"
import { Project } from "@/types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ProjectSelectorProps {
  projects: Project[]
  currentProject: Project | null
  setCurrentProject: (project: Project | null) => void
  addProject: (name: string, tradingDaysPerWeek: number) => void
}

export function ProjectSelector({ projects, currentProject, setCurrentProject, addProject }: ProjectSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [newProjectName, setNewProjectName] = useState("")
  const [newProjectTradingDays, setNewProjectTradingDays] = useState("5")

  const handleAddProject = () => {
    if (newProjectName.trim()) {
      addProject(newProjectName.trim(), parseInt(newProjectTradingDays, 10))
      setNewProjectName("")
      setNewProjectTradingDays("5")
      setIsOpen(false)
    }
  }

  const handleProjectChange = (projectId: string) => {
    const selectedProject = projects.find(p => p.id === projectId) || null
    setCurrentProject(selectedProject)
  }

  return (
    <div className="flex items-center space-x-4">
      <Select
        value={currentProject?.id || ""}
        onValueChange={handleProjectChange}
      >
        <SelectTrigger className="w-[250px] bg-[#141414] border-[#141414] text-white">
          <SelectValue placeholder="Select a project" />
        </SelectTrigger>
        <SelectContent className="bg-[#141414] border-[#141414] text-white">
          {projects.map((project) => (
            <SelectItem key={project.id} value={project.id} className="text-white hover:bg-[#1f1f1f]">
              {project.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="bg-[#141414] border-0 text-[rgba(191,219,254,1)]">
            New Project
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-[#141414] border-[#141414]">
          <DialogHeader>
            <DialogTitle className="text-[rgba(191,219,254,1)]">Create New Project</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="project-name" className="text-right text-[rgba(191,219,254,1)]">
                Name
              </Label>
              <Input
                id="project-name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                className="col-span-3 bg-[#1f1f1f] text-[rgba(229,231,235,1)] border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="trading-days" className="text-right text-[rgba(191,219,254,1)]">
                Trading Days/Week
              </Label>
              <Select value={newProjectTradingDays} onValueChange={setNewProjectTradingDays}>
                <SelectTrigger className="col-span-3 bg-[#1f1f1f] text-white border-0 focus:ring-0 focus:ring-offset-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1f1f1f] border-0 text-white">
                  {[1, 2, 3, 4, 5, 6, 7].map((days) => (
                    <SelectItem key={days} value={days.toString()} className="text-white hover:bg-[#2f2f2f]">
                      {days}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleAddProject} className="bg-[rgba(191,219,254,1)] text-[#0f0f0f] hover:bg-[rgba(191,219,254,0.8)]">
            Create Project
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}