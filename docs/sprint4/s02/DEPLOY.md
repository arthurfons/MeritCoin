# Deploy cloud — Lab04S02

Arquitetura: **frontend na Vercel** + **API e PostgreSQL na Render**.

## URLs de produção

| Serviço | URL |
|---------|-----|
| Frontend | https://merit-coin.vercel.app/ |
| API | https://meritcoin-api.onrender.com/api/v1 |
| Swagger | https://meritcoin-api.onrender.com/docs |

Senha dos usuários de demonstração: `Senha@123`.

| Tipo | E-mail |
|------|--------|
| Aluno | `aluno@demo.meritcoin.local` |
| Professor | `professor@demo.meritcoin.local` |
| Empresa | `empresa@demo.meritcoin.local` |
| Escola | `escola@demo.meritcoin.local` |
| Admin | `admin@demo.meritcoin.local` |

O container da API aplica a migration e o seed ao subir. O plano gratuito da Render não tem Shell.

## Variáveis

API (`meritcoin-api`):

- `DATABASE_URL` — vem do banco `meritcoin-db` no blueprint
- `JWT_SECRET` — gerado pela Render
- `CORS_ORIGIN` = `https://merit-coin.vercel.app`
- `PORT` = `3000`
- `SMTP_*` — vazio; sem SMTP o e-mail fica no outbox

Frontend (projeto Vercel, raiz `frontend`):

- `VITE_API_URL` = `https://meritcoin-api.onrender.com/api/v1`

## Republicar

1. API: blueprint [`render.yaml`](../../../render.yaml) ou Web Service Docker com [`backend/Dockerfile`](../../../backend/Dockerfile) e contexto `backend`.
2. Frontend: importar o repositório com raiz `frontend`. Build `npm run build`, saída `dist`. O [`vercel.json`](../../../frontend/vercel.json) reescreve a SPA.
3. `CORS_ORIGIN` na API tem de ser a URL exata do site, sem barra no final.

## Conferência

1. Abrir https://merit-coin.vercel.app/
2. Entrar com `professor@demo.meritcoin.local` / `Senha@123`
3. Enviar moedas, entrar como aluno, resgatar uma vantagem e conferir o cupom como empresa

## Arquivos de infra

- [`backend/Dockerfile`](../../../backend/Dockerfile)
- [`render.yaml`](../../../render.yaml)
- [`frontend/vercel.json`](../../../frontend/vercel.json)
