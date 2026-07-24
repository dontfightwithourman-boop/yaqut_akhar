'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Clock } from 'lucide-react';
import { projectsAPI } from '@/lib/api';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Card from '@/components/ui/Card';
import YaqutIcon from '@/components/YaqutIcon';
import SparkleEffect from '@/components/SparkleEffect';
import { toPersianNumber, formatDate } from '@/lib/helpers';
import type { Project } from '@/lib/types';

export default function AdminProjectDetail() {
  const [project, setProject] = useState<Project | null>(null); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  useEffect(() => { projectsAPI.get('self').then((d) => setProject(d.project)).catch((err) => setError(err.message)).finally(() => setLoading(false)); }, []);
  if (loading) return <div className="min-h-screen bg-cream flex items-center justify-center dark:bg-gradient-to-br dark:from-navy-dark dark:via-navy dark:to-navy-dark"><div className="w-8 h-8 border-2 border-ruby border-t-transparent rounded-full animate-spin" /></div>;
  if (error || !project) return <div className="min-h-screen bg-cream flex items-center justify-center dark:bg-gradient-to-br dark:from-navy-dark dark:via-navy dark:to-navy-dark"><Card className="p-6 sm:p-8 text-center"><p className="text-ruby-glow">{error || 'پروژه یافت نشد'}</p></Card></div>;
  return (<div className="min-h-screen bg-cream dark:bg-gradient-to-br dark:from-navy-dark dark:via-navy dark:to-navy-dark"><Navbar /><main className="relative z-10 max-w-2xl mx-auto px-4 pt-24 pb-12"><motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 sm:space-y-6">
    <div className="relative text-center">
      {project.logo && <img src={project.logo} alt={project.name} className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover mx-auto mb-4 border-2 border-navy/10 dark:border-beige/20" />}
      {!project.logo && <div className="inline-flex items-center justify-center mb-4 relative"><YaqutIcon size={48} animate /><SparkleEffect count={6} /></div>}
      <h1 className="text-2xl sm:text-3xl font-black text-navy mb-2 dark:text-cream">{project.name}</h1>
      {project.description && <p className="text-sm sm:text-base text-navy/60 dark:text-beige-light">{project.description}</p>}
    </div>
    <Card className="p-6 sm:p-8 text-center relative overflow-hidden"><SparkleEffect count={10} /><motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.4 }}><YaqutIcon size={56} animate /></motion.div><motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}><div className="text-5xl sm:text-6xl font-black text-navy mt-4 dark:text-cream">{toPersianNumber(project.yaqut_count)}</div><div className="text-base sm:text-lg text-navy/50 mt-2 dark:text-beige-light">مروارید</div></motion.div></Card>
    <Card className="p-4 sm:p-6"><h2 className="text-base sm:text-lg font-bold text-navy mb-3 sm:mb-4 flex items-center gap-2 dark:text-cream"><Users className="w-4 h-4 sm:w-5 sm:h-5 text-sky" />اعضای تیم</h2><div className="space-y-2 sm:space-y-3">{project.members?.map((m, i) => <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl bg-navy/3 dark:bg-navy-light/30"><div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-ruby to-beige flex items-center justify-center text-cream font-bold text-sm shrink-0">{m.name.charAt(0)}</div><div><div className="font-medium text-navy text-sm dark:text-cream">{m.name}</div><div className="text-xs text-sky">{m.period && 'دوره: ' + m.period}</div></div></motion.div>)}</div></Card>
    {project.yaqut_history && project.yaqut_history.length > 0 && <Card className="p-4 sm:p-6"><h2 className="text-base sm:text-lg font-bold text-navy mb-3 sm:mb-4 flex items-center gap-2 dark:text-cream"><Clock className="w-4 h-4 sm:w-5 sm:h-5 text-beige" />تاریخچه مروارید</h2><div className="space-y-2">{project.yaqut_history.map((ev) => <div key={ev.id} className="flex items-center justify-between p-2 sm:p-3 rounded-xl bg-navy/3 dark:bg-navy-light/30"><div className="flex items-center gap-2"><YaqutIcon size={14} animate={false} /><span className="text-navy font-bold text-sm dark:text-cream">+{toPersianNumber(ev.amount)}</span>{ev.note && <span className="text-xs text-sky">({ev.note})</span>}</div><span className="text-xs text-sky">{formatDate(ev.awarded_at)}</span></div>)}</div></Card>}
  </motion.div></main><Footer /></div>);
}
