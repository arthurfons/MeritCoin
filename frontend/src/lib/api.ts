function resolveApiUrl() {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL as string;
  const host =
    typeof window !== 'undefined' ? window.location.hostname : '127.0.0.1';
  return `http://${host}:3000/api/v1`;
}

const API_URL = resolveApiUrl();

export type Role = 'ALUNO' | 'PROFESSOR' | 'EMPRESA' | 'ESCOLA' | 'ADMIN';

export type AuthUser = {
  id: string;
  email: string;
  role: Role;
  active: boolean;
  student?: {
    id: string;
    fullName: string;
    cpf?: string;
    rg?: string;
    studentNumber?: string | null;
    gradeYear?: string | null;
    balance: number;
    course?: { id: string; name: string } | null;
    institution?: { id: string; name: string };
    schoolClass?: { id: string; name: string; gradeYear: string } | null;
  } | null;
  teacher?: {
    id: string;
    fullName: string;
    balance: number;
    classes?: Array<{ schoolClass: { id: string; name: string } }>;
  } | null;
  company?: {
    id: string;
    tradeName: string;
    cnpj: string;
  } | null;
  school?: {
    id: string;
    displayName: string;
    institution?: { id: string; name: string };
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
        courses: Array<{ id: string; name: string }>;
        classes: Array<{
          id: string;
          name: string;
          gradeYear: string;
          institutionId: string;
        }>;
      }>
    >('/institutions'),
  listStudents: () => request<Array<Record<string, unknown>>>('/students'),
  createStudent: (data: Record<string, unknown>) =>
    request('/students', { method: 'POST', body: JSON.stringify(data) }),
  deactivateStudent: (id: string) =>
    request(`/students/${id}`, { method: 'DELETE' }),
  listCompanies: () => request<Array<Record<string, unknown>>>('/companies'),
  deactivateCompany: (id: string) =>
    request(`/companies/${id}`, { method: 'DELETE' }),
  listMissions: () => request<Array<Record<string, unknown>>>('/missions'),
  createMission: (data: Record<string, unknown>) =>
    request('/missions', { method: 'POST', body: JSON.stringify(data) }),
  completeMission: (id: string) =>
    request(`/missions/${id}/complete`, { method: 'POST' }),
  listPendingCompletions: () =>
    request<Array<Record<string, unknown>>>('/missions/completions/pending'),
  reviewCompletion: (
    id: string,
    data: { status: 'APPROVED' | 'REJECTED'; note?: string },
  ) =>
    request(`/missions/completions/${id}/review`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  semesterCredit: () =>
    request<{
      credited: boolean;
      semester: string;
      balance: number;
      message: string;
    }>('/wallets/semester-credit', { method: 'POST' }),
  transferCoins: (data: {
    studentId: string;
    amount: number;
    message: string;
  }) =>
    request('/wallets/transfer', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  statement: () =>
    request<{
      balance: number;
      transactions: Array<{
        id: string;
        type: string;
        amount: number;
        balanceAfter: number;
        description: string;
        createdAt: string;
      }>;
      transfers?: Array<{
        id: string;
        amount: number;
        message: string;
        createdAt: string;
        student: { id: string; fullName: string };
      }>;
    }>('/wallets/statement'),
  rewardsCatalog: () =>
    request<
      Array<{
        id: string;
        title: string;
        description: string;
        imageUrl: string;
        costCoins: number;
        company: { tradeName: string };
      }>
    >('/rewards/catalog'),
  rewardsMine: () =>
    request<
      Array<{
        id: string;
        title: string;
        description: string;
        imageUrl: string;
        costCoins: number;
        active: boolean;
      }>
    >('/rewards/mine'),
  createReward: (data: Record<string, unknown>) =>
    request('/rewards', { method: 'POST', body: JSON.stringify(data) }),
  deactivateReward: (id: string) =>
    request(`/rewards/${id}`, { method: 'DELETE' }),
  redeemReward: (id: string) =>
    request<{ couponCode?: string }>(`/rewards/${id}/redeem`, {
      method: 'POST',
    }),
  listRedemptions: () =>
    request<Array<Record<string, unknown>>>('/redemptions'),
  confirmCoupon: (couponCode: string) =>
    request('/redemptions/confirm', {
      method: 'POST',
      body: JSON.stringify({ couponCode }),
    }),
};
