export interface Project { id: string; name: string; name_en?: string; username: string; description?: string; logo?: string; yaqut_count: number; created_at: string; updated_at: string; members?: Member[]; yaqut_history?: YaqutEvent[]; }
export interface Member { name: string; period?: string; student_id?: string; class_name?: string; }
export interface YaqutEvent { id: string; amount: number; awarded_at: string; note?: string; }
export interface LeaderboardEntry { rank: number; id: string; name: string; name_en?: string; username: string; description?: string; logo?: string; yaqut_count: number; members: string[]; }
export interface User { role: 'admin' | 'project'; username: string; projectId?: string; }
export interface WorkshopItem { id: string; name: string; location: string; quantity: number; description: string; created_at: string; updated_at: string; }
export interface WorkshopLoan { id: string; loan_number: number; item_id: string; item_name: string; quantity: number; group_number: string; borrower_name: string; borrow_date: string; return_date: string; status: string; created_at: string; }
