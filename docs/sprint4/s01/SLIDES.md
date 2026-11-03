# Estrutura de slides — Lab04S01 (pronta para colar)

## Slide 1 — Capa
**MeritCoin** · Lab04 Sprint 01 · Comportamento e UML  
PUC Minas · Projeto de Software

## Slide 2 — Objetivo
- Diagramas de Sequência (UML)
- Visão Geral de Interação
- Casos de uso restantes evidenciados
- Alinhamento modelo ↔ código

## Slide 3 — Lab03 × Lab04S01
| Lab03 | Lab04S01 |
|-------|----------|
| MER, CRUD, regras de moeda | Sequências + Overview |
| Código funcional | Modelos comportamentais |

## Slide 4 — Arquitetura MVC
React → Nest Controllers → Services → Prisma → PostgreSQL

## Slide 5 — SQ-04 Transferência
Professor → WalletPage → WalletsService → Prisma + EmailOutbox

## Slide 6 — SQ-07 Resgate
Aluno → RewardsService → débito + cupom → e-mails aluno/empresa

## Slide 7 — Visão Geral
Cadastro → Crédito → Envio → Extrato → Vantagem → Resgate

## Slide 8 — Alinhamento
Classes/componentes atualizados com `WalletsService`, `RewardsService`, `EmailOutbox`

## Slide 9 — Demo
professor@ / aluno@ / empresa@ · Senha@123

## Slide 10 — Conclusão
GitHub: https://github.com/arthurfons/MeritCoin · Próximo: implantação e nuvem
