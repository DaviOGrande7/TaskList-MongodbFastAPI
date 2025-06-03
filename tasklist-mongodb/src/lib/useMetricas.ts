import { useEffect, useState } from "react";

export function useMetricas() {
  const [statusTarefas, setStatusTarefas] = useState<Record<
    string,
    number
  > | null>(null);

  const [tarefasConcluidasPorDia, setTarefasConcluidasPorDia] = useState<Record<
    string,
    number
  > | null>(null);

  const [topTags, setTopTags] = useState<
    { tag: string; contagem: number }[] | null
  >(null);

  const [produtividade, setProdutividade] = useState<{
    tempo_medio_conclusao: number;
    tarefas_criadas_hoje: number;
    taxa_conclusao_semanal: number;
  } | null>(null);

  useEffect(() => {
    async function buscarMetricas() {
      const resStatus = await fetch(
        "http://127.0.0.1:8000/metricas/status-tarefas"
      );
      setStatusTarefas(await resStatus.json());

      const resConcluidas = await fetch(
        "http://127.0.0.1:8000/metricas/tarefas-concluidas-por-dia"
      );
      setTarefasConcluidasPorDia(await resConcluidas.json());

      const resTags = await fetch("http://127.0.0.1:8000/metricas/top-tags");
      setTopTags(await resTags.json());

      const resProd = await fetch(
        "http://127.0.0.1:8000/metricas/produtividade"
      );
      setProdutividade(await resProd.json());
    }

    buscarMetricas();
  }, []);

  return { statusTarefas, tarefasConcluidasPorDia, topTags, produtividade };
}
