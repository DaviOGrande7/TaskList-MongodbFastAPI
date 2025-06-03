// tasklist-mongodb/src/app/dashboard/page.tsx

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  ArrowUpRight,
  Timer,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useMetricas } from "@/lib/useMetricas";

export default function Dashboard() {
  const { statusTarefas, tarefasConcluidasPorDia, topTags, produtividade } =
    useMetricas();

  // Calcular estatísticas baseadas nas métricas do Redis
  const totalTasks = statusTarefas
    ? Object.values(statusTarefas).reduce((a, b) => a + b, 0)
    : 0;
  const completedTasks = statusTarefas?.completada ?? 0;
  const inProgressTasks = statusTarefas?.["em progresso"] ?? 0;
  const pendingTasks = statusTarefas?.pendente ?? 0;
  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Tarefas por status para gráfico
  const tasksByStatus = [
    { status: "Pendente", count: pendingTasks, color: "bg-yellow-500" },
    { status: "Em Progresso", count: inProgressTasks, color: "bg-blue-500" },
    { status: "Completada", count: completedTasks, color: "bg-green-500" },
  ];

  // Preparar dados das tarefas concluídas por dia (últimos 7 dias)
  const chartData = tarefasConcluidasPorDia
    ? Object.entries(tarefasConcluidasPorDia)
        .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
        .slice(-7)
        .map(([date, count]) => ({
          date: new Date(date).toLocaleDateString("pt-BR", {
            weekday: "short",
          }),
          tasks: count,
        }))
    : [];

  // Loading state
  if (!statusTarefas && !produtividade) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Carregando métricas...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Visão geral das suas tarefas e produtividade
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm hover:shadow-xl transition-all duration-200 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total de Tarefas
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {totalTasks}
                  </p>
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
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Concluídas
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {completedTasks}
                  </p>
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
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Em Progresso
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {inProgressTasks}
                  </p>
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
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Taxa de Conclusão
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {completionRate}%
                  </p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Productivity Stats */}
        {produtividade && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm hover:shadow-xl transition-all duration-200 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Tempo Médio
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {Math.round(produtividade.tempo_medio_conclusao)} dias
                    </p>
                  </div>
                  <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
                    <Timer className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm hover:shadow-xl transition-all duration-200 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Criadas Hoje
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {produtividade.tarefas_criadas_hoje}
                    </p>
                  </div>
                  <div className="p-3 bg-cyan-100 dark:bg-cyan-900/30 rounded-xl">
                    <Plus className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm hover:shadow-xl transition-all duration-200 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Taxa Semanal
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {Math.round(produtividade.taxa_conclusao_semanal)}%
                    </p>
                  </div>
                  <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                    <Zap className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

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
                        width:
                          totalTasks > 0
                            ? `${(item.count / totalTasks) * 100}%`
                            : "0%",
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
                <Button
                  variant="outline"
                  className="w-full justify-start h-12 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-700"
                >
                  <Plus className="w-4 h-4 mr-3" />
                  Criar Nova Tarefa
                  <ArrowUpRight className="w-4 h-4 ml-auto" />
                </Button>
              </Link>

              <Link href="/tasks" className="block">
                <Button
                  variant="outline"
                  className="w-full justify-start h-12 hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-300 dark:hover:border-green-700"
                >
                  <CheckCircle2 className="w-4 h-4 mr-3" />
                  Ver Todas as Tarefas
                  <ArrowUpRight className="w-4 h-4 ml-auto" />
                </Button>
              </Link>

              <Link href="/tags" className="block">
                <Button
                  variant="outline"
                  className="w-full justify-start h-12 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:border-purple-300 dark:hover:border-purple-700"
                >
                  <Award className="w-4 h-4 mr-3" />
                  Gerenciar Tags
                  <ArrowUpRight className="w-4 h-4 ml-auto" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Tarefas Concluídas por Dia */}
        {chartData.length > 0 && (
          <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <Calendar className="w-5 h-5 text-orange-500" />
                Tarefas Concluídas (Últimos 7 dias)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {chartData.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-16">
                      {item.date}
                    </span>
                    <div className="flex-1 mx-4">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div
                          className="h-3 rounded-full bg-green-500 transition-all duration-300"
                          style={{
                            width: `${Math.max(
                              (item.tasks /
                                Math.max(...chartData.map((d) => d.tasks))) *
                                100,
                              10
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[3rem] text-right">
                      {item.tasks} tarefas
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Top Tags */}
        {topTags && topTags.length > 0 && (
          <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <Award className="w-5 h-5 text-purple-500" />
                Tags Mais Utilizadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {topTags.slice(0, 6).map((item, index) => (
                  <div
                    key={item.tag}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                          {index + 1}
                        </span>
                      </div>
                      <Badge variant="outline" className="font-medium">
                        {item.tag}
                      </Badge>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {item.contagem}x
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {totalTasks === 0 && (
          <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm">
            <CardContent className="text-center py-12">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Nenhuma tarefa ainda
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Comece criando sua primeira tarefa para ver as métricas aqui
              </p>
              <Link href="/">
                <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeira Tarefa
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
