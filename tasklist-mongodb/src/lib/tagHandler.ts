import { toast } from "sonner";
import { Tag } from "@/Interfaces/TagsInterfaces";

export const handleAddTag = async (
  nome: string,
  tags: Tag[],
  setIsAdding: (b: boolean) => void,
  addTag: Function,
  setNome: Function
) => {
  if (!nome.trim()) {
    toast.error("Por favor, insira um nome para a tag");
    return;
  }

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
  } catch {
    toast.error("Erro ao adicionar tag");
  } finally {
    setIsAdding(false);
  }
};

export const handleDeleteTag = async (
  id: string,
  tagName: string,
  fetchTags: Function
) => {
  try {
    await fetch(`http://127.0.0.1:8000/tags/${id}`, {
      method: "DELETE",
    });
    await fetchTags();
    toast.success(`Tag "${tagName}" removida com sucesso!`);
  } catch {
    toast.error("Erro ao remover tag");
  }
};

export const getTagUsageCount = (tagName: string, tasks: any[]) => {
  return tasks.filter((task) => task.tags?.includes(tagName)).length;
};

export const handleKeyPressTag = (
  e: React.KeyboardEvent,
  handleAdd: Function
) => {
  if (e.key === "Enter") {
    handleAdd();
  }
};
