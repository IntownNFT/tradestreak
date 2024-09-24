import { useEffect, useRef } from "react"
import { Task } from "@/types"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Undo } from "lucide-react"

interface CompletedTasksProps {
  tasks: Task[]
  toggleComplete: (id: string) => void
  selectedDate: string | null
}

export function CompletedTasks({ tasks, toggleComplete, selectedDate }: CompletedTasksProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const groupTasksByDate = (tasks: Task[]) => {
    const grouped: { [key: string]: Task[] } = {}
    tasks.forEach(task => {
      if (task.completed && task.completed_date) {
        if (!grouped[task.completed_date]) {
          grouped[task.completed_date] = []
        }
        grouped[task.completed_date].push(task)
      }
    })
    return Object.entries(grouped).sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  }

  useEffect(() => {
    if (selectedDate && scrollRef.current) {
      const selectedElement = scrollRef.current.querySelector(`[data-date="${selectedDate}"]`)
      if (selectedElement) {
        selectedElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }, [selectedDate])

  return (
    <Card className="bg-[#141414] border-none">
      <CardContent className="p-4">
        <ScrollArea className="h-[240px] w-full pr-4" ref={scrollRef}>
          {groupTasksByDate(tasks).map(([date, tasksForDate]) => (
            <div key={date} className="mb-6" data-date={date}>
              <h3 className="text-sm font-semibold text-[rgba(191,219,254,0.9)] mb-3">{formatDate(date)}</h3>
              <ul className="space-y-3">
                {tasksForDate.map(task => (
                  <li key={task.id} className="flex items-center justify-between">
                    <span className="text-[rgba(229,231,235,1)]">{task.content}</span>
                    <Button variant="ghost" size="sm" onClick={() => toggleComplete(task.id)}>
                      <Undo className="h-4 w-4 text-[rgba(156,163,175,1)]" />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}