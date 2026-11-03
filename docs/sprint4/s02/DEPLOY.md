# Deploy cloud — Lab04S02

Arquitetura alvo: **Frontend Vercel** + **API Render** + **PostgreSQL Render/Neon**.

## URLs de produção

| Serviço | URL |
|---------|-----|
| Frontend (Vercel) | _rodar `npx vercel login` + checklist em [`scripts/cloud-deploy.md`](../../../scripts/cloud-deploy.md)_ |
| API (Render) | _Blueprint [`render.yaml`](../../../render.yaml) no dashboard Render_ |
| Swagger | `https://<api>.onrender.com/docs` |

> Infra no GitHub já está pronta. O deploy cloud exige login único na sua conta Vercel/Render (CLI não autenticada nesta máquina). Após o deploy, atualize esta tabela e o README.

## 1) Banco PostgreSQL

Opções: Render Postgres (free) **ou** [Neon](https://neon.tech) / Supabase.

Copie a `DATABASE_URL` (com SSL se exigido).

## 2) API no Render

1. Conecte o repo `arthurfons/MeritCoin`
2. Use o blueprint [`render.yaml`](../../../render.yaml) **ou** Web Service com Docker:
   - Dockerfile: `backend/Dockerfile`
   - Context: `backend`
3. Env vars:
   - `DATABASE_URL`
   - `JWT_SECRET` (forte)
   - `CORS_ORIGIN=https://SEU-APP.vercel.app`
   - `PORT=3000`
   - `SMTP_*` opcional
4. Após o deploy: rode seed uma vez (Shell Render):

```bash
npx prisma db seed
```

## 3) Frontend na Vercel

1. Importar repo → root `frontend`
2. Build: `npm run build` · Output: `dist`
3. Env: `VITE_API_URL=https://SEU-API.onrender.com/api/v1`
4. `vercel.json` já faz rewrite SPA

## 4) Smoke test produção

1. Abrir front Vercel  
2. Login `professor@demo.meritcoin.local` / `Senha@123`  
3. Enviar moedas → login aluno → resgatar vantagem → empresa confirma cupom  

## Arquivos de infra no repo

- [`backend/Dockerfile`](../../../backend/Dockerfile)
- [`render.yaml`](../../../render.yaml)
- [`frontend/vercel.json`](../../../frontend/vercel.json)
