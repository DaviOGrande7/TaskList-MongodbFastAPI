// tasklist-mongodb/src/app/dashboard/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useTasks } from "@/contexts/TaskProvider"
import { useTags } from "@/contexts/TagsProvider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  PlayCircle, 
  Calendar,
  Target,
  Award,
  Activity,
  Plus,
  ArrowUpRight
} from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  const { tasks, fetchTasks } = useTasks()
  const { tags, fetchTags } = useTags()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([fetchTasks(), fetchTags()]).finally(() => setLoading(false))
  }, [fetchTasks, fetchTags])

  // Calculate statistics
  const totalTasks = tasks.length
  const completedTasks = tasks.filter(t => t.status === "completada").length
  const inProgressTasks = tasks.filter(t => t.status === "em progresso").length
  const pendingTasks = tasks.filter(t => t.status === "pendente").length
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  // Recent tasks (last 5)
  const recentTasks = tasks.slice(-5).reverse()

  // Tasks by status for chart representation
  const tasksByStatus = [
    { status: "Pendente", count: pendingTasks, color: "bg-yellow-500" },
    { status: "Em Progresso", count: inProgressTasks, color: "bg-blue-500" },
    { status: "Completada", count: completedTasks, color: "bg-green-500" }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300">Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Visão geral das suas tarefas e produtividade
            </p>
          </div>
          <Link href="/">
            <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
              <Plus className="w-4 h-4 mr-2" />
              Nova Tarefa
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm hover:shadow-xl transition-all duration-200 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total de Tarefas</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalTasks}</p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                  <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm hover:shadow-xl transition-all duration-200 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Concluídas</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{completedTasks}</p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                  <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm hover:shadow-xl transition-all duration-200 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Em Progresso</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{inProgressTasks}</p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                  <PlayCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm hover:shadow-xl transition-all duration-200 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Taxa de Conclusão</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{completionRate}%</p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status Distribution */}
          <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <Activity className="w-5 h-5 text-blue-500" />
                Distribuição por Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {tasksByStatus.map((item) => (
                <div key={item.status} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {item.status}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {item.count} tarefas
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-300 ${item.color}`}
                      style={{
                        width: totalTasks > 0 ? `${(item.count / totalTasks) * 100}%` : '0%'
                      }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <Target className="w-5 h-5 text-green-500" />
                Ações Rápidas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/" className="block">
                <Button variant="outline" className="w-full justify-start h-12 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-700">
                  <Plus className="w-4 h-4 mr-3" />
                  Criar Nova Tarefa
                  <ArrowUpRight className="w-4 h-4 ml-auto" />
                </Button>
              </Link>
              
              <Link href="/tasks" className="block">
                <Button variant="outline" className="w-full justify-start h-12 hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-300 dark:hover:border-green-700">
                  <CheckCircle2 className="w-4 h-4 mr-3" />
                  Ver Todas as Tarefas
                  <ArrowUpRight className="w-4 h-4 ml-auto" />
                </Button>
              </Link>
              
              <Link href="/tags" className="block">
                <Button variant="outline" className="w-full justify-start h-12 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:border-purple-300 dark:hover:border-purple-700">
                  <Award className="w-4 h-4 mr-3" />
                  Gerenciar Tags
                  <ArrowUpRight className="w-4 h-4 ml-auto" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Tasks */}
        <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <Calendar className="w-5 h-5 text-orange-500" />
                Tarefas Recentes
              </CardTitle>
              <Link href="/tasks">
                <Button variant="outline" size="sm">
                  Ver Todas
                  <ArrowUpRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentTasks.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Nenhuma tarefa ainda
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Comece criando sua primeira tarefa para ver o progresso aqui
                </p>
                <Link href="/">
                  <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Primeira Tarefa
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentTasks.map((task) => (
                  <Link key={task._id} href={`/tasks/${task._id}`} className="block group">
                    <div className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-all duration-200 group-hover:shadow-md">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800">
                          {task.status === "completada" && (
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                          )}
                          {task.status === "em progresso" && (
                            <PlayCircle className="w-4 h-4 text-blue-500" />
                          )}
                          {task.status === "pendente" && (
                            <Clock className="w-4 h-4 text-yellow-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {task.titulo}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                            {task.desc}
                          </p>
                        </div>
                      </div>
                      <Badge 
                        className={`ml-4 ${
                          task.status === "completada" 
                            ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"
                            : task.status === "em progresso"
                            ? "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800"
                            : "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800"
                        }`}
                      >
                        {task.status}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tags Overview */}
        {tags.length > 0 && (
          <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <Award className="w-5 h-5 text-purple-500" />
                Tags Disponíveis ({tags.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge 
                    key={tag._id} 
                    variant="outline" 
                    className="hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:border-purple-300 dark:hover:border-purple-700 transition-colors cursor-pointer"
                  >
                    {tag.nome}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}