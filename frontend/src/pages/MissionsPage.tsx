import { Plus } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useMemo, useState } from 'react';
import { Modal } from '../components/Modal';
import { api } from '../lib/api';
import { useAuth } from '../lib/auth';

type Mission = {
  id: string;
  title: string;
  description: string;
  rewardCoins: number;
  scope: 'SCHOOL' | 'CLASS';
  schoolClass?: { name: string } | null;
  completions?: Array<{ status: string }>;
  _count?: { completions: number };
};

type Pending = {
  id: string;
  student: { fullName: string; studentNumber: string };
  mission: { title: string; rewardCoins: number };
};

export function MissionsPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const canCreate =
    user?.role === 'ESCOLA' ||
    user?.role === 'PROFESSOR' ||
    user?.role === 'ADMIN';
  const canReview =
    user?.role === 'ESCOLA' ||
    user?.role === 'PROFESSOR' ||
    user?.role === 'ADMIN';

  const { data: missions = [], isLoading } = useQuery({
    queryKey: ['missions'],
    queryFn: () => api.listMissions() as Promise<Mission[]>,
  });

  const { data: pending = [] } = useQuery({
    queryKey: ['pending-completions'],
    queryFn: () => api.listPendingCompletions() as Promise<Pending[]>,
    enabled: canReview,
  });

  const { data: institutions = [] } = useQuery({
    queryKey: ['institutions'],
    queryFn: () => api.listInstitutions(),
    enabled: canCreate,
  });

  const classes = useMemo(
    () => institutions.flatMap((i) => i.classes),
    [institutions],
  );

  const defaultScope =
    user?.role === 'ESCOLA' || user?.role === 'ADMIN' ? 'SCHOOL' : 'CLASS';

  const { register, handleSubmit, watch, reset } = useForm({
    defaultValues: {
      title: '',
      description: '',
      rewardCoins: 20,
      scope: defaultScope,
      classId: '',
      repeatable: false,
      maxPerWeek: 3,
    },
  });
  const scope = watch('scope');

  function closeModal() {
    setOpen(false);
    setError('');
  }

  const create = useMutation({
    mutationFn: (data: Record<string, unknown>) => api.createMission(data),
    onSuccess: () => {
      reset({
        title: '',
        description: '',
        rewardCoins: 20,
        scope: defaultScope,
        classId: '',
        repeatable: false,
        maxPerWeek: 3,
      });
      setOpen(false);
      setError('');
      qc.invalidateQueries({ queryKey: ['missions'] });
    },
    onError: (e: Error) => setError(e.message),
  });

  const complete = useMutation({
    mutationFn: (id: string) => api.completeMission(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['missions'] }),
    onError: (e: Error) => setError(e.message),
  });

  const review = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: 'APPROVED' | 'REJECTED';
    }) => api.reviewCompletion(id, { status }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['pending-completions'] });
      qc.invalidateQueries({ queryKey: ['missions'] });
    },
    onError: (e: Error) => setError(e.message),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">Missões</h2>
          <p className="text-neutral-500">
            Professor cria para a turma · Escola cria para todos · Aluno conclui ·
            Staff aprova e libera moedas.
          </p>
        </div>
        {canCreate && (
          <button
            type="button"
            onClick={() => {
              setError('');
              setOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-purple)] px-4 py-2.5 text-sm font-medium text-white"
          >
            <Plus size={16} /> Nova missão
          </button>
        )}
      </div>

      {error && !open && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {canReview && pending.length > 0 && (
        <section className="rounded-2xl bg-white p-5 ring-1 ring-neutral-200">
          <h3 className="font-semibold">Aprovações pendentes</h3>
          <ul className="mt-3 space-y-3">
            {pending.map((p) => (
              <li
                key={p.id}
                className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 pb-3"
              >
                <div>
                  <p className="font-medium">{p.student.fullName}</p>
                  <p className="text-sm text-neutral-500">
                    {p.mission.title} · {p.mission.rewardCoins} moedas
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="rounded-lg bg-emerald-700 px-3 py-2 text-sm text-white"
                    onClick={() =>
                      review.mutate({ id: p.id, status: 'APPROVED' })
                    }
                  >
                    Aprovar
                  </button>
                  <button
                    type="button"
                    className="rounded-lg border border-red-300 px-3 py-2 text-sm text-red-700"
                    onClick={() =>
                      review.mutate({ id: p.id, status: 'REJECTED' })
                    }
                  >
                    Negar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="grid gap-3">
        {isLoading && <p>Carregando missões...</p>}
        {!isLoading && missions.length === 0 && (
          <p className="rounded-2xl bg-white px-5 py-8 text-sm text-neutral-500 ring-1 ring-neutral-200">
            Nenhuma missão publicada.
            {canCreate ? ' Clique em “Nova missão” para criar.' : ''}
          </p>
        )}
        {missions.map((m) => {
          const myStatus = m.completions?.[0]?.status;
          return (
            <article
              key={m.id}
              className="rounded-2xl bg-white p-5 ring-1 ring-neutral-200"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-purple)]">
                    {m.scope === 'SCHOOL'
                      ? 'Escola'
                      : m.schoolClass?.name || 'Turma'}{' '}
                    · {m.rewardCoins} moedas
                  </p>
                  <h3 className="mt-1 text-lg font-semibold">{m.title}</h3>
                  <p className="mt-1 text-sm text-neutral-600">{m.description}</p>
                </div>
                {user?.role === 'ALUNO' && (
                  <button
                    type="button"
                    disabled={myStatus === 'PENDING' || myStatus === 'APPROVED'}
                    className="rounded-xl bg-[var(--color-purple)] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                    onClick={() => complete.mutate(m.id)}
                  >
                    {myStatus === 'APPROVED'
                      ? 'Concluída'
                      : myStatus === 'PENDING'
                        ? 'Aguardando'
                        : 'Marcar concluída'}
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </section>

      <Modal
        open={open}
        onClose={closeModal}
        title="Nova missão"
        description="Defina título, recompensa e alcance da missão."
      >
        <form
          className="grid gap-3 sm:grid-cols-2"
          onSubmit={handleSubmit((data) =>
            create.mutate({
              title: data.title,
              description: data.description,
              rewardCoins: Number(data.rewardCoins),
              scope: data.scope,
              classId: data.scope === 'CLASS' ? data.classId : undefined,
              repeatable: Boolean(data.repeatable),
              maxPerWeek: data.repeatable
                ? Number(data.maxPerWeek)
                : undefined,
            }),
          )}
        >
          {error && (
            <p className="sm:col-span-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}
          <label className="text-sm sm:col-span-2">
            Título
            <input
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2"
              required
              {...register('title')}
            />
          </label>
          <label className="text-sm sm:col-span-2">
            Descrição
            <textarea
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2"
              rows={3}
              required
              {...register('description')}
            />
          </label>
          <label className="text-sm">
            Moedas
            <input
              type="number"
              min={1}
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2"
              required
              {...register('rewardCoins')}
            />
          </label>
          <label className="text-sm">
            Alcance
            <select
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2"
              {...register('scope')}
            >
              {(user?.role === 'ESCOLA' || user?.role === 'ADMIN') && (
                <option value="SCHOOL">Toda a escola</option>
              )}
              <option value="CLASS">Turma</option>
            </select>
          </label>
          {scope === 'CLASS' && (
            <label className="text-sm sm:col-span-2">
              Turma
              <select
                className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2"
                required
                {...register('classId')}
              >
                <option value="">Selecione</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
          )}
          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <input type="checkbox" {...register('repeatable')} />
            Repetível na semana
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
              {create.isPending ? 'Publicando...' : 'Publicar missão'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
