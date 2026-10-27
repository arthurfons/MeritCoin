import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { api } from '../lib/api';
import { useAuth } from '../lib/auth';

const schema = z.object({
  tradeName: z.string().min(2),
  cnpj: z.string().min(14),
  email: z.string().email(),
  password: z.string().min(6),
});

type FormData = z.infer<typeof schema>;

export function RegisterCompanyPage() {
  const { setSession } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    setError('');
    try {
      const res = await api.registerCompany(data);
      setSession(res.accessToken, res.user);
      navigate('/app');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha no cadastro');
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-neutral-200"
      >
        <h1 className="text-2xl font-bold">Cadastro de Empresa</h1>
        {error && (
          <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}
        {(
          [
            ['tradeName', 'Nome fantasia'],
            ['cnpj', 'CNPJ'],
            ['email', 'E-mail'],
            ['password', 'Senha'],
          ] as const
        ).map(([name, label]) => (
          <label key={name} className="mt-3 block text-sm">
            {label}
            <input
              type={name === 'password' ? 'password' : 'text'}
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2"
              {...register(name)}
            />
          </label>
        ))}
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-5 w-full rounded-xl bg-[var(--color-purple)] py-3 font-medium text-white"
        >
          Cadastrar empresa
        </button>
        <p className="mt-4 text-center text-sm">
          <Link to="/login" className="text-[var(--color-purple)]">
            Já tenho conta
          </Link>
        </p>
      </form>
    </div>
  );
}
