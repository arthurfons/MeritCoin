# Roteiro de apresentação — Lab03S03 (~6–8 min)

## Antes de começar (2 min)

1. PostgreSQL ligado (`docker compose up -d` **ou** `node backend/scripts/start-embedded-pg.mjs`)
2. API: `cd backend && npm run start:dev`
3. Front: `cd frontend && npm run dev`
4. Abrir http://127.0.0.1:5173
5. Senha de todos: **`Senha@123`**

## Fala rápida (30 s)

> “MeritCoin — sistema de moeda estudantil. Sprint 2: MER + Prisma + CRUD aluno/empresa. Sprint 3: crédito semestral, envio com motivo, extrato, vantagens, cupom e e-mails (outbox).”

## Demo ao vivo

### 1) Professor envia moedas (2 min)
1. Login: `professor@demo.meritcoin.local`
2. Ir em **Carteira**
3. Mostrar saldo (1.000 do semestre)
4. **Enviar moedas** para o aluno demo, com motivo (ex.: “Participação exemplar”)
5. Mostrar extrato do professor

### 2) Aluno vê extrato e resgata (2 min)
1. Sair → login: `aluno@demo.meritcoin.local`
2. **Carteira** → saldo + recebimento no extrato
3. **Vantagens** → resgatar “Café expresso” (ou outra)
4. Mostrar **cupom** gerado

### 3) Empresa confere cupom (1 min)
1. Login: `empresa@demo.meritcoin.local`
2. **Vantagens** → colar cupom → **Confirmar uso**
3. (Opcional) citar e-mails no `EmailOutbox` se SMTP não estiver configurado

### 4) Extra rápido — missões (opcional, 1 min)
1. Login escola ou professor → **Missões** → criar/aprovar
2. “Extra além do enunciado, alinhado ao feedback da professora”

## Se perguntarem

| Pergunta | Resposta curta |
|----------|----------------|
| ORM? | Prisma + PostgreSQL |
| E-mail? | Outbox; SMTP opcional no `.env` |
| Professor se cadastra? | Não — pré-cadastrado (seed) |
| Soft delete? | `User.active = false` |

## Comentário curto p/ Moodle (se pedir)

`S03: crédito 1.000, transferência+mensagem, extrato, vantagens/cupom e e-mails (outbox). Docs em docs/sprint3/. Demo: professor@ / aluno@ / empresa@ + Senha@123.`
