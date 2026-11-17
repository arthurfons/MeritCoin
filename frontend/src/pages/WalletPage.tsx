import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { api } from '../lib/api';
import { useAuth } from '../lib/auth';

const transferSchema = z.object({
  studentId: z.string().uuid('Selecione um aluno'),
  amount: z.coerce.number().int().min(1),
  message: z.string().min(5, 'Motivo obrigatório (mín. 5 caracteres)'),
});

type TransferForm = z.infer<typeof transferSchema>;

export function WalletPage() {
  const { user, refresh } = useAuth();
  const qc = useQueryClient();
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const statement = useQuery({
    queryKey: ['statement'],
    queryFn: api.statement,
    enabled: user?.role === 'PROFESSOR' || user?.role === 'ALUNO',
  });

  const students = useQuery({
    queryKey: ['students'],
    queryFn: api.listStudents,
    enabled: user?.role === 'PROFESSOR',
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof transferSchema>, unknown, TransferForm>({
    resolver: zodResolver(transferSchema),
  });

  const credit = useMutation({
    mutationFn: api.semesterCredit,
    onSuccess: async (res) => {
      setErr('');
      setMsg(res.message);
      await refresh();
      await qc.invalidateQueries({ queryKey: ['statement'] });
    },
    onError: (e: Error) => setErr(e.message),
  });

  const transfer = useMutation({
    mutationFn: api.transferCoins,
    onSuccess: async () => {
      setErr('');
      setMsg('Moedas enviadas. O aluno receberá e-mail (outbox/SMTP).');
      reset();
      await refresh();
      await qc.invalidateQueries({ queryKey: ['statement'] });
    },
    onError: (e: Error) => setErr(e.message),
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Carteira e extrato</h2>
        <p className="text-neutral-500">
          {user?.role === 'PROFESSOR'
            ? 'Crédito de 1.000/semestre, envio com mensagem obrigatória e extrato.'
            : 'Extrato de recebimentos e resgates.'}
        </p>
      </div>

      {(msg || err) && (
        <p
          className={`rounded-lg px-3 py-2 text-sm ${err ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-800'}`}
        >
          {err || msg}
        </p>
      )}

      <div className="rounded-2xl bg-[var(--color-purple)] p-5 text-white">
        <p className="text-sm text-white/80">Saldo</p>
        <p className="mt-1 text-3xl font-bold">
          {statement.data?.balance ??
            user?.teacher?.balance ??
            user?.student?.balance ??
            0}
        </p>
      </div>

      {user?.role === 'PROFESSOR' && (
        <>
          <button
            type="button"
            onClick={() => credit.mutate()}
            className="rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm font-medium"
          >
            Aplicar crédito semestral (1.000)
          </button>

          <form
            onSubmit={handleSubmit((data) => transfer.mutate(data))}
            className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-neutral-200"
          >
            <h3 className="font-semibold">Enviar moedas ao aluno</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className="text-sm sm:col-span-2">
                Aluno
                <select
                  className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2"
                  {...register('studentId')}
                >
                  <option value="">Selecione</option>
                  {(students.data ?? []).map((s) => (
                    <option key={String(s.id)} value={String(s.id)}>
                      {String(s.fullName)}
                    </option>
                  ))}
                </select>
                {errors.studentId && (
                  <span className="text-xs text-red-600">
                    {errors.studentId.message}
                  </span>
                )}
              </label>
              <label className="text-sm">
                Quantidade
                <input
                  type="number"
                  className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2"
                  {...register('amount')}
                />
              </label>
              <label className="text-sm sm:col-span-2">
                Motivo (obrigatório)
                <textarea
                  className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2"
                  rows={3}
                  {...register('message')}
                />
                {errors.message && (
                  <span className="text-xs text-red-600">
                    {errors.message.message}
                  </span>
                )}
              </label>
            </div>
            <button
              type="submit"
              disabled={isSubmitting || transfer.isPending}
              className="mt-4 rounded-xl bg-[var(--color-purple)] px-4 py-2 text-sm font-medium text-white"
            >
              Enviar
            </button>
          </form>
        </>
      )}

      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-neutral-200">
        <h3 className="font-semibold">Extrato</h3>
        <ul className="mt-3 divide-y divide-neutral-100">
          {(statement.data?.transactions ?? []).map((tx) => (
            <li key={tx.id} className="flex items-start justify-between gap-3 py-3 text-sm">
              <div>
                <p className="font-medium">{tx.description}</p>
                <p className="text-neutral-500">
                  {tx.type} · {new Date(tx.createdAt).toLocaleString('pt-BR')}
                </p>
              </div>
              <span
                className={`font-semibold ${tx.amount >= 0 ? 'text-emerald-700' : 'text-red-600'}`}
              >
                {tx.amount >= 0 ? '+' : ''}
                {tx.amount}
              </span>
            </li>
          ))}
          {!statement.data?.transactions?.length && (
            <li className="py-3 text-sm text-neutral-500">Sem movimentações.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
