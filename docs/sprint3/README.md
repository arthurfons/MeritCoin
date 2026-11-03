# Lab03S03 — Sprint 3 (Regras de negócio + integração)

## Escopo desta sprint

Completar o sistema do enunciado além dos CRUDs da Sprint 2:

| Requisito | Status | Onde |
|-----------|--------|------|
| Professor: 1.000 moedas/semestre (acumulável) | OK | `POST /wallets/semester-credit` · `/app/carteira` |
| Envio professor → aluno com mensagem | OK | `POST /wallets/transfer` |
| Extrato professor e aluno | OK | `GET /wallets/statement` |
| E-mail ao receber moedas | OK | `EmailModule` + `EmailOutbox` |
| Empresa cadastra vantagens (foto, descrição, custo) | OK | `POST /rewards` · `/app/vantagens` |
| Aluno resgata vantagem → cupom | OK | `POST /rewards/:id/redeem` |
| E-mails de resgate (aluno + empresa) | OK | `EmailService.enqueue` |
| Login/autenticação de todos os papéis | OK | JWT + RBAC |

**Extra (mantido):** missões escolares (`/app/missoes`).

## Artefatos

- Roteiro de apresentação: [APRESENTACAO.md](APRESENTACAO.md)
- Alinhamento ao enunciado: [../sprint2/ALINHAMENTO-ENUNCIADO.md](../sprint2/ALINHAMENTO-ENUNCIADO.md)
- MER / ORM / padrões: pasta `docs/sprint2/`

## Contas demo

Senha: `Senha@123`

| Papel | E-mail |
|-------|--------|
| Professor | `professor@demo.meritcoin.local` |
| Aluno | `aluno@demo.meritcoin.local` |
| Empresa | `empresa@demo.meritcoin.local` |
| Escola | `escola@demo.meritcoin.local` |
| Admin | `admin@demo.meritcoin.local` |
