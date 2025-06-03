from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import redis.asyncio as redis

from classes import Tarefa, Tag
from services import tags, tasks, redis_metrics

# - Configuração do FastAPI
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# - Conexão do MongoDB
client = AsyncIOMotorClient("mongodb://localhost:27017")
db = client["lista_tarefas"]

colecao = db["tarefas"]
colecao_tags = db["tags"]

# - Conexão do Redis
REDIS_URL = "redis://localhost:6379/0"
redis_pool = None 

@app.on_event("startup")
async def startup_event():
    global redis_pool
    redis_pool = redis.from_url(REDIS_URL, encoding="utf-8", decode_responses=True)
    try:
        await redis_pool.ping()
        print("✅ Conectado ao Redis com sucesso!")
        
        # Inicializar métricas na primeira execução
        await redis_metrics.inicializar_metricas_redis(colecao, redis_pool)
        
    except Exception as e:
        print(f"❌ Erro ao conectar ao Redis: {e}")

@app.on_event("shutdown")
async def shutdown_event():
    if redis_pool:
        await redis_pool.close()
        print("🔌 Conexão com o Redis fechada.")

# === ROUTES TAGS ===
@app.get("/tags")
async def list_tags():
    return await tags.list_tags(colecao_tags)

@app.post("/tags")
async def create_tag(tag: Tag):
    result = await tags.create_tag(colecao_tags, tag)
    # Tags não afetam métricas de tarefas diretamente
    return result

@app.delete("/tags/{id}")
async def delete_tag(id: str):
    result = await tags.delete_tag(colecao_tags, id)
    # Atualizar métricas porque tags podem ter sido removidas das tarefas
    await redis_metrics.atualizar_metricas_redis_single_user(colecao, redis_pool)
    return result

# === ROUTES TAREFAS ===
@app.get("/tarefas")
async def list_tasks():
    return await tasks.list_tasks(colecao)

@app.post("/tarefas")
async def create_task(tarefa: Tarefa):
    """Criar nova tarefa + atualizar métricas"""
    result = await tasks.create_task(colecao, tarefa)
    print("📝 Nova tarefa criada - atualizando métricas...")
    await redis_metrics.atualizar_metricas_redis_single_user(colecao, redis_pool)
    return result

@app.get("/tarefas/{id}")
async def get_task(id: str):
    return await tasks.get_task(colecao, id)

@app.put("/tarefas/{id}")
async def update_task(id: str, updates: dict = Body(...)):
    """Atualizar tarefa + atualizar métricas"""
    result = await tasks.update_task(colecao, id, updates)
    print(f"✏️ Tarefa {id} atualizada - atualizando métricas...")
    await redis_metrics.atualizar_metricas_redis_single_user(colecao, redis_pool)
    return result

@app.delete("/tarefas/{id}")
async def delete_task(id: str):
    """Deletar tarefa + atualizar métricas"""
    result = await tasks.delete_task(colecao, id)
    print(f"🗑️ Tarefa {id} deletada - atualizando métricas...")
    await redis_metrics.atualizar_metricas_redis_single_user(colecao, redis_pool)
    return result

@app.post("/tarefas/{id}/comments")
async def add_comment(id: str, comment: dict):
    """Adicionar comentário + atualizar métricas"""
    result = await tasks.add_comment(colecao, id, comment)
    print(f"💬 Comentário adicionado à tarefa {id} - atualizando métricas...")
    await redis_metrics.atualizar_metricas_redis_single_user(colecao, redis_pool)
    return result

@app.post("/tarefas/{id}/tags")
async def add_tag_to_task(id: str, tag: dict):
    """Adicionar tag à tarefa + atualizar métricas"""
    result = await tasks.add_tag_to_task(colecao, id, tag)
    print(f"🏷️ Tag adicionada à tarefa {id} - atualizando métricas...")
    await redis_metrics.atualizar_metricas_redis_single_user(colecao, redis_pool)
    return result

# === ROUTES MÉTRICAS ===
@app.get("/metricas/status-tarefas")
async def obter_status_tarefas():
    """Obter contagem de tarefas por status"""
    chaves_status = ["pendente", "em progresso", "completada"]
    resultado = {}
    for status in chaves_status:
        val = await redis_pool.get(f"user:default:tasks:status:{status}")
        resultado[status] = int(val) if val else 0
    return resultado

@app.get("/metricas/tarefas-concluidas-por-dia")
async def obter_tarefas_concluidas_por_dia():
    """Obter tarefas concluídas por dia (últimos 7 dias)"""
    from datetime import datetime, timedelta
    resultado = {}
    hoje = datetime.now()
    
    for i in range(7):
        dia = (hoje - timedelta(days=i)).strftime("%Y-%m-%d")
        val = await redis_pool.get(f"user:default:tasks:completed:{dia}")
        resultado[dia] = int(val) if val else 0
    
    return resultado

@app.get("/metricas/top-tags")
async def obter_top_tags():
    """Obter top 10 tags mais utilizadas"""
    chave_zset = "user:default:tags:top"
    tags_raw = await redis_pool.zrevrange(chave_zset, 0, 9, withscores=True)
    return [{"tag": tag, "contagem": int(score)} for tag, score in tags_raw]

@app.get("/metricas/produtividade")
async def obter_metricas_produtividade():
    """Obter métricas de produtividade"""
    chave_produtividade = "user:default:stats:productivity"
    dados = await redis_pool.hgetall(chave_produtividade) 
    
    return {
        "tempo_medio_conclusao": float(dados.get("tempo_medio_conclusao", 0)),
        "tarefas_criadas_hoje": int(dados.get("tarefas_criadas_hoje", 0)),
        "taxa_conclusao_semanal": float(dados.get("taxa_conclusao_semanal", 0)),
    }
