'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Trophy, Gem } from 'lucide-react';
import { leaderboardAPI } from '@/lib/api';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LeaderboardTable from '@/components/LeaderboardTable';
import Button from '@/components/ui/Button';
import ParticleBackground from '@/components/ParticleBackground';
import { toPersianNumber } from '@/lib/helpers';
import type { LeaderboardEntry } from '@/lib/types';

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]); const [loading, setLoading] = useState(true); const [refreshing, setRefreshing] = useState(false);
  const fetchLb = async (showRefresh = false) => { if (showRefresh) setRefreshing(true); try { const d = await leaderboardAPI.get(); setEntries(d.leaderboard); } catch { /* */ } finally { setLoading(false); setRefreshing(false); } };
  useEffect(() => { fetchLb(); const i = setInterval(() => fetchLb(), 30000); return () => clearInterval(i); }, []);
  const maxYaqut = entries.length > 0 ? entries[0].yaqut_count : 1; const totalYaqut = entries.reduce((s, e) => s + e.yaqut_count, 0);
  return (<div className="min-h-screen bg-[#EDF4F8] dark:bg-gradient-to-br dark:from-navy-dark dark:via-navy dark:to-navy-dark"><ParticleBackground count={15} /><Navbar />
    <main className="relative z-10 max-w-4xl mx-auto px-4 pt-24 pb-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <div className="inline-flex items-center justify-center mb-4"><Trophy className="w-12 h-12 text-beige" /></div>
        <h1 className="text-3xl md:text-4xl font-black text-navy mb-3 dark:text-cream">رتبه‌بندی مروارید</h1>
        <p className="text-navy/60 mb-6 dark:text-beige-light">مدرسه راهنمایی علامه حلی ۱ تهران — جدول رتبه‌بندی پروژه‌ها</p>
        <div className="flex items-center justify-center gap-6 mb-6">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/60 border border-navy/8 dark:bg-navy/60 dark:border-beige/10"><Gem className="w-4 h-4 text-ruby" /><span className="text-sm text-navy/60 dark:text-beige-light">کل مروارید: <span className="font-bold text-navy dark:text-cream">{toPersianNumber(totalYaqut)}</span></span></div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/60 border border-navy/8 dark:bg-navy/60 dark:border-beige/10"><Trophy className="w-4 h-4 text-beige" /><span className="text-sm text-navy/60 dark:text-beige-light">تیم‌ها: <span className="font-bold text-navy dark:text-cream">{toPersianNumber(entries.length)}</span></span></div>
        </div>
        <Button onClick={() => fetchLb(true)} loading={refreshing} variant="secondary" size="sm"><RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />بروزرسانی</Button>
      </motion.div>
      {loading ? <div className="space-y-3">{[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-20 rounded-2xl bg-navy/5 animate-pulse dark:bg-navy/40" />)}</div> : entries.length === 0 ? <div className="text-center py-12 text-navy/40 dark:text-sky">هنوز پروژه‌ای ثبت نشده</div> : <LeaderboardTable entries={entries} maxYaqut={maxYaqut} />}
    </main><Footer /></div>);
}
