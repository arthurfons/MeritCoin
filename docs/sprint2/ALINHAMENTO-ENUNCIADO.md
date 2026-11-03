# Alinhamento ao enunciado Lab03 (híbrido)

A professora validou a direção do produto (escola + missões), mas o sistema
**precisa cobrir o enunciado oficial**. O MeritCoin mantém os extras e entrega
o núcleo obrigatório.

## Enunciado → implementação

| Requisito | Onde |
| --- | --- |
| Auto-cadastro de aluno (nome, e-mail, CPF, RG, endereço, instituição, curso) | `POST /auth/register/student` + `/cadastro/aluno` |
| Cadastro de empresa parceira | `POST /auth/register/company` + `/cadastro/empresa` |
| Professor: 1.000 moedas/semestre (acumulável) | `POST /wallets/semester-credit` (também no envio) |
| Envio professor → aluno com **mensagem obrigatória** | `POST /wallets/transfer` |
| Extrato professor e aluno | `GET /wallets/statement` + `/app/carteira` |
| E-mail ao receber moedas | `EmailOutbox` + Nodemailer (SMTP opcional) |
| Empresa: vantagens (foto, descrição, custo) | `POST /rewards` + `/app/vantagens` |
| Aluno resgata vantagem → cupom | `POST /rewards/:id/redeem` |
| E-mails de resgate (aluno + empresa) | `EmailService.enqueue` no resgate |
| Confirmação presencial do cupom | `POST /redemptions/confirm` |

## Extras (mantidos, fora do núcleo)

- Papel `ESCOLA`, matrícula/série/turma
- Missões escolares e de turma (`/app/missoes`)
- Aprovação de missão gera `MISSION_REWARD` no extrato

## Contas demo

Senha: `Senha@123`

- `aluno@demo.meritcoin.local`
- `professor@demo.meritcoin.local`
- `empresa@demo.meritcoin.local`
- `escola@demo.meritcoin.local`
- `admin@demo.meritcoin.local`
