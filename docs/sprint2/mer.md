# Modelo Entidade-Relacionamento (MER)

Derivado do diagrama de classes da Sprint 1, com foco nas entidades necessárias aos CRUDs da Sprint 2 e preparando o domínio completo.

## Diagrama (Mermaid ER)

```mermaid
erDiagram
  INSTITUICAO ||--o{ CURSO : oferece
  INSTITUICAO ||--o{ ALUNO : possui
  CURSO ||--o{ ALUNO : matricula
  EMPRESA_PARCEIRA ||--o{ VANTAGEM : oferece
  PROFESSOR ||--o{ TRANSACAO_MOEDA : envia
  ALUNO ||--o{ TRANSACAO_MOEDA : recebe
  ALUNO ||--o{ RESGATE : realiza
  VANTAGEM ||--o{ RESGATE : gera
  PROFESSOR ||--o{ CREDITO_SEMESTRAL : recebe

  INSTITUICAO {
    int id PK
    string nome UK
  }

  CURSO {
    int id PK
    string nome
    int instituicaoId FK
  }

  ALUNO {
    int id PK
    string nome
    string email UK
    string cpf UK
    string rg
    string login UK
    string senhaHash
    float saldoMoedas
    string logradouro
    string numero
    string complemento
    string bairro
    string cidade
    string estado
    string cep
    int instituicaoId FK
    int cursoId FK
  }

  EMPRESA_PARCEIRA {
    int id PK
    string nome
    string cnpj UK
    string email UK
    string login UK
    string senhaHash
  }

  PROFESSOR {
    int id PK
    string nome
    string cpf UK
    string departamento
    string login UK
    string senhaHash
    float saldoMoedas
    int instituicaoId FK
  }

  VANTAGEM {
    int id PK
    string descricao
    string fotoUrl
    float custoMoedas
    boolean ativa
    int empresaId FK
  }

  TRANSACAO_MOEDA {
    int id PK
    float valor
    string mensagem
    datetime dataHora
    int professorId FK
    int alunoId FK
  }

  RESGATE {
    int id PK
    string codigoCupom UK
    float valorDebitado
    datetime dataHora
    int alunoId FK
    int vantagemId FK
  }

  CREDITO_SEMESTRAL {
    int id PK
    string semestre
    float valor
    datetime dataCredito
    int professorId FK
  }
```

## Escopo implementado na Sprint 2

| Entidade | Persistida | CRUD nesta sprint |
|----------|------------|-------------------|
| Instituicao | Sim (seed) | Leitura (listagem para o formulário de aluno) |
| Curso | Sim (seed) | Leitura (listagem filtrada por instituição) |
| Aluno | Sim | **CRUD completo** |
| EmpresaParceira | Sim | **CRUD completo** |
| Professor, Vantagem, Transacao, Resgate, Credito | Schema preparado | Sprint 3 |

## Dicionário de dados (Sprint 2)

### INSTITUICAO
| Atributo | Tipo | Restrições |
|----------|------|------------|
| id | INTEGER | PK, autoincremento |
| nome | VARCHAR | NOT NULL, UNIQUE |

### CURSO
| Atributo | Tipo | Restrições |
|----------|------|------------|
| id | INTEGER | PK |
| nome | VARCHAR | NOT NULL |
| instituicaoId | INTEGER | FK → INSTITUICAO |

### ALUNO
| Atributo | Tipo | Restrições |
|----------|------|------------|
| id | INTEGER | PK |
| nome, email, cpf, rg | VARCHAR | email/cpf UNIQUE, NOT NULL |
| login, senhaHash | VARCHAR | login UNIQUE |
| saldoMoedas | REAL | DEFAULT 0 |
| logradouro, numero, bairro, cidade, estado, cep | VARCHAR | NOT NULL |
| complemento | VARCHAR | NULL |
| instituicaoId, cursoId | INTEGER | FK |

### EMPRESA_PARCEIRA
| Atributo | Tipo | Restrições |
|----------|------|------------|
| id | INTEGER | PK |
| nome, cnpj, email, login, senhaHash | VARCHAR | cnpj/email/login UNIQUE |

## Cardinalidades

- 1 Instituição → N Cursos / N Alunos / N Professores  
- 1 Curso → N Alunos  
- 1 Empresa → N Vantagens  
- 1 Professor → N Transações / N Créditos  
- 1 Aluno → N Transações / N Resgates  
