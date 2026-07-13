'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { LayoutDashboard, FolderPlus, Gem, BarChart3, Wrench, Shield, Menu, X } from 'lucide-react';

const links = [
  { href: '/admin', label: 'داشبورد', icon: LayoutDashboard },
  { href: '/admin/projects', label: 'پروژه‌ها', icon: FolderPlus },
  { href: '/admin/award', label: 'اعطای یاقوت', icon: Gem },
  { href: '/admin/workshop', label: 'کارگاه', icon: Wrench },
  { href: '/admin/backup', label: 'پشتیبانی', icon: Shield },
  { href: '/leaderboard', label: 'رتبه‌بندی', icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden fixed bottom-4 left-4 z-50 p-3 rounded-full bg-ruby text-cream shadow-lg shadow-ruby/30">
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>
      {mobileOpen && <div className="md:hidden fixed inset-0 bg-black/40 z-40" onClick={() => setMobileOpen(false)} />}
      <aside className={`
        fixed md:static top-16 right-0 bottom-0 z-40
        w-64 min-h-[calc(100vh-4rem)] bg-white/95 md:bg-white/50 backdrop-blur-xl md:backdrop-blur-none
        border-l border-navy/10 p-4 dark:bg-navy-dark/95 md:dark:bg-navy-dark/50 dark:border-beige/10
        transition-transform duration-300 overflow-y-auto
        ${mobileOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
      `}>
        <div className="space-y-1">{links.map((l) => {
          const active = pathname === l.href || (l.href !== '/admin' && l.href !== '/leaderboard' && pathname.startsWith(l.href));
          const I = l.icon;
          return <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
            className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${active ? 'bg-ruby/15 text-ruby dark:bg-ruby/20 dark:text-ruby-glow' : 'text-navy/60 hover:text-navy hover:bg-navy/5 dark:text-beige-light dark:hover:text-cream dark:hover:bg-navy-light/30'}`}>
            {active && <motion.div layoutId="activeTab" className="absolute inset-0 bg-ruby/10 rounded-xl border border-ruby/15 dark:border-ruby/20" transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }} />}
            <I className="w-4 h-4 relative z-10 shrink-0" /><span className="font-medium relative z-10">{l.label}</span>
          </Link>;
        })}</div>
      </aside>
    </>
  );
}
