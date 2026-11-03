# Estratégia de acesso ao banco — Lab03S02

## Decisão (obrigatória no README / entrega)

| Aspecto | Escolha |
|---------|---------|
| Padrão | **ORM** |
| Ferramenta | **Prisma** |
| Banco | **PostgreSQL** |
| Migrações | Prisma Migrate (`backend/prisma/migrations`) |
| Acesso no NestJS | `PrismaService` injetável (`PrismaModule` global) |
| Alternativa a DAO | O Prisma Client cumpre o papel de acesso a dados tipado |
| Dev sem Docker | `backend/scripts/start-embedded-pg.mjs` |
| Dev com Docker | `docker compose up -d` |

## Por que ORM (Prisma) e não DAO clássico

1. Atende ao enunciado (“ORM, Padrão DAO, **etc.**”) com escolha explícita de **ORM**.
2. Schema único alinhado ao MER (`schema.prisma`).
3. Migrações versionadas no Git.
4. Tipagem TypeScript gerada → menos erro em CRUD.
5. Transações nativas para evoluções (envio de moedas / resgates).

## Fluxo de uma operação CRUD

Exemplo — cadastro de aluno:

1. Front envia JSON para `POST /api/v1/auth/register/student`
2. `AuthController` valida DTO (`class-validator`)
3. `AuthService` aplica regra (curso pertence à instituição, hash bcrypt)
4. `PrismaService.user.create({ student: { create: … } })` persiste User + StudentProfile
5. Retorna JWT + usuário sanitizado (sem `passwordHash`)

## Soft delete

`DELETE` em aluno/empresa não remove a linha: marca `User.active = false`.

## Seed

`npx prisma db seed` popula instituição, cursos, professor, aluno, empresa e admin demo.
