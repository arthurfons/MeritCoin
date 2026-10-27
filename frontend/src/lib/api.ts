const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api/v1';

export type Role = 'ALUNO' | 'PROFESSOR' | 'EMPRESA' | 'ADMIN';

export type AuthUser = {
  id: string;
  email: string;
  role: Role;
  active: boolean;
  student?: {
    id: string;
    fullName: string;
    balance: number;
    institution?: { id: string; name: string };
    course?: { id: string; name: string };
  } | null;
  teacher?: {
    id: string;
    fullName: string;
    balance: number;
  } | null;
  company?: {
    id: string;
    tradeName: string;
    cnpj: string;
  } | null;
};

function authHeaders(): HeadersInit {
  const token = localStorage.getItem('meritcoin_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { ...authHeaders(), ...(options?.headers ?? {}) },
  });
  if (res.status === 401) {
    localStorage.removeItem('meritcoin_token');
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const message = Array.isArray(body.message)
      ? body.message.join(', ')
      : body.message || `Erro HTTP ${res.status}`;
    throw new Error(message);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  login: (email: string, password: string) =>
    request<{ accessToken: string; user: AuthUser }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  me: () => request<AuthUser>('/auth/me'),
  registerStudent: (data: Record<string, unknown>) =>
    request<{ accessToken: string; user: AuthUser }>('/auth/register/student', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  registerCompany: (data: Record<string, unknown>) =>
    request<{ accessToken: string; user: AuthUser }>('/auth/register/company', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  listInstitutions: () =>
    request<
      Array<{
        id: string;
        name: string;
        courses: Array<{ id: string; name: string; institutionId: string }>;
      }>
    >('/institutions'),
  listStudents: () => request<Array<Record<string, unknown>>>('/students'),
  updateStudent: (id: string, data: Record<string, unknown>) =>
    request(`/students/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  deactivateStudent: (id: string) =>
    request(`/students/${id}`, { method: 'DELETE' }),
  listCompanies: () => request<Array<Record<string, unknown>>>('/companies'),
  updateCompany: (id: string, data: Record<string, unknown>) =>
    request(`/companies/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  deactivateCompany: (id: string) =>
    request(`/companies/${id}`, { method: 'DELETE' }),
};
