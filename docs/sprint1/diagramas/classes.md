# Diagrama de Classes

Modelo de domínio alinhado à arquitetura MVC. Classes de **Controller** e **View** aparecem no diagrama de componentes; aqui o foco é o **Model** (entidades e serviços de negócio).

```mermaid
classDiagram
  direction TB

  class Usuario {
    <<abstract>>
    -Long id
    -String login
    -String senha
    -String email
    +autenticar(login, senha) boolean
  }

  class Aluno {
    -String nome
    -String cpf
    -String rg
    -Endereco endereco
    -Double saldoMoedas
    +resgatarVantagem(vantagem) Resgate
    +consultarExtrato() List~Movimentacao~
  }

  class Professor {
    -String nome
    -String cpf
    -String departamento
    -Double saldoMoedas
    +enviarMoedas(aluno, valor, mensagem) TransacaoMoeda
    +consultarExtrato() List~TransacaoMoeda~
    +receberCreditoSemestral(valor) void
  }

  class EmpresaParceira {
    -String nome
    -String cnpj
    +cadastrarVantagem(dados) Vantagem
    +atualizarVantagem(vantagem) void
    +removerVantagem(vantagem) void
  }

  class InstituicaoEnsino {
    -Long id
    -String nome
  }

  class Curso {
    -Long id
    -String nome
  }

  class Endereco {
    -String logradouro
    -String numero
    -String complemento
    -String bairro
    -String cidade
    -String estado
    -String cep
  }

  class Vantagem {
    -Long id
    -String descricao
    -String fotoUrl
    -Double custoMoedas
    -boolean ativa
  }

  class TransacaoMoeda {
    -Long id
    -Double valor
    -String mensagem
    -LocalDateTime dataHora
  }

  class Resgate {
    -Long id
    -String codigoCupom
    -LocalDateTime dataHora
    -Double valorDebitado
  }

  class CreditoSemestral {
    -Long id
    -String semestre
    -Double valor
    -LocalDateTime dataCredito
  }

  class ServicoAutenticacao {
    +login(login, senha) Usuario
    +logout() void
  }

  class ServicoMoeda {
    +enviarMoedas(professor, aluno, valor, mensagem) TransacaoMoeda
    +creditarSemestre(professor, valor) CreditoSemestral
  }

  class ServicoResgate {
    +resgatar(aluno, vantagem) Resgate
    +gerarCodigoCupom() String
  }

  class ServicoNotificacao {
    +notificarRecebimento(aluno, transacao) void
    +notificarResgateAluno(aluno, resgate) void
    +notificarResgateEmpresa(empresa, resgate) void
  }

  Usuario <|-- Aluno
  Usuario <|-- Professor
  Usuario <|-- EmpresaParceira

  Aluno "1" --> "1" Endereco : possui
  Aluno "*" --> "1" InstituicaoEnsino : estuda_em
  Aluno "*" --> "1" Curso : cursa
  Professor "*" --> "1" InstituicaoEnsino : vinculado_a
  EmpresaParceira "1" --> "*" Vantagem : oferece

  TransacaoMoeda "*" --> "1" Professor : enviada_por
  TransacaoMoeda "*" --> "1" Aluno : recebida_por

  Resgate "*" --> "1" Aluno : realizado_por
  Resgate "*" --> "1" Vantagem : referente_a

  CreditoSemestral "*" --> "1" Professor : creditado_a

  ServicoMoeda ..> Professor
  ServicoMoeda ..> Aluno
  ServicoMoeda ..> TransacaoMoeda
  ServicoMoeda ..> ServicoNotificacao

  ServicoResgate ..> Aluno
  ServicoResgate ..> Vantagem
  ServicoResgate ..> Resgate
  ServicoResgate ..> ServicoNotificacao

  ServicoAutenticacao ..> Usuario
```

---

## Regras de negócio refletidas nas classes

| Regra | Onde aparece |
|-------|----------------|
| Login e senha obrigatórios | `Usuario` (+ `ServicoAutenticacao`) |
| Aluno: Nome, E-mail, CPF, RG, Endereço, Instituição, Curso | `Aluno`, `Endereco`, `InstituicaoEnsino`, `Curso` |
| Professor pré-cadastrado: Nome, CPF, Departamento, Instituição | `Professor` |
| 1.000 moedas/semestre, saldo acumulável | `Professor.saldoMoedas`, `CreditoSemestral`, `receberCreditoSemestral` |
| Envio exige saldo e mensagem | `ServicoMoeda.enviarMoedas` / `Professor.enviarMoedas` |
| Vantagem: descrição, foto, custo | `Vantagem` |
| Resgate debita saldo e gera cupom | `Resgate.codigoCupom`, `ServicoResgate` |
| E-mails de recebimento e resgate | `ServicoNotificacao` |

---

## Multiplicidades

| Relação | Cardinalidade |
|---------|---------------|
| Instituição → Alunos | 1 : N |
| Instituição → Professores | 1 : N |
| Curso → Alunos | 1 : N |
| Empresa → Vantagens | 1 : N |
| Professor → Transações enviadas | 1 : N |
| Aluno → Transações recebidas | 1 : N |
| Aluno → Resgates | 1 : N |
| Vantagem → Resgates | 1 : N |
