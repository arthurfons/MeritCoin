const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options?.headers ?? {}) },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const message =
      (Array.isArray(body.message) ? body.message.join(', ') : body.message) ||
      `Erro HTTP ${res.status}`;
    throw new Error(message);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export type Instituicao = {
  id: number;
  nome: string;
  cursos: Curso[];
};

export type Curso = {
  id: number;
  nome: string;
  instituicaoId: number;
};

export type Aluno = {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  rg: string;
  login: string;
  saldoMoedas: number;
  logradouro: string;
  numero: string;
  complemento?: string | null;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  instituicaoId: number;
  cursoId: number;
  instituicao?: { id: number; nome: string };
  curso?: { id: number; nome: string };
};

export type Empresa = {
  id: number;
  nome: string;
  cnpj: string;
  email: string;
  login: string;
};

export const api = {
  listInstituicoes: () => request<Instituicao[]>('/instituicoes'),
  listAlunos: () => request<Aluno[]>('/alunos'),
  getAluno: (id: number) => request<Aluno>(`/alunos/${id}`),
  createAluno: (data: Record<string, unknown>) =>
    request<Aluno>('/alunos', { method: 'POST', body: JSON.stringify(data) }),
  updateAluno: (id: number, data: Record<string, unknown>) =>
    request<Aluno>(`/alunos/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  deleteAluno: (id: number) =>
    request<{ message: string }>(`/alunos/${id}`, { method: 'DELETE' }),
  listEmpresas: () => request<Empresa[]>('/empresas'),
  getEmpresa: (id: number) => request<Empresa>(`/empresas/${id}`),
  createEmpresa: (data: Record<string, unknown>) =>
    request<Empresa>('/empresas', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateEmpresa: (id: number, data: Record<string, unknown>) =>
    request<Empresa>(`/empresas/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  deleteEmpresa: (id: number) =>
    request<{ message: string }>(`/empresas/${id}`, { method: 'DELETE' }),
};
