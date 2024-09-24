import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Project } from "@/types"

interface ProjectSettingsDialogProps {
  isOpen: boolean
  onClose: () => void
  currentProject: Project | null
  updateProject: (id: string, name: string, tradingDaysPerWeek: number) => Promise<Project | undefined>
  deleteProject: (id: string) => Promise<void>
}

export function ProjectSettingsDialog({
  isOpen,
  onClose,
  currentProject,
  updateProject,
  deleteProject
}: ProjectSettingsDialogProps) {
  const [projectName, setProjectName] = useState("")
  const [tradingDays, setTradingDays] = useState("5")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (currentProject) {
      setProjectName(currentProject.name)
      setTradingDays(currentProject.trading_days_per_week.toString())
    }
  }, [currentProject])

  const handleUpdateProject = async () => {
    if (currentProject) {
      setIsLoading(true)
      try {
        await updateProject(currentProject.id, projectName, parseInt(tradingDays, 10))
        console.log("Project updated successfully")
        onClose()
      } catch (error) {
        console.error('Failed to update project:', error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleDeleteProject = async () => {
    if (currentProject) {
      setIsLoading(true)
      try {
        await deleteProject(currentProject.id)
        console.log("Project deleted successfully")
        onClose()
      } catch (error) {
        console.error('Failed to delete project:', error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#141414] border-[#141414]">
        <DialogHeader>
          <DialogTitle className="text-[rgba(191,219,254,1)]">Project Settings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="project-name" className="text-right text-[rgba(191,219,254,1)]">
              Name
            </Label>
            <Input
              id="project-name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="col-span-3 bg-[#1f1f1f] text-[rgba(229,231,235,1)] border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="trading-days" className="text-right text-[rgba(191,219,254,1)]">
              Trading Days/Week
            </Label>
            <Select value={tradingDays} onValueChange={setTradingDays}>
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
        <div className="flex justify-end space-x-2">
          <Button 
            onClick={handleDeleteProject} 
            variant="destructive"
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete Project"}
          </Button>
          <Button 
            onClick={handleUpdateProject} 
            className="bg-[rgba(191,219,254,1)] text-[#0f0f0f] hover:bg-[rgba(191,219,254,0.8)]"
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update Project"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}