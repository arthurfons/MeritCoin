# Checklist de deploy

O sistema já está publicado. Use esta lista só para republicar.

## Vercel (frontend)

Raiz do projeto: `frontend`.

Variável: `VITE_API_URL=https://meritcoin-api.onrender.com/api/v1`

Pelo painel: importar `arthurfons/MeritCoin` e escolher **Import single project** na linha `frontend`.

Pela CLI:

```bash
cd frontend
npx vercel login
npx vercel link
npx vercel env add VITE_API_URL
npx vercel --prod
```

## Render (API + banco)

1. https://dashboard.render.com → New → Blueprint → repo `arthurfons/MeritCoin`
2. `CORS_ORIGIN` = `https://merit-coin.vercel.app` (sem barra no final)
3. Deixe `SMTP_*` vazio
4. O seed roda no start do container. Não depende do Shell, que no plano gratuito não abre

URLs e logins: [DEPLOY.md](DEPLOY.md).
