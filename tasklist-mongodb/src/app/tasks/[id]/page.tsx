// tasklist-mongodb/src/app/tasks/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Task } from "@/Interfaces/TaskInterfaces";
import { useTasks } from "@/contexts/TaskProvider";
import { useTags } from "@/contexts/TagsProvider";

import { getStatusIcon, getStatusColor } from "@/lib/statusUtils";
import {
  handleAddComment,
  handleStatusChange,
  handleSaveEdit,
  handleDeleteTask,
  handleRemoveTag,
} from "@/lib/taskHandler";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
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
  X,
  Trash2,
  Hash,
  AlertCircle,
} from "lucide-react";

export default function TaskDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { id } = params;
  const { updateTask, deleteTask } = useTasks();
  const { tags, addTagToTask } = useTags();

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDesc, setEditedDesc] = useState("");
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/tarefas/${id}`);
        if (res.ok) {
          const taskData = await res.json();
          setTask(taskData);
          setEditedTitle(taskData.titulo);
          setEditedDesc(taskData.desc);
        } else {
          toast.error("Tarefa não encontrada");
          router.push("/tasks");
        }
      } catch (error) {
        console.error("Error fetching task:", error);
        toast.error("Erro ao carregar tarefa");
        router.push("/tasks");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTaskDetails();
    }
  }, [id, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Carregando tarefa...
          </p>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Tarefa não encontrada
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            A tarefa que você está procurando não existe ou foi removida.
          </p>
          <Link href="/tasks">
            <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para Tarefas
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
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
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Detalhes da Tarefa
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Visualize e edite os detalhes da sua tarefa
              </p>
            </div>
          </div>

          <Button
            onClick={() => handleDeleteTask(id, deleteTask)}
            variant="outline"
            size="sm"
            className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Deletar Tarefa
          </Button>
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
                    {isEditing ? (
                      <X className="w-4 h-4" />
                    ) : (
                      <Edit3 className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 pb-4">
                {" "}
                {/* Removed relative and pb-20 */}
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                        Título *
                      </label>
                      <Input
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        className="text-lg font-semibold"
                        placeholder="Digite o título da tarefa..."
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                        Descrição
                      </label>
                      <Textarea
                        value={editedDesc}
                        onChange={(e) => setEditedDesc(e.target.value)}
                        className="min-h-32"
                        placeholder="Digite a descrição da tarefa..."
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() =>
                          handleSaveEdit(
                            id,
                            editedTitle,
                            editedDesc,
                            updateTask,
                            setTask,
                            setIsEditing
                          )
                        }
                        disabled={!editedTitle.trim()}
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Salvar Alterações
                      </Button>
                      <Button
                        onClick={() => {
                          setIsEditing(false);
                          setEditedTitle(task.titulo);
                          setEditedDesc(task.desc);
                        }}
                        variant="outline"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Title and Description */}
                    <div className="flex items-center justify-between flex-wrap gap-x-4 gap-y-2 mb-4">
                      <div className="flex-grow">
                        {/* Title and Description block */}
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                          {task.titulo}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                          {task.desc || "Nenhuma descrição fornecida."}
                        </p>
                      </div>
                      <div className="flex-shrink-0 mt-2">
                        <Badge
                          className={`px-3 py-2 text-sm ${getStatusColor(
                            task.status
                          )}`}
                        >
                          {getStatusIcon(task.status)}
                          <span className="ml-2">{task.status}</span>
                        </Badge>
                      </div>
                    </div>

                    {/* Status Combobox, Current Status Badge and Date Info in one row */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="w-full md:w-auto flex-grow">
                        <Select
                          value={task.status}
                          onValueChange={async (value) => {
                            setIsUpdatingStatus(true);
                            await handleStatusChange(
                              id,
                              value,
                              updateTask,
                              setTask,
                              setIsUpdatingStatus
                            );
                            setIsUpdatingStatus(false);
                          }}
                          disabled={isUpdatingStatus}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pendente">
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-yellow-500" />
                                Pendente
                              </div>
                            </SelectItem>
                            <SelectItem value="em progresso">
                              <div className="flex items-center gap-2">
                                <PlayCircle className="w-4 h-4 text-blue-500" />
                                Em progresso
                              </div>
                            </SelectItem>
                            <SelectItem value="completada">
                              <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                Completada
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Current Status Badge and Creation Date */}
                      <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400 mt-4 md:mt-0">
                        {task.created_at && (
                          <>
                            <Calendar className="w-5 h-5 ml-2" />{" "}
                            {/* Added ml-2 for spacing */}
                            <div>
                              <p className="text-sm font-medium">Criada em</p>
                              <p className="text-sm">
                                {new Date(task.created_at).toLocaleDateString(
                                  "pt-BR",
                                  {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
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
                <div className="space-y-3">
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Adicione um comentário sobre esta tarefa..."
                    className="min-h-24"
                    disabled={isAddingComment}
                  />
                  <div className="flex justify-end">
                    <Button
                      onClick={async () => {
                        await handleAddComment({
                          id,
                          comment,
                          setComment,
                          setIsAddingComment,
                          setTask,
                        });
                      }}
                      disabled={!comment.trim() || isAddingComment}
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                    >
                      {isAddingComment ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      ) : (
                        <Send className="w-4 h-4 mr-2" />
                      )}
                      {isAddingComment
                        ? "Adicionando..."
                        : "Adicionar Comentário"}
                    </Button>
                  </div>
                </div>

                {/* Comments List */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {(task.comments ?? []).length > 0 ? (
                    (task.comments ?? []).map((c, i) => (
                      <Card
                        key={i}
                        className="bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-gray-700"
                      >
                        <CardContent className="p-4">
                          <p className="text-gray-900 dark:text-white mb-2 leading-relaxed">
                            {c.text}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(c.created_at).toLocaleDateString(
                              "pt-BR",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
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
                {Array.isArray(task.tags) && task.tags.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Tags atuais:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {task.tags.map((t, i) => (
                        <Badge
                          key={i}
                          variant="outline"
                          className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800 group hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors"
                        >
                          <Hash className="w-3 h-3 mr-1" />
                          {t}
                          <button
                            onClick={() =>
                              handleRemoveTag(id, t, task, updateTask, setTask)
                            }
                            className="ml-2 hover:text-red-600 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add Tag */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Adicionar tag:
                  </h4>
                  <Select
                    onValueChange={async (value) => {
                      try {
                        await addTagToTask(task._id, value);
                        const res = await fetch(
                          `http://127.0.0.1:8000/tarefas/${task._id}`
                        );
                        if (res.ok) {
                          const updated = await res.json();
                          setTask(updated);
                        }
                        toast.success("Tag adicionada com sucesso!");
                      } catch (error) {
                        toast.error("Erro ao adicionar tag");
                      }
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <div className="flex items-center">
                        <Plus className="w-4 h-4 mr-2" />
                        <SelectValue placeholder="Selecionar tag..." />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {tags
                        .filter((tag) => !task.tags?.includes(tag.nome))
                        .map((tag) => (
                          <SelectItem key={tag._id} value={tag.nome}>
                            <div className="flex items-center gap-2">
                              <Hash className="w-3 h-3" />
                              {tag.nome}
                            </div>
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>

                  {tags.filter((tag) => !task.tags?.includes(tag.nome))
                    .length === 0 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">
                      {tags.length === 0
                        ? "Nenhuma tag disponível. Crie tags primeiro."
                        : "Todas as tags disponíveis já foram adicionadas"}
                    </p>
                  )}

                  {tags.length === 0 && (
                    <Link href="/tags" className="block">
                      <Button variant="outline" className="w-full">
                        <Plus className="w-4 h-4 mr-2" />
                        Criar nova tag
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Task Statistics */}
            <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">
                  Estatísticas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {task.comments?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Comentários
                    </div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {task.tags?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Tags
                    </div>
                  </div>
                </div>

                {task.created_at && (
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Dias desde criação
                    </div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white">
                      {Math.floor(
                        (new Date().getTime() -
                          new Date(task.created_at).getTime()) /
                          (1000 * 3600 * 24)
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">
                  Ações Rápidas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/tasks" className="block">
                  <Button
                    variant="outline"
                    className="w-full justify-start hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Voltar para Tarefas
                  </Button>
                </Link>
                <Link href="/" className="block">
                  <Button
                    variant="outline"
                    className="w-full justify-start hover:bg-green-50 dark:hover:bg-green-900/20"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nova Tarefa
                  </Button>
                </Link>
                <Link href="/tags" className="block">
                  <Button
                    variant="outline"
                    className="w-full justify-start hover:bg-purple-50 dark:hover:bg-purple-900/20"
                  >
                    <Tag className="w-4 h-4 mr-2" />
                    Gerenciar Tags
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
