# Modelo ER — Lab03S02 (Sprint 2)

Fonte de verdade da implementação: `backend/prisma/schema.prisma`.  
Diagrama PlantUML: [diagramas/mer.puml](diagramas/mer.puml).

## Escopo desta sprint

Entidades centrais do **CRUD de Aluno** e **CRUD de Empresa Parceira**, com suporte a instituição/curso e autenticação.

## Diagrama (MER lógico)

```mermaid
erDiagram
  USER ||--o| STUDENT_PROFILE : "1:0..1"
  USER ||--o| TEACHER_PROFILE : "1:0..1"
  USER ||--o| COMPANY_PROFILE : "1:0..1"
  USER ||--o| SCHOOL_PROFILE : "1:0..1"

  INSTITUTION ||--o{ COURSE : possui
  INSTITUTION ||--o{ DEPARTMENT : possui
  INSTITUTION ||--o{ STUDENT_PROFILE : matricula
  INSTITUTION ||--o{ TEACHER_PROFILE : vincula
  INSTITUTION ||--o{ SCHOOL_PROFILE : administra
  INSTITUTION ||--o{ SCHOOL_CLASS : possui

  DEPARTMENT ||--o{ TEACHER_PROFILE : aloca
  COURSE ||--o{ STUDENT_PROFILE : cursa
  SCHOOL_CLASS ||--o{ STUDENT_PROFILE : turma

  USER {
    uuid id PK
    string email UK
    string passwordHash
    enum role "ALUNO|PROFESSOR|EMPRESA|ESCOLA|ADMIN"
    boolean active
  }

  STUDENT_PROFILE {
    uuid id PK
    uuid userId FK_UK
    string fullName
    string cpf UK
    string rg
    string street
    string number
    string complement
    string district
    string city
    string state
    string zipCode
    string studentNumber "extra opcional"
    string gradeYear "extra opcional"
    int balance
    uuid institutionId FK
    uuid courseId FK
    uuid classId FK "opcional"
  }

  COMPANY_PROFILE {
    uuid id PK
    uuid userId FK_UK
    string tradeName
    string cnpj UK
  }

  TEACHER_PROFILE {
    uuid id PK
    uuid userId FK_UK
    string fullName
    string cpf UK
    int balance
    uuid institutionId FK
    uuid departmentId FK
  }

  INSTITUTION {
    uuid id PK
    string name UK
    boolean active
  }

  COURSE {
    uuid id PK
    string name
    uuid institutionId FK
  }

  DEPARTMENT {
    uuid id PK
    string name
    uuid institutionId FK
  }

  SCHOOL_CLASS {
    uuid id PK
    string name
    string gradeYear
    uuid institutionId FK
  }

  SCHOOL_PROFILE {
    uuid id PK
    uuid userId FK_UK
    string displayName
    uuid institutionId FK
  }
```

## Observações

1. **User + Profile:** login/senha ficam em `User`; dados de domínio em perfis (evita duplicar credenciais).
2. **Aluno (enunciado):** CPF, RG, endereço completo, instituição e curso.
3. **Empresa:** nome fantasia + CNPJ + usuário de acesso.
4. **Professor:** pré-cadastrado no seed (sem auto-cadastro público nesta sprint).
5. **Extras** (missões, carteira, vantagens) existem no schema para evolução; o requisito mínimo da Sprint 2 é o MER + CRUDs aluno/empresa.

## Cardinalidades principais

| Relação | Cardinalidade |
|---------|---------------|
| User → StudentProfile | 1 : 0..1 |
| User → CompanyProfile | 1 : 0..1 |
| Institution → Student | 1 : N |
| Course → Student | 1 : N |
| Institution → Course | 1 : N |
