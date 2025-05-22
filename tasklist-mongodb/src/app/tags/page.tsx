// tasklist-mongodb/src/app/tags/page.tsx

"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useTags } from "@/contexts/TagsProvider"
import { Trash2 } from "lucide-react"

export default function TagsPage() {
  const { tags, addTag, fetchTags } = useTags()
  const [nome, setNome] = useState("")

  const handleAdd = async () => {
    if (!nome.trim()) return
    await addTag(nome.trim())
    setNome("")
  }

  const handleDelete = async (id: string) => {
    await fetch(`http://127.0.0.1:8000/tags/${id}`, {
      method: "DELETE",
    })
    await fetchTags()
  }

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-6">
      <div className="flex gap-4">
        <Input
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nova tag"
        />
        <Button onClick={handleAdd}>Adicionar</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {tags.map((tag) => (
          <Card key={tag._id} className="p-4 flex flex-row items-center justify-between">
            <span className="font-medium">{tag.nome}</span>
            <Button
              size="icon"
              className="cursor-pointer"
              onClick={() => handleDelete(tag._id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </Card>
        ))}
      </div>
    </div>
  )
}
