// tasklist-mongodb/src/app/tasks/[id]/page.tsx

"use client"

import { useState } from "react"
import { useTasks } from "@/contexts/TaskProvider"
import { useTags } from "@/contexts/TagsProvider"
import { useParams } from "next/navigation"

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select"

export default function TaskDetailPage() {
  const params = useParams<{ id: string }>()
  const { id } = params
  const { tasks, fetchTasks } = useTasks()

  const initialTask = tasks.find((t) => t._id === id) || null
  const [task, setTask] = useState(initialTask)

  const [comment, setComment] = useState("")
  const [tag, setTag] = useState("")

  const { tags, addTagToTask } = useTags()

  const handleAddComment = async () => {
    await fetch(`http://127.0.0.1:8000/${id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: comment }),
    })
    setComment("")
    await fetchTasks()
  }

  const handleAddTag = async () => {
    await fetch(`http://127.0.0.1:8000/${id}/tags`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tag }),
    })
    setTag("")
    await fetchTasks()
  }

  if (!task) return <p>Carregando tarefa...</p>

  return (
    <div className="max-w-5xl mx-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="p-4 space-y-2">
        <h2 className="text-xl font-bold">{task.titulo}</h2>
        <p>{task.desc}</p>
        <p className="text-sm text-gray-500">Status: {task.status}</p>
        {task.created_at && (
          <p className="text-xs text-gray-400">
            Criada: {new Date(task.created_at).toLocaleString()}
          </p>
        )}
        <div className="space-y-2">
          <h3 className="font-semibold">Tags:</h3>
          <ul className="list-disc pl-4">
            {task.tags?.map((t, i) => <li key={i}>{t}</li>)}
          </ul>
            <Select
              onValueChange={async (value) => {
                await addTagToTask(task._id, value)
                const res = await fetch(`http://127.0.0.1:8000/tarefas/${task._id}`)
                const updated = await res.json()
                setTask(updated)
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Adicionar tag" />
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
      </Card>
      <div>
        <h3 className="font-semibold mb-2">Comentários:</h3>
        <div className="space-y-2">
          {task.comments?.map((c, i) => (
            <Card key={i} className="p-2">
              <p>{c.text}</p>
              <p className="text-xs text-gray-400">
                {new Date(c.created_at).toLocaleString()}
              </p>
            </Card>
          )) ?? <p>Sem comentários ainda.</p>}
        </div>
        <div className="flex space-x-2 mt-4">
          <Input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Novo comentário" />
          <Button onClick={handleAddComment}>Enviar</Button>
        </div>
      </div>
    </div>
  )
}
