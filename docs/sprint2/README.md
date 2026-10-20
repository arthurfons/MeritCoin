# Lab03S02 — Sprint 2: Persistência e Funcionalidades Iniciais

## Entregáveis

| # | Artefato | Local |
|---|----------|--------|
| 1 | Modelo Entidade-Relacionamento (MER) | [mer.md](mer.md) · [diagramas/mer.puml](diagramas/mer.puml) |
| 2 | Estratégia de acesso ao banco | [estrategia-persistencia.md](estrategia-persistencia.md) |
| 3 | CRUD de Aluno (front + back) | `backend/` + `frontend/` |
| 4 | CRUD de Empresa Parceira (front + back) | `backend/` + `frontend/` |

## Stack escolhida

| Camada | Tecnologia |
|--------|------------|
| Backend | NestJS (TypeScript) |
| ORM | **Prisma** |
| Banco (dev) | SQLite (`file:./dev.db`) |
| Banco (alvo/produção) | PostgreSQL (mesmo schema Prisma) |
| Frontend | React + Vite + TypeScript |

## Como executar

Ver [README.md](../../README.md) na raiz do repositório.
