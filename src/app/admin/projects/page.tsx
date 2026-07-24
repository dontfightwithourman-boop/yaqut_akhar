'use client';
import { useState, useEffect, useRef } from 'react';
import { Plus, Search, FolderPlus, Upload, X } from 'lucide-react';
import { projectsAPI } from '@/lib/api';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import ProjectCard from '@/components/ProjectCard';
import { toPersianNumber } from '@/lib/helpers';
import type { Project } from '@/lib/types';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]); const [loading, setLoading] = useState(true); const [search, setSearch] = useState(''); const [showCreate, setShowCreate] = useState(false); const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [fN, setFN] = useState(''); const [fU, setFU] = useState(''); const [fP, setFP] = useState(''); const [fD, setFD] = useState(''); const [fL, setFL] = useState('');
  const [fM, setFM] = useState<{ name: string; period: string }[]>([]); const [fErr, setFErr] = useState(''); const [fLoad, setFLoad] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fetchP = async () => { try { const d = await projectsAPI.list(); setProjects(d.projects); } catch { /* */ } finally { setLoading(false); } };
  useEffect(() => { fetchP(); }, []);
  const reset = () => { setFN(''); setFU(''); setFP(''); setFD(''); setFL(''); setFM([]); setFErr(''); };
  const openC = () => { reset(); setEditingProject(null); setShowCreate(true); };
  const openE = (p: Project) => { setEditingProject(p); setFN(p.name); setFU(p.username); setFP(''); setFD(p.description || ''); setFL(p.logo || ''); setFM(p.members?.map((m) => ({ name: m.name, period: m.period || '' })) || []); setShowCreate(true); };
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (!file) return; if (file.size > 2 * 1024 * 1024) { setFErr('حجم تصویر باید کمتر از ۲ مگابایت باشد'); return; } const reader = new FileReader(); reader.onload = (ev) => { setFL(ev.target?.result as string); }; reader.readAsDataURL(file); };
  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); setFErr(''); setFLoad(true); try { if (editingProject) { const ud: Record<string, unknown> = { name: fN, description: fD, logo: fL, members: fM.filter((m) => m.name.trim()) }; if (fU) ud.username = fU; if (fP) ud.password = fP; await projectsAPI.update(editingProject.id, ud); } else { await projectsAPI.create({ name: fN, username: fU, password: fP || undefined, description: fD, logo: fL, members: fM.filter((m) => m.name.trim()) }); } setShowCreate(false); fetchP(); } catch (err: unknown) { setFErr(err instanceof Error ? err.message : 'خطا'); } finally { setFLoad(false); } };
  const handleDelete = async (id: string) => { if (!confirm('آیا از حذف این پروژه مطمئن هستید؟')) return; try { await projectsAPI.delete(id); fetchP(); } catch { /* */ } };
  const addM = () => setFM([...fM, { name: '', period: '' }]);
  const updM = (i: number, f: string, v: string) => { const u = [...fM]; const m = { ...u[i] }; if (f === 'name') m.name = v; else m.period = v; u[i] = m; setFM(u); };
  const rmM = (i: number) => setFM(fM.filter((_, idx) => idx !== i));
  const filtered = projects.filter((p) => p.name.includes(search) || p.username.includes(search));
  const inp = 'flex-1 px-3 py-2 rounded-lg bg-white/60 border border-navy/10 text-navy text-sm focus:outline-none focus:ring-1 focus:ring-pearl/50 dark:bg-navy-light/30 dark:border-beige/15 dark:text-cream';
  return (<div className="space-y-6">
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"><div><h1 className="text-xl sm:text-2xl font-bold text-navy mb-2 dark:text-cream">مدیریت پروژه‌ها</h1><p className="text-navy/50 dark:text-beige-light">{toPersianNumber(projects.length)} پروژه ثبت شده</p></div><Button onClick={openC}><Plus className="w-4 h-4" />پروژه جدید</Button></div>
    <div className="max-w-md"><Input placeholder="جستجو..." value={search} onChange={(e) => setSearch(e.target.value)} icon={<Search className="w-4 h-4" />} /></div>
    {loading ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{[1, 2, 3].map((i) => <div key={i} className="h-48 rounded-2xl bg-navy/5 animate-pulse dark:bg-navy-light/20" />)}</div> : filtered.length === 0 ? <div className="text-center py-12"><FolderPlus className="w-12 h-12 text-navy/15 mx-auto mb-4 dark:text-sky/30" /><p className="text-navy/40 dark:text-sky">پروژه‌ای یافت نشد</p></div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{filtered.map((p) => <ProjectCard key={p.id} project={p} onEdit={openE} onDelete={handleDelete} />)}</div>}
    <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title={editingProject ? 'ویرایش پروژه' : 'پروژه جدید'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="نام پروژه" value={fN} onChange={(e) => setFN(e.target.value)} required />
        {!editingProject && <Input label="نام کاربری" value={fU} onChange={(e) => setFU(e.target.value)} dir="ltr" required />}
        <Input label={editingProject ? 'رمز جدید (خالی = بدون تغییر)' : 'رمز عبور'} type="password" value={fP} onChange={(e) => setFP(e.target.value)} dir="ltr" required={!editingProject} />
        <div className="space-y-1.5"><label className="block text-sm font-medium text-navy dark:text-beige-light">توضیحات پروژه</label>
          <textarea value={fD} onChange={(e) => setFD(e.target.value)} rows={3} className="w-full px-4 py-3 rounded-xl bg-white/80 border border-navy/15 text-navy placeholder-navy/30 focus:outline-none focus:ring-2 focus:ring-pearl/50 focus:border-pearl/50 transition-all duration-200 dark:bg-navy-light/40 dark:border-beige/15 dark:text-cream dark:placeholder-sky/40 resize-none" dir="auto" placeholder="توضیحات پروژه..." /></div>
        {/* Logo Upload */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-navy dark:text-beige-light">لوگوی پروژه</label>
          <input type="file" ref={fileInputRef} accept="image/*" onChange={handleImageUpload} className="hidden" />
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/60 border border-navy/10 text-navy/60 hover:text-navy hover:bg-white/80 transition-all dark:bg-navy-light/30 dark:border-beige/15 dark:text-beige-light dark:hover:text-cream"><Upload className="w-4 h-4" />انتخاب تصویر</button>
            {fL && <button type="button" onClick={() => setFL('')} className="flex items-center gap-1 px-3 py-2 rounded-xl text-pearl hover:text-pearl-glow text-sm"><X className="w-3 h-3" />حذف</button>}
          </div>
          {fL && <div className="mt-2 text-center"><img src={fL} alt="Logo preview" className="w-16 h-16 rounded-xl object-cover mx-auto border border-navy/10 dark:border-beige/20" /></div>}
        </div>
        <div><div className="flex items-center justify-between mb-2"><label className="text-sm font-medium text-navy/60 dark:text-beige-light">اعضا</label><button type="button" onClick={addM} className="text-xs text-pearl hover:text-pearl-glow transition-colors">+ افزودن عضو</button></div>
          <div className="space-y-2">{fM.map((m, i) => <div key={i} className="flex gap-2 items-center">
            <span className="text-xs font-bold text-navy/40 dark:text-sky w-6 text-center">{toPersianNumber(i + 1)}</span>
            <input placeholder="نام" value={m.name} onChange={(e) => updM(i, 'name', e.target.value)} className={inp} />
            <input placeholder="دوره" value={m.period} onChange={(e) => updM(i, 'period', e.target.value)} className="w-24 sm:w-28 px-3 py-2 rounded-lg bg-white/60 border border-navy/10 text-navy text-sm dark:bg-navy-light/30 dark:border-beige/15 dark:text-cream" />
            <button type="button" onClick={() => rmM(i)} className="px-2 text-ruby-glow hover:text-ruby">✕</button>
          </div>)}</div></div>
        {fErr && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">{fErr}</div>}
        <div className="flex gap-3 pt-2"><Button type="submit" loading={fLoad} className="flex-1">{editingProject ? 'ذخیره' : 'ایجاد'}</Button><Button type="button" variant="ghost" onClick={() => setShowCreate(false)}>انصراف</Button></div>
      </form>
    </Modal>
  </div>);
}
