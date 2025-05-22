// tasklist-mongodb/src/app/tasks/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useTasks } from "@/contexts/TaskProvider"
import { useTags } from "@/contexts/TagsProvider"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, Plus, Clock, CheckCircle2, PlayCircle, Filter, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
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
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const { tags, addTagToTask } = useTags()

  useEffect(() => {
    fetchTasks().finally(() => setLoading(false))
  }, [fetchTasks])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completada":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />
      case "em progresso":
        return <PlayCircle className="w-4 h-4 text-blue-500" />
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />
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

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.desc.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || task.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300">Carregando tarefas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Minhas Tarefas</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Gerencie e acompanhe o progresso das suas tarefas
              </p>
            </div>
            <Link href="/">
              <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                <Plus className="w-4 h-4 mr-2" />
                Nova Tarefa
              </Button>
            </Link>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar tarefas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 border-2 border-gray-200 dark:border-gray-700"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48 h-12 border-2 border-gray-200 dark:border-gray-700">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="em progresso">Em progresso</SelectItem>
                <SelectItem value="completada">Completada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <Clock className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Nenhuma tarefa encontrada
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {searchTerm || statusFilter !== "all" 
                    ? "Tente ajustar os filtros para encontrar suas tarefas"
                    : "Comece criando sua primeira tarefa"
                  }
                </p>
                <Link href="/">
                  <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Primeira Tarefa
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            filteredTasks.map((task) => (
              <Link key={task._id} href={`/tasks/${task._id}`} className="block group">
                <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-200 border-0">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {getStatusIcon(task.status)}
                          <h2 className="font-bold text-xl text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {task.titulo}
                          </h2>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                          {task.desc}
                        </p>
                      </div>

                      <Select
                        onValueChange={async (value) => {
                          await addTagToTask(task._id, value)
                          fetchTasks()
                        }}
                      >
                        <SelectTrigger className="w-32 ml-4" onClick={(e) => e.preventDefault()}>
                          <Plus className="w-4 h-4 mr-1" />
                          <SelectValue placeholder="Tag" />
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

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <Button
                          size="sm"
                          variant="outline"
                          className="hover:bg-red-50 hover:text-red-600 hover:border-red-300 dark:hover:bg-red-900/20"
                          onClick={(e) => {
                            e.preventDefault()
                            deleteTask(task._id)
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Excluir
                        </Button>
                      </div>

                      <div className="flex items-center gap-3">
                        <Badge className={`px-3 py-1 ${getStatusColor(task.status)}`}>
                          {task.status}
                        </Badge>
                        <Select
                          value={task.status}
                          onValueChange={(value) => updateTask(task._id, { status: value })}
                        >
                          <SelectTrigger className="w-40" onClick={(e) => e.preventDefault()}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pendente">Pendente</SelectItem>
                            <SelectItem value="em progresso">Em progresso</SelectItem>
                            <SelectItem value="completada">Completada</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  )
}