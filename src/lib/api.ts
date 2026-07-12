import type { User, Project, LeaderboardEntry } from './types';

const API_URL = typeof window !== 'undefined' ? '/api' : (process.env.BACKEND_URL || 'http://localhost:3001') + '/api';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('yaghout_token') : null;
  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...(options.headers as Record<string, string>) };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  let res: Response;
  try { res = await fetch(`${API_URL}${path}`, { ...options, headers }); }
  catch { throw new Error('سرور در دسترس نیست.'); }
  const text = await res.text();
  let data: Record<string, unknown>;
  try { data = JSON.parse(text); } catch { throw new Error('پاسخ نامعتبر از سرور'); }
  if (!res.ok) throw new Error((data as { error?: string }).error || 'خطای سرور');
  return data as T;
}

export const authAPI = {
  login: (username: string, password: string) => request<{ token: string; user: User }>('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
  verify: () => request<{ user: User }>('/auth/verify'),
};
export const projectsAPI = {
  list: () => request<{ projects: Project[] }>('/projects'),
  get: (id: string) => request<{ project: Project }>(`/projects/${id}`),
  create: (data: Record<string, unknown>) => request<{ project: Project }>('/projects', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Record<string, unknown>) => request<{ success: boolean }>(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => request<{ success: boolean }>(`/projects/${id}`, { method: 'DELETE' }),
};
export const yaqutAPI = {
  award: (data: { projectIds: string[]; amount: number; note?: string }) => request<{ success: boolean; awarded: { projectId: string; projectName: string; amount: number }[]; totalAwarded: number }>('/yaqut/award', { method: 'POST', body: JSON.stringify(data) }),
  getHistory: (projectId: string) => request<{ events: { id: string; amount: number; awarded_at: string; note?: string }[] }>(`/yaqut/${projectId}`),
};
export const leaderboardAPI = { get: () => request<{ leaderboard: LeaderboardEntry[] }>('/leaderboard') };
