# Diagramas Lab04S01

## Sequência

| ID | Arquivo | Caso |
|----|---------|------|
| SQ-01 | `sq01-autenticacao.puml` | Login JWT |
| SQ-02 | `sq02-cadastro-aluno.puml` | Auto-cadastro aluno |
| SQ-03 | `sq03-credito-semestral.puml` | 1.000 moedas/semestre |
| SQ-04 | `sq04-transferencia.puml` | Envio professor → aluno |
| SQ-05 | `sq05-extrato.puml` | Consulta extrato |
| SQ-06 | `sq06-cadastro-vantagem.puml` | Empresa publica vantagem |
| SQ-07 | `sq07-resgate.puml` | Resgate + cupom + e-mails |

## Visão Geral de Interação

`visao-geral-interacao.puml` — activity overview ligando SQ-01…SQ-07.

## Como gerar PNG

```bash
# com PlantUML instalado / jar
java -jar plantuml.jar -tpng *.puml
```

Ou cole o `.puml` em https://www.plantuml.com/plantuml/uml
