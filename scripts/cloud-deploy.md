# Checklist de deploy (executar uma vez na sua máquina)

Requer login interativo (não automatizável sem suas credenciais).

## Vercel (frontend)

```bash
cd frontend
npx vercel login
npx vercel link
npx vercel env add VITE_API_URL
# valor: https://SEU-SERVICO.onrender.com/api/v1
npx vercel --prod
```

## Render (API + DB)

1. https://dashboard.render.com → New → Blueprint → repo `arthurfons/MeritCoin`
2. Ou Web Service + Docker (`backend/Dockerfile`)
3. Configure `CORS_ORIGIN` = URL da Vercel
4. Shell: `npx prisma db seed`
5. Atualize `docs/sprint4/s02/DEPLOY.md` com as URLs finais
