import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { api } from '../api';
import type { Aluno, Instituicao } from '../api';

const emptyForm = {
  nome: '',
  email: '',
  cpf: '',
  rg: '',
  login: '',
  senha: '',
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  estado: 'MG',
  cep: '',
  instituicaoId: '',
  cursoId: '',
};

export function AlunosPage() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [instituicoes, setInstituicoes] = useState<Instituicao[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');
  const [loading, setLoading] = useState(false);

  const cursos = useMemo(() => {
    const inst = instituicoes.find((i) => i.id === Number(form.instituicaoId));
    return inst?.cursos ?? [];
  }, [instituicoes, form.instituicaoId]);

  async function load() {
    const [lista, insts] = await Promise.all([
      api.listAlunos(),
      api.listInstituicoes(),
    ]);
    setAlunos(lista);
    setInstituicoes(insts);
  }

  useEffect(() => {
    load().catch((e) => setError(e.message));
  }, []);

  function setField(name: string, value: string) {
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'instituicaoId' ? { cursoId: '' } : {}),
    }));
  }

  function startEdit(aluno: Aluno) {
    setEditingId(aluno.id);
    setForm({
      nome: aluno.nome,
      email: aluno.email,
      cpf: aluno.cpf,
      rg: aluno.rg,
      login: aluno.login,
      senha: '',
      logradouro: aluno.logradouro,
      numero: aluno.numero,
      complemento: aluno.complemento ?? '',
      bairro: aluno.bairro,
      cidade: aluno.cidade,
      estado: aluno.estado,
      cep: aluno.cep,
      instituicaoId: String(aluno.instituicaoId),
      cursoId: String(aluno.cursoId),
    });
    setError('');
    setOk('');
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setOk('');
    try {
      const payload: Record<string, unknown> = {
        ...form,
        instituicaoId: Number(form.instituicaoId),
        cursoId: Number(form.cursoId),
      };
      if (editingId && !form.senha) delete payload.senha;
      if (editingId) {
        await api.updateAluno(editingId, payload);
        setOk('Aluno atualizado com sucesso.');
      } else {
        await api.createAluno(payload);
        setOk('Aluno cadastrado com sucesso.');
      }
      resetForm();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao salvar');
    } finally {
      setLoading(false);
    }
  }

  async function onDelete(id: number) {
    if (!confirm('Remover este aluno?')) return;
    try {
      await api.deleteAluno(id);
      setOk('Aluno removido.');
      if (editingId === id) resetForm();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao remover');
    }
  }

  return (
    <section className="panel">
      <h2>CRUD de Aluno</h2>
      <p className="hint">
        Cadastro com instituição pré-cadastrada, curso e endereço. Senha armazenada
        com hash no backend.
      </p>

      {error && <p className="alert">{error}</p>}
      {ok && <p className="alert ok">{ok}</p>}

      <form onSubmit={onSubmit} className="grid-form">
        <label>
          Nome
          <input
            required
            value={form.nome}
            onChange={(e) => setField('nome', e.target.value)}
          />
        </label>
        <label>
          E-mail
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => setField('email', e.target.value)}
          />
        </label>
        <label>
          CPF
          <input
            required
            value={form.cpf}
            onChange={(e) => setField('cpf', e.target.value)}
            placeholder="somente números"
          />
        </label>
        <label>
          RG
          <input
            required
            value={form.rg}
            onChange={(e) => setField('rg', e.target.value)}
          />
        </label>
        <label>
          Login
          <input
            required
            value={form.login}
            onChange={(e) => setField('login', e.target.value)}
          />
        </label>
        <label>
          Senha {editingId ? '(deixe em branco para manter)' : ''}
          <input
            required={!editingId}
            type="password"
            minLength={6}
            value={form.senha}
            onChange={(e) => setField('senha', e.target.value)}
          />
        </label>
        <label>
          Instituição
          <select
            required
            value={form.instituicaoId}
            onChange={(e) => setField('instituicaoId', e.target.value)}
          >
            <option value="">Selecione</option>
            {instituicoes.map((i) => (
              <option key={i.id} value={i.id}>
                {i.nome}
              </option>
            ))}
          </select>
        </label>
        <label>
          Curso
          <select
            required
            value={form.cursoId}
            onChange={(e) => setField('cursoId', e.target.value)}
            disabled={!form.instituicaoId}
          >
            <option value="">Selecione</option>
            {cursos.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
        </label>
        <label className="full">
          Logradouro
          <input
            required
            value={form.logradouro}
            onChange={(e) => setField('logradouro', e.target.value)}
          />
        </label>
        <label>
          Número
          <input
            required
            value={form.numero}
            onChange={(e) => setField('numero', e.target.value)}
          />
        </label>
        <label>
          Complemento
          <input
            value={form.complemento}
            onChange={(e) => setField('complemento', e.target.value)}
          />
        </label>
        <label>
          Bairro
          <input
            required
            value={form.bairro}
            onChange={(e) => setField('bairro', e.target.value)}
          />
        </label>
        <label>
          Cidade
          <input
            required
            value={form.cidade}
            onChange={(e) => setField('cidade', e.target.value)}
          />
        </label>
        <label>
          Estado (UF)
          <input
            required
            maxLength={2}
            value={form.estado}
            onChange={(e) => setField('estado', e.target.value)}
          />
        </label>
        <label>
          CEP
          <input
            required
            value={form.cep}
            onChange={(e) => setField('cep', e.target.value)}
          />
        </label>

        <div className="actions full">
          <button type="submit" disabled={loading}>
            {editingId ? 'Salvar alterações' : 'Cadastrar aluno'}
          </button>
          {editingId && (
            <button type="button" className="secondary" onClick={resetForm}>
              Cancelar edição
            </button>
          )}
        </div>
      </form>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Instituição / Curso</th>
              <th>Saldo</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {alunos.map((a) => (
              <tr key={a.id}>
                <td>
                  <strong>{a.nome}</strong>
                  <div>{a.cpf}</div>
                </td>
                <td>{a.email}</td>
                <td>
                  {a.instituicao?.nome}
                  <div>{a.curso?.nome}</div>
                </td>
                <td>{a.saldoMoedas}</td>
                <td>
                  <div className="row-actions">
                    <button
                      type="button"
                      className="secondary"
                      onClick={() => startEdit(a)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="danger"
                      onClick={() => onDelete(a.id)}
                    >
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {alunos.length === 0 && (
              <tr>
                <td colSpan={5}>Nenhum aluno cadastrado ainda.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
