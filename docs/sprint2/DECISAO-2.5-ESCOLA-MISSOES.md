# Decisão 2.5 — Escola, missões + enunciado (híbrido)

## Motivação
A professora validou a direção (escola + missões), mas pediu conformidade com o
**enunciado oficial**. O sistema ficou híbrido: núcleo do Lab03 + extras.

## Núcleo (enunciado)
1. Aluno **pode se auto-cadastrar** com CPF, RG, endereço, instituição e curso.
2. Professor recebe **1.000 moedas/semestre** (acumulável) e envia com **mensagem**.
3. Extrato para professor e aluno.
4. Empresa cadastra vantagens (foto, descrição, custo); aluno resgata e recebe cupom.
5. E-mails de recebimento e resgate (outbox; SMTP opcional).

## Extras (mantidos)
1. Papel `ESCOLA` também cadastra aluno (com os campos do enunciado + matrícula/turma).
2. Missões de turma (professor) e de escola (escola).
3. Conclusão aprovada gera crédito `MISSION_REWARD` no extrato.

## Credenciais demo
Senha: `Senha@123`
- `escola@demo.meritcoin.local`
- `professor@demo.meritcoin.local`
- `aluno@demo.meritcoin.local`
- `empresa@demo.meritcoin.local`
- `admin@demo.meritcoin.local`

## Ver também
[ALINHAMENTO-ENUNCIADO.md](ALINHAMENTO-ENUNCIADO.md)
