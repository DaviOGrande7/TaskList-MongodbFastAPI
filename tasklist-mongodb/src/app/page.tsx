// tasklist-mongodb/src/app/page.tsx
"use client"

import { useState } from "react"
import { useTasks } from "@/contexts/TaskProvider"
import { toast } from "sonner"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

import { Plus, Sparkles, CheckCircle } from "lucide-react"

export default function Home() {
  const { addTask } = useTasks()
  const [titulo, setTitulo] = useState("")
  const [desc, setDesc] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await addTask({ titulo, desc, status: "pendente" })
      setTitulo("")
      setDesc("")
      toast.success("Tarefa criada com sucesso!")
    } catch {
      toast.error("Erro ao criar tarefa.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />
        <div className="relative px-8 py-16 sm:py-24">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
              Task Manager
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Organize your tasks efficiently with our modern, intuitive task management system.
              Create, track, and complete your goals with ease.
            </p>
          </div>
        </div>
      </div>

      {/* Task Creation Form */}
      <div className="relative px-8 pb-16">
        <div className="mx-auto max-w-2xl">
          <Card className="backdrop-blur-sm bg-white/70 dark:bg-slate-900/70 border-0 shadow-2xl">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
                <Plus className="w-6 h-6 text-blue-500" />
                Criar Nova Tarefa
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label 
                    htmlFor="titulo" 
                    className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Título da Tarefa
                  </Label>
                  <Input 
                    id="titulo" 
                    value={titulo} 
                    onChange={(e) => setTitulo(e.target.value)} 
                    required 
                    placeholder="Digite o título da sua tarefa..."
                    className="h-12 text-base border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label 
                    htmlFor="desc" 
                    className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Descrição
                  </Label>
                  <Textarea 
                    id="desc" 
                    value={desc} 
                    onChange={(e) => setDesc(e.target.value)} 
                    required 
                    placeholder="Descreva sua tarefa em detalhes..."
                    className="min-h-24 text-base border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 resize-none"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  disabled={loading}
                  size="lg"
                  className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Registrando...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Registrar Tarefa
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Features Section */}
      <div className="px-8 pb-16">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Recursos Principais
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Tudo que você precisa para gerenciar suas tarefas
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Plus className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Criação Rápida
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Crie tarefas rapidamente com nosso formulário intuitivo
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="w-12 h-12 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Acompanhamento
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Monitore o progresso das suas tarefas em tempo real
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="w-12 h-12 mx-auto mb-4 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Organização
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Use tags e comentários para manter tudo organizado
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}