# Auditoria funcional — Lab04S01

Data: 2026-11-03 · API local `http://127.0.0.1:3000/api/v1`

| Requisito do enunciado | Status | Evidência |
|------------------------|--------|-----------|
| Cadastro de aluno (nome, email, CPF, RG, endereço, instituição, curso) | OK | `POST /auth/register/student` + `/cadastro/aluno` |
| Instituições pré-cadastradas | OK | `GET /institutions` (seed PUC Minas) |
| Professor pré-cadastrado (nome, CPF, departamento, instituição) | OK | seed `professor@demo.meritcoin.local` |
| 1.000 moedas/semestre acumuláveis | OK | `POST /wallets/semester-credit` + `TeacherSemesterCredit` |
| Envio com saldo + aluno + mensagem obrigatória | OK | `POST /wallets/transfer` |
| E-mail ao receber moedas | OK | `EmailOutbox` via `EmailService` |
| Extrato professor e aluno | OK | `GET /wallets/statement` + `/app/carteira` |
| Empresa cadastra vantagens (descrição, foto, custo) | OK | `POST /rewards` (foto = URL) |
| Resgate debita saldo + cupom | OK | `POST /rewards/:id/redeem` |
| E-mails aluno + empresa com código | OK | dois `enqueue` no resgate |
| Autenticação (aluno, professor, empresa) | OK | JWT + RBAC |

## Smoke test (2026-11-03)

```
institutions:OK
login-aluno:OK
login-prof:OK
login-emp:OK
extrato-prof:OK
extrato-aluno:OK
catalogo:OK
list-alunos:OK
AUDIT_OK
```

## Gaps residuais (não bloqueiam S01)

- Foto de vantagem: URL (sem upload multipart)
- SMTP opcional: sem `SMTP_*`, e-mails ficam `PENDING` no outbox
- Missões escolares: **extra**, fora do núcleo do enunciado
