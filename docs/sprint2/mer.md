# MER — Sprint 2 (PostgreSQL)

Modelo alinhado ao `backend/prisma/schema.prisma`.

```mermaid
erDiagram
  USER ||--o| STUDENT_PROFILE : possui
  USER ||--o| TEACHER_PROFILE : possui
  USER ||--o| COMPANY_PROFILE : possui
  INSTITUTION ||--o{ COURSE : oferece
  INSTITUTION ||--o{ DEPARTMENT : possui
  INSTITUTION ||--o{ STUDENT_PROFILE : matricula
  INSTITUTION ||--o{ TEACHER_PROFILE : vincula
  DEPARTMENT ||--o{ TEACHER_PROFILE : aloca
  COURSE ||--o{ STUDENT_PROFILE : cursa

  USER {
    uuid id PK
    string email UK
    string passwordHash
    enum role
    boolean active
  }

  STUDENT_PROFILE {
    uuid id PK
    uuid userId UK
    string fullName
    string cpf UK
    string rg
    int balance
    uuid institutionId FK
    uuid courseId FK
  }

  TEACHER_PROFILE {
    uuid id PK
    uuid userId UK
    string fullName
    string cpf UK
    int balance
    uuid institutionId FK
    uuid departmentId FK
  }

  COMPANY_PROFILE {
    uuid id PK
    uuid userId UK
    string tradeName
    string cnpj UK
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
```

## Escopo CRUD Sprint 2

- **Aluno:** cadastro público (`POST /auth/register/student`) + consulta/edição/desativação autenticada
- **Empresa:** cadastro público (`POST /auth/register/company`) + consulta/edição/desativação autenticada
- **Professor:** apenas seed/pré-cadastro institucional
