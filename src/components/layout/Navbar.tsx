'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Menu, X, LogOut, Shield, BarChart3, FolderOpen } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import ThemeToggle from '@/components/ui/ThemeToggle';
import YaqutIcon from '@/components/YaqutIcon';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-navy/10 dark:bg-navy/80 dark:border-beige/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group"><YaqutIcon size={28} animate /><span className="text-xl font-bold text-navy group-hover:text-ruby transition-colors dark:text-cream dark:group-hover:text-ruby-glow">یاقوت سمینار</span></Link>
          <div className="hidden md:flex items-center gap-4">
            <Link href="/leaderboard" className="flex items-center gap-2 px-4 py-2 rounded-xl text-navy/70 hover:text-navy hover:bg-navy/5 transition-all dark:text-beige-light dark:hover:text-cream dark:hover:bg-navy-light/40"><BarChart3 className="w-4 h-4" /><span>رتبه‌بندی</span></Link>
            {user?.role === 'project' && <Link href="/project" className="flex items-center gap-2 px-4 py-2 rounded-xl text-ruby hover:text-ruby-glow hover:bg-ruby/5 transition-all dark:text-ruby-glow dark:hover:bg-ruby/10"><FolderOpen className="w-4 h-4" /><span>پروژه من</span></Link>}
            {user?.role === 'admin' && <Link href="/admin" className="flex items-center gap-2 px-4 py-2 rounded-xl text-navy/70 hover:text-navy hover:bg-navy/5 transition-all dark:text-beige-light dark:hover:text-cream dark:hover:bg-navy-light/40"><Shield className="w-4 h-4" /><span>مدیریت</span></Link>}
            {user && <button onClick={logout} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sky hover:text-ruby hover:bg-ruby/5 transition-all dark:hover:text-ruby-glow dark:hover:bg-ruby/10"><LogOut className="w-4 h-4" /><span>خروج</span></button>}
            <ThemeToggle />
          </div>
          <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-xl text-navy/70 hover:text-navy hover:bg-navy/5 dark:text-beige-light dark:hover:text-cream dark:hover:bg-navy-light/40">{open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}</button>
        </div>
      </div>
      {open && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="md:hidden bg-white/95 backdrop-blur-xl border-b border-navy/10 dark:bg-navy/95 dark:border-beige/10">
        <div className="px-4 py-4 space-y-2">
          <Link href="/leaderboard" className="flex items-center gap-2 px-4 py-3 rounded-xl text-navy/70 hover:text-navy hover:bg-navy/5 dark:text-beige-light dark:hover:text-cream dark:hover:bg-navy-light/40" onClick={() => setOpen(false)}><BarChart3 className="w-4 h-4" /><span>رتبه‌بندی</span></Link>
          {user?.role === 'project' && <Link href="/project" className="flex items-center gap-2 px-4 py-3 rounded-xl text-ruby hover:text-ruby-glow hover:bg-ruby/5 dark:text-ruby-glow dark:hover:bg-ruby/10" onClick={() => setOpen(false)}><FolderOpen className="w-4 h-4" /><span>پروژه من</span></Link>}
          {user?.role === 'admin' && <Link href="/admin" className="flex items-center gap-2 px-4 py-3 rounded-xl text-navy/70 hover:text-navy hover:bg-navy/5 dark:text-beige-light dark:hover:text-cream dark:hover:bg-navy-light/40" onClick={() => setOpen(false)}><Shield className="w-4 h-4" /><span>مدیریت</span></Link>}
          {user && <button onClick={() => { logout(); setOpen(false); }} className="flex items-center gap-2 w-full px-4 py-3 rounded-xl text-sky hover:text-ruby hover:bg-ruby/5 dark:hover:text-ruby-glow dark:hover:bg-ruby/10"><LogOut className="w-4 h-4" /><span>خروج</span></button>}
          <div className="flex items-center justify-center pt-2"><ThemeToggle /></div>
        </div>
      </motion.div>}
    </nav>
  );
}
