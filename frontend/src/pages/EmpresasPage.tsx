import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { api } from '../api';
import type { Empresa } from '../api';

const emptyForm = {
  nome: '',
  cnpj: '',
  email: '',
  login: '',
  senha: '',
};

export function EmpresasPage() {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');
  const [loading, setLoading] = useState(false);

  async function load() {
    setEmpresas(await api.listEmpresas());
  }

  useEffect(() => {
    load().catch((e) => setError(e.message));
  }, []);

  function setField(name: string, value: string) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function startEdit(empresa: Empresa) {
    setEditingId(empresa.id);
    setForm({
      nome: empresa.nome,
      cnpj: empresa.cnpj,
      email: empresa.email,
      login: empresa.login,
      senha: '',
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
      const payload: Record<string, unknown> = { ...form };
      if (editingId && !form.senha) delete payload.senha;
      if (editingId) {
        await api.updateEmpresa(editingId, payload);
        setOk('Empresa atualizada com sucesso.');
      } else {
        await api.createEmpresa(payload);
        setOk('Empresa cadastrada com sucesso.');
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
    if (!confirm('Remover esta empresa?')) return;
    try {
      await api.deleteEmpresa(id);
      setOk('Empresa removida.');
      if (editingId === id) resetForm();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao remover');
    }
  }

  return (
    <section className="panel">
      <h2>CRUD de Empresa Parceira</h2>
      <p className="hint">
        Cadastro de empresas que oferecerão vantagens na Sprint 3.
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
          CNPJ
          <input
            required
            value={form.cnpj}
            onChange={(e) => setField('cnpj', e.target.value)}
            placeholder="somente números"
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
          Login
          <input
            required
            value={form.login}
            onChange={(e) => setField('login', e.target.value)}
          />
        </label>
        <label className="full">
          Senha {editingId ? '(deixe em branco para manter)' : ''}
          <input
            required={!editingId}
            type="password"
            minLength={6}
            value={form.senha}
            onChange={(e) => setField('senha', e.target.value)}
          />
        </label>

        <div className="actions full">
          <button type="submit" disabled={loading}>
            {editingId ? 'Salvar alterações' : 'Cadastrar empresa'}
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
              <th>CNPJ</th>
              <th>E-mail</th>
              <th>Login</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {empresas.map((e) => (
              <tr key={e.id}>
                <td>
                  <strong>{e.nome}</strong>
                </td>
                <td>{e.cnpj}</td>
                <td>{e.email}</td>
                <td>{e.login}</td>
                <td>
                  <div className="row-actions">
                    <button
                      type="button"
                      className="secondary"
                      onClick={() => startEdit(e)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="danger"
                      onClick={() => onDelete(e.id)}
                    >
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {empresas.length === 0 && (
              <tr>
                <td colSpan={5}>Nenhuma empresa cadastrada ainda.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
