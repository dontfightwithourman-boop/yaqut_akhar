'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FolderPlus, Gem, BarChart3, TrendingUp } from 'lucide-react';
import { projectsAPI, leaderboardAPI } from '@/lib/api';
import Card from '@/components/ui/Card';
import YaqutIcon from '@/components/YaqutIcon';
import { toPersianNumber } from '@/lib/helpers';
import type { Project, LeaderboardEntry } from '@/lib/types';

export default function AdminDashboard() {
  const [projects, setProjects] = useState<Project[]>([]); const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]); const [loading, setLoading] = useState(true);
  useEffect(() => { Promise.all([projectsAPI.list(), leaderboardAPI.get()]).then(([p, l]) => { setProjects(p.projects); setLeaderboard(l.leaderboard); }).finally(() => setLoading(false)); }, []);
  const totalYaqut = projects.reduce((s, p) => s + p.yaqut_count, 0); const totalMembers = projects.reduce((s, p) => s + (p.members?.length || 0), 0);
  const stats = [{ label: 'پروژه‌ها', value: projects.length, icon: FolderPlus, color: 'text-sky' }, { label: 'مروارید', value: totalYaqut, icon: Gem, color: 'text-pearl' }, { label: 'شرکت‌کنندگان', value: totalMembers, icon: BarChart3, color: 'text-sky' }, { label: 'میانگین', value: projects.length > 0 ? Math.round(totalYaqut / projects.length) : 0, icon: TrendingUp, color: 'text-navy' }];
  if (loading) return <div className="space-y-6"><div className="h-8 w-48 bg-navy/5 rounded-lg animate-pulse dark:bg-navy-light/30" /><div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">{[1, 2, 3, 4].map((i) => <div key={i} className="h-24 sm:h-28 rounded-2xl bg-navy/5 animate-pulse dark:bg-navy-light/20" />)}</div></div>;
  return (<div className="space-y-6 sm:space-y-8">
    <div><h1 className="text-xl sm:text-2xl font-bold text-navy mb-2 dark:text-cream">داشبورد مدیریت</h1><p className="text-sm text-navy/50 dark:text-beige-light">مدرسه راهنمایی علامه حلی ۱ تهران</p></div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">{stats.map((s, i) => <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}><Card className="p-3 sm:p-5"><div className="flex items-center justify-between"><div><p className="text-xs sm:text-sm text-navy/50 mb-1 dark:text-beige-light">{s.label}</p><p className="text-xl sm:text-3xl font-black text-navy dark:text-cream">{toPersianNumber(s.value)}</p></div><s.icon className={`w-6 h-6 sm:w-8 sm:h-8 ${s.color}`} /></div></Card></motion.div>)}</div>
    <div className="grid gap-4 sm:gap-6">
      <Card className="p-4 sm:p-6"><h2 className="text-base sm:text-lg font-bold text-navy mb-3 sm:mb-4 flex items-center gap-2 dark:text-cream"><TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-beige" />سه تیم برتر</h2><div className="space-y-2 sm:space-y-3">{leaderboard.slice(0, 3).map((e, i) => <div key={e.id} className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl ${i === 0 ? 'bg-beige/10 border border-beige/20' : i === 1 ? 'bg-sky/10 border border-sky/20' : 'bg-pearl/8 border border-pearl/15 dark:bg-pearl/10 dark:border-pearl/20'}`}><div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm ${i === 0 ? 'bg-beige text-navy-dark' : i === 1 ? 'bg-sky text-navy-dark' : 'bg-pearl text-navy'}`}>{i + 1}</div><div className="flex-1 min-w-0"><div className="font-medium text-navy text-xs sm:text-sm dark:text-cream truncate">{e.name}</div></div><div className="flex items-center gap-1 shrink-0"><YaqutIcon size={14} animate={i === 0} /><span className="font-bold text-navy text-sm dark:text-cream">{toPersianNumber(e.yaqut_count)}</span></div></div>)}</div></Card>
      <Card className="p-4 sm:p-6"><h2 className="text-base sm:text-lg font-bold text-navy mb-3 sm:mb-4 flex items-center gap-2 dark:text-cream"><FolderPlus className="w-4 h-4 sm:w-5 sm:h-5 text-sky" />آخرین پروژه‌ها</h2><div className="space-y-2">{projects.slice(0, 5).map((p) => <div key={p.id} className="flex items-center justify-between p-2 sm:p-3 rounded-xl bg-navy/3 dark:bg-navy-light/30"><div className="min-w-0 flex-1"><div className="font-medium text-navy text-xs sm:text-sm truncate dark:text-cream">{p.name}</div><div className="text-xs text-sky">{p.members?.length || 0} عضو</div></div><div className="flex items-center gap-1 shrink-0"><YaqutIcon size={12} animate={false} /><span className="text-xs sm:text-sm text-navy/60 dark:text-beige-light">{toPersianNumber(p.yaqut_count)}</span></div></div>)}</div></Card>
    </div>
  </div>);
}
