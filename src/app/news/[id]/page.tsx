'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Image as ImageIcon, Video, AudioLines, Newspaper } from 'lucide-react';
import { newsAPI } from '@/lib/api';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { toPersianNumber, formatDate } from '@/lib/helpers';
import type { News } from '@/lib/types';
import { useParams } from 'next/navigation';

export default function NewsDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { if (id) newsAPI.get(id).then((d) => setNews(d.news)).finally(() => setLoading(false)); }, [id]);

  const getMediaIcon = (type: string) => {
    switch (type) {
      case 'image': return ImageIcon;
      case 'video': return Video;
      case 'audio': return AudioLines;
      default: return ImageIcon;
    }
  };

  if (loading) return <div className="min-h-screen bg-transparent flex items-center justify-center dark:bg-gradient-to-br dark:from-navy-dark dark:via-navy dark:to-navy-dark"><div className="w-8 h-8 border-2 border-ruby border-t-transparent rounded-full animate-spin" /></div>;
  if (!news) return <div className="min-h-screen bg-transparent flex items-center justify-center dark:bg-gradient-to-br dark:from-navy-dark dark:via-navy dark:to-navy-dark"><div className="text-center"><Newspaper className="w-12 h-12 text-navy/15 mx-auto mb-4" /><p className="text-navy/40">خبر یافت نشد</p><Button onClick={() => window.history.back()} className="mt-4">بازگشت</Button></div></div>;

  return (
    <div className="min-h-screen bg-transparent dark:bg-gradient-to-br dark:from-navy-dark dark:via-navy dark:to-navy-dark">
      <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Button variant="ghost" onClick={() => window.history.back()} className="mb-6"><ArrowRight className="w-4 h-4" />بازگشت</Button>
          <Card className="p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-black text-navy mb-4 dark:text-cream">{news.title}</h1>
            <div className="flex items-center gap-3 text-sm text-navy/50 mb-6 dark:text-beige-light">
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{formatDate(news.created_at)}</span>
            </div>
            {news.content && <div className="prose prose-slate dark:prose-invert max-w-none mb-8">
              <p className="text-navy/80 whitespace-pre-wrap leading-relaxed dark:text-cream/90">{news.content}</p>
            </div>}
            {news.media.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-navy/60 dark:text-beige-light">رسانه‌های ضمیمه</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {news.media.map((m, idx) => {
                    const Icon = getMediaIcon(m.type);
                    if (m.type === 'image') return <div key={idx} className="rounded-2xl overflow-hidden border border-navy/10 dark:border-beige/10"><img src={m.url} alt={m.name || `تصویر ${idx + 1}`} className="w-full h-auto object-cover" /></div>;
                    if (m.type === 'video') return <div key={idx} className="rounded-2xl overflow-hidden border border-navy/10 dark:border-beige/10"><video controls className="w-full h-auto"><source src={m.url} />مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند</video></div>;
                    if (m.type === 'audio') return <div key={idx} className="rounded-2xl border border-navy/10 p-4 dark:border-beige/10 flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-sky/10 flex items-center justify-center shrink-0"><Icon className="w-5 h-5 text-sky" /></div><div className="flex-1 min-w-0"><p className="text-sm font-medium text-navy truncate dark:text-cream">{m.name || `فایل صوتی ${idx + 1}`}</p></div><audio controls className="w-full"><source src={m.url} /></audio></div>;
                    return null;
                  })}
                </div>
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
