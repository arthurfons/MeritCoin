# Lab03S01 — Sprint 1: Modelagem do Sistema de Moeda Estudantil

**Disciplina:** Projeto de Software · **Período:** 2º Semestre/2026  
**Professora:** Milena Menezes Adão · **Instituição:** PUC Minas (Engenharia de Software)

Documento-síntese da Sprint 1. Detalhes e diagramas editáveis estão nos arquivos irmãos desta pasta.

---

## 1. Objetivo

Desenvolver (nas sprints seguintes) um sistema **MVC** que estimula o reconhecimento do mérito estudantil por meio de moeda virtual, com distribuição por professores, troca de vantagens com empresas parceiras e notificações por e-mail.

---

## 2. Diagrama de Casos de Uso

**Arquivos:** [diagramas/casos-de-uso.md](diagramas/casos-de-uso.md) · [diagramas/casos-de-uso.puml](diagramas/casos-de-uso.puml)

### Atores
- **Aluno** — cadastro, recebimento/gasto de moedas, extrato
- **Professor** — pré-cadastrado; distribuição de moedas; extrato
- **Empresa Parceira** — cadastro; vantagens; conferência de resgates
- **Sistema** — crédito semestral, autenticação de apoio, e-mails e cupons

### Casos de uso (resumo)

| ID | Nome | Ator(es) |
|----|------|----------|
| UC01 | Cadastrar Aluno | Aluno |
| UC02 | Cadastrar Empresa Parceira | Empresa |
| UC03 | Autenticar Usuário | Aluno, Professor, Empresa |
| UC04 | Pré-cadastrar Professor | Sistema |
| UC05 | Creditar Moedas Semestrais | Sistema |
| UC06 | Enviar Moedas ao Aluno | Professor (+ UC03, UC12) |
| UC07 | Consultar Extrato Professor | Professor |
| UC08 | Cadastrar Vantagem | Empresa |
| UC09 | Gerenciar Vantagens | Empresa |
| UC10 | Resgatar Vantagem | Aluno (+ UC03, UC13) |
| UC11 | Consultar Extrato Aluno | Aluno |
| UC12 | Notificar Recebimento | Sistema |
| UC13 | Notificar Resgate | Sistema |

---

## 3. Histórias do Usuário

**Arquivo:** [historias-usuario.md](historias-usuario.md)

| ID | Título | Prioridade | Sprint |
|----|--------|------------|--------|
| US-01 | Cadastro de Aluno | Alta | 2–3 |
| US-02 | Cadastro de Empresa Parceira | Alta | 2–3 |
| US-03 | Login no sistema | Alta | 2–3 |
| US-04 | Pré-cadastro de Professor | Alta | 3 |
| US-05 | Crédito semestral de moedas | Alta | 3 |
| US-06 | Enviar moedas a um aluno | Alta | 3 |
| US-07 | Extrato do professor | Alta | 3 |
| US-08 | Cadastrar vantagem | Alta | 3 |
| US-09 | Gerenciar vantagens | Média | 3 |
| US-10 | Listar e resgatar vantagem | Alta | 3 |
| US-11 | Extrato do aluno | Alta | 3 |
| US-12 | E-mail ao receber moedas | Alta | 3 |
| US-13 | E-mails de resgate | Alta | 3 |
| US-14 | CRUD Aluno (inicial) | Alta | 2 |
| US-15 | CRUD Empresa (inicial) | Alta | 2 |

---

## 4. Diagrama de Classes

**Arquivos:** [diagramas/classes.md](diagramas/classes.md) · [diagramas/classes.puml](diagramas/classes.puml)

### Hierarquia de usuários
`Usuario` (abstrata) ← `Aluno` | `Professor` | `EmpresaParceira`

### Entidades principais
- **Aluno** — dados pessoais, endereço, instituição, curso, saldo
- **Professor** — CPF, departamento, instituição, saldo (acumulável)
- **EmpresaParceira** — oferecimento de vantagens
- **Vantagem** — descrição, foto, custo em moedas
- **TransacaoMoeda** — envio professor→aluno com mensagem obrigatória
- **Resgate** — débito do aluno + `codigoCupom`
- **CreditoSemestral** — +1.000 moedas/semestre
- **InstituicaoEnsino**, **Curso**, **Endereco**

### Serviços de negócio
`ServicoAutenticacao` · `ServicoMoeda` · `ServicoResgate` · `ServicoNotificacao`

---

## 5. Diagrama de Componentes

**Arquivos:** [diagramas/componentes.md](diagramas/componentes.md) · [diagramas/componentes.puml](diagramas/componentes.puml)

```
[View] → [Controller] → [Services + Domínio] → [DAO/ORM] → [(BD)]
                                              ↘ [ServicoNotificacao] → [SMTP]
```

| Camada | Papel |
|--------|--------|
| View | Interfaces por perfil |
| Controller | Orquestração HTTP / entrada |
| Model (Services + Entidades) | Regras de negócio |
| Persistência | Acesso a dados (detalhar na Sprint 2) |
| E-mail | Notificações UC12 e UC13 |

---

## 6. Rastreabilidade (alinhamento modelo ↔ requisitos)

| Requisito do enunciado | Artefato |
|------------------------|----------|
| Cadastro aluno/empresa; professor pré-cadastrado | UC01–UC04, US-01–US-04, classes `Aluno`/`Professor`/`EmpresaParceira` |
| Login/senha obrigatórios | UC03, `Usuario`, `ServicoAutenticacao` |
| 1.000 moedas/semestre acumuláveis | UC05, `CreditoSemestral`, `Professor.saldoMoedas` |
| Envio com mensagem e saldo | UC06, `ServicoMoeda`, `TransacaoMoeda` |
| Vantagens e resgate | UC08–UC10, `Vantagem`, `Resgate` |
| Extratos | UC07, UC11 |
| E-mails recebimento/resgate | UC12, UC13, `ServicoNotificacao` |
| Arquitetura MVC | Diagrama de componentes |

---

## 7. Próximos passos (Sprint 2)

1. Modelo Entidade-Relacionamento (MER) a partir do diagrama de classes  
2. Estratégia de persistência (ORM ou DAO)  
3. CRUD integrado de **Aluno** e **Empresa Parceira**
