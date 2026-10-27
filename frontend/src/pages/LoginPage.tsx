import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../lib/auth';

const schema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

type FormData = z.infer<typeof schema>;

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    setError('');
    try {
      await login(data.email, data.password);
      navigate('/app');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha no login');
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-neutral-200"
      >
        <h1 className="text-2xl font-bold">Entrar</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Demo: aluno@demo.meritcoin.local / Senha@123
        </p>
        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}
        <label className="mt-4 block text-sm">
          E-mail
          <input
            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2"
            {...register('email')}
          />
          {errors.email && (
            <span className="text-xs text-red-600">{errors.email.message}</span>
          )}
        </label>
        <label className="mt-3 block text-sm">
          Senha
          <input
            type="password"
            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2"
            {...register('password')}
          />
          {errors.password && (
            <span className="text-xs text-red-600">
              {errors.password.message}
            </span>
          )}
        </label>
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-5 w-full rounded-xl bg-[var(--color-purple)] py-3 font-medium text-white disabled:opacity-60"
        >
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </button>
        <p className="mt-4 text-center text-sm text-neutral-500">
          <Link to="/" className="text-[var(--color-purple)]">
            Voltar
          </Link>
        </p>
      </form>
    </div>
  );
}
