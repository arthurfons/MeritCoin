import { GraduationCap, LogOut, Building2, Users } from 'lucide-react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../lib/auth';

export function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="border-b border-neutral-200 bg-black text-white lg:border-b-0 lg:border-r lg:min-h-screen">
        <div className="p-5">
          <div className="flex items-center gap-2">
            <GraduationCap className="text-[var(--color-purple)]" />
            <div>
              <p className="text-xs uppercase tracking-widest text-neutral-400">
                MeritCoin
              </p>
              <h1 className="text-lg font-semibold">Moeda Estudantil</h1>
            </div>
          </div>
          <nav className="mt-8 flex flex-col gap-2 text-sm">
            <NavLink
              to="/app"
              end
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 ${isActive ? 'bg-[var(--color-purple)]' : 'hover:bg-neutral-900'}`
              }
            >
              Dashboard
            </NavLink>
            {(user?.role === 'ADMIN' || user?.role === 'PROFESSOR') && (
              <NavLink
                to="/app/alunos"
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 flex items-center gap-2 ${isActive ? 'bg-[var(--color-purple)]' : 'hover:bg-neutral-900'}`
                }
              >
                <Users size={16} /> Alunos
              </NavLink>
            )}
            {user?.role === 'ADMIN' && (
              <NavLink
                to="/app/empresas"
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 flex items-center gap-2 ${isActive ? 'bg-[var(--color-purple)]' : 'hover:bg-neutral-900'}`
                }
              >
                <Building2 size={16} /> Empresas
              </NavLink>
            )}
            <NavLink
              to="/app/perfil"
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 ${isActive ? 'bg-[var(--color-purple)]' : 'hover:bg-neutral-900'}`
              }
            >
              Meu perfil
            </NavLink>
          </nav>
        </div>
      </aside>

      <div>
        <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-3 sm:px-6">
          <div>
            <p className="text-sm text-neutral-500">Sessão autenticada</p>
            <p className="font-medium">{user?.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-[var(--color-purple-soft)] px-3 py-1 text-xs font-semibold text-[var(--color-purple)]">
              {user?.role}
            </span>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 px-3 py-2 text-sm hover:bg-neutral-50"
            >
              <LogOut size={16} /> Sair
            </button>
            <Link to="/" className="hidden text-sm text-[var(--color-purple)] sm:inline">
              Início
            </Link>
          </div>
        </header>
        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
