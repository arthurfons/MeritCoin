# Histórias do Usuário — Sistema de Moeda Estudantil

Formato: **Como** [ator], **quero** [ação], **para** [benefício].  
Prioridade: Alta / Média / Baixa · Sprint sugerida: S1 (modelagem) / S2 / S3.

---

## Épico 1 — Autenticação e Cadastro

### US-01 — Cadastro de Aluno
**Como** aluno,  
**quero** me cadastrar informando Nome, E-mail, CPF, RG, Endereço, Instituição de Ensino e Curso,  
**para** ter acesso ao sistema e receber moedas de reconhecimento.

| Campo | Valor |
|-------|-------|
| Prioridade | Alta |
| Sprint | 2–3 |
| Critérios de aceite | Dados obrigatórios validados; instituição deve existir (pré-cadastrada); login/senha criados; e-mail e CPF únicos |

### US-02 — Cadastro de Empresa Parceira
**Como** empresa parceira,  
**quero** me cadastrar no sistema,  
**para** oferecer vantagens aos alunos.

| Campo | Valor |
|-------|-------|
| Prioridade | Alta |
| Sprint | 2–3 |
| Critérios de aceite | Cadastro com login/senha; empresa autenticada pode gerenciar vantagens |

### US-03 — Login no sistema
**Como** aluno, professor ou empresa,  
**quero** autenticar-me com login e senha,  
**para** acessar apenas as operações permitidas ao meu perfil.

| Campo | Valor |
|-------|-------|
| Prioridade | Alta |
| Sprint | 2–3 |
| Critérios de aceite | Autenticação obrigatória para todas as operações; sessão/perfil corretos; credenciais inválidas rejeitadas |

### US-04 — Pré-cadastro de Professor
**Como** instituição (via operação administrativa do sistema),  
**quero** que professores sejam pré-cadastrados com Nome, CPF, Departamento e Instituição,  
**para** que possam distribuir moedas sem se auto-cadastrar.

| Campo | Valor |
|-------|-------|
| Prioridade | Alta |
| Sprint | 3 |
| Critérios de aceite | Professor vinculado a instituição e departamento; possui login/senha; recebe 1.000 moedas por semestre |

---

## Épico 2 — Distribuição de Moedas (Professor)

### US-05 — Crédito semestral de moedas
**Como** professor,  
**quero** receber 1.000 moedas no início de cada semestre,  
**para** reconhecer o mérito dos alunos.

| Campo | Valor |
|-------|-------|
| Prioridade | Alta |
| Sprint | 3 |
| Critérios de aceite | Crédito de 1.000 moedas por semestre; saldo acumulável (moedas não usadas somam-se ao próximo semestre) |

### US-06 — Enviar moedas a um aluno
**Como** professor,  
**quero** enviar moedas a um aluno informando o valor e uma mensagem aberta com o motivo,  
**para** reconhecer comportamento, participação ou outro mérito.

| Campo | Valor |
|-------|-------|
| Prioridade | Alta |
| Sprint | 3 |
| Critérios de aceite | Saldo do professor ≥ valor enviado; mensagem obrigatória e não vazia; débito no professor e crédito no aluno; registro no extrato |

### US-07 — Consultar saldo e extrato (Professor)
**Como** professor,  
**quero** visualizar meu saldo atual e o extrato das moedas enviadas,  
**para** controlar a distribuição no semestre.

| Campo | Valor |
|-------|-------|
| Prioridade | Alta |
| Sprint | 3 |
| Critérios de aceite | Exibe saldo atual; lista envios com aluno, valor, mensagem e data |

---

## Épico 3 — Troca de Vantagens (Aluno e Empresa)

### US-08 — Cadastrar vantagem
**Como** empresa parceira,  
**quero** cadastrar uma vantagem com Descrição, Foto do produto e Custo em moedas,  
**para** oferecer benefícios aos alunos.

| Campo | Valor |
|-------|-------|
| Prioridade | Alta |
| Sprint | 3 |
| Critérios de aceite | Campos obrigatórios; custo > 0; foto associada; vantagem vinculada à empresa logada |

