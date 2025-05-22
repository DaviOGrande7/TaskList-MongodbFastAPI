// tasklist-mongodb/src/app/contexts/TaskProvider.tsx

"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

export interface Task {
  _id: string
  titulo: string
  desc: string
  status: string
  created_at: string
  comments?: { text: string; created_at: string }[]
  tags?: string[]
}

interface TasksContextData {
  tasks: Task[]
  fetchTasks: () => Promise<void>
  addTask: (task: Omit<Task, "_id" | "created_at">) => Promise<void>
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  addTagToTask: (taskId: string, tag: string) => Promise<void>
}



const TasksContext = createContext<TasksContextData | undefined>(undefined)

export const TasksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([])

  const fetchTasks = async () => {
    const res = await fetch("http://127.0.0.1:8000/tarefas")
    const data = await res.json()
    setTasks(data)
  }

  const addTask = async (task: Omit<Task, "_id" | "created_at">) => {
    await fetch("http://127.0.0.1:8000/tarefas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    })
    await fetchTasks()
  }

  const updateTask = async (id: string, updates: Partial<Task>) => {
    await fetch(`http://127.0.0.1:8000/tarefas/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    })
    await fetchTasks()
  }

  const deleteTask = async (id: string) => {
    await fetch(`http://127.0.0.1:8000/tarefas/${id}`, { method: "DELETE" })
    await fetchTasks()
  }

  const addTagToTask = async (taskId: string, tag: string) => {
    await fetch(`http://127.0.0.1:8000/tarefas/${taskId}/tags`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tag }),
    })
  }


  useEffect(() => {
    fetchTasks()
  }, [])

  return (
    <TasksContext.Provider value={{ tasks, fetchTasks, addTask, updateTask, deleteTask, addTagToTask}}>
      {children}
    </TasksContext.Provider>
  )
}

export const useTasks = () => {
  const context = useContext(TasksContext)
  if (!context) throw new Error("useTasks must be used within a TasksProvider")
  return context
}

