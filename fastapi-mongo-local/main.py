# pip install fastapi motor uvicorn

from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from datetime import datetime

from classes import Tarefa, Tag;

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = AsyncIOMotorClient("mongodb://localhost:27017")
db = client["lista_tarefas"]

colecao = db["tarefas"]
colecao_tags = db["tags"]

# --- TAGS ---

# cria/lê coleção em /tags
@app.get("/tags")
async def list_tags():
    tags = []
    async for tag in colecao_tags.find():
        tag["_id"] = str(tag["_id"])
        tags.append(tag)
    return tags

# cria metodo de post de tags
@app.post("/tags")
async def create_tag(tag: Tag):
    if await colecao_tags.find_one({"nome": tag.nome}):
        raise HTTPException(status_code=400, detail="Tag já existe")
    resultado = await colecao_tags.insert_one(tag.model_dump())
    return {"id": str(resultado.inserted_id)}

# cria metodo de deleção de tags
@app.delete("/tags/{id}")
async def delete_tag(id: str):
    result = await colecao_tags.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Tag não encontrada")
    return {"msg": "Tag deletada"}

# --- TAREFAS ---

# cria/lê coleção em /tarefas
@app.get("/tarefas")
async def list_tasks():
    tarefas = []
    async for tarefa in colecao.find():
        tarefa["_id"] = str(tarefa["_id"])
        if "created_at" in tarefa:
            tarefa["created_at"] = tarefa["created_at"].isoformat()
        tarefas.append(tarefa)
    return tarefas

# cria metodo de post de tarefas
@app.post("/tarefas")
async def create_task(tarefa: Tarefa):
    tarefa_dict = tarefa.model_dump()
    resultado = await colecao.insert_one(tarefa_dict)
    return {"id": str(resultado.inserted_id)}

# cria um endereço dedicado para pegar uma tarefa
@app.get("/tarefas/{id}")
async def get_task(id: str):
    try:
        tarefa = await colecao.find_one({"_id": ObjectId(id)})
    except:
        raise HTTPException(status_code=400, detail="ID inválido")
    if not tarefa:
        raise HTTPException(status_code=404, detail="Tarefa não encontrada")
    tarefa["_id"] = str(tarefa["_id"])
    if "created_at" in tarefa:
        tarefa["created_at"] = tarefa["created_at"].isoformat()
    return tarefa

# cria metodo de update de tarefas
@app.put("/tarefas/{id}")
async def update_task(id: str, updates: dict = Body(...)):
    result = await colecao.update_one(
        {"_id": ObjectId(id)},
        {"$set": updates}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Tarefa não encontrada ou sem mudanças")
    return {"msg": "Tarefa atualizada"}

# cria metodo de deleção de tarefas
@app.delete("/tarefas/{id}")
async def delete_task(id: str):
    result = await colecao.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Tarefa não encontrada")
    return {"msg": "Tarefa deletada"}

# cria metodo que adiciona comentario na tarefa
@app.post("/tarefas/{id}/comments")
async def add_comment(id: str, comment: dict):
    await colecao.update_one(
        {"_id": ObjectId(id)},
        {"$push": {"comments": {"text": comment["text"], "created_at": datetime.now()}}}
    )
    return {"msg": "Comentário adicionado"}

# cria metodo que adiciona tag na tarefa
@app.post("/tarefas/{id}/tags")
async def add_tag_to_task(id: str, tag: dict):
    await colecao.update_one(
        {"_id": ObjectId(id)},
        {"$addToSet": {"tags": tag["tag"]}}
    )
    return {"msg": "Tag adicionada"}