### US-09 — Gerenciar vantagens
**Como** empresa parceira,  
**quero** listar, editar e remover minhas vantagens,  
**para** manter as ofertas atualizadas.

| Campo | Valor |
|-------|-------|
| Prioridade | Média |
| Sprint | 3 |
| Critérios de aceite | Empresa só altera as próprias vantagens; remoção/edição refletidas na listagem do aluno |

### US-10 — Listar e resgatar vantagem
**Como** aluno,  
**quero** escolher uma vantagem e resgatá-la,  
**para** trocar minhas moedas por descontos ou produtos.

| Campo | Valor |
|-------|-------|
| Prioridade | Alta |
| Sprint | 3 |
| Critérios de aceite | Saldo do aluno ≥ custo; débito imediato; geração de cupom/código; registro no extrato |

### US-11 — Consultar saldo e extrato (Aluno)
**Como** aluno,  
**quero** visualizar meu saldo, as moedas recebidas e as trocas realizadas,  
**para** acompanhar meu mérito e meus resgates.

| Campo | Valor |
|-------|-------|
| Prioridade | Alta |
| Sprint | 3 |
| Critérios de aceite | Saldo atual; histórico de recebimentos; histórico de resgates |

---

## Épico 4 — Notificações

### US-12 — E-mail ao receber moedas
**Como** aluno,  
**quero** receber um e-mail quando ganhar moedas,  
**para** ser notificado do reconhecimento.

| Campo | Valor |
|-------|-------|
| Prioridade | Alta |
| Sprint | 3 |
| Critérios de aceite | E-mail enviado após envio bem-sucedido; contém valor, professor e mensagem |

### US-13 — E-mails de resgate (aluno e empresa)
**Como** aluno e empresa parceira,  
**quero** receber e-mails após um resgate,  
**para** o aluno usar o cupom presencialmente e a empresa conferir a troca.

| Campo | Valor |
|-------|-------|
| Prioridade | Alta |
| Sprint | 3 |
| Critérios de aceite | Código/cupom gerado pelo sistema; e-mail ao aluno com cupom e código; e-mail à empresa para conferência |

---

## Épico 5 — CRUDs iniciais (Sprint 2)

### US-14 — CRUD de Aluno (versão inicial)
**Como** usuário autenticado do sistema (fluxo de cadastro/manutenção),  
**quero** criar, consultar, atualizar e remover alunos com front-end integrado ao back-end,  
**para** ter a base persistente do domínio na Sprint 2.

| Campo | Valor |
|-------|-------|
| Prioridade | Alta |
| Sprint | 2 |
| Critérios de aceite | Persistência via estratégia definida (ORM/DAO); telas integradas; validações básicas |

### US-15 — CRUD de Empresa Parceira (versão inicial)
**Como** usuário do sistema,  
**quero** criar, consultar, atualizar e remover empresas parceiras com front-end integrado ao back-end,  
**para** preparar o fluxo de vantagens nas sprints seguintes.

| Campo | Valor |
|-------|-------|
| Prioridade | Alta |
| Sprint | 2 |
| Critérios de aceite | Persistência consistente com o MER; telas integradas; validações básicas |

---

## Mapeamento História → Casos de Uso

| História | Caso(s) de uso |
|----------|----------------|
| US-01 | UC01 Cadastrar Aluno |
| US-02 | UC02 Cadastrar Empresa Parceira |
| US-03 | UC03 Autenticar Usuário |
| US-04 | UC04 Pré-cadastrar Professor |
| US-05 | UC05 Creditar Moedas Semestrais |
| US-06 | UC06 Enviar Moedas ao Aluno |
| US-07 | UC07 Consultar Extrato Professor |
| US-08 | UC08 Cadastrar Vantagem |
| US-09 | UC09 Gerenciar Vantagens |
| US-10 | UC10 Resgatar Vantagem |
| US-11 | UC11 Consultar Extrato Aluno |
| US-12 | UC12 Notificar Recebimento de Moedas |
| US-13 | UC13 Notificar Resgate |
| US-14 / US-15 | UC01, UC02 (+ manutenção CRUD) |
