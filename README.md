# Sistema de Moeda Estudantil

Sistema MVC para reconhecimento do mérito estudantil via moeda virtual.

| Campo | Valor |
|-------|-------|
| Disciplina | Projeto de Software |
| Período | 2º Semestre/2026 |
| Professora | Milena Menezes Adão |
| Instituição | PUC Minas — Engenharia de Software |

## Stack (Sprint 2+)

| Camada | Tecnologia |
|--------|------------|
| Backend | NestJS (TypeScript) |
| ORM | Prisma |
| Banco (dev) | SQLite |
| Banco (alvo) | PostgreSQL |
| Frontend | React + Vite + TypeScript |

## Estrutura

```
docs/sprint1/     Modelagem UML
docs/sprint2/     MER + estratégia de persistência
backend/          API NestJS + Prisma
frontend/         React (CRUDs)
```

## Como executar

### 1. Backend

```bash
cd backend
npm install
npx prisma migrate dev
npx prisma db seed
npm run start:dev
```

API: http://localhost:3000

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

App: http://localhost:5173

## Endpoints Sprint 2

| Método | Rota | Descrição |
|--------|------|-----------|
| GET/POST | `/alunos` | Listar / criar aluno |
| GET/PATCH/DELETE | `/alunos/:id` | Ler / atualizar / remover |
| GET/POST | `/empresas` | Listar / criar empresa |
| GET/PATCH/DELETE | `/empresas/:id` | Ler / atualizar / remover |
| GET | `/instituicoes` | Instituições e cursos (seed) |

Seed inclui **PUC Minas**, **UFMG**, cursos e um professor pré-cadastrado (`ana.silva` / `senha123`).
