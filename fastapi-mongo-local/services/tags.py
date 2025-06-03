from fastapi import HTTPException
from bson import ObjectId
from typing import List
from classes import Tag

async def list_tags(colecao_tags) -> List[dict]:
    tags = []
    async for tag in colecao_tags.find():
        tag["_id"] = str(tag["_id"])
        tags.append(tag)
    return tags

async def create_tag(colecao_tags, tag: Tag) -> dict:
    if await colecao_tags.find_one({"nome": tag.nome}):
        raise HTTPException(status_code=400, detail="Tag já existe")
    resultado = await colecao_tags.insert_one(tag.model_dump())
    return {"id": str(resultado.inserted_id)}

async def delete_tag(colecao_tags, id: str) -> dict:
    result = await colecao_tags.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Tag não encontrada")
    return {"msg": "Tag deletada"}
