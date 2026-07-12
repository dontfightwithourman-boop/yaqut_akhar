'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gem } from 'lucide-react';
import { projectsAPI, yaqutAPI } from '@/lib/api';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import ProjectCard from '@/components/ProjectCard';
import YaqutConfetti from '@/components/YaqutConfetti';
import YaqutIcon from '@/components/YaqutIcon';
import { toPersianNumber } from '@/lib/helpers';
import type { Project } from '@/lib/types';

export default function AwardPage() {
  const [projects, setProjects] = useState<Project[]>([]); const [loading, setLoading] = useState(true); const [selected, setSelected] = useState<string[]>([]); const [amount, setAmount] = useState(''); const [note, setNote] = useState(''); const [awarding, setAwarding] = useState(false); const [showConfetti, setShowConfetti] = useState(false); const [lastAwarded, setLastAwarded] = useState<{ projectName: string; amount: number } | null>(null);
  useEffect(() => { projectsAPI.list().then((d) => setProjects(d.projects)).finally(() => setLoading(false)); }, []);
  const toggle = (id: string) => setSelected((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);
  const selectAll = () => setSelected(selected.length === projects.length ? [] : projects.map((p) => p.id));
  const handleAward = async () => { if (selected.length === 0 || !amount || parseInt(amount) < 1) return; setAwarding(true); try { await yaqutAPI.award({ projectIds: selected, amount: parseInt(amount), note: note || undefined }); const d = await projectsAPI.list(); setProjects(d.projects); setShowConfetti(true); setLastAwarded({ projectName: `${selected.length} پروژه`, amount: parseInt(amount) }); setSelected([]); setAmount(''); setNote(''); setTimeout(() => { setShowConfetti(false); setLastAwarded(null); }, 3000); } catch (err: unknown) { alert(err instanceof Error ? err.message : 'خطا'); } finally { setAwarding(false); } };
  return (<div className="space-y-6">
    <div className="relative"><h1 className="text-2xl font-bold text-navy mb-2 dark:text-cream">اعطای یاقوت</h1><p className="text-navy/50 dark:text-beige-light">یاقوت به پروژه‌های برتر اعطا کنید</p>
      <AnimatePresence>{showConfetti && <div className="fixed inset-0 pointer-events-none z-50"><YaqutConfetti trigger={showConfetti} />{lastAwarded && <motion.div initial={{ opacity: 0, scale: 0.8, y: 50 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8 }} className="fixed top-1/3 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-xl rounded-3xl border border-ruby/20 p-8 shadow-2xl shadow-ruby/10 text-center dark:bg-navy/95 dark:border-ruby/30 dark:shadow-ruby/20"><YaqutIcon size={48} animate /><h3 className="text-xl font-bold text-navy mt-4 dark:text-cream">یاقوت اعطا شد!</h3><p className="text-navy/50 mt-2 dark:text-beige-light">{toPersianNumber(lastAwarded.amount)} یاقوت به {lastAwarded.projectName}</p></motion.div>}</div>}</AnimatePresence>
    </div>
    <Card className="p-6"><div className="grid md:grid-cols-3 gap-4 mb-4"><Input label="تعداد یاقوت" type="number" min="1" placeholder="10" value={amount} onChange={(e) => setAmount(e.target.value)} /><Input label="یادداشت (اختیاری)" placeholder="ارائه، پوستر، ..." value={note} onChange={(e) => setNote(e.target.value)} /><div className="flex items-end"><Button onClick={handleAward} loading={awarding} disabled={selected.length === 0 || !amount || parseInt(amount) < 1} className="w-full"><Gem className="w-4 h-4" />اعطای {amount ? toPersianNumber(parseInt(amount)) : ''} یاقوت{selected.length > 0 && ` به ${toPersianNumber(selected.length)} پروژه`}</Button></div></div>
      <div className="flex items-center justify-between"><p className="text-sm text-navy/50 dark:text-beige-light">{toPersianNumber(selected.length)} پروژه انتخاب شده</p><button onClick={selectAll} className="text-sm text-ruby hover:text-ruby-glow transition-colors">{selected.length === projects.length ? 'انتخاب هیچکدام' : 'انتخاب همه'}</button></div></Card>
    {loading ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{[1, 2, 3].map((i) => <div key={i} className="h-48 rounded-2xl bg-navy/5 animate-pulse dark:bg-navy-light/20" />)}</div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{projects.map((p) => <ProjectCard key={p.id} project={p} selectable selected={selected.includes(p.id)} onSelect={toggle} />)}</div>}
  </div>);
}
