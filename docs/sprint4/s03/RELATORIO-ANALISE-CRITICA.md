# Relatório de Análise Crítica — Lab04S03

## 1. Identificação

| Campo | Valor |
|-------|-------|
| Disciplina | Projeto de Software · Lab04S03 |
| Nosso projeto | [MeritCoin](https://github.com/arthurfons/MeritCoin) |
| Projeto analisado | Sistema de Moeda Estudantil — Bernardo Augusto Pereira, Bruno Kenji Fantucci, João Gabriel e Murilo Duarte Moura |
| Repositório | https://github.com/BernardoApl/Sistema-de-Moeda-Estudantil |
| Commit lido | `8a4eca7` (`Feat: relatorio`, branch `main`, 24/11/2026) |
| Data da análise | 24/11/2026 (horário de Brasília) |

A leitura cobriu o README, as pastas de entrega, os diagramas de Lab04S01 e Lab04S02 e o código em `Entrega Sprint 3/sistema`. A execução local e a suíte de testes foram feitas de fato. PostgreSQL e SMTP reais não foram exercitados.

## 2. Arquitetura e tecnologias utilizadas

A aplicação é um monólito Python com Flask 3.1.3. Não há frontend separado: as telas são templates Jinja (`templates/`) e um CSS em `static/style.css`.

A fábrica `create_app` em `app.py` registra rotas (`controllers.py`), comandos de linha de comando (`commands.py`) e, na ausência de `DATABASE_URL`, cria o esquema SQLite. As regras de saldo, cadastro, resgate e cupom ficam em `services.py`. O acesso a dados fica em `models.py` (`ContaDAO`, `VantagemDAO`, `extrato`). Há um adaptador `postgres_db.py` quando `DATABASE_URL` ou `POSTGRES_URL_NON_POOLING` está definido. O arquivo `vercel.json` aponta a função Flask para a Vercel.

A autenticação é sessão de cookie (`HttpOnly`, `SameSite=Lax`) com senha em hash do Werkzeug e um token CSRF guardado na sessão. Os perfis são `aluno`, `professor` e `empresa`, todos na mesma tabela `contas`, discriminados pela coluna `perfil`.

O desenho é MVC de um projeto pequeno e dá para achar cada fluxo. O ponto fraco é a coesão de `services.py`: validação de documento, crédito semestral, transferência, vantagem, resgate e o `INSERT` da caixa de notificações moram na mesma unidade.

## 3. Organização do GitHub

O histórico consultado tem 16 commits, todos de `BernardoApl`, entre 06/10/2026 e 24/11/2026. O README lista quatro integrantes, mas o GitHub não mostra autoria dos demais. As mensagens são curtas (`Feat .md`, `Feat: relatorio`, `NEW: Diagramas sprint 1`). Não há pull requests no repositório: o código entra direto em `main`. Há um merge de `origin/main` em 16/11/2026.

A documentação acadêmica está versionada e separada por entrega (`Entrega Sprint 1` a `3`, `Lab04S01` a `Lab04S03`), com fontes PlantUML ao lado dos SVG. O `.gitignore` cobre `__pycache__`, `.venv`, `.env` e `*.sqlite3`. Não há `node_modules` nem banco de dados commitado.

Os nomes de pasta com espaço (`Entrega Sprint 3`) obrigam aspas em todo comando. O código executável existe em duas cópias, `Entrega Sprint 2/sistema` e `Entrega Sprint 3/sistema`. Quem abre a pasta errada lê uma versão anterior. O PDF `Apresentacao Projeto de software.pdf` fica na raiz, fora da pasta da entrega correspondente.

## 4. Dificuldade de configuração (README)

O README da raiz explica o objetivo, a senha de demonstração e os três perfis. No Windows, o caminho que ele descreve chega ao sistema.

Nesta máquina (Linux) o mesmo texto não basta:

- Os comandos usam PowerShell e `.\.venv\Scripts\python.exe`. No Linux o interpretador do venv é `.venv/bin/python`.
- `python3 -m venv .venv` falhou porque o pacote `python3.12-venv` não estava instalado (`ensurepip` ausente). Foi preciso instalá-lo antes de repetir o passo.
- O README não menciona Linux, nem que Flask e `psycopg` vêm só de `requirements.txt` (duas dependências, versões fixas).

Depois desses dois ajustes, a partir de `Entrega Sprint 3/sistema`:

1. `python3 -m venv .venv` e `pip install -r requirements.txt` concluíram.
2. `flask --app app seed-demo` criou as contas e imprimiu a senha `Demo12345!`.
3. `python -m unittest discover -s tests -q` executou **26 testes, todos aprovados**, em cerca de 8 segundos.

O endereço publicado, https://sistema-de-moeda-estudantil-sistema.vercel.app/, respondeu **HTTP 500** nesta data. O próprio `Lab04S02/README.md` já registra essa falha e a ausência de teste com PostgreSQL. SMTP e o comando `enviar-emails` não foram executados contra um servidor real.

## 5. Erros e omissões nos diagramas

- `Lab04S01/diagramas/IOD01-visao-geral.puml` começa com `@startdot`: é um grafo Graphviz. Os quadros `ref` são tabelas HTML de nó, e os losangos são nós `diamond`. O README dessa entrega cita a seção 17.10 da UML 2.5.1 (visão geral de interação). O desenho comunica a navegação, mas não é essa notação.
- `Lab04S02/implantacao.puml` mostra a função Flask na Vercel ligada só a PostgreSQL. O caminho que de fato sobe com o README é SQLite, e esse nó não aparece. O diagrama se apresenta como topologia prevista. A URL publicada devolve HTTP 500, então o nó da função web não corresponde a um serviço verificado.
- Nenhum diagrama de sequência cobre `POST /cupons/<id>/utilizar` (`controllers.marcar_cupom` e `services.utilizar_cupom`). O fluxo existe, tem teste (`test_cupom_usado_apenas_pela_empresa_dona`) e não está em SD08 nem na visão geral.

Os dez diagramas de sequência (SD01–SD10) acompanham os fluxos que o README de Lab04S01 descreve: sessão, CSRF, crédito de 1.000 moedas só na primeira inserção do semestre, e as duas notificações do resgate em sequência. SD08 bate com `resgatar`: as duas gravações de aviso são sequenciais, não paralelas.

## 6. Alinhamento modelo × implementação

| Modelo | Código | Leitura |
|--------|--------|---------|
| `Aluno`, `Professor` e `EmpresaParceira` herdam `ContaAcesso` (`Entrega Sprint 1/diagramas/02_classes.puml`) | Uma tabela `contas` com `perfil` e `ContaDAO` | O próprio diagrama avisa que não há classe Python por entidade. A herança é conceitual. |
| `CreditoSemestral.valor = 1000`, único por professor e semestre | `creditos` com `CHECK(valor = 1000)` e `UNIQUE(professor_id, semestre)` | Alinhado. `creditar_semestre` omite a coluna `valor` e usa o `DEFAULT 1000`. |
| `Vantagem.fotoUrl` | `salvar_vantagem` exige URL `http://` ou `https://` | Alinhado: a foto é um endereço, não um arquivo enviado. |
| `Notificacao.enviado` | coluna `enviado` com default 0; comando de e-mail marca o envio | Alinhado com SD10. O envio real depende de SMTP, que o grupo também registra como pendente. |
| Resgate gera um código e avisa aluno e empresa | `resgatar` grava o mesmo `secrets.token_hex(12)` nas duas notificações, na mesma transação | Alinhado com SD08. O teste de falha na notificação confirma o rollback. |
| Casos de uso até o resgate | `POST /cupons/<id>/utilizar` marca o cupom da empresa dona | Comportamento a mais, sem caso de uso nem sequência. |

## 7. Refatorações GRASP (PRs)

As três mudanças estão em branches locais, cada uma partindo de `8a4eca7`, e foram conferidas com os mesmos 26 testes. Os patches estão em `docs/sprint4/s03/patches/`. O detalhe antes/depois está em [GRASP.md](GRASP.md).

| # | Princípio | Onde | Patch |
|---|-----------|------|-------|
| 1 | Information Expert | `cupom.py` / `gerar_codigo_cupom` | [grasp-01-cupom.patch](patches/grasp-01-cupom.patch) |
| 2 | Information Expert | `credito.py` / semestre e 1.000 moedas | [grasp-02-credito.patch](patches/grasp-02-credito.patch) |
| 3 | Indirection | `Notificador` e a caixa `notificacoes` | [grasp-03-notificador.patch](patches/grasp-03-notificador.patch) |

A tentativa de abrir os pull requests no GitHub deles, a partir deste ambiente, recebeu HTTP 403 (`Resource not accessible by integration`) ao criar o fork. O enunciado pede a entrega por pull request, e os donos não precisam aceitar. Quem tiver uma conta GitHub com permissão de fork publica os três com:

```bash
git clone https://github.com/BernardoApl/Sistema-de-Moeda-Estudantil.git
cd Sistema-de-Moeda-Estudantil
gh repo fork --remote=true
# a partir da pasta que contém os três .patch
git checkout main
git checkout -b grasp-01-cupom
git apply grasp-01-cupom.patch && git add -A && git commit -m "Separa a geração do código de cupom (Information Expert)."
git push -u origin grasp-01-cupom
gh pr create --repo BernardoApl/Sistema-de-Moeda-Estudantil --base main --title "GRASP: Information Expert do código de cupom" --body "Ver descrição no commit."
```

Repita o bloco para `grasp-02-credito` e `grasp-03-notificador`, cada um a partir de `main`, para os três diffs ficarem independentes.

## 8. Conclusão

O grupo entregou um Flask pequeno, com testes que passam e com diagramas de sequência próximos do código que li. O README leva um colega de Windows até as contas de demonstração. Falta o equivalente para Linux, e a publicação na Vercel, no dia desta análise, responde erro 500.

Vale registrar os quatro integrantes no histórico, tirar o código da cópia antiga da Sprint 2 do caminho de quem for executar, e incluir o uso do cupom na modelagem. As três refatorações só movem conhecimento que hoje está solto em `services.py`: o formato do cupom, a regra das 1.000 moedas e a gravação da notificação. Nenhuma delas muda o comportamento coberto pela suíte.

## Apêndice — Prompt de slides S03

```
Crie slides Lab04S03 MeritCoin: análise crítica de https://github.com/BernardoApl/Sistema-de-Moeda-Estudantil (Flask, SQLite/PostgreSQL, 26 testes ok, Vercel HTTP 500, IOD em Graphviz, cupom sem diagrama) e 3 refactors GRASP (gerar_codigo_cupom, credito semestral, Notificador) com before/after. Visual sóbrio; 8 slides; tom acadêmico.
```
