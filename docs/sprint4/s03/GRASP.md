# Refatorações GRASP — Lab04S03

Aplicadas no código de https://github.com/BernardoApl/Sistema-de-Moeda-Estudantil, commit `8a4eca7`, pasta `Entrega Sprint 3/sistema`. Cada uma é um patch independente sobre `main`. Os 26 testes do projeto passaram de novo em cada branch.

## 1) Information Expert — código do cupom

**Antes:** `resgatar`, em `services.py`, montava o código no meio da transação:

```python
codigo = secrets.token_hex(12).upper()
```

**Depois:** `cupom.py` conhece o formato. O resgate só pede o código.

```python
def gerar_codigo_cupom():
    return secrets.token_hex(12).upper()
```

**Por quê:** o resgate sabe debitar saldo, gravar o custo histórico e avisar as duas contas. O formato do token (12 bytes em hexadecimal maiúsculo) é outro conhecimento. Isolá-lo permite trocar o gerador sem reabrir a transação.

## 2) Information Expert — crédito semestral

**Antes:** `creditar_semestre` validava o texto `AAAA-1`/`AAAA-2` e somava o literal `1000` no `UPDATE`. O `INSERT` em `creditos` omitia `valor` e dependia do `DEFAULT` do SQLite.

**Depois:** `credito.py` guarda a política.

```python
MOEDAS_POR_SEMESTRE = 1000

def validar_semestre(semestre):
    if not re.fullmatch(r'20\d{2}-[12]', semestre):
        raise ValueError('Semestre deve seguir AAAA-1 ou AAAA-2.')
    return semestre
```

`creditar_semestre` chama `validar_semestre` e grava `MOEDAS_POR_SEMESTRE` tanto na linha de `creditos` quanto no saldo. A idempotência continua no `INSERT OR IGNORE` e na chave única `(professor_id, semestre)`.

**Por quê:** quem conhece “quanto vale o semestre e qual texto é aceito” não precisa ser a rotina que percorre os professores.

## 3) Indirection — caixa de notificações

**Antes:** `notificar` em `services.py` executava o `INSERT` em `notificacoes`. `transferir` e `resgatar` dependiam dessa tabela.

**Depois:** `notificador.py` concentra o `INSERT`.

```python
class Notificador:
    def notificar(self, conta, assunto, mensagem):
        db().execute(
            'INSERT INTO notificacoes(conta_id,destinatario,assunto,mensagem) VALUES(?,?,?,?)',
            (conta['id'], conta['email'], assunto, mensagem),
        )
```

A função `notificar` de `services.py` permanece e só encaminha a chamada. O teste `test_atomicidade_falha_notificacao` continua substituindo `services.notificar` e verificando o rollback.

**Por quê:** a fachada é o ponto estável. Trocar a caixa (outra tabela, fila, SMTP imediato) mexe em `Notificador`, não nas regras de saldo.

## Evidência

| Branch local | Testes |
|--------------|--------|
| `grasp-01-cupom` (`c4b6818`) | 26 OK |
| `grasp-02-credito` (`3dafb90`) | 26 OK |
| `grasp-03-notificador` (`046bbf8`) | 26 OK |

O fork para publicar os pull requests devolveu HTTP 403 neste ambiente. Os diffs estão em `patches/`. O relatório descreve o comando para abri-los com uma conta que possa criar o fork.
