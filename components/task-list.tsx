import { useState } from "react"
import { Task } from "@/types"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, Edit2, Check, X } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface TaskListProps {
  tasks: Task[]
  toggleComplete: (id: string) => void
  deleteTask: (id: string) => void
  editTask: (id: string, newContent: string) => void
}

export function TaskList({ tasks, toggleComplete, deleteTask, editTask }: TaskListProps) {
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [editingContent, setEditingContent] = useState("")

  const startEditing = (task: Task) => {
    setEditingTaskId(task.id)
    setEditingContent(task.content)
  }

  const cancelEditing = () => {
    setEditingTaskId(null)
    setEditingContent("")
  }

  const saveEdit = (id: string) => {
    editTask(id, editingContent)
    setEditingTaskId(null)
    setEditingContent("")
  }

  return (
    <ScrollArea className="h-[280px] w-full pr-4">
      <ul className="space-y-4">
        {tasks.map((task) => (
          <li key={task.id} className="flex items-center justify-between bg-[#141414] p-4 rounded-lg">
            <div className="flex items-center space-x-3 flex-grow">
              <Checkbox
                checked={task.completed}
                onCheckedChange={() => toggleComplete(task.id)}
                className="border-[rgba(191,219,254,0.5)]"
              />
              {editingTaskId === task.id ? (
                <Input
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                  className="flex-grow bg-[#1f1f1f] text-[rgba(229,231,235,1)] border-0"
                />
              ) : (
                <span className="text-[rgba(229,231,235,1)] flex-grow">{task.content}</span>
              )}
            </div>
            <div className="flex space-x-2">
              {editingTaskId === task.id ? (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => saveEdit(task.id)}
                    className="text-green-500 hover:text-green-400"
                  >
                    <Check className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={cancelEditing}
                    className="text-red-500 hover:text-red-400"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => startEditing(task)}
                    className="text-[rgba(156,163,175,1)] hover:text-[rgba(229,231,235,1)]"
                  >
                    <Edit2 className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteTask(task.id)}
                    className="text-[rgba(156,163,175,1)] hover:text-[rgba(229,231,235,1)]"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </ScrollArea>
  )
}