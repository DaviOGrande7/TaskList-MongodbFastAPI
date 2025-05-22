# Task List com FastAPI + MongoDB + Next.js

Projeto fullstack para gerenciamento de tarefas com tags e comentários. Desenvolvido com:

- FastAPI (Python + MongoDB)
- Next.js + TypeScript + ShadCN (interface)
- Comunicação via REST API (localhost)

---

## 🐍 FastAPI

### 📁 Caminho:
cd fastapi-mongo-local

### ▶️ Rodando o banco de dados localmente

1. Clone o repositório e entre na pasta fastapi-mongo-local
2. Crie e ative o ambiente virtual:

```bash
python3 -m venv venv
source venv/bin/activate
```

3. Instale as dependências:

```bash
pip install fastapi motor "uvicorn[standard]" pydantic
```

4. Inicie o serviço do MongoDB:

```bash
sudo systemctl start mongod
```

5. Rode o servidor FastAPI:

```bash
uvicorn main:app --reload
```

A API estará em: http://127.0.0.1:8000  
Swagger UI: http://127.0.0.1:8000/docs

---

## ⚛️ Next.js + ShadCN

### 📁 Caminho:
tasklist-mongodb

### ▶️ Rodando o frontend localmente

1. Entre na pasta tasklist-mongodb
2. Instale as dependências:

```bash
npm install
```

3. Rode o projeto:

```bash
npm run dev
```

A aplicação estará em: http://localhost:3000

---

## 🛠 Funcionalidades

- Cadastro de tarefas com título, descrição e status
- Adição de comentários em cada tarefa
- Tags reutilizáveis atribuídas às tarefas
- Dashboard com estatísticas
- Tela de gerenciamento de tags