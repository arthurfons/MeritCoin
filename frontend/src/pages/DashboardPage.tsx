import {
  ArrowUpRight,
  Building2,
  Gift,
  Target,
  Users,
  Wallet,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { type AuthUser, type Role } from '../lib/api';
import { useAuth } from '../lib/auth';

type Action = {
  to: string;
  label: string;
  hint: string;
  icon: typeof Wallet;
  primary?: boolean;
};

function displayName(user: AuthUser | null) {
  if (!user) return 'olá';
  return (
    user.student?.fullName?.split(' ')[0] ||
    user.teacher?.fullName?.split(' ')[0] ||
    user.company?.tradeName ||
    user.school?.displayName ||
    user.email.split('@')[0]
  );
}

function roleLabel(role: Role) {
  switch (role) {
    case 'ALUNO':
      return 'Aluno';
    case 'PROFESSOR':
      return 'Professor';
    case 'EMPRESA':
      return 'Empresa parceira';
    case 'ESCOLA':
      return 'Escola';
    case 'ADMIN':
      return 'Administração';
  }
}

function roleBlurb(role: Role) {
  switch (role) {
    case 'ALUNO':
      return 'Saldo, extrato, vantagens e missões — tudo no mesmo lugar.';
    case 'PROFESSOR':
      return 'Credite o semestre, reconheça alunos e acompanhe o extrato.';
    case 'EMPRESA':
      return 'Publique vantagens e confira cupons de resgate.';
    case 'ESCOLA':
      return 'Cadastre alunos e publique missões para a comunidade.';
    case 'ADMIN':
      return 'Visão geral da plataforma MeritCoin.';
  }
}

function actionsFor(role: Role): Action[] {
  switch (role) {
    case 'ALUNO':
      return [
        {
          to: '/app/carteira',
          label: 'Carteira',
          hint: 'Extrato e saldo',
          icon: Wallet,
          primary: true,
        },
        {
          to: '/app/vantagens',
          label: 'Vantagens',
          hint: 'Trocar moedas',
          icon: Gift,
        },
        {
          to: '/app/missoes',
          label: 'Missões',
          hint: 'Concluir e ganhar',
          icon: Target,
        },
      ];
    case 'PROFESSOR':
      return [
        {
          to: '/app/carteira',
          label: 'Enviar moedas',
          hint: '1.000 / semestre',
          icon: Wallet,
          primary: true,
        },
        {
          to: '/app/missoes',
          label: 'Missões',
          hint: 'Criar e aprovar',
          icon: Target,
        },
        {
          to: '/app/alunos',
          label: 'Alunos',
          hint: 'Turmas da instituição',
          icon: Users,
        },
      ];
    case 'EMPRESA':
      return [
        {
          to: '/app/vantagens',
          label: 'Vantagens',
          hint: 'Publicar e cupons',
          icon: Gift,
          primary: true,
        },
        {
          to: '/app/perfil',
          label: 'Perfil',
          hint: 'Dados da empresa',
          icon: Building2,
        },
      ];
    case 'ESCOLA':
      return [
        {
          to: '/app/alunos',
          label: 'Alunos',
          hint: 'Cadastro completo',
          icon: Users,
          primary: true,
        },
        {
          to: '/app/missoes',
          label: 'Missões',
          hint: 'Para toda a escola',
          icon: Target,
        },
      ];
    case 'ADMIN':
      return [
        {
          to: '/app/alunos',
          label: 'Alunos',
          hint: 'Gestão',
          icon: Users,
          primary: true,
        },
        {
          to: '/app/empresas',
          label: 'Empresas',
          hint: 'Parceiros',
          icon: Building2,
        },
        {
          to: '/app/missoes',
          label: 'Missões',
          hint: 'Visão geral',
          icon: Target,
        },
      ];
  }
}

function metaLine(user: AuthUser) {
  if (user.student?.course?.name) return user.student.course.name;
  if (user.student?.institution?.name) return user.student.institution.name;
  if (user.school?.institution?.name) return user.school.institution.name;
  if (user.teacher?.classes?.[0]?.schoolClass?.name)
    return user.teacher.classes.map((c) => c.schoolClass.name).join(' · ');
  if (user.company?.cnpj) return `CNPJ ${user.company.cnpj}`;
  return user.email;
}

export function DashboardPage() {
  const { user } = useAuth();
  if (!user) return null;

  const balance = user.student?.balance ?? user.teacher?.balance ?? null;
  const actions = actionsFor(user.role);
  const name = displayName(user);

  return (
    <div className="dash space-y-8">
      <section className="dash-hero relative overflow-hidden rounded-3xl bg-black px-6 py-8 text-white sm:px-8 sm:py-10">
        <div className="dash-hero__glow" aria-hidden />
        <div className="dash-hero__grain" aria-hidden />
        <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/45">
              {roleLabel(user.role)}
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Olá, {name}
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/55">
              {roleBlurb(user.role)}
            </p>
            <p className="mt-5 text-xs text-white/35">{metaLine(user)}</p>
          </div>

          {balance !== null ? (
            <div className="dash-balance min-w-[200px] rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.18em] text-white/45">
                Saldo
              </p>
              <p className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl font-semibold tabular-nums">
                  {balance.toLocaleString('pt-BR')}
                </span>
                <span className="text-sm text-[var(--color-purple-soft)]">
                  moedas
                </span>
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white/50 backdrop-blur-sm">
              MeritCoin
            </div>
          )}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-baseline justify-between gap-3">
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-neutral-400">
            Atalhos
          </h3>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {actions.map((action, i) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.to}
                to={action.to}
                className={`dash-tile group ${action.primary ? 'dash-tile--primary' : ''}`}
                style={{ animationDelay: `${80 + i * 60}ms` }}
              >
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${
                      action.primary
                        ? 'bg-white/15 text-white'
                        : 'bg-[var(--color-purple-soft)] text-[var(--color-purple)]'
                    }`}
                  >
                    <Icon size={18} />
                  </span>
                  <ArrowUpRight
                    size={18}
                    className={`shrink-0 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                      action.primary ? 'text-white/50' : 'text-neutral-300'
                    }`}
                  />
                </div>
                <div className="mt-6">
                  <p
                    className={`text-lg font-semibold ${action.primary ? 'text-white' : 'text-black'}`}
                  >
                    {action.label}
                  </p>
                  <p
                    className={`mt-1 text-sm ${action.primary ? 'text-white/60' : 'text-neutral-500'}`}
                  >
                    {action.hint}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
