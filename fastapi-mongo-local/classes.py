from pydantic import BaseModel, Field;
from datetime import datetime;

class Tarefa(BaseModel):
    titulo: str
    desc: str
    status: str = Field(default="pendente")
    created_at: datetime = Field(default_factory=datetime.now)

class Tag(BaseModel):
    nome: str