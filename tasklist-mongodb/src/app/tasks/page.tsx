// tasklist-mongodb/src/app/tasks/page.tsx

"use client"

import { useEffect, useState } from "react"
import { useTasks } from "@/contexts/TaskProvider"
import { useTags } from "@/contexts/TagsProvider"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, Plus } from "lucide-react"
import Link from "next/link"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function TasksPage() {
  const { tasks, fetchTasks, deleteTask, updateTask } = useTasks()
  const [loading, setLoading] = useState(true)
  const { tags, addTagToTask } = useTags()

  useEffect(() => {
    fetchTasks().finally(() => setLoading(false))
  }, [fetchTasks])

  if (loading) return <p className="p-8 text-center">Carregando tarefas...</p>
  
  const handleStatusChange = async (id: string, newStatus: string) => {
  await updateTask(id, { status: newStatus })
}

  return ( 
    <div className="max-w-4xl mx-auto p-8 space-y-4">
      {tasks.map((task) => (
        <Link key={task._id} href={`/tasks/${task._id}`} className="block">
          <Card className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="font-bold text-lg">{task.titulo}</h2>
                <p className="text-sm text-muted-foreground">{task.desc}</p>
              </div>

              <Select
                onValueChange={async (value) => {
                  await addTagToTask(task._id, value)
                  fetchTasks()
                }}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Tags" />
                </SelectTrigger>
                <SelectContent>
                  {tags.map((tag) => (
                    <SelectItem key={tag._id} value={tag.nome}>
                      {tag.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-between items-end mt-4">
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  onClick={(e) => {
                    e.preventDefault()
                    deleteTask(task._id)
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm">Status:</span>
                <Select
                  value={task.status}
                  onValueChange={(value) => updateTask(task._id, { status: value })}
                >
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="em progresso">Em progresso</SelectItem>
                    <SelectItem value="completada">Completada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        </Link>

      ))}
    </div>
  )
}
