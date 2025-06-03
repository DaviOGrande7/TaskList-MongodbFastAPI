from datetime import datetime, timedelta
import redis.asyncio as redis
from motor.motor_asyncio import AsyncIOMotorCollection

async def atualizar_metricas_redis_single_user(colecao_tarefas: AsyncIOMotorCollection, redis_pool: redis.Redis,):
    status_counts = {"pendente": 0, "em progresso": 0, "completada": 0}
    tags_count = {}
    tarefas_concluidas_por_dia = {}
    tarefas_criadas_hoje = 0
    
    hoje = datetime.now().strftime("%Y-%m-%d")
    
    cursor = colecao_tarefas.find({})
    total_tarefas = 0
    
    async for tarefa in cursor:
        total_tarefas += 1
        
        # contagem status
        status = tarefa.get("status", "pendente")
        status_counts[status] = status_counts.get(status, 0) + 1
        
        # contagem tags
        for tag in tarefa.get("tags", []):
            tags_count[tag] = tags_count.get(tag, 0) + 1
        
        # datas
        if "created_at" in tarefa:
            data_criacao = tarefa["created_at"]
            
            if isinstance(data_criacao, str):
                try:
                    data_criacao = datetime.fromisoformat(data_criacao.replace('Z', '+00:00'))
                except:
                    data_criacao = datetime.fromisoformat(data_criacao)
            
            data_str = data_criacao.strftime("%Y-%m-%d")
            
            # Tarefas criadas hoje
            if data_str == hoje:
                tarefas_criadas_hoje += 1
            
            # Tarefas concluídas por dia (apenas as completadas)
            if status == "completada":
                tarefas_concluidas_por_dia[data_str] = tarefas_concluidas_por_dia.get(data_str, 0) + 1
    
    # atualizar
    
    #Status das tarefas
    for status, count in status_counts.items():
        await redis_pool.set(f"user:default:tasks:status:{status}", count)
    
    #Tarefas concluídas
    keys_to_delete = []
    for i in range(30):
        dia = (datetime.now() - timedelta(days=i)).strftime("%Y-%m-%d")
        key = f"user:default:tasks:completed:{dia}"
        keys_to_delete.append(key)
    
    if keys_to_delete:
        await redis_pool.delete(*keys_to_delete)
    
    for data, count in tarefas_concluidas_por_dia.items():
        await redis_pool.set(f"user:default:tasks:completed:{data}", count)
    
    # 3. Top tags (usando sorted set)
    zset_key = f"user:default:tags:top"
    await redis_pool.delete(zset_key)
    
    if tags_count:
        for tag, score in tags_count.items():
            await redis_pool.zadd(zset_key, {tag: score})
    
    # 4. Métricas de produtividade
    # Calcular tempo médio de conclusão (simulado - pode ser melhorado)
    tarefas_concluidas = status_counts.get("completada", 0)
    
    # Taxa de conclusão semanal (últimos 7 dias)
    tarefas_concluidas_semana = 0
    for i in range(7):
        dia = (datetime.now() - timedelta(days=i)).strftime("%Y-%m-%d")
        tarefas_concluidas_semana += tarefas_concluidas_por_dia.get(dia, 0)
    
    # Calcular taxa de conclusão semanal
    tarefas_total_semana = min(total_tarefas, tarefas_concluidas_semana + status_counts.get("pendente", 0) + status_counts.get("em progresso", 0))
    taxa_conclusao_semanal = (tarefas_concluidas_semana / tarefas_total_semana * 100) if tarefas_total_semana > 0 else 0
    
    # Tempo médio de conclusão (exemplo: baseado no número de tarefas)
    tempo_medio_conclusao = 2.5 if tarefas_concluidas > 0 else 0
    
    productivity_key = f"user:default:stats:productivity"
    await redis_pool.hset(productivity_key, mapping={
        "tempo_medio_conclusao": tempo_medio_conclusao,
        "tarefas_criadas_hoje": tarefas_criadas_hoje,
        "taxa_conclusao_semanal": taxa_conclusao_semanal,
    })
    
    print(f"✅ Métricas atualizadas: {total_tarefas} tarefas processadas")
    print(f"   - Status: {status_counts}")
    print(f"   - Criadas hoje: {tarefas_criadas_hoje}")
    print(f"   - Tags: {len(tags_count)} diferentes")
    print(f"   - Taxa semanal: {taxa_conclusao_semanal:.1f}%")


async def inicializar_metricas_redis(
    colecao_tarefas: AsyncIOMotorCollection,
    redis_pool: redis.Redis,
):
    """Inicializa as métricas do Redis na primeira execução"""
    print("🔄 Inicializando métricas do Redis...")
    exists = await redis_pool.exists("user:default:tasks:status:pendente")
    
    if not exists:
        print("📊 Primeira execução - calculando métricas iniciais...")
        await atualizar_metricas_redis_single_user(colecao_tarefas, redis_pool)
    else:
        print("✅ Métricas já existem no Redis")


async def limpar_metricas_redis(redis_pool: redis.Redis):
    """Limpa todas as métricas do Redis (para debug/reset)"""
    
    keys_pattern = [
        "user:default:tasks:status:*",
        "user:default:tasks:completed:*", 
        "user:default:tags:top",
        "user:default:stats:productivity"
    ]
    
    for pattern in keys_pattern:
        keys = await redis_pool.keys(pattern)
        if keys:
            await redis_pool.delete(*keys)
    
    print("🧹 Métricas do Redis limpas!")