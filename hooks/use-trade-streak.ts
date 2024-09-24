"use client";

import { useState, useEffect, useCallback } from 'react'
import { Project, Task } from '@/types'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export function useTradeStreak(userId: string | undefined) {
  const [projects, setProjects] = useState<Project[]>([])
  const [currentProject, setCurrentProject] = useState<Project | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [streak, setStreak] = useState(0)
  const [completedToday, setCompletedToday] = useState(0)
  const [completedDays, setCompletedDays] = useState<number[]>([])
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [availableYears, setAvailableYears] = useState<number[]>([])

  const fetchProjects = useCallback(async () => {
    if (!userId) return

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
    
    if (error) {
      console.error('Error fetching projects:', error)
      return
    }

    if (data) {
      setProjects(data)
      if (data.length > 0 && !currentProject) {
        setCurrentProject(data[0])
      }
    }
  }, [userId, currentProject])

  const fetchTasks = useCallback(async (projectId: string) => {
    const today = new Date().toISOString().split('T')[0]

    const { data: allTasks, error: tasksError } = await supabase
      .from('tasks')
      .select('*')
      .eq('project_id', projectId)
    
    if (tasksError) {
      console.error('Error fetching tasks:', tasksError)
      return
    }

    const { count, error: countError } = await supabase
      .from('tasks')
      .select('*', { count: 'exact', head: true })
      .eq('project_id', projectId)
      .eq('completed', true)
      .eq('completed_date', today)

    if (countError) {
      console.error('Error counting completed tasks:', countError)
      return
    }

    if (allTasks) {
      setTasks(allTasks)
      setCompletedToday(count || 0)
      updateStats(allTasks, projectId)
    }
  }, [])

  const fetchCompletedDays = useCallback(async (projectId: string, year: number) => {
    const startDate = new Date(year, 0, 1).toISOString().split('T')[0];
    const endDate = new Date(year, 11, 31).toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('tasks')
      .select('completed_date')
      .eq('project_id', projectId)
      .eq('completed', true)
      .gte('completed_date', startDate)
      .lte('completed_date', endDate);

    if (error) {
      console.error('Error fetching completed days:', error);
      return;
    }

    if (data) {
      const completedDays = data.map(task => {
        const date = new Date(task.completed_date!);
        return Math.floor((date.getTime() - new Date(year, 0, 0).getTime()) / (24 * 60 * 60 * 1000));
      });
      setCompletedDays([...new Set(completedDays)]);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetchProjects()
    }
  }, [userId, fetchProjects])

  useEffect(() => {
    if (currentProject) {
      fetchTasks(currentProject.id)
    }
  }, [currentProject, fetchTasks])

  useEffect(() => {
    if (currentProject && selectedYear) {
      fetchCompletedDays(currentProject.id, selectedYear);
    }
  }, [currentProject, selectedYear, fetchCompletedDays]);

  const addProject = async (name: string, tradingDaysPerWeek: number, userId: string) => {
    const { data, error } = await supabase
      .from('projects')
      .insert({ name, trading_days_per_week: tradingDaysPerWeek, user_id: userId })
      .select()
    
    if (error) {
      console.error('Error adding project:', error)
      return
    }

    if (data && data.length > 0) {
      const newProject = data[0] as Project
      setProjects(prevProjects => [...prevProjects, newProject])
      setCurrentProject(newProject)
    }
  }

  const addTask = async (content: string) => {
    if (content.trim() && currentProject && userId) {
      const newTask = {
        content: content.trim(),
        project_id: currentProject.id,
        completed: false,
        completed_date: null,
        user_id: userId
      }

      const { data, error } = await supabase
        .from('tasks')
        .insert(newTask)
        .select()
      
      if (error) {
        console.error('Error adding task:', error)
        return
      }

      if (data && data.length > 0) {
        const addedTask = data[0] as Task
        const updatedTasks = [...tasks, addedTask]
        setTasks(updatedTasks)
        updateStats(updatedTasks, currentProject.id)
      }
    }
  }

  const deleteTask = async (id: string) => {
    if (!currentProject) return

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting task:', error)
      return
    }

    const updatedTasks = tasks.filter(task => task.id !== id)
    setTasks(updatedTasks)
    updateStats(updatedTasks, currentProject.id)
  }

  const toggleComplete = async (id: string) => {
    if (!currentProject) return

    const task = tasks.find(t => t.id === id)
    if (task) {
      const updatedTask = {
        ...task,
        completed: !task.completed,
        completed_date: !task.completed ? new Date().toISOString().split('T')[0] : null
      }

      const { data, error } = await supabase
        .from('tasks')
        .update(updatedTask)
        .eq('id', id)
        .select()
      
      if (error) {
        console.error('Error updating task:', error)
        return
      }

      if (data && data.length > 0) {
        const updatedTaskFromDB = data[0] as Task
        const updatedTasks = tasks.map(t => t.id === id ? updatedTaskFromDB : t)
        setTasks(updatedTasks)
        updateStats(updatedTasks, currentProject.id)
      }
    }
  }

  const updateStats = useCallback(async (currentTasks: Task[], projectId: string) => {
    const today = new Date().toISOString().split('T')[0]

    const { count, error: countError } = await supabase
      .from('tasks')
      .select('*', { count: 'exact', head: true })
      .eq('project_id', projectId)
      .eq('completed', true)
      .eq('completed_date', today)

    if (countError) {
      console.error('Error counting completed tasks:', countError)
      return
    }

    setCompletedToday(count || 0)

    // Calculate streak
    const sortedCompletedDates = [...new Set(currentTasks
      .filter(task => task.completed && task.project_id === projectId)
      .map(task => task.completed_date)
      .filter(date => date !== null)
      .sort((a, b) => new Date(b!).getTime() - new Date(a!).getTime()))]

    let currentStreak = 0
    const date = new Date()
    let previousDate: Date | null = null

    for (const completedDate of sortedCompletedDates) {
      const currentDate = new Date(completedDate!)
      
      if (previousDate === null) {
        currentStreak = 1
      } else {
        const dayDifference = (previousDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24)
        if (dayDifference === 1) {
          currentStreak++
        } else {
          break
        }
      }

      previousDate = currentDate
    }

    setStreak(currentStreak)

    // Update completed days for the contributions chart
    const allCompletedDays = sortedCompletedDates
      .map(date => new Date(date!))
      .filter(date => date.getFullYear() === selectedYear)
      .map(date => Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (24 * 60 * 60 * 1000)))

    setCompletedDays([...new Set(allCompletedDays)])

    // Update available years
    const years = new Set<number>()
    currentTasks.forEach(task => {
      if (task.completed_date) {
        years.add(new Date(task.completed_date).getFullYear())
      }
    })
    const sortedYears = Array.from(years).sort((a, b) => b - a)
    
    if (sortedYears.length === 0) {
      setAvailableYears([new Date().getFullYear()])
    } else {
      setAvailableYears(sortedYears)
    }

    if (sortedYears.length > 0 && !sortedYears.includes(selectedYear)) {
      setSelectedYear(sortedYears[0])
    }
  }, [selectedYear])

  const updateProject = async (id: string, name: string, tradingDaysPerWeek: number) => {
    if (!userId) return

    const { data, error } = await supabase
      .from('projects')
      .update({ name, trading_days_per_week: tradingDaysPerWeek })
      .eq('id', id)
      .eq('user_id', userId)
      .select()

    if (error) {
      console.error('Error updating project:', error)
      throw error
    }

    if (data && data.length > 0) {
      const updatedProject = data[0] as Project
      setProjects(prevProjects => prevProjects.map(p => p.id === id ? updatedProject : p))
      if (currentProject && currentProject.id === id) {
        setCurrentProject(updatedProject)
      }
      return updatedProject
    }
  }

  const deleteProject = async (id: string) => {
    if (!userId) return

    // First, delete all tasks associated with the project
    const { error: tasksDeleteError } = await supabase
      .from('tasks')
      .delete()
      .eq('project_id', id)

    if (tasksDeleteError) {
      console.error('Error deleting project tasks:', tasksDeleteError)
      throw tasksDeleteError
    }

    // Then, delete the project
    const { error: projectDeleteError } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (projectDeleteError) {
      console.error('Error deleting project:', projectDeleteError)
      throw projectDeleteError
    }

    setProjects(prevProjects => prevProjects.filter(p => p.id !== id))
    if (currentProject && currentProject.id === id) {
      const remainingProjects = projects.filter(p => p.id !== id)
      setCurrentProject(remainingProjects.length > 0 ? remainingProjects[0] : null)
    }
  }

  const editTask = async (id: string, newContent: string) => {
    if (!currentProject) return

    const task = tasks.find(t => t.id === id)
    if (task) {
      const updatedTask = {
        ...task,
        content: newContent
      }

      const { data, error } = await supabase
        .from('tasks')
        .update(updatedTask)
        .eq('id', id)
        .select()
      
      if (error) {
        console.error('Error updating task:', error)
        return
      }

      if (data && data.length > 0) {
        const updatedTaskFromDB = data[0] as Task
        const updatedTasks = tasks.map(t => t.id === id ? updatedTaskFromDB : t)
        setTasks(updatedTasks)
      }
    }
  }

  return {
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
    editTask,
  }
}