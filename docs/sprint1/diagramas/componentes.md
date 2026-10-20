# Diagrama de Componentes

Arquitetura **MVC** com camadas de apresentação, controle, negócio, persistência e serviços externos (e-mail).

```mermaid
flowchart TB
  subgraph cliente["Camada Cliente"]
    Browser["Navegador Web"]
  end

  subgraph apresentacao["Camada de Apresentação — View"]
    VAluno["Views Aluno"]
    VProfessor["Views Professor"]
    VEmpresa["Views Empresa"]
    VAuth["Views Autenticação / Cadastro"]
  end

  subgraph controle["Camada de Controle — Controller"]
    CAluno["AlunoController"]
    CProfessor["ProfessorController"]
    CEmpresa["EmpresaController"]
    CAuth["AuthController"]
    CVantagem["VantagemController"]
    CResgate["ResgateController"]
    CExtrato["ExtratoController"]
  end

  subgraph negocio["Camada de Negócio — Model / Services"]
    SAuth["ServicoAutenticacao"]
    SMoeda["ServicoMoeda"]
    SResgate["ServicoResgate"]
    SNotif["ServicoNotificacao"]
    Dominio["Entidades de Domínio\n(Aluno, Professor, Empresa,\nVantagem, Transacao, Resgate)"]
  end

  subgraph persistencia["Camada de Persistência"]
    DAO["DAOs / Repositórios\n(ORM ou Padrão DAO)"]
    BD[("Banco de Dados Relacional")]
  end

  subgraph externos["Serviços Externos"]
    Email["Servidor de E-mail\n(SMTP)"]
  end

  Browser --> VAluno & VProfessor & VEmpresa & VAuth

  VAluno --> CAluno & CResgate & CExtrato
  VProfessor --> CProfessor & CExtrato
  VEmpresa --> CEmpresa & CVantagem
  VAuth --> CAuth

  CAuth --> SAuth
  CProfessor --> SMoeda
  CResgate --> SResgate
  CExtrato --> SMoeda & SResgate
  CAluno --> Dominio
  CEmpresa --> Dominio
  CVantagem --> Dominio

  SAuth --> Dominio
  SMoeda --> Dominio
  SResgate --> Dominio
  SMoeda --> SNotif
  SResgate --> SNotif

  SAuth & SMoeda & SResgate & Dominio --> DAO
  DAO --> BD
  SNotif --> Email
```

---

## Responsabilidades por camada

| Camada | Componentes | Responsabilidade |
|--------|-------------|------------------|
| **View** | Telas web por perfil | Formulários, listagens, extratos; não contém regra de negócio |
| **Controller** | Controllers por recurso | Recebe requisições HTTP, valida entrada básica, aciona serviços, devolve resposta à View |
| **Model / Services** | Serviços + entidades | Regras de negócio (saldo, mensagem, crédito semestral, cupom) |
| **Persistência** | DAO / ORM | CRUD e consultas; isola o SGBD |
| **Externo** | E-mail | Notificações de recebimento e resgate |

---

## Fluxos principais entre componentes

### Envio de moedas
`View Professor` → `ProfessorController` → `ServicoMoeda` → valida saldo/mensagem → persiste `TransacaoMoeda` → `ServicoNotificacao` → E-mail ao aluno

### Resgate de vantagem
`View Aluno` → `ResgateController` → `ServicoResgate` → debita saldo → gera cupom → persiste `Resgate` → `ServicoNotificacao` → E-mails ao aluno e à empresa

### CRUD Aluno / Empresa (Sprint 2)
`Views Cadastro` → `AlunoController` / `EmpresaController` → entidades → DAO/ORM → Banco

---

## Decisões de arquitetura (Sprint 1)

1. **MVC clássico** — separação clara View / Controller / Model, exigida pelo enunciado.
2. **Serviços de domínio** — regras de moeda, resgate e notificação fora dos Controllers, facilitando testes e alinhamento ao diagrama de classes.
3. **Persistência encapsulada** — ORM ou DAO (definição e implementação na Sprint 2); componentes acima não conhecem SQL.
4. **Notificação assíncrona/independente** — `ServicoNotificacao` como componente dedicado ao SMTP, desacoplado do fluxo de UI.
