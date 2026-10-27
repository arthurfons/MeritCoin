import { useAuth } from '../lib/auth';

export function ProfilePage() {
  const { user } = useAuth();
  return (
    <div className="max-w-xl rounded-2xl bg-white p-6 ring-1 ring-neutral-200">
      <h2 className="text-2xl font-bold">Meu perfil</h2>
      <dl className="mt-4 space-y-3 text-sm">
        <div>
          <dt className="text-neutral-500">E-mail</dt>
          <dd className="font-medium">{user?.email}</dd>
        </div>
        <div>
          <dt className="text-neutral-500">Papel</dt>
          <dd className="font-medium">{user?.role}</dd>
        </div>
        {user?.student && (
          <>
            <div>
              <dt className="text-neutral-500">Nome</dt>
              <dd className="font-medium">{user.student.fullName}</dd>
            </div>
            <div>
              <dt className="text-neutral-500">Instituição / Curso</dt>
              <dd className="font-medium">
                {user.student.institution?.name} — {user.student.course?.name}
              </dd>
            </div>
          </>
        )}
        {user?.teacher && (
          <div>
            <dt className="text-neutral-500">Nome</dt>
            <dd className="font-medium">{user.teacher.fullName}</dd>
          </div>
        )}
        {user?.company && (
          <>
            <div>
              <dt className="text-neutral-500">Empresa</dt>
              <dd className="font-medium">{user.company.tradeName}</dd>
            </div>
            <div>
              <dt className="text-neutral-500">CNPJ</dt>
              <dd className="font-medium">{user.company.cnpj}</dd>
            </div>
          </>
        )}
      </dl>
    </div>
  );
}
