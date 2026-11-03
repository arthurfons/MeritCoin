import { Plus } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useMemo, useState } from 'react';
import { Modal } from '../components/Modal';
import { api } from '../lib/api';
import { useAuth } from '../lib/auth';

type StudentRow = {
  id: string;
  fullName: string;
  cpf?: string;
  studentNumber?: string | null;
  gradeYear?: string | null;
  balance: number;
  user: { email: string; active: boolean };
  course?: { name: string } | null;
  schoolClass?: { name: string } | null;
};

type FormData = {
  fullName: string;
  email: string;
  password: string;
  cpf: string;
  rg: string;
  street: string;
  number: string;
  complement?: string;
  district: string;
  city: string;
  state: string;
  zipCode: string;
  courseId: string;
  studentNumber?: string;
  gradeYear?: string;
  classId?: string;
};

const defaults: FormData = {
  fullName: '',
  email: '',
  password: 'Senha@123',
  cpf: '',
  rg: '',
  street: '',
  number: '',
  complement: '',
  district: '',
  city: 'Belo Horizonte',
  state: 'MG',
  zipCode: '',
  courseId: '',
  studentNumber: '',
  gradeYear: '3o Ano',
  classId: '',
};

export function StudentsPage() {
  const { user } = useAuth();
  const canCreate = user?.role === 'ESCOLA' || user?.role === 'ADMIN';
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');

  const { data = [], isLoading } = useQuery({
    queryKey: ['students'],
    queryFn: () => api.listStudents() as Promise<StudentRow[]>,
  });

  const { data: institutions = [] } = useQuery({
    queryKey: ['institutions'],
    queryFn: () => api.listInstitutions(),
    enabled: canCreate,
  });

  const courses = useMemo(
    () => institutions.flatMap((i) => i.courses),
    [institutions],
  );
  const classes = useMemo(
    () => institutions.flatMap((i) => i.classes),
    [institutions],
  );

  const { register, handleSubmit, reset } = useForm<FormData>({
    defaultValues: defaults,
  });

  function closeModal() {
    setOpen(false);
    setError('');
  }

  const create = useMutation({
    mutationFn: (payload: FormData) =>
      api.createStudent({
        ...payload,
        classId: payload.classId || undefined,
        studentNumber: payload.studentNumber || undefined,
        gradeYear: payload.gradeYear || undefined,
        complement: payload.complement || undefined,
      }),
    onSuccess: () => {
      setOk('Aluno cadastrado.');
      setError('');
      reset(defaults);
      setOpen(false);
      qc.invalidateQueries({ queryKey: ['students'] });
    },
    onError: (e: Error) => setError(e.message),
  });

  const deactivate = useMutation({
    mutationFn: (id: string) => api.deactivateStudent(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['students'] }),
    onError: (e: Error) => setError(e.message),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">Alunos</h2>
          <p className="text-neutral-500">
            Enunciado: CPF, RG, endereço, instituição/curso. Extra escola:
            matrícula, série e turma.
          </p>
        </div>
        {canCreate && (
          <button
            type="button"
            onClick={() => {
              setOk('');
              setError('');
              setOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-purple)] px-4 py-2.5 text-sm font-medium text-white"
          >
            <Plus size={16} /> Novo aluno
          </button>
        )}
      </div>

      {ok && (
        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {ok}
        </p>
      )}

      <div className="overflow-x-auto rounded-2xl bg-white ring-1 ring-neutral-200">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-neutral-50 text-neutral-500">
            <tr>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">Curso</th>
              <th className="px-4 py-3">Matrícula</th>
              <th className="px-4 py-3">Saldo</th>
              <th className="px-4 py-3">E-mail</th>
              {canCreate && <th className="px-4 py-3" />}
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td className="px-4 py-4" colSpan={6}>
                  Carregando...
                </td>
              </tr>
            )}
            {!isLoading && data.length === 0 && (
              <tr>
                <td className="px-4 py-8 text-neutral-500" colSpan={6}>
                  Nenhum aluno ainda.
                  {canCreate ? ' Clique em “Novo aluno” para cadastrar.' : ''}
                </td>
              </tr>
            )}
            {data.map((s) => (
              <tr key={s.id} className="border-t border-neutral-100">
                <td className="px-4 py-3 font-medium">{s.fullName}</td>
                <td className="px-4 py-3">{s.course?.name ?? '—'}</td>
                <td className="px-4 py-3">
                  {s.studentNumber ?? '—'}
                  {s.gradeYear ? ` · ${s.gradeYear}` : ''}
                </td>
                <td className="px-4 py-3">{s.balance}</td>
                <td className="px-4 py-3">{s.user.email}</td>
                {canCreate && (
                  <td className="px-4 py-3 text-right">
                    {s.user.active && (
                      <button
                        type="button"
                        onClick={() => deactivate.mutate(s.id)}
                        className="text-red-600 hover:underline"
                      >
                        Desativar
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={open}
        onClose={closeModal}
        wide
        title="Novo aluno"
        description="Campos do enunciado + extras da escola (matrícula, série, turma)."
      >
        <form
          onSubmit={handleSubmit((data) => create.mutate(data))}
          className="grid gap-3 sm:grid-cols-2"
        >
          {error && (
            <p className="sm:col-span-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}
          {(
            [
              ['fullName', 'Nome completo'],
              ['email', 'E-mail'],
              ['cpf', 'CPF'],
              ['rg', 'RG'],
              ['password', 'Senha'],
              ['street', 'Logradouro'],
              ['number', 'Número'],
              ['complement', 'Complemento'],
              ['district', 'Bairro'],
              ['city', 'Cidade'],
              ['state', 'UF'],
              ['zipCode', 'CEP'],
              ['studentNumber', 'Nº aluno (extra)'],
              ['gradeYear', 'Série/ano (extra)'],
            ] as const
          ).map(([name, label]) => (
            <label key={name} className="text-sm">
              {label}
              <input
                type={name === 'password' ? 'password' : 'text'}
                className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2"
                required={
                  name !== 'complement' &&
                  name !== 'studentNumber' &&
                  name !== 'gradeYear'
                }
                {...register(name)}
              />
            </label>
          ))}
          <label className="text-sm">
            Curso
            <select
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2"
              required
              {...register('courseId')}
            >
              <option value="">Selecione</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            Turma (extra)
            <select
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2"
              {...register('classId')}
            >
              <option value="">Sem turma</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <div className="sm:col-span-2 mt-2 flex flex-wrap justify-end gap-2">
            <button
              type="button"
              onClick={closeModal}
              className="rounded-xl border border-neutral-300 px-4 py-2.5 text-sm font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={create.isPending}
              className="rounded-xl bg-[var(--color-purple)] px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60"
            >
              {create.isPending ? 'Salvando...' : 'Cadastrar'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
