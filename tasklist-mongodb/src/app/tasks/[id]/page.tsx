// tasklist-mongodb/src/app/tasks/[id]/page.tsx

"use client"

import { useState, useEffect } from "react"
import { useTasks } from "@/contexts/TaskProvider"
import { useTags } from "@/contexts/TagsProvider"
import { useParams, useRouter } from "next/navigation"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select"
import {
  ArrowLeft,
  Calendar,
  MessageCircle,
  Tag,
  Clock,
  CheckCircle2,
  PlayCircle,
  Send,
  Plus,
  Edit3,
  Save,
  X
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function TaskDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const { id } = params
  const { tasks, fetchTasks, updateTask } = useTasks()
  const { tags, addTagToTask } = useTags()

  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(true)
  const [comment, setComment] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState("")
  const [editedDesc, setEditedDesc] = useState("")

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/tarefas/${id}`)
        if (res.ok) {
          const taskData = await res.json()
          setTask(taskData)
          setEditedTitle(taskData.titulo)
          setEditedDesc(taskData.desc)
        }
      } catch (error) {
        console.error("Error fetching task:", error)
        toast.error("Erro ao carregar tarefa")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchTaskDetails()
    }
  }, [id])

  const handleAddComment = async () => {
    if (!comment.trim()) return

    try {
      await fetch(`http://127.0.0.1:8000/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: comment.trim() }),
      })
      
      setComment("")
      toast.success("Comentário adicionado!")
      
      // Refresh task data
      const res = await fetch(`http://127.0.0.1:8000/tarefas/${id}`)
      if (res.ok) {
        const updatedTask = await res.json()
        setTask(updatedTask)
      }
    } catch (error) {
      toast.error("Erro ao adicionar comentário")
    }
  }

  const handleStatusChange = async (newStatus) => {
    try {
      await updateTask(id, { status: newStatus })
      setTask(prev => ({ ...prev, status: newStatus }))
      toast.success("Status atualizado!")
    } catch (error) {
      toast.error("Erro ao atualizar status")
    }
  }

  const handleSaveEdit = async () => {
    try {
      await updateTask(id, { 
        titulo: editedTitle.trim(), 
        desc: editedDesc.trim() 
      })
      setTask(prev => ({ 
        ...prev, 
        titulo: editedTitle.trim(), 
        desc: editedDesc.trim() 
      }))
      setIsEditing(false)
      toast.success("Tarefa atualizada!")
    } catch (error) {
      toast.error("Erro ao atualizar tarefa")
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completada":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />
      case "em progresso":
        return <PlayCircle className="w-5 h-5 text-blue-500" />
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completada":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"
      case "em progresso":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800"
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300">Carregando tarefa...</p>
        </div>
      </div>
    )
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Tarefa não encontrada</h2>
          <Link href="/tasks">
            <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para Tarefas
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/tasks">
            <Button 
              variant="outline" 
              size="icon"
              className="hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-700"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Detalhes da Tarefa</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Visualize e edite os detalhes da sua tarefa
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Main Task Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Task Details Card */}
            <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm shadow-xl">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(task.status)}
                    <CardTitle className="text-2xl text-gray-900 dark:text-white">
                      Informações da Tarefa
                    </CardTitle>
                  </div>
                  <Button
                    onClick={() => setIsEditing(!isEditing)}
                    variant={isEditing ? "outline" : "ghost"}
                    size="sm"
                    className="hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  >
                    {isEditing ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                        Título
                      </label>
                      <Input
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        className="text-lg font-semibold"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                        Descrição
                      </label>
                      <Textarea
                        value={editedDesc}
                        onChange={(e) => setEditedDesc(e.target.value)}
                        className="min-h-24"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={handleSaveEdit}
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Salvar
                      </Button>
                      <Button 
                        onClick={() => {
                          setIsEditing(false)
                          setEditedTitle(task.titulo)
                          setEditedDesc(task.desc)
                        }}
                        variant="outline"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {task.titulo}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                        {task.desc}
                      </p>
                    </div>
                  </div>
                )}

                {/* Status and Date Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge className={`px-3 py-1 ${getStatusColor(task.status)}`}>
                        {task.status}
                      </Badge>
                    </div>
                    <Select value={task.status} onValueChange={handleStatusChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pendente">Pendente</SelectItem>
                        <SelectItem value="em progresso">Em progresso</SelectItem>
                        <SelectItem value="completada">Completada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {task.created_at && (
                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                      <Calendar className="w-5 h-5" />
                      <div>
                        <p className="text-sm font-medium">Criada em</p>
                        <p className="text-sm">
                          {new Date(task.created_at).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Comments Section */}
            <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <MessageCircle className="w-5 h-5 text-blue-500" />
                  Comentários ({task.comments?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add Comment */}
                <div className="flex gap-3">
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Adicione um comentário..."
                    className="flex-1 min-h-20"
                  />
                  <Button 
                    onClick={handleAddComment}
                    disabled={!comment.trim()}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 self-end"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>

                {/* Comments List */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {task.comments?.length > 0 ? (
                    task.comments.map((c, i) => (
                      <Card key={i} className="bg-gray-50 dark:bg-slate-800/50">
                        <CardContent className="p-4">
                          <p className="text-gray-900 dark:text-white mb-2">{c.text}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(c.created_at).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500 dark:text-gray-400">
                        Nenhum comentário ainda. Seja o primeiro a comentar!
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tags Section */}
            <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <Tag className="w-5 h-5 text-purple-500" />
                  Tags ({task.tags?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Current Tags */}
                {task.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {task.tags.map((t, i) => (
                      <Badge 
                        key={i} 
                        variant="outline"
                        className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800"
                      >
                        {t}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Add Tag */}
                <Select
                  onValueChange={async (value) => {
                    try {
                      await addTagToTask(task._id, value)
                      const res = await fetch(`http://127.0.0.1:8000/tarefas/${task._id}`)
                      if (res.ok) {
                        const updated = await res.json()
                        setTask(updated)
                      }
                      toast.success("Tag adicionada!")
                    } catch (error) {
                      toast.error("Erro ao adicionar tag")
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Adicionar tag" />
                  </SelectTrigger>
                  <SelectContent>
                    {tags
                      .filter(tag => !task.tags?.includes(tag.nome))
                      .map((tag) => (
                        <SelectItem key={tag._id} value={tag.nome}>
                          {tag.nome}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>

                {tags.filter(tag => !task.tags?.includes(tag.nome)).length === 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    Todas as tags disponíveis já foram adicionadas
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/tasks" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Voltar para Tarefas
                  </Button>
                </Link>
                <Link href="/" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Plus className="w-4 h-4 mr-2" />
                    Nova Tarefa
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}