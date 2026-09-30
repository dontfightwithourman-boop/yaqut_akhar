'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Newspaper, Calendar, Image as ImageIcon, Video, AudioLines, Search, ArrowLeft } from 'lucide-react';
import { newsAPI } from '@/lib/api';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { toPersianNumber } from '@/lib/helpers';
import type { News } from '@/lib/types';
import Link from 'next/link';

export default function NewsPage() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  useEffect(() => { newsAPI.list().then((d) => setNews(d.news)).finally(() => setLoading(false)); }, []);
  const filtered = news.filter((n) => n.title.includes(search) || n.content.includes(search));

  const getMediaIcon = (type: string) => {
    switch (type) {
      case 'image': return ImageIcon;
      case 'video': return Video;
      case 'audio': return AudioLines;
      default: return ImageIcon;
    }
  };

  return (
    <div className="min-h-screen bg-transparent dark:bg-gradient-to-br dark:from-navy-dark dark:via-navy dark:to-navy-dark">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-sky hover:text-ruby transition-colors mb-6"><ArrowLeft className="w-4 h-4" />بازگشت به صفحه اصلی</Link>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center mb-4"><Newspaper className="w-12 h-12 text-sky" /></div>
          <h1 className="text-3xl sm:text-4xl font-black text-navy mb-3 dark:text-cream">اخبار و رویدادها</h1>
          <p className="text-navy/60 dark:text-beige-light max-w-md mx-auto">آخرین اخبار، رویدادها و اطلاعیه‌های سمینار را اینجا دنبال کنید</p>
        </motion.div>

        <div className="max-w-md mx-auto mb-8">
          <Input placeholder="جستجو در اخبار..." value={search} onChange={(e) => setSearch(e.target.value)} icon={<Search className="w-4 h-4" />} />
        </div>

        {loading ? <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="h-48 rounded-2xl bg-navy/5 animate-pulse dark:bg-navy-light/20" />)}</div> : filtered.length === 0 ? <div className="text-center py-16"><Newspaper className="w-12 h-12 text-navy/15 mx-auto mb-4 dark:text-sky/30" /><p className="text-navy/40 dark:text-sky">خبری یافت نشد</p></div> : (
          <div className="space-y-6">
            {filtered.map((item, i) => (
              <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Link href={`/news/${item.id}`}>
                  <Card className="p-5 sm:p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group">
                    <div className="flex items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <h2 className="text-lg sm:text-xl font-bold text-navy mb-2 group-hover:text-sky transition-colors dark:text-cream dark:group-hover:text-sky">{item.title}</h2>
                        <p className="text-sm text-navy/60 line-clamp-2 mb-3 dark:text-beige-light">{item.content || 'بدون توضیح'}</p>
                        <div className="flex items-center gap-3 text-xs text-navy/40 dark:text-sky/70">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{toPersianNumber(new Date(item.created_at).toLocaleDateString('fa-IR'))}</span>
                          {item.media.length > 0 && <span className="flex items-center gap-1"><ImageIcon className="w-3 h-3" />{toPersianNumber(item.media.length)} فایل رسانه‌ای</span>}
                        </div>
                      </div>
                      {item.media.length > 0 && (
                        <div className="hidden sm:flex items-center gap-2 shrink-0">
                          {item.media.slice(0, 3).map((m, idx) => {
                            const Icon = getMediaIcon(m.type);
                            return <div key={idx} className="w-10 h-10 rounded-xl bg-navy/5 flex items-center justify-center dark:bg-navy-light/30"><Icon className="w-4 h-4 text-sky" /></div>;
                          })}
                        </div>
                      )}
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
