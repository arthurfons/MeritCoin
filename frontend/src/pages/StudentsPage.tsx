import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { api } from '../lib/api';

type StudentRow = {
  id: string;
  fullName: string;
  cpf: string;
  balance: number;
  user: { email: string; active: boolean };
  institution?: { name: string };
  course?: { name: string };
};

export function StudentsPage() {
  const qc = useQueryClient();
  const [error, setError] = useState('');
  const { data = [], isLoading } = useQuery({
    queryKey: ['students'],
    queryFn: () => api.listStudents() as Promise<StudentRow[]>,
  });

  const deactivate = useMutation({
    mutationFn: (id: string) => api.deactivateStudent(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['students'] }),
    onError: (e: Error) => setError(e.message),
  });

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">Alunos</h2>
        <p className="text-neutral-500">
          Listagem autenticada (admin/professor). Cadastro público em /cadastro/aluno.
        </p>
      </div>
      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      <div className="overflow-x-auto rounded-2xl bg-white ring-1 ring-neutral-200">
        <table className="min-w-full text-sm">
          <thead className="bg-neutral-50 text-left text-neutral-500">
            <tr>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">E-mail</th>
              <th className="px-4 py-3">Instituição / Curso</th>
              <th className="px-4 py-3">Saldo</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td className="px-4 py-4" colSpan={6}>
                  Carregando...
                </td>
              </tr>
            )}
            {data.map((s) => (
              <tr key={s.id} className="border-t border-neutral-100">
                <td className="px-4 py-3 font-medium">
                  {s.fullName}
                  <div className="text-xs text-neutral-500">{s.cpf}</div>
                </td>
                <td className="px-4 py-3">{s.user.email}</td>
                <td className="px-4 py-3">
                  {s.institution?.name}
                  <div className="text-xs text-neutral-500">{s.course?.name}</div>
                </td>
                <td className="px-4 py-3">{s.balance}</td>
                <td className="px-4 py-3">
                  {s.user.active ? 'Ativo' : 'Inativo'}
                </td>
                <td className="px-4 py-3">
                  {s.user.active && (
                    <button
                      type="button"
                      className="text-red-700 hover:underline"
                      onClick={() => {
                        if (confirm('Desativar este aluno?')) {
                          deactivate.mutate(s.id);
                        }
                      }}
                    >
                      Desativar
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {!isLoading && data.length === 0 && (
              <tr>
                <td className="px-4 py-4" colSpan={6}>
                  Nenhum aluno encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
