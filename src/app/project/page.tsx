'use client';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Users, Clock, Trophy, Settings, Upload, X, Wrench, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { projectsAPI, leaderboardAPI, workshopAPI } from '@/lib/api';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import YaqutIcon from '@/components/YaqutIcon';
import SparkleEffect from '@/components/SparkleEffect';
import ParticleBackground from '@/components/ParticleBackground';
import { toPersianNumber, formatDate } from '@/lib/helpers';
import type { Project, LeaderboardEntry, WorkshopLoan } from '@/lib/types';

export default function StudentProjectPage() {
  const { user, loading: authLoading } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [rank, setRank] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [sName, setSName] = useState('');
  const [sDesc, setSDesc] = useState('');
  const [sLogo, setSLogo] = useState('');
  const [sMembers, setSMembers] = useState<{ name: string; period: string }[]>([]);
  const [sErr, setSErr] = useState('');
  const [sLoad, setSLoad] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [workshopLoans, setWorkshopLoans] = useState<WorkshopLoan[]>([]);

  const loadProject = async () => {
    if (!user || user.role !== 'project') return;
    try {
      const [pd, ld] = await Promise.all([projectsAPI.get(user.projectId!), leaderboardAPI.get()]);
      setProject(pd.project);
      setSName(pd.project.name);
      setSDesc(pd.project.description || '');
      setSLogo(pd.project.logo || '');
      setSMembers(pd.project.members?.map((m) => ({ name: m.name, period: m.period || '' })) || []);
      const e = ld.leaderboard.find((x: LeaderboardEntry) => x.id === user.projectId);
      if (e) setRank(e.rank);
      // Fetch workshop loans for all project members
      const allLoans: WorkshopLoan[] = [];
      if (pd.project.members) {
        for (const m of pd.project.members) {
          try {
            const res = await workshopAPI.getLoansByMember(m.name);
            if (res && res.loans) allLoans.push(...res.loans);
          } catch (e) { /* silently continue */ }
        }
      }
      setWorkshopLoans(allLoans);
    } catch (err: unknown) { setError(err instanceof Error ? err.message : 'خطا'); } finally { setLoading(false); }
  };

  useEffect(() => { if (!authLoading && (!user || user.role !== 'project')) window.location.href = '/'; }, [user, authLoading]);
  useEffect(() => { loadProject(); }, [user]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { setSErr('حجم تصویر باید کمتر از ۲ مگابایت باشد'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => { setSLogo(ev.target?.result as string); };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!user || user.role !== 'project') return;
    setSErr(''); setSLoad(true); setSaveMsg('');
    try { await projectsAPI.update(user.projectId!, { name: sName, description: sDesc, logo: sLogo, members: sMembers.filter((m) => m.name.trim()) }); setSaveMsg('تغییرات ذخیره شد!'); setTimeout(() => setSaveMsg(''), 3000); setShowSettings(false); loadProject(); }
    catch (err: unknown) { setSErr(err instanceof Error ? err.message : 'خطا'); } finally { setSLoad(false); }
  };

  const addM = () => setSMembers([...sMembers, { name: '', period: '' }]);
  const updM = (i: number, f: string, v: string) => { const u = [...sMembers]; const m = { ...u[i] }; if (f === 'name') m.name = v; else m.period = v; u[i] = m; setSMembers(u); };
  const rmM = (i: number) => setSMembers(sMembers.filter((_, idx) => idx !== i));

  const today = new Date().toISOString().split('T')[0];
  const getRemainingDays = (returnDate: string) => {
    const diff = new Date(returnDate).getTime() - new Date(today).getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days < 0) return `${toPersianNumber(Math.abs(days))} روز گذشته`;
    if (days === 0) return 'امروز';
    return `${toPersianNumber(days)} روز مانده`;
  };

  if (authLoading || loading) return <div className="min-h-screen bg-[#F0F7FB] flex items-center justify-center dark:bg-gradient-to-br dark:from-navy-dark dark:via-navy dark:to-navy-dark"><div className="w-8 h-8 border-2 border-ruby border-t-transparent rounded-full animate-spin" /></div>;
  if (error || !project) return <div className="min-h-screen bg-[#F0F7FB] flex items-center justify-center dark:bg-gradient-to-br dark:from-navy-dark dark:via-navy dark:to-navy-dark"><Card className="p-8 text-center"><p className="text-red-500">{error || 'پروژه یافت نشد'}</p></Card></div>;

  return (
    <div className="min-h-screen bg-[#F0F7FB] dark:bg-gradient-to-br dark:from-navy-dark dark:via-navy dark:to-navy-dark">
      <ParticleBackground count={15} />
      <Navbar />
      <main className="relative z-10 max-w-2xl mx-auto px-4 pt-24 pb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 sm:space-y-6">
          {/* Header */}
          <div className="relative text-center">
            {project.logo && <img src={project.logo} alt={project.name} className="w-20 h-20 rounded-2xl object-cover mx-auto mb-4 border-2 border-navy/10 dark:border-beige/20" />}
            {!project.logo && <div className="inline-flex items-center justify-center mb-4 relative"><YaqutIcon size={56} animate /><SparkleEffect count={8} /></div>}
            <h1 className="text-2xl sm:text-3xl font-black text-navy mb-2 dark:text-cream">{project.name}</h1>
            {project.description && <p className="text-sm sm:text-base text-navy/60 dark:text-beige-light max-w-md mx-auto">{project.description}</p>}
          </div>

          {/* Rank */}
          {rank && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex justify-center">
              <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl ${rank === 1 ? 'bg-beige/15 border border-beige/25 text-beige-dark dark:bg-beige/20 dark:text-beige' : rank === 2 ? 'bg-sky/15 border border-sky/25 text-sky' : rank === 3 ? 'bg-pearl/10 border border-pearl/20 text-pearl dark:bg-pearl/20 dark:text-pearl-glow' : 'bg-navy/5 border border-navy/10 text-navy/60 dark:bg-navy-light/40 dark:text-beige-light'}`}>
                <Trophy className="w-5 h-5" /><span className="font-bold">رتبه {toPersianNumber(rank)}</span>
              </div>
            </motion.div>
          )}

          {/* Yaqut Score */}
          <Card className="p-8 sm:p-10 text-center relative overflow-hidden">
            <SparkleEffect count={12} />
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.4 }}><YaqutIcon size={72} animate /></motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <div className="text-6xl sm:text-7xl font-black text-navy mt-4 dark:text-cream">{toPersianNumber(project.yaqut_count)}</div>
              <div className="text-xl text-navy/50 mt-2 dark:text-beige-light">مروارید</div>
            </motion.div>
          </Card>

          {saveMsg && <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm text-center">{saveMsg}</motion.div>}

          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={() => setShowSettings(!showSettings)} className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white/60 border border-navy/8 text-navy/60 hover:text-navy hover:bg-white/80 transition-all dark:bg-navy/60 dark:border-beige/10 dark:text-beige-light dark:hover:text-cream dark:hover:bg-navy-light/30"><Settings className="w-4 h-4" />تنظیمات پروژه</button>
            <a href="/leaderboard" className="flex-1 flex items-center justify-center gap-2 p-4 rounded-2xl bg-white/60 border border-navy/8 text-navy/60 hover:text-navy hover:bg-white/80 transition-all dark:bg-navy/60 dark:border-beige/10 dark:text-beige-light dark:hover:text-cream dark:hover:bg-navy-light/30"><Trophy className="w-4 h-4" />رتبه‌بندی</a>
          </div>

          {showSettings && (
            <Card className="p-4 sm:p-6">
              <h2 className="text-lg font-bold text-navy mb-4 flex items-center gap-2 dark:text-cream"><Settings className="w-5 h-5 text-sky" />تنظیمات پروژه</h2>
              <div className="space-y-4">
                <Input label="نام پروژه" value={sName} onChange={(e) => setSName(e.target.value)} />
                <div className="space-y-1.5"><label className="block text-sm font-medium text-navy dark:text-beige-light">توضیحات</label><textarea value={sDesc} onChange={(e) => setSDesc(e.target.value)} rows={3} className="w-full px-4 py-3 rounded-xl bg-white/80 border border-navy/15 text-navy placeholder-navy/30 focus:outline-none focus:ring-2 focus:ring-pearl/50 dark:bg-navy-light/40 dark:border-beige/15 dark:text-cream dark:placeholder-sky/40 resize-none" dir="auto" /></div>
                <div className="space-y-1.5"><label className="block text-sm font-medium text-navy dark:text-beige-light">لوگوی پروژه</label>
                  <input type="file" ref={fileInputRef} accept="image/*" onChange={handleImageUpload} className="hidden" />
                  <div className="flex items-center gap-3"><button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/60 border border-navy/10 text-navy/60 hover:text-navy hover:bg-white/80 transition-all dark:bg-navy-light/30 dark:border-beige/15 dark:text-beige-light dark:hover:text-cream"><Upload className="w-4 h-4" />انتخاب تصویر</button>
                    {sLogo && <button type="button" onClick={() => setSLogo('')} className="flex items-center gap-1 px-3 py-2 rounded-xl text-pearl hover:text-pearl-glow text-sm"><X className="w-3 h-3" />حذف</button>}</div>
                  {sLogo && <div className="mt-2 text-center"><img src={sLogo} alt="Logo" className="w-20 h-20 rounded-xl object-cover mx-auto border border-navy/10 dark:border-beige/20" /></div>}
                </div>
                <div><div className="flex items-center justify-between mb-2"><label className="text-sm font-medium text-navy/60 dark:text-beige-light">اعضا</label><button type="button" onClick={addM} className="text-xs text-pearl hover:text-pearl-glow transition-colors">+ افزودن عضو</button></div>
                  <div className="space-y-2">{sMembers.map((m, i) => (<div key={i} className="flex gap-2 items-center"><span className="text-xs font-bold text-navy/40 dark:text-sky w-6 text-center">{toPersianNumber(i + 1)}</span><input placeholder="نام" value={m.name} onChange={(e) => updM(i, 'name', e.target.value)} className="flex-1 px-3 py-2 rounded-lg bg-white/60 border border-navy/10 text-navy text-sm focus:outline-none focus:ring-1 focus:ring-pearl/50 dark:bg-navy-light/30 dark:border-beige/15 dark:text-cream" /><input placeholder="دوره" value={m.period} onChange={(e) => updM(i, 'period', e.target.value)} className="w-24 sm:w-28 px-3 py-2 rounded-lg bg-white/60 border border-navy/10 text-navy text-sm dark:bg-navy-light/30 dark:border-beige/15 dark:text-cream" /><button type="button" onClick={() => rmM(i)} className="px-2 text-red-500 hover:text-red-500">✕</button></div>))}</div></div>
                {sErr && <div className="p-3 rounded-xl bg-ruby/10 border border-ruby/20 text-red-500 text-sm text-center">{sErr}</div>}
                <div className="flex gap-3"><Button onClick={handleSave} loading={sLoad} className="flex-1">ذخیره تغییرات</Button><Button variant="ghost" onClick={() => setShowSettings(false)}>انصراف</Button></div>
              </div>
            </Card>
          )}

          {/* پروژه من - Team members */}
          <Card className="p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold text-navy mb-3 sm:mb-4 flex items-center gap-2 dark:text-cream"><Users className="w-4 h-4 sm:w-5 sm:h-5 text-sky" />پروژه من</h2>
            <div className="space-y-2 sm:space-y-3">
              {project.members?.map((m, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="flex items-center gap-3 p-2 sm:p-3 rounded-xl bg-navy/3 dark:bg-navy-light/30">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-ruby to-beige flex items-center justify-center text-cream font-bold text-sm shrink-0">{m.name.charAt(0)}</div>
                  <div><div className="font-medium text-navy text-sm dark:text-cream">{m.name}</div><div className="text-xs text-sky">{m.period && 'دوره: ' + m.period}</div></div>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* وسایل قرضی تیم - Workshop Loans */}
          <Card className="p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold text-navy mb-3 sm:mb-4 flex items-center gap-2 dark:text-cream"><Wrench className="w-4 h-4 sm:w-5 sm:h-5 text-beige" />قرض گرفته شده‌ها</h2>
            {workshopLoans.length === 0 ? (
              <p className="text-sm text-navy/40 dark:text-sky/60 text-center py-4">هنوز وسیله‌ای قرض گرفته نشده</p>
            ) : (
              <div className="space-y-2">
                {workshopLoans.map((loan) => {
                  const isOverdue = loan.return_date < today;
                  return (
                    <div key={loan.id} className={`flex items-center justify-between p-3 rounded-xl ${isOverdue ? 'bg-red-500/5 border border-red-500/20 dark:bg-red-500/10' : 'bg-navy/3 dark:bg-navy-light/30'}`}>
                      <div className="flex items-center gap-2">
                        {isOverdue && <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />}
                        <div>
                          <div className="font-medium text-navy text-sm dark:text-cream">{loan.item_name} × {toPersianNumber(loan.quantity)}</div>
                          <div className="text-xs text-sky">قرض‌گیرنده: {loan.borrower_name} {loan.group_number && `• گروه ${loan.group_number}`}</div>
                        </div>
                      </div>
                      <div className="text-left shrink-0">
                        <div className={`text-xs font-medium ${isOverdue ? 'text-red-500' : 'text-navy/50 dark:text-beige-light'}`}>{getRemainingDays(loan.return_date)}</div>
                        <div className="text-xs text-navy/40 dark:text-beige-light/60">تا {formatDate(loan.return_date)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Yaqut History */}
          {project.yaqut_history && project.yaqut_history.length > 0 && (
            <Card className="p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-bold text-navy mb-3 sm:mb-4 flex items-center gap-2 dark:text-cream"><Clock className="w-4 h-4 sm:w-5 sm:h-5 text-beige" />تاریخچه مروارید</h2>
              <div className="space-y-2">
                {project.yaqut_history.map((ev) => (
                  <div key={ev.id} className="flex items-center justify-between p-2 sm:p-3 rounded-xl bg-navy/3 dark:bg-navy-light/30">
                    <div className="flex items-center gap-2">
                      <YaqutIcon size={14} animate={false} />
                      <span className="text-navy font-bold text-sm dark:text-cream">+{toPersianNumber(ev.amount)}</span>
                      {ev.note && <span className="text-xs text-sky">({ev.note})</span>}
                    </div>
                    <span className="text-xs text-sky">{formatDate(ev.awarded_at)}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
