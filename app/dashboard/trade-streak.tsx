"use client"

import { useEffect, useState, useRef } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useTradeStreak } from "@/hooks/use-trade-streak"
import { ProjectSelector } from "@/components/project-selector"
import { TaskInput } from "@/components/task-input"
import { TaskList } from "@/components/task-list"
import { Statistics } from "@/components/statistics"
import { CompletedTasks } from "@/components/completed-tasks"
import { ContributionsChart } from "@/components/contributions-chart"
import { UserGuide } from "@/components/user-guide"
import { Navbar } from "@/components/navbar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import TradingAccountSetup from '@/components/trading-account-setup'
import { WelcomeBanner } from "@/components/welcome-banner"
import { SafetyNotice } from "@/components/safety-notice"

export function TradeStreak() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const {
    projects,
    currentProject,
    setCurrentProject,
    tasks,
    streak,
    completedToday,
    completedDays,
    selectedYear,
    setSelectedYear,
    availableYears,
    addProject,
    addTask,
    deleteTask,
    toggleComplete,
    fetchProjects,
    fetchTasks,
    fetchCompletedDays,
    updateProject,
    deleteProject,
    editTask
  } = useTradeStreak(session?.user?.id)

  const [activeTab, setActiveTab] = useState("statistics")
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [totalBalance] = useState("$25,814.79")
  const [change24h] = useState("+5.23%")

  const userGuideRef = useRef<HTMLDivElement>(null)

  const handleUserGuideClick = () => {
    userGuideRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchProjects()
    }
  }, [session, fetchProjects])

  useEffect(() => {
    if (currentProject) {
      fetchTasks(currentProject.id)
    }
  }, [currentProject, fetchTasks])

  const handleAddProject = async (name: string, tradingDaysPerWeek: number) => {
    if (session?.user?.id) {
      await addProject(name, tradingDaysPerWeek, session.user.id)
      fetchProjects()
    } else {
      console.error("User ID not available")
    }
  }

  const handleAddTask = async (content: string) => {
    if (session?.user?.id && currentProject) {
      await addTask(content)
      fetchTasks(currentProject.id)
    } else {
      console.error("User ID or current project not available")
    }
  }

  const handleDayClick = (date: string) => {
    setSelectedDate(date)
    setActiveTab("completed")
  }

  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-[rgba(229,231,235,1)] p-4">
      <div className="max-w-6xl mx-auto space-y-8"> {/* Changed from space-y-12 to space-y-8 */}
        <Navbar
          currentProject={currentProject}
          updateProject={updateProject}
          deleteProject={deleteProject}
        />

        <div className="space-y-4"> {/* Added this div with space-y-4 */}
          <SafetyNotice />
          <WelcomeBanner 
            userName={session.user?.name || 'User'} 
            onUserGuideClick={handleUserGuideClick}
          />
        </div>

        <ProjectSelector
          projects={projects}
          currentProject={currentProject}
          setCurrentProject={setCurrentProject}
          addProject={handleAddProject}
        />

        <div className="flex flex-col md:flex-row gap-10">
          <div className="flex-grow md:w-1/2 space-y-8">
            <TaskInput addTask={handleAddTask} />
            <TaskList
              tasks={tasks.filter(task => !task.completed && task.project_id === currentProject?.id)}
              toggleComplete={toggleComplete}
              deleteTask={deleteTask}
              editTask={editTask}
            />
          </div>

          <div className="md:w-1/2 space-y-8">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 bg-[#141414]">
                <TabsTrigger value="statistics" className="text-[rgba(191,219,254,1)] data-[state=active]:bg-[rgba(191,219,254,1)]">Statistics</TabsTrigger>
                <TabsTrigger value="completed" className="text-[rgba(191,219,254,1)] data-[state=active]:bg-[rgba(191,219,254,1)]">Completed trades</TabsTrigger>
              </TabsList>
              <TabsContent value="statistics" className="space-y-6 mt-6">
                <Statistics 
                  streak={streak} 
                  completedToday={completedToday} 
                  totalBalance={totalBalance}
                  change24h={change24h}
                />
              </TabsContent>
              <TabsContent value="completed" className="mt-6">
                <CompletedTasks
                  tasks={tasks.filter(task => task.completed && task.project_id === currentProject?.id)}
                  toggleComplete={toggleComplete}
                  selectedDate={selectedDate}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <Card className="bg-[#141414] border-none">
          <ContributionsChart
            completedDays={completedDays}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            availableYears={availableYears}
            fetchCompletedDays={fetchCompletedDays}
            currentProjectId={currentProject?.id}
            onDayClick={handleDayClick}
          />
        </Card>

        <div className="mt-12 py-8">
          <TradingAccountSetup />
        </div>

        <div ref={userGuideRef}>
          <UserGuide />
        </div>
      </div>
    </div>
  )
}