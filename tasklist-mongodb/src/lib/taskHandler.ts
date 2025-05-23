import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const handleStatusChange = async (
  id: string,
  newStatus: string,
  updateTask: Function,
  setTask: Function,
  setIsUpdatingStatus: Function
) => {
  setIsUpdatingStatus(true);
  try {
    await updateTask(id, { status: newStatus });
    setTask((prev: any) => (prev ? { ...prev, status: newStatus } : prev));
    toast.success("Status atualizado!");
  } catch {
    toast.error("Erro ao atualizar status");
  } finally {
    setIsUpdatingStatus(false);
  }
};

export const handleSaveEdit = async (
  id: string,
  editedTitle: string,
  editedDesc: string,
  updateTask: Function,
  setTask: Function,
  setIsEditing: Function
) => {
  if (!editedTitle.trim()) {
    toast.error("O título não pode estar vazio");
    return;
  }

  try {
    await updateTask(id, {
      titulo: editedTitle.trim(),
      desc: editedDesc.trim(),
    });
    setTask((prev: any) =>
      prev
        ? { ...prev, titulo: editedTitle.trim(), desc: editedDesc.trim() }
        : null
    );
    setIsEditing(false);
    toast.success("Tarefa atualizada!");
  } catch {
    toast.error("Erro ao atualizar tarefa");
  }
};

export const handleDeleteTask = async (id: string, deleteTask: Function) => {
  const router = useRouter();
  if (
    window.confirm(
      "Tem certeza que deseja deletar esta tarefa? Esta ação não pode ser desfeita."
    )
  ) {
    try {
      await deleteTask(id);
      toast.success("Tarefa deletada com sucesso!");
      router.push("/tasks");
    } catch {
      toast.error("Erro ao deletar tarefa");
    }
  }
};

export const handleRemoveTag = async (
  id: string,
  tagToRemove: string,
  task: any,
  updateTask: Function,
  setTask: Function
) => {
  try {
    if (!task || !task.tags) {
      toast.error("Tarefa ou tags não disponíveis");
      return;
    }
    const updatedTags = task.tags.filter((tag: string) => tag !== tagToRemove);
    await updateTask(id, { tags: updatedTags });
    setTask((prev: any) => (prev ? { ...prev, tags: updatedTags } : prev));
    toast.success("Tag removida!");
  } catch {
    toast.error("Erro ao remover tag");
  }
};

export const handleSubmitTask = async (
  titulo: string,
  desc: string,
  addTask: Function,
  setTitulo: Function,
  setDesc: Function,
  setLoading: Function
) => {
  setLoading(true);
  try {
    await addTask({ titulo, desc, status: "pendente" });
    setTitulo("");
    setDesc("");
    toast.success("Tarefa criada com sucesso!");
  } catch {
    toast.error("Erro ao criar tarefa.");
  } finally {
    setLoading(false);
  }
};

interface HandleAddCommentParams {
  id: string;
  comment: string;
  setComment: (value: string) => void;
  setIsAddingComment: (value: boolean) => void;
  setTask: (task: any) => void;
}

export const handleAddComment = async ({
  id,
  comment,
  setComment,
  setIsAddingComment,
  setTask,
}: HandleAddCommentParams) => {
  if (!comment.trim()) {
    toast.error("Por favor, digite um comentário");
    return;
  }

  setIsAddingComment(true);

  try {
    const res = await fetch(`http://127.0.0.1:8000/tarefas/${id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: comment.trim() }),
    });

    if (!res.ok) {
      throw new Error("Erro ao adicionar comentário");
    }

    setComment("");
    toast.success("Comentário adicionado!");

    const taskRes = await fetch(`http://127.0.0.1:8000/tarefas/${id}`);
    if (taskRes.ok) {
      const updatedTask = await taskRes.json();
      setTask(updatedTask);
    }
  } catch (error) {
    toast.error("Erro ao adicionar comentário");
  } finally {
    setIsAddingComment(false);
  }
};
