'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Clock, Trophy, ArrowRight, Wrench, AlertTriangle } from 'lucide-react';
import { leaderboardAPI, projectsAPI } from '@/lib/api';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Card from '@/components/ui/Card';
import YaqutIcon from '@/components/YaqutIcon';
import SparkleEffect from '@/components/SparkleEffect';
import ParticleBackground from '@/components/ParticleBackground';
import { toPersianNumber, formatDate } from '@/lib/helpers';
import type { Project, LeaderboardEntry, WorkshopLoan } from '@/lib/types';
import Link from 'next/link';

export default function PublicProjectPage({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<Project | null>(null);
  const [rank, setRank] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [workshopLoans, setWorkshopLoans] = useState<WorkshopLoan[]>([]);

  useEffect(() => {
    leaderboardAPI.get().then((lb) => {
      const entry = lb.leaderboard.find((e) => e.id === params.id);
      if (entry) { setRank(entry.rank); return projectsAPI.getPublic(params.id); }
      throw new Error('پروژه یافت نشد');
    }).then(async (data) => {
      setProject(data.project);
      if (data.project.members) {
        const allLoans: WorkshopLoan[] = [];
        for (const m of data.project.members) {
          try { const r = await fetch(`/api/workshop/loans-by-member/${encodeURIComponent(m.name)}`); if (r.ok) { const d = await r.json(); allLoans.push(...d.loans); } } catch { /* */ }
        }
        setWorkshopLoans(allLoans);
      }
    }).catch((err) => setError(err.message || 'پروژه یافت نشد')).finally(() => setLoading(false));
  }, [params.id]);

  const today = new Date().toISOString().split('T')[0];
  const getRemainingDays = (returnDate: string) => {
    const diff = new Date(returnDate).getTime() - new Date(today).getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days < 0) return `${toPersianNumber(Math.abs(days))} روز گذشته`;
    if (days === 0) return 'امروز';
    return `${toPersianNumber(days)} روز مانده`;
  };

  if (loading) return <div className="min-h-screen bg-[#EDF4F8] flex items-center justify-center dark:bg-gradient-to-br dark:from-navy-dark dark:via-navy dark:to-navy-dark"><div className="w-8 h-8 border-2 border-ruby border-t-transparent rounded-full animate-spin" /></div>;
  if (error || !project) return <div className="min-h-screen bg-[#EDF4F8] flex items-center justify-center dark:bg-gradient-to-br dark:from-navy-dark dark:via-navy dark:to-navy-dark"><Card className="p-6 sm:p-8 text-center"><p className="text-ruby-glow">{error || 'پروژه یافت نشد'}</p><Link href="/leaderboard" className="mt-4 inline-block text-sky hover:text-ruby">بازگشت به رتبه‌بندی</Link></Card></div>;

  return (<div className="min-h-screen bg-[#EDF4F8] dark:bg-gradient-to-br dark:from-navy-dark dark:via-navy dark:to-navy-dark"><ParticleBackground count={15} /><Navbar />
    <main className="relative z-10 max-w-2xl mx-auto px-4 pt-24 pb-12"><motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 sm:space-y-6">
      <Link href="/leaderboard" className="inline-flex items-center gap-2 text-sky hover:text-ruby transition-colors"><ArrowRight className="w-4 h-4" />بازگشت به رتبه‌بندی</Link>
      <div className="relative text-center">
        {project.logo && <img src={project.logo} alt={project.name} className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover mx-auto mb-4 border-2 border-navy/10 dark:border-beige/20" />}
        {!project.logo && <div className="inline-flex items-center justify-center mb-4 relative"><YaqutIcon size={56} animate /><SparkleEffect count={8} /></div>}
        <h1 className="text-2xl sm:text-3xl font-black text-navy mb-2 dark:text-cream">{project.name}</h1>
        {project.description && <p className="text-sm sm:text-base text-navy/60 dark:text-beige-light max-w-md mx-auto">{project.description}</p>}
      </div>
      {rank && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex justify-center"><div className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl ${rank === 1 ? 'bg-beige/15 border border-beige/25 text-beige-dark dark:bg-beige/20 dark:text-beige' : rank === 2 ? 'bg-sky/15 border border-sky/25 text-sky' : rank === 3 ? 'bg-ruby/10 border border-ruby/20 text-ruby dark:bg-ruby/20 dark:text-ruby-glow' : 'bg-navy/5 border border-navy/10 text-navy/60 dark:bg-navy-light/40 dark:text-beige-light'}`}><Trophy className="w-5 h-5" /><span className="font-bold">رتبه {toPersianNumber(rank)}</span></div></motion.div>}
      <Card className="p-8 sm:p-10 text-center relative overflow-hidden"><SparkleEffect count={12} /><motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.4 }}><YaqutIcon size={64} animate /></motion.div><motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}><div className="text-5xl sm:text-7xl font-black text-navy mt-4 dark:text-cream">{toPersianNumber(project.yaqut_count)}</div><div className="text-lg sm:text-xl text-navy/50 mt-2 dark:text-beige-light">مروارید</div></motion.div></Card>
      <Card className="p-4 sm:p-6"><h2 className="text-base sm:text-lg font-bold text-navy mb-3 sm:mb-4 flex items-center gap-2 dark:text-cream"><Users className="w-4 h-4 sm:w-5 sm:h-5 text-sky" />اعضای تیم</h2><div className="space-y-2 sm:space-y-3">{project.members?.map((m, i) => <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl bg-navy/3 dark:bg-navy-light/30"><div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-ruby to-beige flex items-center justify-center text-cream font-bold text-sm shrink-0">{m.name.charAt(0)}</div><div><div className="font-medium text-navy text-sm dark:text-cream">{m.name}</div><div className="text-xs text-sky">{m.period && 'دوره: ' + m.period}</div></div></motion.div>)}</div></Card>
      {workshopLoans.length > 0 && <Card className="p-4 sm:p-6"><h2 className="text-base sm:text-lg font-bold text-navy mb-3 sm:mb-4 flex items-center gap-2 dark:text-cream"><Wrench className="w-4 h-4 sm:w-5 sm:h-5 text-beige" />وسایل قرضی تیم</h2>
        <div className="space-y-2">{workshopLoans.map((loan) => { const isOverdue = loan.return_date < today; return (<div key={loan.id} className={`flex items-center justify-between p-2 sm:p-3 rounded-xl ${isOverdue ? 'bg-red-500/5 border border-red-500/20' : 'bg-navy/3 dark:bg-navy-light/30'}`}>
          <div className="flex items-center gap-2">{isOverdue && <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />}
            <div><div className="font-medium text-navy text-sm dark:text-cream">{loan.item_name} × {toPersianNumber(loan.quantity)}</div><div className="text-xs text-sky">گروه {loan.group_number} • {loan.borrower_name}</div></div>
          </div>
          <div className="text-left shrink-0"><div className={`text-xs font-medium ${isOverdue ? 'text-red-500' : 'text-navy/50 dark:text-beige-light'}`}>{getRemainingDays(loan.return_date)}</div><div className="text-xs text-navy/40 dark:text-beige-light/60">تا {formatDate(loan.return_date)}</div></div>
        </div>); })}</div>
      </Card>}
      {project.yaqut_history && project.yaqut_history.length > 0 && <Card className="p-4 sm:p-6"><h2 className="text-base sm:text-lg font-bold text-navy mb-3 sm:mb-4 flex items-center gap-2 dark:text-cream"><Clock className="w-4 h-4 sm:w-5 sm:h-5 text-beige" />تاریخچه مروارید</h2><div className="space-y-2">{project.yaqut_history.map((ev) => <div key={ev.id} className="flex items-center justify-between p-2 sm:p-3 rounded-xl bg-navy/3 dark:bg-navy-light/30"><div className="flex items-center gap-2"><YaqutIcon size={14} animate={false} /><span className="text-navy font-bold text-sm dark:text-cream">+{toPersianNumber(ev.amount)}</span>{ev.note && <span className="text-xs text-sky">({ev.note})</span>}</div><span className="text-xs text-sky">{formatDate(ev.awarded_at)}</span></div>)}</div></Card>}
    </motion.div></main><Footer /></div>);
}
