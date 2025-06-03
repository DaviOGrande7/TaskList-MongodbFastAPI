from fastapi import HTTPException, Body
from bson import ObjectId
from datetime import datetime
from typing import List
from classes import Tarefa

async def list_tasks(colecao) -> List[dict]:
    tarefas = []
    async for tarefa in colecao.find():
        tarefa["_id"] = str(tarefa["_id"])
        if "created_at" in tarefa:
            tarefa["created_at"] = tarefa["created_at"].isoformat()
        tarefas.append(tarefa)
    return tarefas

async def create_task(colecao, tarefa: Tarefa) -> dict:
    tarefa_dict = tarefa.model_dump()
    resultado = await colecao.insert_one(tarefa_dict)
    return {"id": str(resultado.inserted_id)}

async def get_task(colecao, id: str) -> dict:
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

async def update_task(colecao, id: str, updates: dict = Body(...)) -> dict:
    result = await colecao.update_one(
        {"_id": ObjectId(id)},
        {"$set": updates}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Tarefa não encontrada ou sem mudanças")
    return {"msg": "Tarefa atualizada"}

async def delete_task(colecao, id: str) -> dict:
    result = await colecao.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Tarefa não encontrada")
    return {"msg": "Tarefa deletada"}

async def add_comment(colecao, id: str, comment: dict) -> dict:
    await colecao.update_one(
        {"_id": ObjectId(id)},
        {"$push": {"comments": {"text": comment["text"], "created_at": datetime.now()}}}
    )
    return {"msg": "Comentário adicionado"}

async def add_tag_to_task(colecao, id: str, tag: dict) -> dict:
    await colecao.update_one(
        {"_id": ObjectId(id)},
        {"$addToSet": {"tags": tag["tag"]}}
    )
    return {"msg": "Tag adicionada"}
