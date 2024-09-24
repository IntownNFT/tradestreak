import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface TaskInputProps {
  addTask: (content: string) => void
}

export function TaskInput({ addTask }: TaskInputProps) {
  const [taskContent, setTaskContent] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (taskContent.trim()) {
      addTask(taskContent.trim())
      setTaskContent("")
    }
  }

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium text-[rgba(191,219,254,1)]">What's your trading plan for today?</h3>
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <Input
          type="text"
          placeholder="Add a new trade..."
          value={taskContent}
          onChange={(e) => setTaskContent(e.target.value)}
          className="flex-grow bg-[#141414] text-[rgba(229,231,235,1)] border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <Button type="submit" className="bg-[rgba(191,219,254,1)] text-[#0f0f0f] hover:bg-[rgba(191,219,254,0.8)]">
          Add
        </Button>
      </form>
    </div>
  )
}