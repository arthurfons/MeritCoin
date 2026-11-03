# MeritCoin — Sistema de Moeda Estudantil

**PUC Minas · Projeto de Software · Lab03 + Lab04**

Aplicação para reconhecimento do mérito estudantil com moeda virtual.

- GitHub: https://github.com/arthurfons/MeritCoin

---

## Padrões utilizados

| Padrão | Aplicação |
|--------|-----------|
| **MVC** | NestJS Controllers + Services + React (View) |
| **ORM** | **Prisma** + **PostgreSQL** |
| **REST / Client-Server** | API `/api/v1` |
| **DTO + Validação** | `class-validator` |
| **JWT + RBAC** | ALUNO, PROFESSOR, EMPRESA, ESCOLA, ADMIN |
| **SPA** | React + Vite |
| **Outbox** | `EmailOutbox` (SMTP opcional) |
| **GRASP** | Information Expert, High Cohesion, Indirection — ver `docs/sprint4/s03/GRASP.md` |

Detalhes: [`docs/sprint2/PADROES.md`](docs/sprint2/PADROES.md) · MER: [`docs/sprint2/mer.md`](docs/sprint2/mer.md)

---

## Entregas

| Sprint | Conteúdo | Docs |
|--------|----------|------|
| Lab03S01 | Casos de uso, histórias, classes, componentes | `docs/sprint1/` |
| Lab03S02 | MER + ORM + CRUD aluno/empresa | `docs/sprint2/` |
| Lab03S03 | Moedas, extrato, vantagens, cupom, e-mails | `docs/sprint3/` |
| **Lab04S01** | Sequências + Interaction Overview | `docs/sprint4/s01/` |
| **Lab04S02** | Implantação + Vercel/Render | `docs/sprint4/s02/` |
| **Lab04S03** | Análise crítica + GRASP | `docs/sprint4/s03/` |

---

## Stack

| Camada | Tecnologia |
|--------|------------|
| Backend | NestJS + TypeScript |
| ORM / BD | Prisma + PostgreSQL |
| Auth | JWT + bcrypt + RBAC |
| Frontend | React + Vite + TanStack Query + RHF/Zod + Tailwind |
| Cloud | Vercel (front) + Render (API/DB) |

---

## Como executar (local)

```bash
# Postgres: docker compose up -d   OU   cd backend && node scripts/start-embedded-pg.mjs
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

cd backend && npm i && npx prisma migrate dev && npx prisma db seed && npm run start:dev
cd frontend && npm i && npm run dev
```

| Serviço | URL |
|---------|-----|
| Front | http://127.0.0.1:5173 |
| API | http://127.0.0.1:3000/api/v1 |
| Swagger | http://127.0.0.1:3000/docs |

Senha demo: `Senha@123` — `aluno@` / `professor@` / `empresa@` / `escola@` / `admin@` + `demo.meritcoin.local`

---

## Deploy (Lab04S02)

Guia completo: [`docs/sprint4/s02/DEPLOY.md`](docs/sprint4/s02/DEPLOY.md)

Resumo:
1. Postgres na Render/Neon → `DATABASE_URL`
2. API: blueprint [`render.yaml`](render.yaml) ou Docker [`backend/Dockerfile`](backend/Dockerfile)
3. Front: Vercel com root `frontend`, env `VITE_API_URL=https://<api>/api/v1`
4. `CORS_ORIGIN` na API = URL da Vercel

Infra no repo: `render.yaml`, `backend/Dockerfile`, `frontend/vercel.json`

---

## Estrutura do repositório

```
MeritCoin/
├── README.md
├── docker-compose.yml      # Postgres local
├── render.yaml             # Blueprint Render (Lab04S02)
├── backend/                # NestJS + Prisma
├── frontend/               # React + Vite (+ vercel.json)
└── docs/
    ├── sprint1/            # UML Lab03S01
    ├── sprint2/            # MER + padrões Lab03S02
    ├── sprint3/            # Regras Lab03S03
    └── sprint4/            # Lab04 (s01 sequências · s02 deploy · s03 GRASP)
```

## Identidade visual

Preto `#000000` · cinza `#A3A3A3` · branco `#FFFFFF` · roxo `#800080`
