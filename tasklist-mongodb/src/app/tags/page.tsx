// tasklist-mongodb/src/app/tags/page.tsx

"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTags } from "@/contexts/TagsProvider";
import { useTasks } from "@/contexts/TaskProvider";
import { filteredTags } from "@/lib/uiHelpers";
import { Tag, Trash2, Plus, Search, Hash, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function TagsPage() {
  const { tags, addTag, fetchTags } = useTags();
  const { tasks } = useTasks();
  const [nome, setNome] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async () => {
    if (!nome.trim()) {
      toast.error("Por favor, insira um nome para a tag");
      return;
    }

    // Check if tag already exists
    const tagExists = tags.some(
      (tag) => tag.nome.toLowerCase() === nome.trim().toLowerCase()
    );

    if (tagExists) {
      toast.error("Esta tag já existe");
      return;
    }

    setIsAdding(true);
    try {
      await addTag(nome.trim());
      setNome("");
      toast.success("Tag adicionada com sucesso!");
    } catch (error) {
      toast.error("Erro ao adicionar tag");
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (id: string, tagName: string) => {
    try {
      await fetch(`http://127.0.0.1:8000/tags/${id}`, {
        method: "DELETE",
      });
      await fetchTags();
      toast.success(`Tag "${tagName}" removida com sucesso!`);
    } catch (error) {
      toast.error("Erro ao remover tag");
    }
  };

  const getTagUsageCount = (tagName: string) => {
    return tasks.filter((task) => task.tags?.includes(tagName)).length;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAdd();
    }
  };

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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Tag className="w-8 h-8 text-purple-500" />
              Gerenciar Tags
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Organize suas tarefas com tags personalizadas
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto space-y-8">
          {/* Add New Tag Section */}
          <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <Plus className="w-5 h-5 text-green-500" />
                Adicionar Nova Tag
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Digite o nome da nova tag..."
                    className="text-lg"
                    disabled={isAdding}
                  />
                </div>
                <Button
                  onClick={handleAdd}
                  disabled={!nome.trim() || isAdding}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 min-w-[120px]"
                >
                  {isAdding ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Search and Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Search */}
            <Card className="lg:col-span-2 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm shadow-xl">
              <CardContent className="p-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar tags..."
                    className="pl-10 text-lg"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm shadow-xl">
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-500">
                    {tags.length}
                  </div>
                  <div className="text-gray-600 dark:text-gray-300">
                    Tags Totais
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tags Grid */}
          <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <Hash className="w-5 h-5 text-blue-500" />
                Suas Tags ({filteredTags(tags, searchTerm).length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredTags(tags, searchTerm).length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                  {filteredTags(tags, searchTerm).map((tag) => {
                    const usageCount = getTagUsageCount(tag.nome);
                    return (
                      <Card
                        key={tag._id}
                        className="group hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-700 border border-gray-200 dark:border-gray-600"
                      >
                        <CardContent className="p-4">
                          <div className="flex flex-col space-y-3">
                            <div className="flex items-center justify-between">
                              <Badge
                                variant="outline"
                                className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700 font-medium"
                              >
                                <Tag className="w-3 h-3 mr-1" />
                                {tag.nome}
                              </Badge>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                                onClick={() => handleDelete(tag._id, tag.nome)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>

                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              <span className="font-medium text-blue-600 dark:text-blue-400">
                                {usageCount}
                              </span>{" "}
                              tarefa{usageCount !== 1 ? "s" : ""}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  {searchTerm ? (
                    <div>
                      <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Nenhuma tag encontrada
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Tente buscar por outro termo ou crie uma nova tag
                      </p>
                    </div>
                  ) : (
                    <div>
                      <Tag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Nenhuma tag criada ainda
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-4">
                        Crie sua primeira tag para organizar suas tarefas
                      </p>
                      <Button
                        onClick={() => document.querySelector("input")?.focus()}
                        className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Criar primeira tag
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
