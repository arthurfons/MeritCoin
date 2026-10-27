# MeritCoin — Sistema de Moeda Estudantil

Aplicação acadêmica (PUC Minas · Projeto de Software · 2º/2026) para reconhecimento do mérito estudantil via moeda virtual.

## Stack

| Camada | Tecnologia |
|--------|------------|
| Backend | NestJS + TypeScript |
| ORM | Prisma |
| Banco | **PostgreSQL** |
| Auth | JWT + bcrypt + RBAC |
| Frontend | React + Vite + TanStack Query + RHF/Zod + Tailwind |
| Docs API | Swagger em `/docs` |

## Sprint 2 — o que está pronto

- PostgreSQL + Prisma Migrate + seed
- Autenticação JWT e papéis (`ALUNO`, `PROFESSOR`, `EMPRESA`, `ADMIN`)
- Cadastro público de aluno e empresa
- Professor **pré-cadastrado** (seed; sem auto-cadastro)
- CRUD/consulta de alunos e empresas com autorização
- Frontend integrado (login, cadastros, dashboard, listagens)
- Documentação em `docs/sprint1` e `docs/sprint2`

## Pré-requisitos

- Node.js 20+
- PostgreSQL (opções abaixo)

### Opção A — Docker Compose (recomendado)

```bash
docker compose up -d
```

### Opção B — PostgreSQL embutido (sem Docker)

```bash
cd backend
node scripts/start-embedded-pg.mjs
```

Deixe esse terminal aberto.

## Configuração

```bash
# backend
cp backend/.env.example backend/.env

# frontend
cp frontend/.env.example frontend/.env
```

`DATABASE_URL` padrão:

```
postgresql://meritcoin:meritcoin@localhost:5432/meritcoin?schema=public
```

## Executar

```bash
# terminal 1 — API
cd backend
npm install
npx prisma migrate dev
npx prisma db seed
npm run start:dev

# terminal 2 — Web
cd frontend
npm install
npm run dev
```

- App: http://localhost:5173  
- API: http://localhost:3000/api/v1  
- Swagger: http://localhost:3000/docs  

## Credenciais de demonstração

Senha de todos: `Senha@123`

| Perfil | E-mail |
|--------|--------|
| Aluno | `aluno@demo.meritcoin.local` |
| Professor | `professor@demo.meritcoin.local` |
| Empresa | `empresa@demo.meritcoin.local` |
| Admin | `admin@demo.meritcoin.local` |

## Endpoints principais (Sprint 2)

| Método | Rota | Auth |
|--------|------|------|
| POST | `/api/v1/auth/login` | pública |
| POST | `/api/v1/auth/register/student` | pública |
| POST | `/api/v1/auth/register/company` | pública |
| GET | `/api/v1/auth/me` | JWT |
| GET | `/api/v1/institutions` | pública |
| GET/PATCH/DELETE | `/api/v1/students/:id` | JWT + RBAC |
| GET/PATCH/DELETE | `/api/v1/companies/:id` | JWT + RBAC |

## Testes

```bash
cd backend
npm test
```

## Identidade visual

Paleta da bandeira assexual: preto `#000000`, cinza `#A3A3A3`, branco `#FFFFFF`, roxo `#800080` (destaque).

## Próximo (Sprint 3)

Transferências de moedas, alocação semestral, vantagens, cupons, e-mails e dashboards completos.
