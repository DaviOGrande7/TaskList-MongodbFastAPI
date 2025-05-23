"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Tag, TagsContextData } from "@/Interfaces/TagsInterfaces";

const TagsContext = createContext<TagsContextData | undefined>(undefined);

export const TagsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tags, setTags] = useState<Tag[]>([]);

  const fetchTags = async () => {
    const res = await fetch("http://127.0.0.1:8000/tags");
    const data = await res.json();
    setTags(data);
  };

  const addTag = async (nome: string) => {
    await fetch("http://127.0.0.1:8000/tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome }),
    });
    await fetchTags();
  };

  const addTagToTask = async (taskId: string, tag: string) => {
    await fetch(`http://127.0.0.1:8000/tarefas/${taskId}/tags`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tag }),
    });
  };

  useEffect(() => {
    fetchTags();
  }, []);

  return (
    <TagsContext.Provider value={{ tags, fetchTags, addTag, addTagToTask }}>
      {children}
    </TagsContext.Provider>
  );
};

export const useTags = () => {
  const context = useContext(TagsContext);
  if (!context) throw new Error("useTags must be used within a TagsProvider");
  return context;
};
