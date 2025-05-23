export interface Tag {
  _id: string;
  nome: string;
}

export interface TagsContextData {
  tags: Tag[];
  fetchTags: () => Promise<void>;
  addTag: (nome: string) => Promise<void>;
  addTagToTask: (taskId: string, tag: string) => Promise<void>;
}
