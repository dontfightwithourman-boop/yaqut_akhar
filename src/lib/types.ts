export interface Project { id: string; name: string; name_en?: string; username: string; description?: string; logo?: string; yaqut_count: number; created_at: string; updated_at: string; members?: Member[]; yaqut_history?: YaqutEvent[]; }
export interface Member { name: string; period?: string; student_id?: string; class_name?: string; }
export interface YaqutEvent { id: string; amount: number; awarded_at: string; note?: string; }
export interface LeaderboardEntry { rank: number; id: string; name: string; name_en?: string; username: string; description?: string; logo?: string; yaqut_count: number; members: string[]; }
export interface User { role: 'admin' | 'project'; username: string; projectId?: string; }
