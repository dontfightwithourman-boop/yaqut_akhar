'use client';
import { useState, useEffect, useRef } from 'react';
import { Plus, Search, Newspaper, Trash2, Edit, Upload, X, Image as ImageIcon, Video, AudioLines, ArrowRight } from 'lucide-react';
import { newsAPI } from '@/lib/api';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Card from '@/components/ui/Card';
import { toPersianNumber } from '@/lib/helpers';
import type { News } from '@/lib/types';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AdminNewsPage() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [fTitle, setFTitle] = useState('');
  const [fContent, setFContent] = useState('');
  const [fMedia, setFMedia] = useState<News['media']>([]);
  const [fStatus, setFStatus] = useState<'draft' | 'published'>('draft');
  const [fErr, setFErr] = useState('');
  const [fLoad, setFLoad] = useState(false);
  const [mediaUrls, setMediaUrls] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchNews = async () => { try { const d = await newsAPI.list(); setNews(d.news); } catch { /* */ } finally { setLoading(false); } };
  useEffect(() => { fetchNews(); }, []);

  const reset = () => { setFTitle(''); setFContent(''); setFMedia([]); setFStatus('draft'); setFErr(''); setMediaUrls(''); };
  const openC = () => { reset(); setEditingNews(null); setShowCreate(true); };
  const openE = (n: News) => { setEditingNews(n); setFTitle(n.title); setFContent(n.content); setFMedia(n.media); setFStatus(n.status); setMediaUrls(n.media.map(m => m.url).join('\n')); setShowCreate(true); };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newMedia: News['media'] = [];
    let error = '';
    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) { error = 'حجم هر فایل باید کمتر از ۵ مگابایت باشد'; return; }
      const reader = new FileReader();
      reader.onload = (ev) => {
        const url = ev.target?.result as string;
        let type: 'image' | 'video' | 'audio' = 'image';
        if (file.type.startsWith('video/')) type = 'video';
        else if (file.type.startsWith('audio/')) type = 'audio';
        newMedia.push({ url, type, name: file.name });
        setFMedia((prev) => [...prev, ...newMedia]);
      };
      reader.readAsDataURL(file);
    });
    if (error) setFErr(error);
    e.target.value = '';
  };

  const handleUrlParse = () => {
    const urls = mediaUrls.split('\n').filter((u) => u.trim());
    const parsed: News['media'] = urls.map((url) => {
      const trimmed = url.trim();
      let type: 'image' | 'video' | 'audio' = 'image';
      if (trimmed.endsWith('.mp4') || trimmed.endsWith('.webm') || trimmed.includes('youtube') || trimmed.includes('vimeo')) type = 'video';
      else if (trimmed.endsWith('.mp3') || trimmed.endsWith('.wav') || trimmed.endsWith('.ogg')) type = 'audio';
      return { url: trimmed, type, name: trimmed.split('/').pop() || '' };
    });
    setFMedia((prev) => [...prev, ...parsed]);
    setMediaUrls('');
  };

  const removeMedia = (index: number) => setFMedia((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFErr('');
    setFLoad(true);
    try {
      if (editingNews) {
        await newsAPI.update(editingNews.id, { title: fTitle, content: fContent, media: fMedia, status: fStatus });
      } else {
        await newsAPI.create({ title: fTitle, content: fContent, media: fMedia, status: fStatus });
      }
      setShowCreate(false);
      fetchNews();
    } catch (err: unknown) { setFErr(err instanceof Error ? err.message : 'خطا'); } finally { setFLoad(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('آیا از حذف این خبر مطمئن هستید؟')) return;
    try { await newsAPI.delete(id); fetchNews(); } catch { /* */ }
  };

  const getMediaIcon = (type: string) => {
    switch (type) {
      case 'image': return ImageIcon;
      case 'video': return Video;
      case 'audio': return AudioLines;
      default: return ImageIcon;
    }
  };

  const filtered = news.filter((n) => n.title.includes(search) || n.content.includes(search));
  return (
    <div className="space-y-6">
      <Link href="/admin" className="inline-flex items-center gap-2 text-sky hover:text-ruby transition-colors"><ArrowRight className="w-4 h-4" />بازگشت به داشبورد</Link>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div><h1 className="text-xl sm:text-2xl font-bold text-navy mb-2 dark:text-cream">مدیریت اخبار</h1><p className="text-navy/50 dark:text-beige-light">{toPersianNumber(news.length)} خبر ثبت شده</p></div>
        <Button onClick={openC}><Plus className="w-4 h-4" />خبر جدید</Button>
      </div>
      <div className="max-w-md"><Input placeholder="جستجو..." value={search} onChange={(e) => setSearch(e.target.value)} icon={<Search className="w-4 h-4" />} /></div>
      {loading ? <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="h-32 rounded-2xl bg-navy/5 animate-pulse dark:bg-navy-light/20" />)}</div> : filtered.length === 0 ? <div className="text-center py-12"><Newspaper className="w-12 h-12 text-navy/15 mx-auto mb-4 dark:text-sky/30" /><p className="text-navy/40 dark:text-sky">خبری یافت نشد</p></div> : (
        <div className="space-y-4">
          {filtered.map((item) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="p-4 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-navy dark:text-cream truncate">{item.title}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${item.status === 'published' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>{item.status === 'published' ? 'منتشر شده' : 'پیش‌نویس'}</span>
                    </div>
                    <p className="text-sm text-navy/60 line-clamp-2 mb-2 dark:text-beige-light">{item.content || 'بدون توضیح'}</p>
                    <div className="flex items-center gap-3 text-xs text-navy/40 dark:text-sky/70">
                      <span>{new Date(item.created_at).toLocaleDateString('fa-IR')}</span>
                      {item.media.length > 0 && <span>{toPersianNumber(item.media.length)} رسانه</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => openE(item)} className="p-2 rounded-xl text-sky hover:bg-sky/10 transition-colors"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(item.id)} className="p-2 rounded-xl text-ruby hover:bg-ruby/10 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                {item.media.length > 0 && (
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-navy/5 dark:border-beige/10">
                    {item.media.slice(0, 5).map((m, idx) => {
                      const Icon = getMediaIcon(m.type);
                      return <div key={idx} className="w-8 h-8 rounded-lg bg-navy/5 flex items-center justify-center dark:bg-navy-light/30" title={m.name || m.url}><Icon className="w-4 h-4 text-sky" /></div>;
                    })}
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title={editingNews ? 'ویرایش خبر' : 'خبر جدید'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="عنوان خبر" value={fTitle} onChange={(e) => setFTitle(e.target.value)} required dir="auto" />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-navy dark:text-beige-light">متن خبر</label>
            <textarea value={fContent} onChange={(e) => setFContent(e.target.value)} rows={5} className="w-full px-4 py-3 rounded-xl bg-white/80 border border-navy/15 text-navy placeholder-navy/30 focus:outline-none focus:ring-2 focus:ring-pearl/50 focus:border-pearl/50 transition-all duration-200 dark:bg-navy-light/40 dark:border-beige/15 dark:text-cream dark:placeholder-sky/40 resize-none" dir="auto" placeholder="متن خبر را بنویسید..." />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-navy dark:text-beige-light">رسانه‌ها</label>
            <div className="flex items-center gap-2">
              <input type="file" ref={fileInputRef} accept="image/*,video/*,audio/*" multiple onChange={handleFileUpload} className="hidden" />
              <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/60 border border-navy/10 text-navy/60 hover:text-navy hover:bg-white/80 transition-all dark:bg-navy-light/30 dark:border-beige/15 dark:text-beige-light dark:hover:text-cream"><Upload className="w-4 h-4" />انتخاب فایل</button>
            </div>
            <div className="space-y-2">
              <textarea value={mediaUrls} onChange={(e) => setMediaUrls(e.target.value)} rows={2} className="w-full px-4 py-3 rounded-xl bg-white/80 border border-navy/15 text-navy placeholder-navy/30 focus:outline-none focus:ring-2 focus:ring-pearl/50 focus:border-pearl/50 transition-all duration-200 dark:bg-navy-light/40 dark:border-beige/15 dark:text-cream dark:placeholder-sky/40 resize-none text-sm" placeholder="یا لینک‌های رسانه را اینجا وارد کنید (هر لینک در یک خط)" dir="ltr" />
              <Button type="button" variant="ghost" size="sm" onClick={handleUrlParse}>افزودن لینک‌ها</Button>
            </div>
            {fMedia.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
                {fMedia.map((m, idx) => {
                  const Icon = getMediaIcon(m.type);
                  return (
                    <div key={idx} className="relative rounded-xl overflow-hidden border border-navy/10 dark:border-beige/10 bg-navy/3 dark:bg-navy-light/20">
                      {m.type === 'image' && <img src={m.url} alt={m.name} className="w-full h-24 object-cover" />}
                      {m.type === 'video' && <div className="w-full h-24 bg-navy/5 flex items-center justify-center dark:bg-navy-dark/50"><Video className="w-8 h-8 text-sky" /></div>}
                      {m.type === 'audio' && <div className="w-full h-24 bg-navy/5 flex items-center justify-center dark:bg-navy-dark/50"><AudioLines className="w-8 h-8 text-sky" /></div>}
                      <button type="button" onClick={() => removeMedia(idx)} className="absolute top-1 left-1 p-1 rounded-full bg-white/80 dark:bg-navy-dark/80 text-ruby hover:text-ruby-glow"><X className="w-3 h-3" /></button>
                      <div className="p-2"><p className="text-xs text-navy/60 truncate dark:text-beige-light">{m.name || m.type}</p></div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <label className="block text-sm font-medium text-navy dark:text-beige-light">وضعیت:</label>
            <select value={fStatus} onChange={(e) => setFStatus(e.target.value as 'draft' | 'published')} className="px-3 py-2 rounded-lg bg-white/60 border border-navy/10 text-navy text-sm focus:outline-none focus:ring-1 focus:ring-pearl/50 dark:bg-navy-light/30 dark:border-beige/15 dark:text-cream">
              <option value="draft">پیش‌نویس</option>
              <option value="published">منتشر شده</option>
            </select>
          </div>
          {fErr && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">{fErr}</div>}
          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={fLoad} className="flex-1">{editingNews ? 'ذخیره' : 'ایجاد'}</Button>
            <Button type="button" variant="ghost" onClick={() => setShowCreate(false)}>انصراف</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
