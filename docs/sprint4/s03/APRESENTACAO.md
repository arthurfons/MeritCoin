# Apresentação Lab04S03

Projeto analisado: Sistema de Moeda Estudantil, https://github.com/BernardoApl/Sistema-de-Moeda-Estudantil, commit `8a4eca7`.

## Roteiro

1. Flask, templates, SQLite por padrão e PostgreSQL se houver `DATABASE_URL`. Sessão, hash de senha e CSRF. Perfis na mesma tabela `contas`.
2. README funciona no Windows. No Linux faltam o caminho do venv e o pacote `python3-venv`. Depois disso, 26 testes passaram. A URL da Vercel respondeu HTTP 500 em 24/11/2026.
3. Dezesseis commits, um autor no GitHub, nenhum pull request. Duas cópias da pasta `sistema`.
4. A visão geral de interação é Graphviz (`@startdot`). O diagrama de implantação não mostra o SQLite que o README sobe. O uso do cupom (`POST /cupons/<id>/utilizar`) não tem sequência.
5. GRASP 1 — `gerar_codigo_cupom` tira `secrets.token_hex(12)` de dentro de `resgatar`.
6. GRASP 2 — `credito.py` passa a conhecer o semestre e as 1.000 moedas.
7. GRASP 3 — `Notificador` esconde o `INSERT` da caixa de notificações. Os testes de rollback continuam no mesmo ponto.
8. Os três patches estão em `patches/`. A publicação dos pull requests depende de um fork, que este ambiente não conseguiu criar (HTTP 403).
