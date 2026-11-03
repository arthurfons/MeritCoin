# Refatorações GRASP — Lab04S03

Aplicadas no repositório MeritCoin (também servem de modelo para PRs no projeto da turma).

## 1) Information Expert / High Cohesion — `SemesterCreditService`

**Antes:** `WalletsService` concentrava crédito semestral + transferência + extrato.  
**Depois:** política de 1.000/semestre isolada em [`semester-credit.service.ts`](../../../backend/src/wallets/semester-credit.service.ts).

**Por quê:** o expert do crédito semestral conhece `TeacherSemesterCredit` e a regra de acumulação; `WalletsService` orquestra transferências.

## 2) Information Expert — `generateCouponCode`

**Antes:** `randomBytes` embutido em `RewardsService.redeem`.  
**Depois:** [`coupon-code.ts`](../../../backend/src/rewards/coupon-code.ts).

**Por quê:** o algoritmo do cupom é conhecimento isolado, testável e reutilizável.

## 3) Low Coupling / Indirection — `MailNotifierService`

**Antes:** `WalletsService`/`RewardsService` acoplados diretamente a `EmailService` + `notification.create`.  
**Depois:** fachada [`mail-notifier.service.ts`](../../../backend/src/common/mail-notifier.service.ts).

**Por quê:** reduz acoplamento aos canais (e-mail/in-app); facilita trocar SMTP ou adicionar push depois.

## Como abrir PRs no projeto da turma

1. Fork do repo deles  
2. Branch `grasp-01-semester-expert`, `grasp-02-coupon`, `grasp-03-mail-indirection`  
3. Commits mínimos + PR com descrição before/after  
4. Cole os links no [RELATORIO-ANALISE-CRITICA.md](RELATORIO-ANALISE-CRITICA.md)
