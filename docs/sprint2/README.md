# Lab03S02 — Banco de Dados e CRUD Inicial

## Entrega

| Item do enunciado | Artefato |
|-------------------|----------|
| Modelo ER | [mer.md](mer.md) · [diagramas/mer.puml](diagramas/mer.puml) |
| Estratégia de acesso ao BD | [estrategia-persistencia.md](estrategia-persistencia.md) |
| Padrões utilizados | [PADROES.md](PADROES.md) · README na raiz |
| CRUD Aluno (API + UI) | `backend/src/students` · `auth/register/student` · `frontend/.../RegisterStudentPage` · `StudentsPage` |
| CRUD Empresa (API + UI) | `backend/src/companies` · `auth/register/company` · `frontend/.../RegisterCompanyPage` · `CompaniesPage` |

## Como validar os CRUDs

1. Subir PostgreSQL (`docker compose up -d` **ou** `node backend/scripts/start-embedded-pg.mjs`)
2. `cd backend && npm i && npx prisma migrate dev && npx prisma db seed && npm run start:dev`
3. `cd frontend && npm i && npm run dev`
4. Cadastrar aluno em `/cadastro/aluno` e empresa em `/cadastro/empresa`
5. Login admin `admin@demo.meritcoin.local` / `Senha@123` → listar/desativar em `/app/alunos` e `/app/empresas`
6. Swagger: http://localhost:3000/docs

## Contas demo

Senha: `Senha@123` — `aluno@`, `professor@`, `empresa@`, `escola@`, `admin@` + `demo.meritcoin.local`
