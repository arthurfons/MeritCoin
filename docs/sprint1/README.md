# Lab03S01 — Sprint 1: Modelagem do Sistema

**Foco:** arquitetura e design da aplicação (sem implementação de código nesta sprint).

## Entrega principal (PDF)

**[Lab03S01_Sprint1_Modelagem.pdf](Lab03S01_Sprint1_Modelagem.pdf)** — documento completo com capa, regras de negócio, os 4 artefatos da sprint e os diagramas UML.

Para regenerar o PDF: `python docs/sprint1/gerar_pdf.py`

## Fontes dos artefatos

| # | Artefato | Arquivo |
|---|----------|---------|
| 1 | Diagrama de Casos de Uso | [diagramas/casos-de-uso.md](diagramas/casos-de-uso.md) · [casos-de-uso.puml](diagramas/casos-de-uso.puml) |
| 2 | Histórias do Usuário | [historias-usuario.md](historias-usuario.md) |
| 3 | Diagrama de Classes | [diagramas/classes.md](diagramas/classes.md) · [classes.puml](diagramas/classes.puml) |
| 4 | Diagrama de Componentes | [diagramas/componentes.md](diagramas/componentes.md) · [componentes.puml](diagramas/componentes.puml) |

Os arquivos `.md` usam **Mermaid** (GitHub). Os `.puml` são **PlantUML** (fonte dos diagramas do PDF).

## Atores do sistema

| Ator | Descrição |
|------|-----------|
| **Aluno** | Cadastro próprio; recebe e gasta moedas; consulta extrato |
| **Professor** | Pré-cadastrado; distribui moedas com mensagem de reconhecimento |
| **Empresa Parceira** | Cadastro próprio; cadastra vantagens; recebe notificação de resgate |
| **Sistema** | Credita moedas semestrais, autentica, gera cupons e dispara e-mails |

## Arquitetura alvo

**MVC** (Model–View–Controller), com camada de persistência e serviço de notificação por e-mail — detalhados no diagrama de componentes.
