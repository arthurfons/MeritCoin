# MeritCoin — Sistema de Moeda Estudantil

**PUC Minas · Projeto de Software · Lab03 · Sprint 3 (Lab03S03)**

Aplicação para reconhecimento do mérito estudantil com moeda virtual.

---

## Padrões utilizados

| Padrão | Aplicação |
|--------|-----------|
| **MVC** | NestJS Controllers + Services + React (View) |
| **ORM** | **Prisma** + **PostgreSQL** |
| **REST / Client-Server** | API `/api/v1` |
| **DTO + Validação** | `class-validator` |
| **JWT + RBAC** | Papéis ALUNO, PROFESSOR, EMPRESA, ESCOLA, ADMIN |
| **SPA** | React + Vite |
| **Outbox** | E-mails em `EmailOutbox` (SMTP opcional) |

Detalhes: [`docs/sprint2/PADROES.md`](docs/sprint2/PADROES.md) · MER: [`docs/sprint2/mer.md`](docs/sprint2/mer.md)

---

## Entregas por sprint

| Sprint | Conteúdo | Docs |
|--------|----------|------|
| **S01** | Modelagem (casos de uso, classes, componentes) | `docs/sprint1/` |
| **S02** | MER + ORM + CRUD Aluno/Empresa | `docs/sprint2/` |
| **S03** | Crédito semestral, transferência, extrato, vantagens, cupom, e-mails | `docs/sprint3/` |

Roteiro de apresentação: [`docs/sprint3/APRESENTACAO.md`](docs/sprint3/APRESENTACAO.md)

---

## Stack

| Camada | Tecnologia |
|--------|------------|
| Backend | NestJS + TypeScript |
| ORM / BD | Prisma + PostgreSQL |
| Auth | JWT + bcrypt + RBAC |
| Frontend | React + Vite + TanStack Query + RHF/Zod + Tailwind |
| Docs API | Swagger `/docs` |

---

## Como executar

**Pré-requisitos:** Node.js 20+ e PostgreSQL.

```bash
# Opção A — Docker
docker compose up -d

# Opção B — PG embutido (deixar terminal aberto)
cd backend && node scripts/start-embedded-pg.mjs
```

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# API
cd backend
npm install
npx prisma migrate dev
# se houver drift: npx prisma db push
npx prisma db seed
npm run start:dev

# Web (outro terminal)
cd frontend
npm install
npm run dev
```

| Serviço | URL |
|---------|-----|
| Front | http://localhost:5173 |
| API | http://localhost:3000/api/v1 |
| Swagger | http://localhost:3000/docs |

---

## Contas demo

Senha: **`Senha@123`**

| Perfil | E-mail |
|--------|--------|
| Aluno | `aluno@demo.meritcoin.local` |
| Professor | `professor@demo.meritcoin.local` |
| Empresa | `empresa@demo.meritcoin.local` |
| Escola | `escola@demo.meritcoin.local` |
| Admin | `admin@demo.meritcoin.local` |

---

## Fluxos Sprint 3 (demo)

1. **Professor** → `/app/carteira` → crédito 1.000 → envia moedas com motivo  
2. **Aluno** → extrato → `/app/vantagens` → resgata → recebe cupom  
3. **Empresa** → confirma cupom presencial  

E-mails ficam no outbox sem SMTP; com `SMTP_*` no `.env`, o Nodemailer envia de verdade.

---

## Estrutura

```
├── README.md
├── docs/sprint1|sprint2|sprint3
├── backend/   (NestJS + Prisma)
└── frontend/  (React)
```

## Identidade visual

Preto `#000000` · cinza `#A3A3A3` · branco `#FFFFFF` · roxo `#800080`
