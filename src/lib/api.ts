import type { User, Project, LeaderboardEntry, WorkshopItem, WorkshopLoan } from './types';

// In browser: use Next.js rewrite proxy (/api)
// On server: use direct backend URL
const API_URL = typeof window !== 'undefined' ? '/api' : (process.env.BACKEND_URL || 'http://localhost:3001') + '/api';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('yaghout_token') : null;
  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...(options.headers as Record<string, string>) };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, { ...options, headers });
  } catch (err) {
    throw new Error('سرور در دسترس نیست. لطفاً مطمئن شوید سرور پشتیبان در حال اجراست.');
  }

  // Read response as text first to handle non-JSON responses
  const text = await res.text();

  // If empty response
  if (!text || text.trim() === '') {
    if (!res.ok) throw new Error(`خطای سرور (${res.status})`);
    throw new Error('پاسخ خالی از سرور');
  }

  // Try to parse as JSON
  let data: Record<string, unknown>;
  try {
    data = JSON.parse(text);
  } catch {
    // If not JSON, show the actual response for debugging
    const preview = text.substring(0, 200);
    throw new Error(`پاسخ نامعتبر از سرور: ${preview}`);
  }

  if (!res.ok) {
    throw new Error((data as { error?: string }).error || `خطای سرور (${res.status})`);
  }

  return data as T;
}

export const authAPI = {
  login: (username: string, password: string) => request<{ token: string; user: User }>('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
  verify: () => request<{ user: User }>('/auth/verify'),
};
export const projectsAPI = {
  list: () => request<{ projects: Project[] }>('/projects'),
  get: (id: string) => request<{ project: Project }>(`/projects/${id}`),
  getPublic: (id: string) => request<{ project: Project }>(`/projects/public/${id}`),
  create: (data: Record<string, unknown>) => request<{ project: Project }>('/projects', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Record<string, unknown>) => request<{ success: boolean }>(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => request<{ success: boolean }>(`/projects/${id}`, { method: 'DELETE' }),
};
export const yaqutAPI = {
  award: (data: { projectIds: string[]; amount: number; note?: string }) => request<{ success: boolean; awarded: { projectId: string; projectName: string; amount: number }[]; totalAwarded: number }>('/yaqut/award', { method: 'POST', body: JSON.stringify(data) }),
  getHistory: (projectId: string) => request<{ events: { id: string; amount: number; awarded_at: string; note?: string }[] }>(`/yaqut/${projectId}`),
};
export const leaderboardAPI = { get: () => request<{ leaderboard: LeaderboardEntry[] }>('/leaderboard') };

export const workshopAPI = {
  getItems: () => request<{ items: WorkshopItem[] }>('/workshop/items'),
  createItem: (data: { name: string; location?: string; quantity?: number; description?: string }) => request<{ item: WorkshopItem }>('/workshop/items', { method: 'POST', body: JSON.stringify(data) }),
  updateItem: (id: string, data: Record<string, unknown>) => request<{ success: boolean }>(`/workshop/items/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteItem: (id: string) => request<{ success: boolean }>(`/workshop/items/${id}`, { method: 'DELETE' }),
  getLoans: () => request<{ loans: WorkshopLoan[] }>('/workshop/loans'),
  createLoan: (data: { item_id: string; item_name: string; quantity?: number; group_number?: string; borrower_name?: string; borrow_date: string; return_date: string }) => request<{ loan: WorkshopLoan }>('/workshop/loans', { method: 'POST', body: JSON.stringify(data) }),
  updateLoan: (id: string, data: { status: string }) => request<{ success: boolean }>(`/workshop/loans/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteLoan: (id: string) => request<{ success: boolean }>(`/workshop/loans/${id}`, { method: 'DELETE' }),
};

export const backupAPI = {
  export: async () => {
    const token = localStorage.getItem('yaghout_token');
    const res = await fetch(`${API_URL}/backup/export`, { headers: { 'Authorization': `Bearer ${token}` } });
    if (!res.ok) throw new Error('خطا در تهیه نسخه پشتیبان');
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `yaghout-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },
  import: (data: Record<string, unknown>) => request<{ success: boolean; message: string }>('/backup/import', { method: 'POST', body: JSON.stringify({ data }) }),
};
