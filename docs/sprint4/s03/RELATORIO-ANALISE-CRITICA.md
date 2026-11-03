# Relatório de Análise Crítica — Lab04S03

## 1. Identificação

| Campo | Valor |
|-------|-------|
| Disciplina | Projeto de Software · Lab04S03 |
| Nosso projeto | [MeritCoin](https://github.com/arthurfons/MeritCoin) |
| Projeto analisado | **_PREENCHER: nome do grupo / URL GitHub da turma_** |
| Data | 2026-11-03 |

> Quando a professora indicar o repositório da turma, complete as seções 2–6 com evidências desse repo. As seções GRASP (7) já documentam as refatorações realizadas e o processo de PR.

## 2. Arquitetura e tecnologias utilizadas

_Preencher para o projeto da turma._

Checklist de observação:
- [ ] Linguagem / framework backend
- [ ] Frontend (ou ausência de GUI)
- [ ] Banco / ORM
- [ ] Autenticação
- [ ] Estrutura de pastas (MVC?)

**Referência MeritCoin (nosso):** NestJS + Prisma + PostgreSQL + React/Vite + JWT/RBAC.

## 3. Organização do GitHub

_Preencher._

Observe: branches, frequência de commits, presença de docs UML, issues/PRs, `.gitignore`, se há `node_modules` commitado, qualidade das mensagens de commit.

## 4. Dificuldade de configuração (README)

_Preencher após seguir o README deles do zero._

Anote: tempo gasto, erros, passos faltando, necessidade de Docker, variáveis de ambiente não documentadas.

## 5. Erros / omissões nos diagramas

_Preencher._

Compare casos de uso, classes, sequência, implantação com o código.

## 6. Alinhamento modelo × implementação

_Preencher com exemplos concretos (classe X no diagrama vs arquivo Y)._

## 7. Refatorações GRASP (PRs)

Ver detalhe em [GRASP.md](GRASP.md). Resumo:

| # | Princípio | Artefato MeritCoin | Status |
|---|-----------|--------------------|--------|
| 1 | Information Expert / High Cohesion | `SemesterCreditService` | Aplicado no código |
| 2 | Information Expert | `generateCouponCode` | Aplicado no código |
| 3 | Low Coupling / Indirection | `MailNotifierService` | Aplicado no código |

### Como reproduzir no projeto da turma

1. Fork → 3 branches → 3 PRs  
2. Cole aqui os links:

- PR1: _link_
- PR2: _link_
- PR3: _link_

Os proprietários **não precisam aceitar** (enunciado).

### Before / After (MeritCoin)

**Before (crédito no WalletsService):** método único misturava semestre + wallet.  
**After:** `SemesterCreditService.ensureForTeacherUser` + `WalletsService` só orquestra.

**Before (cupom):** `randomBytes` inline no `redeem`.  
**After:** `generateCouponCode()`.

**Before (notificação):** `email.enqueue` + `notification.create` duplicados.  
**After:** `MailNotifierService.notifyUser`.

## 8. Conclusão

_Preencher recomendações objetivas e respeitosas ao grupo analisado._

## Apêndice — Prompt de slides S03

```
Crie slides Lab04S03 MeritCoin: análise crítica do projeto da turma + 3 refactors GRASP (Information Expert, High Cohesion, Indirection) com before/after e links de PR. Visual #800080; 8-10 slides; tom acadêmico sem ofensas.
```
