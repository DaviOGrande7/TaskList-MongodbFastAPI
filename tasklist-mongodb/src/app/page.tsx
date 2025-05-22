// tasklist-mongodb/src/app/page.tsx

"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useTasks } from "@/contexts/TaskProvider"

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
    <div className="p-8 max-w-xl mx-auto">
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="titulo">Título</Label>
              <Input id="titulo" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="desc">Descrição</Label>
              <Textarea id="desc" value={desc} onChange={(e) => setDesc(e.target.value)} required />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "Registrando..." : "Registrar Tarefa"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
