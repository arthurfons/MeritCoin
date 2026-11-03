# Alinhamento modelo ↔ código — Lab04S01

## O que mudou desde a Sprint 1

| Modelo Sprint 1 | Implementação atual | Motivo |
|-----------------|---------------------|--------|
| `Usuario` monolítico com subclasses | `User` + profiles (`StudentProfile`, `TeacherProfile`, `CompanyProfile`) | Separar auth de dados de domínio (Prisma) |
| `ServicoMoeda` | `WalletsService` | Nome alinhado ao módulo Nest |
| `ServicoResgate` / `Vantagem` | `RewardsService` / `Reward` + `Redemption` | Vocabulário do domínio de vantagens |
| `ServicoNotificacao` | `EmailService` + `EmailOutbox` + `Notification` | Outbox transacional (confiabilidade) |
| DAO genérico | `PrismaService` | ORM escolhido na Sprint 2 |
| — | `WalletTransaction`, `CoinTransfer`, `TeacherSemesterCredit` | Extrato e crédito semestral |

## Diagramas atualizados nesta sprint

- [classes.puml](../../sprint1/diagramas/classes.puml) — nomes e entidades alinhados ao schema Prisma
- [componentes.puml](../../sprint1/diagramas/componentes.puml) — módulos Nest + páginas React reais
- Sequências SQ-01…SQ-07 e Visão Geral em [diagramas/](diagramas/)

## Conclusão

Os modelos iniciais permaneceram válidos conceitualmente (MVC, papéis, moeda, vantagens). Foram **atualizados** para refletir a arquitetura Nest/Prisma e as entidades de carteira/e-mail introduzidas nas sprints 2–3.
