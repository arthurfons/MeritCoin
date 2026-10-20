# Estratégia de Persistência

## Decisão

Adotamos o **padrão ORM** com **Prisma**, integrado ao backend **NestJS**.

| Aspecto | Escolha |
|---------|---------|
| Padrão | ORM (Object-Relational Mapping) |
| Ferramenta | Prisma |
| Acesso no NestJS | `PrismaService` (injetável) + repositórios via services |
| Banco (desenvolvimento) | SQLite — zero instalação, ideal para validação em aula |
| Banco (produção / alvo) | PostgreSQL — mesmo `schema.prisma`, só altera `provider` e `DATABASE_URL` |

## Por que ORM (Prisma) e não DAO manual?

1. Alinha o MER ao código via `schema.prisma` (fonte única da verdade).
2. Migrations versionadas (`prisma migrate`).
3. Tipagem TypeScript gerada automaticamente (menos erro nos CRUDs).
4. Troca SQLite ↔ PostgreSQL sem reescrever SQL.
5. Encaixa na camada de Persistência do diagrama de componentes (Sprint 1).

## Mapeamento MVC ↔ persistência

```
View (React)  →  Controller (NestJS Controller)
                     ↓
                 Service (regras / validação)
                     ↓
              PrismaService (ORM)
                     ↓
                  Banco (SQLite/PostgreSQL)
```

O `PrismaService` ocupa o papel da camada de persistência (equivalente a DAOs/repositórios), mantendo Controllers e Services livres de SQL.

## Estrutura no repositório

```
backend/
  prisma/
    schema.prisma      ← MER implementado
    seed.ts            ← instituições e cursos pré-cadastrados
  src/
    prisma/            ← PrismaModule + PrismaService
    aluno/             ← CRUD Aluno
    empresa/           ← CRUD Empresa Parceira
    instituicao/       ← listagens auxiliares
```

## Operações CRUD (Sprint 2)

| Recurso | Create | Read | Update | Delete |
|---------|--------|------|--------|--------|
| Aluno | POST `/alunos` | GET `/alunos`, GET `/alunos/:id` | PATCH `/alunos/:id` | DELETE `/alunos/:id` |
| Empresa | POST `/empresas` | GET `/empresas`, GET `/empresas/:id` | PATCH `/empresas/:id` | DELETE `/empresas/:id` |

Senhas são armazenadas apenas como **hash** (bcrypt), nunca em texto puro.
