export const filteredTasks = (
  tasks: any[],
  searchTerm: string,
  statusFilter: string
) => {
  return tasks.filter((task) => {
    const matchesSearch =
      task.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.desc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
};

export const filteredTags = (tags: any[], searchTerm: string) => {
  return tags.filter((tag) =>
    tag.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );
};
