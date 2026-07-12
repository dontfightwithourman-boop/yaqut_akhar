'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Clock, Trophy, Settings, Upload } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { projectsAPI, leaderboardAPI } from '@/lib/api';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import YaqutIcon from '@/components/YaqutIcon';
import SparkleEffect from '@/components/SparkleEffect';
import ParticleBackground from '@/components/ParticleBackground';
import { toPersianNumber, formatDate } from '@/lib/helpers';
import type { Project, LeaderboardEntry } from '@/lib/types';

export default function StudentProjectPage() {
  const { user, loading: authLoading } = useAuth();
  const [project, setProject] = useState<Project | null>(null); const [rank, setRank] = useState<number | null>(null);
  const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [sName, setSName] = useState(''); const [sDesc, setSDesc] = useState(''); const [sLogo, setSLogo] = useState(''); const [sMembers, setSMembers] = useState<{ name: string; period: string }[]>([]); const [sErr, setSErr] = useState(''); const [sLoad, setSLoad] = useState(false); const [saveMsg, setSaveMsg] = useState('');

  const loadProject = () => {
    if (!user || user.role !== 'project') return;
    Promise.all([projectsAPI.get(user.projectId!), leaderboardAPI.get()])
      .then(([pd, ld]) => { setProject(pd.project); setSName(pd.project.name); setSDesc(pd.project.description || ''); setSLogo(pd.project.logo || ''); setSMembers(pd.project.members?.map((m) => ({ name: m.name, period: m.period || '' })) || []); const e = ld.leaderboard.find((x: LeaderboardEntry) => x.id === user.projectId); if (e) setRank(e.rank); })
      .catch((err) => setError(err.message)).finally(() => setLoading(false));
  };

  useEffect(() => { if (!authLoading && (!user || user.role !== 'project')) window.location.href = '/'; }, [user, authLoading]);
  useEffect(() => { loadProject(); }, [user]);

  const handleSave = async () => {
    if (!user || user.role !== 'project') return;
    setSErr(''); setSLoad(true); setSaveMsg('');
    try { await projectsAPI.update(user.projectId!, { name: sName, description: sDesc, logo: sLogo, members: sMembers.filter((m) => m.name.trim()) }); setSaveMsg('تغییرات ذخیره شد!'); setTimeout(() => setSaveMsg(''), 3000); setShowSettings(false); loadProject(); }
    catch (err: unknown) { setSErr(err instanceof Error ? err.message : 'خطا'); } finally { setSLoad(false); }
  };

  const addM = () => setSMembers([...sMembers, { name: '', period: '' }]);
  const updM = (i: number, f: string, v: string) => { const u = [...sMembers]; const m = { ...u[i] }; if (f === 'name') m.name = v; else m.period = v; u[i] = m; setSMembers(u); };
  const rmM = (i: number) => setSMembers(sMembers.filter((_, idx) => idx !== i));

  if (authLoading || loading) return <div className="min-h-screen bg-cream flex items-center justify-center dark:bg-gradient-to-br dark:from-navy-dark dark:via-navy dark:to-navy-dark"><div className="w-8 h-8 border-2 border-ruby border-t-transparent rounded-full animate-spin" /></div>;
  if (error || !project) return <div className="min-h-screen bg-cream flex items-center justify-center dark:bg-gradient-to-br dark:from-navy-dark dark:via-navy dark:to-navy-dark"><Card className="p-8 text-center"><p className="text-ruby-glow">{error || 'پروژه یافت نشد'}</p></Card></div>;

  return (<div className="min-h-screen bg-cream dark:bg-gradient-to-br dark:from-navy-dark dark:via-navy dark:to-navy-dark"><ParticleBackground count={15} /><Navbar />
    <main className="relative z-10 max-w-2xl mx-auto px-4 pt-24 pb-12"><motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="relative text-center">
        {project.logo && <img src={project.logo} alt={project.name} className="w-20 h-20 rounded-2xl object-cover mx-auto mb-4 border-2 border-navy/10 dark:border-beige/20" />}
        {!project.logo && <div className="inline-flex items-center justify-center mb-4 relative"><YaqutIcon size={56} animate /><SparkleEffect count={8} /></div>}
        <h1 className="text-3xl font-black text-navy mb-2 dark:text-cream">{project.name}</h1>
        {project.description && <p className="text-navy/60 dark:text-beige-light max-w-md mx-auto">{project.description}</p>}
      </div>
      {rank && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex justify-center"><div className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl ${rank === 1 ? 'bg-beige/15 border border-beige/25 text-beige-dark dark:bg-beige/20 dark:text-beige' : rank === 2 ? 'bg-sky/15 border border-sky/25 text-sky' : rank === 3 ? 'bg-ruby/10 border border-ruby/20 text-ruby dark:bg-ruby/20 dark:text-ruby-glow' : 'bg-navy/5 border border-navy/10 text-navy/60 dark:bg-navy-light/40 dark:text-beige-light'}`}><Trophy className="w-5 h-5" /><span className="font-bold">رتبه {toPersianNumber(rank)}</span></div></motion.div>}

      <Card className="p-10 text-center relative overflow-hidden"><SparkleEffect count={12} /><motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.4 }}><YaqutIcon size={72} animate /></motion.div><motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}><div className="text-7xl font-black text-navy mt-4 dark:text-cream">{toPersianNumber(project.yaqut_count)}</div><div className="text-xl text-navy/50 mt-2 dark:text-beige-light">یاقوت</div></motion.div></Card>

      {saveMsg && <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm text-center">{saveMsg}</motion.div>}

      <div className="flex gap-3">
        <button onClick={() => setShowSettings(!showSettings)} className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/60 border border-navy/8 text-navy/60 hover:text-navy hover:bg-white/80 transition-all dark:bg-navy/60 dark:border-beige/10 dark:text-beige-light dark:hover:text-cream dark:hover:bg-navy-light/30"><Settings className="w-4 h-4" />تنظیمات پروژه</button>
        <a href="/leaderboard" className="flex-1 flex items-center justify-center gap-2 p-4 rounded-2xl bg-white/60 border border-navy/8 text-navy/60 hover:text-navy hover:bg-white/80 transition-all dark:bg-navy/60 dark:border-beige/10 dark:text-beige-light dark:hover:text-cream dark:hover:bg-navy-light/30"><Trophy className="w-4 h-4" />رتبه‌بندی</a>
      </div>

      {showSettings && <Card className="p-6"><h2 className="text-lg font-bold text-navy mb-4 flex items-center gap-2 dark:text-cream"><Settings className="w-5 h-5 text-sky" />تنظیمات پروژه</h2>
        <div className="space-y-4">
          <Input label="نام پروژه" value={sName} onChange={(e) => setSName(e.target.value)} />
          <div className="space-y-1.5"><label className="block text-sm font-medium text-navy dark:text-beige-light">توضیحات</label><textarea value={sDesc} onChange={(e) => setSDesc(e.target.value)} rows={3} className="w-full px-4 py-3 rounded-xl bg-white/80 border border-navy/15 text-navy placeholder-navy/30 focus:outline-none focus:ring-2 focus:ring-ruby/50 dark:bg-navy-light/40 dark:border-beige/15 dark:text-cream dark:placeholder-sky/40 resize-none" dir="auto" /></div>
          <Input label="لوگو (URL تصویر)" value={sLogo} onChange={(e) => setSLogo(e.target.value)} placeholder="https://example.com/logo.png" dir="ltr" />
          {sLogo && <div className="text-center"><img src={sLogo} alt="Logo preview" className="w-16 h-16 rounded-xl object-cover mx-auto border border-navy/10 dark:border-beige/20" onError={(e) => (e.target as HTMLImageElement).style.display = 'none'} /></div>}
          <div><div className="flex items-center justify-between mb-2"><label className="text-sm font-medium text-navy/60 dark:text-beige-light">اعضا</label><button type="button" onClick={addM} className="text-xs text-ruby hover:text-ruby-glow transition-colors">+ افزودن عضو</button></div>
            <div className="space-y-2">{sMembers.map((m, i) => <div key={i} className="flex gap-2 items-center">
              <span className="text-xs font-bold text-navy/40 dark:text-sky w-6 text-center">{toPersianNumber(i + 1)}</span>
              <input placeholder="نام" value={m.name} onChange={(e) => updM(i, 'name', e.target.value)} className="flex-1 px-3 py-2 rounded-lg bg-white/60 border border-navy/10 text-navy text-sm focus:outline-none focus:ring-1 focus:ring-ruby/50 dark:bg-navy-light/30 dark:border-beige/15 dark:text-cream" />
              <input placeholder="دوره" value={m.period} onChange={(e) => updM(i, 'period', e.target.value)} className="w-28 px-3 py-2 rounded-lg bg-white/60 border border-navy/10 text-navy text-sm dark:bg-navy-light/30 dark:border-beige/15 dark:text-cream" />
              <button type="button" onClick={() => rmM(i)} className="px-2 text-ruby-glow hover:text-ruby">✕</button>
            </div>)}</div></div>
          {sErr && <div className="p-3 rounded-xl bg-ruby/10 border border-ruby/20 text-ruby-glow text-sm text-center">{sErr}</div>}
          <div className="flex gap-3"><Button onClick={handleSave} loading={sLoad} className="flex-1">ذخیره تغییرات</Button><Button variant="ghost" onClick={() => setShowSettings(false)}>انصراف</Button></div>
        </div>
      </Card>}

      <Card className="p-6"><h2 className="text-lg font-bold text-navy mb-4 flex items-center gap-2 dark:text-cream"><Users className="w-5 h-5 text-sky" />اعضای تیم</h2><div className="space-y-3">{project.members?.map((m, i) => <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="flex items-center gap-3 p-3 rounded-xl bg-navy/3 dark:bg-navy-light/30"><div className="w-10 h-10 rounded-full bg-gradient-to-br from-ruby to-beige flex items-center justify-center text-cream font-bold text-sm">{m.name.charAt(0)}</div><div><div className="font-medium text-navy dark:text-cream">{m.name}</div><div className="text-xs text-sky">{m.period && 'دوره: ' + m.period}{m.student_id && ' • کد: ' + m.student_id}{m.class_name && ' • ' + m.class_name}</div></div></motion.div>)}</div></Card>

      {project.yaqut_history && project.yaqut_history.length > 0 && <Card className="p-6"><h2 className="text-lg font-bold text-navy mb-4 flex items-center gap-2 dark:text-cream"><Clock className="w-5 h-5 text-beige" />تاریخچه یاقوت</h2><div className="space-y-2">{project.yaqut_history.map((ev) => <div key={ev.id} className="flex items-center justify-between p-3 rounded-xl bg-navy/3 dark:bg-navy-light/30"><div className="flex items-center gap-2"><YaqutIcon size={16} animate={false} /><span className="text-navy font-bold dark:text-cream">+{toPersianNumber(ev.amount)}</span>{ev.note && <span className="text-xs text-sky">({ev.note})</span>}</div><span className="text-xs text-sky">{formatDate(ev.awarded_at)}</span></div>)}</div></Card>}
    </motion.div></main><Footer /></div>);
}
