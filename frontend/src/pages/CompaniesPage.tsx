import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { api } from '../lib/api';

type CompanyRow = {
  id: string;
  tradeName: string;
  cnpj: string;
  user: { email: string; active: boolean };
};

export function CompaniesPage() {
  const qc = useQueryClient();
  const [error, setError] = useState('');
  const { data = [], isLoading } = useQuery({
    queryKey: ['companies'],
    queryFn: () => api.listCompanies() as Promise<CompanyRow[]>,
  });

  const deactivate = useMutation({
    mutationFn: (id: string) => api.deactivateCompany(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['companies'] }),
    onError: (e: Error) => setError(e.message),
  });

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">Empresas Parceiras</h2>
        <p className="text-neutral-500">
          Listagem administrativa. Cadastro público em /cadastro/empresa.
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
              <th className="px-4 py-3">CNPJ</th>
              <th className="px-4 py-3">E-mail</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td className="px-4 py-4" colSpan={5}>
                  Carregando...
                </td>
              </tr>
            )}
            {data.map((c) => (
              <tr key={c.id} className="border-t border-neutral-100">
                <td className="px-4 py-3 font-medium">{c.tradeName}</td>
                <td className="px-4 py-3">{c.cnpj}</td>
                <td className="px-4 py-3">{c.user.email}</td>
                <td className="px-4 py-3">
                  {c.user.active ? 'Ativo' : 'Inativo'}
                </td>
                <td className="px-4 py-3">
                  {c.user.active && (
                    <button
                      type="button"
                      className="text-red-700 hover:underline"
                      onClick={() => {
                        if (confirm('Desativar esta empresa?')) {
                          deactivate.mutate(c.id);
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
                <td className="px-4 py-4" colSpan={5}>
                  Nenhuma empresa encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
