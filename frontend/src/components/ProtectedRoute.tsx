import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../lib/auth';

export function ProtectedRoute() {
  const { token, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-neutral-500">
        Carregando sessão...
      </div>
    );
  }
  if (!token) return <Navigate to="/login" replace />;
  return <Outlet />;
}
