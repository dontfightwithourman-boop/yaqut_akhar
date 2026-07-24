'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, ArrowLeft, Gem, Trophy, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import ThemeToggle from '@/components/ui/ThemeToggle';
import YaqutIcon from '@/components/YaqutIcon';
import SparkleEffect from '@/components/SparkleEffect';
import ParticleBackground from '@/components/ParticleBackground';

export default function HomePage() {
  const [username, setUsername] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState(''); const [loading, setLoading] = useState(false);
  const { login, user, loading: authLoading } = useAuth(); const router = useRouter();
  useEffect(() => { if (!authLoading && user) router.push(user.role === 'admin' ? '/admin' : '/project'); }, [user, authLoading, router]);
  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); setError(''); setLoading(true); try { await login(username, password); } catch (err: unknown) { setError(err instanceof Error ? err.message : 'خطا'); } finally { setLoading(false); } };
  if (authLoading) return <div className="min-h-screen bg-[#EDF4F8] flex items-center justify-center dark:bg-gradient-to-br dark:from-navy-dark dark:via-navy dark:to-navy-dark"><div className="w-8 h-8 border-2 border-ruby border-t-transparent rounded-full animate-spin" /></div>;
  if (user) return null;
  return (<div className="min-h-screen bg-[#EDF4F8] flex flex-col dark:bg-gradient-to-br dark:from-navy-dark dark:via-navy dark:to-navy-dark"><ParticleBackground count={30} />
    <div className="absolute top-4 left-4 z-50"><ThemeToggle /></div>
    <div className="relative flex-1 flex items-center justify-center px-4 py-12">
      <div className="max-w-6xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center">
        <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="text-center md:text-right order-2 md:order-1">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: 'spring' }} className="inline-flex items-center justify-center mb-6"><div className="relative"><YaqutIcon size={100} animate /><SparkleEffect count={8} /></div></motion.div>
          <h1 className="text-4xl md:text-6xl font-black text-navy mb-4 leading-tight dark:text-cream">مروارید<br /><span className="text-ruby">سمینار</span></h1>
          <div className="flex items-center justify-center md:justify-start gap-8">{[{ icon: Trophy, label: 'مسابقه', value: '۶ تیم' }, { icon: Gem, label: 'مروارید', value: '۱۴۲' }, { icon: Users, label: 'شرکت‌کننده', value: '۱۵ نفر' }].map((s, i) => <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.1 }} className="text-center"><s.icon className="w-5 h-5 text-ruby mb-1 mx-auto" /><div className="text-lg font-bold text-navy dark:text-cream">{s.value}</div><div className="text-xs text-sky">{s.label}</div></motion.div>)}</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="order-1 md:order-2">
          <div className="w-full max-w-md mx-auto"><div className="relative bg-white/80 backdrop-blur-xl rounded-3xl border border-sky/20 p-8 shadow-2xl dark:bg-navy/70 dark:border-beige/15"><div className="relative">
            <div className="text-center mb-8"><h2 className="text-2xl font-bold text-navy mb-2 dark:text-cream">ورود به سیستم</h2><p className="text-sm text-navy/50 dark:text-beige-light">نام کاربری و رمز عبور خود را وارد کنید</p></div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input label="نام کاربری" placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)} icon={<User className="w-4 h-4" />} dir="ltr" />
              <Input label="رمز عبور" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} icon={<Lock className="w-4 h-4" />} dir="ltr" />
              {error && <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-3 rounded-xl bg-ruby/10 border border-ruby/20 text-ruby-glow text-sm text-center">{error}</motion.div>}
              <Button type="submit" loading={loading} className="w-full" size="lg"><span>ورود</span><ArrowLeft className="w-4 h-4" /></Button>
            </form>
            <div className="mt-6 text-center"><a href="/leaderboard" className="text-sm text-sky hover:text-ruby transition-colors">مشاهده رتبه‌بندی بدون ورود ←</a></div>
          </div></div></div>
        </motion.div>
      </div>
    </div>
    <footer className="relative z-10 border-t border-navy/8 py-6 dark:border-beige/10"><div className="max-w-7xl mx-auto px-4 text-center text-sm text-sky">مدرسه راهنمایی علامه حلی ۱ تهران — مروارید سمینار ۱۴۰۵</div></footer>
  </div>);
}
