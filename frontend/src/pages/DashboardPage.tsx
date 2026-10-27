import { useAuth } from '../lib/auth';

export function DashboardPage() {
  const { user } = useAuth();
  const balance =
    user?.student?.balance ?? user?.teacher?.balance ?? null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="text-neutral-500">
          Bem-vindo ao MeritCoin — entrega da Sprint 2.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-neutral-200">
          <p className="text-sm text-neutral-500">Perfil</p>
          <p className="mt-2 text-xl font-semibold">{user?.role}</p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-neutral-200">
          <p className="text-sm text-neutral-500">E-mail</p>
          <p className="mt-2 text-xl font-semibold break-all">{user?.email}</p>
        </div>
        {balance !== null && (
          <div className="rounded-2xl bg-[var(--color-purple)] p-5 text-white shadow-sm">
            <p className="text-sm text-white/80">Saldo de moedas</p>
            <p className="mt-2 text-3xl font-bold">{balance}</p>
          </div>
        )}
        {user?.company && (
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-neutral-200">
            <p className="text-sm text-neutral-500">Empresa</p>
            <p className="mt-2 text-xl font-semibold">
              {user.company.tradeName}
            </p>
          </div>
        )}
      </div>
      <div className="rounded-2xl bg-white p-5 text-sm text-neutral-600 ring-1 ring-neutral-200">
        Nesta sprint: autenticação JWT, RBAC, PostgreSQL via Prisma, cadastro e
        gestão de alunos/empresas. Transferências, vantagens e e-mails entram na
        Sprint 3.
      </div>
    </div>
  );
}
