import { Link } from 'react-router-dom';

export function HomePage() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fff_0%,#f3e6f3_45%,#000_45%,#000_55%,#a3a3a3_55%,#a3a3a3_70%,#fff_70%)]">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-4 py-16">
        <div className="max-w-xl rounded-2xl bg-white/95 p-8 shadow-xl ring-1 ring-black/5">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-purple)]">
            PUC Minas · Projeto de Software
          </p>
          <h1 className="mt-3 text-4xl font-bold text-black">MeritCoin</h1>
          <p className="mt-3 text-neutral-600">
            Sistema de reconhecimento do mérito estudantil por meio de moeda
            virtual. Sprint 2: persistência PostgreSQL, autenticação JWT e CRUDs
            de Aluno e Empresa Parceira.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/login"
              className="rounded-xl bg-[var(--color-purple)] px-5 py-3 font-medium text-white"
            >
              Entrar
            </Link>
            <Link
              to="/cadastro/aluno"
              className="rounded-xl border border-black px-5 py-3 font-medium"
            >
              Cadastrar aluno
            </Link>
            <Link
              to="/cadastro/empresa"
              className="rounded-xl border border-neutral-400 px-5 py-3 font-medium text-neutral-700"
            >
              Cadastrar empresa
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
