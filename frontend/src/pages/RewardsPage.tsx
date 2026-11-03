import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { api } from '../lib/api';
import { useAuth } from '../lib/auth';

const rewardSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(5),
  imageUrl: z.string().url(),
  costCoins: z.coerce.number().int().min(1),
});

type RewardForm = z.infer<typeof rewardSchema>;

export function RewardsPage() {
  const { user, refresh } = useAuth();
  const qc = useQueryClient();
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [coupon, setCoupon] = useState('');

  const catalog = useQuery({
    queryKey: ['rewards-catalog'],
    queryFn: api.rewardsCatalog,
    enabled: user?.role === 'ALUNO' || user?.role === 'EMPRESA',
  });

  const mine = useQuery({
    queryKey: ['rewards-mine'],
    queryFn: api.rewardsMine,
    enabled: user?.role === 'EMPRESA',
  });

  const redemptions = useQuery({
    queryKey: ['redemptions'],
    queryFn: api.listRedemptions,
    enabled: user?.role === 'ALUNO' || user?.role === 'EMPRESA',
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<RewardForm>({ resolver: zodResolver(rewardSchema) });

  const create = useMutation({
    mutationFn: api.createReward,
    onSuccess: async () => {
      setErr('');
      setMsg('Vantagem publicada.');
      reset();
      await qc.invalidateQueries({ queryKey: ['rewards-mine'] });
      await qc.invalidateQueries({ queryKey: ['rewards-catalog'] });
    },
    onError: (e: Error) => setErr(e.message),
  });

  const redeem = useMutation({
    mutationFn: api.redeemReward,
    onSuccess: async (res: { couponCode?: string }) => {
      setErr('');
      setMsg(`Resgate ok. Cupom: ${res.couponCode ?? '(verifique extrato)'}`);
      await refresh();
      await qc.invalidateQueries({ queryKey: ['redemptions'] });
      await qc.invalidateQueries({ queryKey: ['rewards-catalog'] });
    },
    onError: (e: Error) => setErr(e.message),
  });

  const confirm = useMutation({
    mutationFn: () => api.confirmCoupon(coupon.trim()),
    onSuccess: async () => {
      setErr('');
      setMsg('Cupom confirmado como UTILIZADO.');
      setCoupon('');
      await qc.invalidateQueries({ queryKey: ['redemptions'] });
    },
    onError: (e: Error) => setErr(e.message),
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Vantagens</h2>
        <p className="text-neutral-500">
          {user?.role === 'EMPRESA'
            ? 'Cadastre vantagens com foto e custo; confira cupons resgatados.'
            : 'Troque moedas por vantagens e receba cupom por e-mail.'}
        </p>
      </div>

      {(msg || err) && (
        <p
          className={`rounded-lg px-3 py-2 text-sm ${err ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-800'}`}
        >
          {err || msg}
        </p>
      )}

      {user?.role === 'EMPRESA' && (
        <form
          onSubmit={handleSubmit((data) => create.mutate(data))}
          className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-neutral-200"
        >
          <h3 className="font-semibold">Nova vantagem</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="text-sm">
              Título
              <input
                className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2"
                {...register('title')}
              />
            </label>
            <label className="text-sm">
              Custo (moedas)
              <input
                type="number"
                className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2"
                {...register('costCoins')}
              />
            </label>
            <label className="text-sm sm:col-span-2">
              Descrição
              <textarea
                className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2"
                rows={2}
                {...register('description')}
              />
            </label>
            <label className="text-sm sm:col-span-2">
              URL da foto
              <input
                className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2"
                placeholder="https://..."
                {...register('imageUrl')}
              />
            </label>
          </div>
          <button
            type="submit"
            disabled={isSubmitting || create.isPending}
            className="mt-4 rounded-xl bg-[var(--color-purple)] px-4 py-2 text-sm font-medium text-white"
          >
            Publicar
          </button>
        </form>
      )}

      {user?.role === 'EMPRESA' && (
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-neutral-200">
          <h3 className="font-semibold">Confirmar cupom (troca presencial)</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            <input
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              placeholder="Código do cupom"
              className="rounded-lg border border-neutral-300 px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={() => confirm.mutate()}
              className="rounded-xl bg-black px-4 py-2 text-sm text-white"
            >
              Confirmar uso
            </button>
          </div>
          <ul className="mt-4 divide-y divide-neutral-100 text-sm">
            {(mine.data ?? []).map((r) => (
              <li key={r.id} className="py-2">
                {r.title} · {r.costCoins} moedas ·{' '}
                {r.active ? 'ativa' : 'inativa'}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {(catalog.data ?? []).map((r) => (
          <article
            key={r.id}
            className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-neutral-200"
          >
            <img
              src={r.imageUrl}
              alt={r.title}
              className="h-40 w-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://placehold.co/600x240/7c3aed/ffffff?text=Vantagem';
              }}
            />
            <div className="p-4">
              <p className="text-xs text-neutral-500">{r.company.tradeName}</p>
              <h3 className="font-semibold">{r.title}</h3>
              <p className="mt-1 text-sm text-neutral-600">{r.description}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="font-bold text-[var(--color-purple)]">
                  {r.costCoins} moedas
                </span>
                {user?.role === 'ALUNO' && (
                  <button
                    type="button"
                    onClick={() => redeem.mutate(r.id)}
                    className="rounded-lg bg-[var(--color-purple)] px-3 py-1.5 text-sm text-white"
                  >
                    Resgatar
                  </button>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-neutral-200">
        <h3 className="font-semibold">Meus resgates / cupons</h3>
        <ul className="mt-3 divide-y divide-neutral-100 text-sm">
          {(redemptions.data ?? []).map((r) => (
            <li key={String(r.id)} className="py-3">
              <p className="font-medium">
                {String((r.reward as { title?: string } | undefined)?.title ?? 'Vantagem')}{' '}
                · cupom <code>{String(r.couponCode)}</code>
              </p>
              <p className="text-neutral-500">
                {String(r.status)} · {r.costCoins as number} moedas ·{' '}
                {new Date(String(r.createdAt)).toLocaleString('pt-BR')}
              </p>
            </li>
          ))}
          {!redemptions.data?.length && (
            <li className="py-3 text-neutral-500">Nenhum resgate ainda.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
