# Lab03S02 — Sprint 2: Persistência e CRUDs iniciais

## Status: concluída (base funcional)

| Entregável | Situação |
|------------|----------|
| MER | [mer.md](mer.md) · [diagramas/mer.puml](diagramas/mer.puml) |
| Estratégia de persistência | [estrategia-persistencia.md](estrategia-persistencia.md) |
| PostgreSQL + Prisma Migrate | `backend/prisma` + `docker-compose.yml` |
| Seed | `backend/prisma/seed.ts` |
| CRUD Aluno (API + UI) | `/api/v1/auth/register/student`, `/students` + telas React |
| CRUD Empresa (API + UI) | `/api/v1/auth/register/company`, `/companies` + telas React |
| Auth JWT + RBAC | `AuthModule` |
| Swagger | http://localhost:3000/docs |
| Testes | `backend/src/auth/auth.service.spec.ts` |

## Como validar em aula

1. Subir PostgreSQL (`docker compose up -d` **ou** `node backend/scripts/start-embedded-pg.mjs`)
2. `cd backend && npx prisma migrate dev && npx prisma db seed && npm run start:dev`
3. `cd frontend && npm run dev`
4. Login com `admin@demo.meritcoin.local` / `Senha@123`
5. Listar alunos e empresas; cadastrar novos pelos formulários públicos

## Fora do escopo desta sprint (Sprint 3)

Transferência de moedas, alocação semestral, vantagens, cupons e e-mails.
