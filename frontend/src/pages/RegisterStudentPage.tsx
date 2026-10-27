import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { api } from '../lib/api';
import { useAuth } from '../lib/auth';

const schema = z.object({
  fullName: z.string().min(3),
  email: z.string().email(),
  cpf: z.string().min(11),
  rg: z.string().min(3),
  password: z.string().min(6),
  street: z.string().min(2),
  number: z.string().min(1),
  complement: z.string().optional(),
  district: z.string().min(2),
  city: z.string().min(2),
  state: z.string().length(2),
  zipCode: z.string().min(8),
  institutionId: z.string().uuid(),
  courseId: z.string().uuid(),
});

type FormData = z.infer<typeof schema>;

export function RegisterStudentPage() {
  const { setSession } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [institutions, setInstitutions] = useState<
    Array<{
      id: string;
      name: string;
      courses: Array<{ id: string; name: string }>;
    }>
  >([]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { state: 'MG' },
  });

  const institutionId = watch('institutionId');
  const courses = useMemo(
    () => institutions.find((i) => i.id === institutionId)?.courses ?? [],
    [institutions, institutionId],
  );

  useEffect(() => {
    api.listInstitutions().then(setInstitutions).catch((e) => setError(e.message));
  }, []);

  async function onSubmit(data: FormData) {
    setError('');
    try {
      const res = await api.registerStudent(data);
      setSession(res.accessToken, res.user);
      navigate('/app');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha no cadastro');
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-neutral-200"
      >
        <h1 className="text-2xl font-bold">Cadastro de Aluno</h1>
        {error && (
          <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
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
            ] as const
          ).map(([name, label]) => (
            <label key={name} className="text-sm">
              {label}
              <input
                type={name === 'password' ? 'password' : 'text'}
                className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2"
                {...register(name)}
              />
            </label>
          ))}
          <label className="text-sm">
            Instituição
            <select
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2"
              {...register('institutionId')}
            >
              <option value="">Selecione</option>
              {institutions.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            Curso
            <select
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2"
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
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-5 rounded-xl bg-[var(--color-purple)] px-5 py-3 font-medium text-white"
        >
          Cadastrar
        </button>
        <Link to="/login" className="ml-4 text-sm text-[var(--color-purple)]">
          Já tenho conta
        </Link>
      </form>
    </div>
  );
}
