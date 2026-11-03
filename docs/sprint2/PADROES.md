# Padrões utilizados — Lab03S02

Documento exigido pelo enunciado da Sprint 2.

## Arquitetura geral

| Padrão | Onde | Descrição |
|--------|------|-----------|
| **MVC** | NestJS + React | Controllers (API) = Controller; Services = Model/regras; React = View |
| **ORM** | Prisma | Acesso ao PostgreSQL sem SQL manual; schema tipado em `prisma/schema.prisma` |
| **Repository via Prisma** | `PrismaService` | Camada de persistência centralizada (equivalente prático a DAO) |
| **DTO + Validation** | `class-validator` | Validação de entrada nos DTOs (`RegisterStudentDto`, etc.) |
| **JWT + RBAC** | Passport JWT + `RolesGuard` | Autenticação stateless e autorização por papel |
| **SPA** | React + Vite | Front-end desacoplado consumindo REST |
| **Client-Server / REST** | HTTP JSON | Comunicação front ↔ back em `/api/v1` |

## Persistência (obrigatório Sprint 2)

- **Banco:** PostgreSQL  
- **Estratégia:** ORM **Prisma** (não DAO manual clássico)  
- **Migrações:** Prisma Migrate (`backend/prisma/migrations`)  
- **Seed:** `backend/prisma/seed.ts` (dados demo)  
- **Detalhes:** [estrategia-persistencia.md](estrategia-persistencia.md)

## Camadas

```
React (View / pages + components)
    │  HTTP REST + JWT
    ▼
NestJS Controllers  →  Services  →  PrismaService (ORM)  →  PostgreSQL
```

## CRUDs Sprint 2

### Aluno
| Operação | Endpoint / UI |
|----------|----------------|
| Create | `POST /auth/register/student` · `/cadastro/aluno` · escola em `/app/alunos` |
| Read | `GET /students`, `GET /students/:id` · listagem no front |
| Update | `PATCH /students/:id` |
| Delete (soft) | `DELETE /students/:id` → `User.active = false` |

### Empresa parceira
| Operação | Endpoint / UI |
|----------|----------------|
| Create | `POST /auth/register/company` · `/cadastro/empresa` |
| Read | `GET /companies`, `GET /companies/:id` · `/app/empresas` |
| Update | `PATCH /companies/:id` |
| Delete (soft) | `DELETE /companies/:id` → `User.active = false` |

## Outros padrões de apoio

- **Module pattern** (NestJS): `AuthModule`, `StudentsModule`, `CompaniesModule`, …
- **Guard / Decorator**: `@Roles()`, `@CurrentUser()`
- **Outbox** (e-mail): tabela `EmailOutbox` para notificações sem acoplar SMTP à regra de negócio
