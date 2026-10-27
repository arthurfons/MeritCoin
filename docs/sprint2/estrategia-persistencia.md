# Estratégia de Persistência — Sprint 2

## Decisão

| Aspecto | Escolha |
|---------|---------|
| Padrão | ORM |
| Ferramenta | **Prisma** |
| Banco | **PostgreSQL** |
| Migrações | Prisma Migrate (versionadas em `prisma/migrations`) |
| Acesso no NestJS | `PrismaService` global (`PrismaModule`) |
| Dev sem Docker | script `scripts/start-embedded-pg.mjs` (PostgreSQL embutido) |
| Dev com Docker | `docker compose up -d` |

## Por que Prisma + PostgreSQL

1. Atende ao enunciado (ORM + PostgreSQL).
2. Schema tipado alinhado ao MER.
3. Migrações auditáveis no Git.
4. Transações nativas (base para Sprint 3: transferências/resgates).
5. Seed idempotente para demonstração em aula.

## Camadas (MVC)

```
React (View)
  → Controllers NestJS (/api/v1)
    → Services (regras + autorização)
      → PrismaService (persistência)
        → PostgreSQL
```

## Modelo de identidade

- `User`: autenticação (e-mail, hash bcrypt, role, active)
- `StudentProfile` / `TeacherProfile` / `CompanyProfile`: dados de domínio
- Instituições, cursos e departamentos pré-cadastrados no seed
- Professor **não** se auto-cadastra pelo formulário público

## Segurança na persistência

- Senha apenas como `passwordHash` (bcrypt)
- Respostas da API sem hash
- Soft-deactivate via `User.active = false`
- Saldo em `Int` (moedas inteiras)
